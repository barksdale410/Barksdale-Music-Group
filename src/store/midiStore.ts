import { create } from 'zustand';
import { mongoMidiService, MidiBinding, MongoQueryLog, getMongoQueryLogs } from '../services/mongoMidiService';
import { barksdaleSynth } from '../utils/audioUtils';

export interface MidiStoreState {
  mappings: MidiBinding[];
  midiDevices: string[];
  midiStatus: 'unsupported' | 'initializing' | 'granted' | 'denied';
  lastMidiEvent: string;
  isLearning: boolean;
  learningType: 'cc' | 'note';
  learningTargetKey: string;
  learningTargetType: 'daw_param' | 'pad_trigger' | 'transport_control';
  learningTargetName: string;
  isLoading: boolean;
  dbStatus: 'connected' | 'querying' | 'error';
  mongoLogs: MongoQueryLog[];

  // Actions
  initializeMidi: () => void;
  loadMappings: () => Promise<void>;
  addMapping: (mapping: {
    sourceType: 'cc' | 'note';
    sourceNumber: number;
    targetType: 'daw_param' | 'pad_trigger' | 'transport_control';
    targetKey: string;
    targetName: string;
  }) => Promise<void>;
  deleteMapping: (id: string, name: string) => Promise<void>;
  resetMappings: () => Promise<void>;
  setLearning: (
    isLearning: boolean, 
    type?: 'cc' | 'note', 
    targetType?: 'daw_param' | 'pad_trigger' | 'transport_control', 
    targetKey?: string, 
    targetName?: string
  ) => void;
  updateMongoLogs: () => void;
  triggerLocalFeedback: (key: string, value: number) => void;
}

const userId = "darnellbarksdale2@gmail.com";

export const useMidiStore = create<MidiStoreState>((set, get) => {
  let isMidiInitialized = false;

  return {
    mappings: [],
    midiDevices: [],
    midiStatus: 'initializing',
    lastMidiEvent: "No active MIDI signals received",
    isLearning: false,
    learningType: 'cc',
    learningTargetKey: 'mixLevels.keys',
    learningTargetType: 'daw_param',
    learningTargetName: 'Keys Volume Slider',
    isLoading: true,
    dbStatus: 'connected',
    mongoLogs: [],

    initializeMidi: () => {
      if (isMidiInitialized) return;
      isMidiInitialized = true;

      // Fetch mappings first
      get().loadMappings();
      get().updateMongoLogs();

      // Check support
      if (!navigator.requestMIDIAccess) {
        set({ midiStatus: 'unsupported' });
        return;
      }

      // Handler for MIDI events
      const processMidiInput = (status: number, data1: number, data2: number, deviceName: string) => {
        const command = status & 0xf0;
        const isNoteOn = command === 144 && data2 > 0;
        const isNoteOff = command === 128 || (command === 144 && data2 === 0);
        const isCC = command === 176;

        const { isLearning, learningType, learningTargetType, learningTargetKey, learningTargetName, mappings } = get();

        // 1. Learn Mode Intercept
        if (isLearning) {
          if (isCC && learningType === 'cc') {
            get().addMapping({
              sourceType: 'cc',
              sourceNumber: data1,
              targetType: learningTargetType,
              targetKey: learningTargetKey,
              targetName: learningTargetName
            });
            set({ 
              isLearning: false,
              lastMidiEvent: `LEARNED: CC#${data1} bound to ${learningTargetName}` 
            });
            barksdaleSynth.playRhodesNote(523.25, 0.15); // visual sound chime
            return;
          } else if (isNoteOn && learningType === 'note') {
            get().addMapping({
              sourceType: 'note',
              sourceNumber: data1,
              targetType: learningTargetType,
              targetKey: learningTargetKey,
              targetName: learningTargetName
            });
            set({ 
              isLearning: false,
              lastMidiEvent: `LEARNED: Note#${data1} bound to ${learningTargetName}` 
            });
            barksdaleSynth.playRhodesNote(587.33, 0.15); // visual sound chime
            return;
          }
        }

        // 2. Mapping Router Lookup
        let resolved = false;

        if (isCC) {
          const match = mappings.find(m => m.sourceType === 'cc' && m.sourceNumber === data1);
          if (match) {
            resolved = true;
            set({ lastMidiEvent: `CC MAP TRIGGERED: CC#${data1} [Val: ${data2}] ➔ ${match.targetName}` });
            get().triggerLocalFeedback(match.targetKey, data2);

            // Dispatch custom event for subscribers
            window.dispatchEvent(new CustomEvent('midi_control_change', {
              detail: { key: match.targetKey, value: data2, type: match.targetType }
            }));
          }
        } else if (isNoteOn) {
          const match = mappings.find(m => m.sourceType === 'note' && m.sourceNumber === data1);
          if (match) {
            resolved = true;
            set({ lastMidiEvent: `NOTE MAP TRIGGERED: Note#${data1} [Vel: ${data2}] ➔ ${match.targetName}` });
            get().triggerLocalFeedback(match.targetKey, data2);

            window.dispatchEvent(new CustomEvent('midi_note_trigger', {
              detail: { key: match.targetKey, velocity: data2, type: match.targetType }
            }));
          }
        }

        // Fallback default routing
        if (!resolved) {
          if (isNoteOn) {
            const freq = 440 * Math.pow(2, (data1 - 69) / 12);
            barksdaleSynth.playRhodesNote(freq, 0.45);
            set({ lastMidiEvent: `Note ON (Fallback Keyboard): Note#${data1} | Vel: ${data2} | Src: ${deviceName}` });
          } else if (isNoteOff) {
            set({ lastMidiEvent: `Note OFF: Note#${data1} | Src: ${deviceName}` });
          } else if (isCC) {
            set({ lastMidiEvent: `CC unmapped: CC#${data1} Value: ${data2} | Src: ${deviceName}` });
          }
        }
      };

      // Register onto the central barksdaleSynth MIDI stream
      barksdaleSynth.registerMidiCallback(processMidiInput);

      // Access browser requestMIDIAccess to fetch real ports
      navigator.requestMIDIAccess()
        .then((access) => {
          set({ midiStatus: 'granted' });
          const inputs = Array.from(access.inputs.values());
          set({ midiDevices: inputs.map(input => input.name || "Generic Controller") });

          access.onstatechange = () => {
            const updated = Array.from(access.inputs.values());
            set({ midiDevices: updated.map(input => input.name || "Generic Controller") });
          };
        })
        .catch(() => {
          set({ midiStatus: 'denied' });
        });

      // Listen for mongo query events to update logs in real-time
      const handleMongoLog = () => {
        get().updateMongoLogs();
      };
      window.addEventListener('mongo_query_logged', handleMongoLog);
    },

    loadMappings: async () => {
      try {
        set({ dbStatus: 'querying' });
        const data = await mongoMidiService.getMappings(userId);
        set({ mappings: data, dbStatus: 'connected' });
      } catch (err) {
        console.error("Failed to load mappings from MongoDB", err);
        set({ dbStatus: 'error' });
      } finally {
        set({ isLoading: false });
      }
    },

    addMapping: async (mapping) => {
      try {
        set({ dbStatus: 'querying' });
        await mongoMidiService.saveMapping(userId, mapping);
        const data = await mongoMidiService.getMappings(userId);
        set({ mappings: data, dbStatus: 'connected' });
      } catch (err) {
        console.error("Failed to save mapping to MongoDB", err);
        set({ dbStatus: 'error' });
      }
    },

    deleteMapping: async (id, name) => {
      try {
        set({ dbStatus: 'querying' });
        await mongoMidiService.deleteMapping(userId, id);
        const data = await mongoMidiService.getMappings(userId);
        set({ 
          mappings: data, 
          dbStatus: 'connected',
          lastMidiEvent: `DELETED: Mapping removed for ${name}`
        });
      } catch (err) {
        console.error("Failed to delete mapping from MongoDB", err);
        set({ dbStatus: 'error' });
      }
    },

    resetMappings: async () => {
      try {
        set({ dbStatus: 'querying' });
        await mongoMidiService.resetMappings(userId);
        const data = await mongoMidiService.getMappings(userId);
        set({ 
          mappings: data, 
          dbStatus: 'connected',
          lastMidiEvent: "DATABASE RESET: Default document schemas restored in MongoDB."
        });
      } catch (err) {
        console.error("Failed to reset mappings", err);
        set({ dbStatus: 'error' });
      }
    },

    setLearning: (isLearning, type, targetType, targetKey, targetName) => {
      set((state) => ({
        isLearning,
        learningType: type || state.learningType,
        learningTargetType: targetType || state.learningTargetType,
        learningTargetKey: targetKey || state.learningTargetKey,
        learningTargetName: targetName || state.learningTargetName
      }));
    },

    setLastMidiEvent: (event) => set({ lastMidiEvent: event }),

    updateMongoLogs: () => {
      set({ mongoLogs: getMongoQueryLogs() });
    },

    triggerLocalFeedback: (key: string, value: number) => {
      // Temporary custom event to let UI elements flash visual feed
      window.dispatchEvent(new CustomEvent('midi_mapped_flash', {
        detail: { key, value }
      }));
    }
  };
});
