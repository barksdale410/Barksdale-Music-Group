import { logFunctionCall } from '../utils/logger';

export interface MidiBinding {
  _id: string; // MongoDB Document ObjectID format
  userId: string;
  sourceType: 'cc' | 'note';
  sourceNumber: number; // CC number (0-127) or MIDI Note number (0-127)
  targetType: 'daw_param' | 'pad_trigger' | 'transport_control';
  targetKey: string; // e.g. "bpm", "masterVolume", "mixLevels.kick", "pad.1", "transport.play"
  targetName: string; // readable name
  createdAt: string;
}

export interface MongoQueryLog {
  timestamp: string;
  operation: string;
  query: string;
  response: string;
}

// In-memory simulation of active MongoDB transactions, logged to the UI
let localQueryLogs: MongoQueryLog[] = [];
const LOG_LIMIT = 20;

export const addQueryLog = (operation: string, query: object, response: object) => {
  const newLog: MongoQueryLog = {
    timestamp: new Date().toLocaleTimeString(),
    operation,
    query: JSON.stringify(query, null, 2),
    response: JSON.stringify(response, null, 2)
  };
  localQueryLogs = [newLog, ...localQueryLogs].slice(0, LOG_LIMIT);
  
  // Custom event to notify components of new Mongo activity
  const event = new CustomEvent('mongo_query_logged', { detail: newLog });
  window.dispatchEvent(event);
};

export const getMongoQueryLogs = (): MongoQueryLog[] => {
  return localQueryLogs;
};

// Default stock presets
const DEFAULT_MIDI_MAPPINGS: MidiBinding[] = [
  {
    _id: "64b0f7ca3a3f5a2b8e3a2011",
    userId: "darnellbarksdale2@gmail.com",
    sourceType: "cc",
    sourceNumber: 1, // Mod Wheel
    targetType: "daw_param",
    targetKey: "cc1_dynamics",
    targetName: "BBC Dynamics CC#1",
    createdAt: new Date().toISOString()
  },
  {
    _id: "64b0f7ca3a3f5a2b8e3a2012",
    userId: "darnellbarksdale2@gmail.com",
    sourceType: "cc",
    sourceNumber: 11, // Expression Slider
    targetType: "daw_param",
    targetKey: "cc11_expression",
    targetName: "BBC Expression CC#11",
    createdAt: new Date().toISOString()
  },
  {
    _id: "64b0f7ca3a3f5a2b8e3a2013",
    userId: "darnellbarksdale2@gmail.com",
    sourceType: "cc",
    sourceNumber: 7, // Channel Volume
    targetType: "daw_param",
    targetKey: "mixLevels.keys",
    targetName: "Keys Volume Slider",
    createdAt: new Date().toISOString()
  },
  {
    _id: "64b0f7ca3a3f5a2b8e3a2014",
    userId: "darnellbarksdale2@gmail.com",
    sourceType: "note",
    sourceNumber: 36, // C1 pad / note
    targetType: "pad_trigger",
    targetKey: "pad.0",
    targetName: "MPC Pad 1 Trigger",
    createdAt: new Date().toISOString()
  },
  {
    _id: "64b0f7ca3a3f5a2b8e3a2015",
    userId: "darnellbarksdale2@gmail.com",
    sourceType: "note",
    sourceNumber: 38, // D1 pad / note
    targetType: "pad_trigger",
    targetKey: "pad.1",
    targetName: "MPC Pad 2 Trigger",
    createdAt: new Date().toISOString()
  }
];

export const mongoMidiService = {
  /**
   * MongoDB find() query simulating database retrieval
   */
  async getMappings(userId: string): Promise<MidiBinding[]> {
    logFunctionCall('mongoMidiService.getMappings', { userId });
    
    // Simulating database network delay
    await new Promise(resolve => setTimeout(resolve, 150));

    const storedStr = localStorage.getItem(`mongo_midi_maps_${userId}`);
    let data: MidiBinding[] = [];
    
    if (storedStr) {
      data = JSON.parse(storedStr);
    } else {
      // Seed defaults
      data = [...DEFAULT_MIDI_MAPPINGS];
      localStorage.setItem(`mongo_midi_maps_${userId}`, JSON.stringify(data));
    }

    addQueryLog(
      "db.midi_mappings.find",
      { userId },
      { count: data.length, data }
    );

    return data;
  },

  /**
   * MongoDB updateOne / insertOne simulating persistent data write
   */
  async saveMapping(userId: string, mapping: Omit<MidiBinding, '_id' | 'userId' | 'createdAt'>): Promise<MidiBinding> {
    logFunctionCall('mongoMidiService.saveMapping', { userId, mapping });
    await new Promise(resolve => setTimeout(resolve, 200));

    const currentMaps = await this.getMappings(userId);
    
    // Generate an 24-character hex MongoDB ObjectId string
    const hexChars = "0123456789abcdef";
    let mongoId = "64b0f7ca";
    for (let i = 0; i < 16; i++) {
      mongoId += hexChars[Math.floor(Math.random() * 16)];
    }

    const newDoc: MidiBinding = {
      _id: mongoId,
      userId,
      ...mapping,
      createdAt: new Date().toISOString()
    };

    // Prevent duplicate mappings on same sourceType + sourceNumber
    const filteredMaps = currentMaps.filter(
      item => !(item.sourceType === mapping.sourceType && item.sourceNumber === mapping.sourceNumber)
    );

    const updated = [...filteredMaps, newDoc];
    localStorage.setItem(`mongo_midi_maps_${userId}`, JSON.stringify(updated));

    addQueryLog(
      "db.midi_mappings.updateOne",
      { 
        userId, 
        sourceType: mapping.sourceType, 
        sourceNumber: mapping.sourceNumber 
      },
      { 
        matchedCount: currentMaps.length - filteredMaps.length, 
        modifiedCount: 1, 
        upsertedId: newDoc._id,
        document: newDoc 
      }
    );

    return newDoc;
  },

  /**
   * MongoDB deleteOne query simulating deletion
   */
  async deleteMapping(userId: string, id: string): Promise<boolean> {
    logFunctionCall('mongoMidiService.deleteMapping', { userId, id });
    await new Promise(resolve => setTimeout(resolve, 120));

    const currentMaps = await this.getMappings(userId);
    const updated = currentMaps.filter(item => item._id !== id);
    localStorage.setItem(`mongo_midi_maps_${userId}`, JSON.stringify(updated));

    const success = currentMaps.length > updated.length;

    addQueryLog(
      "db.midi_mappings.deleteOne",
      { _id: id, userId },
      { deletedCount: success ? 1 : 0 }
    );

    return success;
  },

  /**
   * Reset collection to default state
   */
  async resetMappings(userId: string): Promise<MidiBinding[]> {
    localStorage.removeItem(`mongo_midi_maps_${userId}`);
    addQueryLog("db.midi_mappings.drop", { userId }, { acknowledged: true });
    return this.getMappings(userId);
  }
};
