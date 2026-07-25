import React, { useState, useMemo, useRef } from 'react';
import { Search, UserPlus, Sliders, Volume2, Save, Download, Star, Heart, Sparkles, Filter, ChevronRight, RefreshCw } from 'lucide-react';

export interface Actor {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Non-Binary';
  age: number;
  ethnicity: string;
  height: string;
  build: string;
  eyeColor: string;
  hairStyle: string;
  hairColor: string;
  facialHair?: string;
  makeup?: string;
  clothing: string;
  accessories: string;
  vocalRange: string;
  accent: string;
  pitch: number; // 1-10
  timbre: string; // warm, cold, raspy, resonant
  speakingSpeed: string; // fast, slow, casual
  actingStyle: string;
  genres: string[];
  notableRoles: string[];
  emotions: {
    joy: number;
    anger: number;
    sorrow: number;
    fear: number;
    comedic: number;
    dramatic: number;
    action: number;
    dance: number;
    sing: number;
  };
  customized?: boolean;
}

const PRESET_ACTORS: Actor[] = [
  {
    id: 'act_aaron',
    name: 'Aaron Vance',
    gender: 'Male',
    age: 34,
    ethnicity: 'African-American',
    height: '6\'2"',
    build: 'Athletic / Lean',
    eyeColor: 'Dark Brown',
    hairStyle: 'Low Buzz Cut',
    hairColor: 'Black',
    facialHair: 'Trimmed Goatee',
    clothing: 'Tailored Leather Trench & Charcoal Mockneck',
    accessories: 'Vintage Gold Signet Ring',
    vocalRange: 'Baritone (Resonant & Smooth)',
    accent: 'Standard American (Midwest)',
    pitch: 4,
    timbre: 'Rich & Resonant',
    speakingSpeed: 'Measured',
    actingStyle: 'Intense Detective / Reluctant Hero',
    genres: ['Crime', 'Drama', 'Thriller'],
    notableRoles: ['Shadow of Chicago (2018)', 'The Red Light District (2023)'],
    emotions: { joy: 4, anger: 8, sorrow: 7, fear: 5, comedic: 3, dramatic: 9, action: 9, dance: 4, sing: 6 }
  },
  {
    id: 'act_beatrice',
    name: 'Beatrice Vance',
    gender: 'Female',
    age: 29,
    ethnicity: 'Multiracial',
    height: '5\'7"',
    build: 'Slender',
    eyeColor: 'Hazel',
    hairStyle: 'Shoulder Length Curls',
    hairColor: 'Auburn',
    clothing: 'Silk Emerald Blouse & Tailored Slacks',
    accessories: 'Delicate Gold Pendant',
    vocalRange: 'Soprano (Crisp & Articulate)',
    accent: 'Standard British (RP)',
    pitch: 7,
    timbre: 'Crisp & Warm',
    speakingSpeed: 'Deliberate',
    actingStyle: 'Brilliant Criminal Psychologist / Enigmatic Heiress',
    genres: ['Mystery', 'Drama', 'Romance'],
    notableRoles: ['The Chessmaster\'s Mind (2020)', 'London Fog (2024)'],
    emotions: { joy: 6, anger: 5, sorrow: 8, fear: 6, comedic: 5, dramatic: 9, action: 5, dance: 7, sing: 8 }
  },
  {
    id: 'act_christian',
    name: 'Christian "Slate" Sterling',
    gender: 'Male',
    age: 38,
    ethnicity: 'Caucasian',
    height: '6\'1"',
    build: 'Rugged / Fit',
    eyeColor: 'Steel Blue',
    hairStyle: 'Classic Side-Part Fade',
    hairColor: 'Dark Brown',
    facialHair: 'Heavy Stubble',
    clothing: 'Tailored Charcoal Wool Coat & Oxford Shirt',
    accessories: 'Vintage Silver Chronograph',
    vocalRange: 'Baritone (Gravelly & Deep)',
    accent: 'East Coast American (Boston Nuance)',
    pitch: 3,
    timbre: 'Gravelly & Resonant',
    speakingSpeed: 'Slow & Deliberate',
    actingStyle: 'Stoic Protagonist / Hard-Boiled Investigator',
    genres: ['Action', 'Crime', 'Drama', 'Film Noir'],
    notableRoles: ['The Crimson Shadow (2016)', 'Dark City Syndicate (2025)'],
    emotions: { joy: 3, anger: 9, sorrow: 8, fear: 4, comedic: 4, dramatic: 10, action: 9, dance: 3, sing: 4 }
  },
  {
    id: 'act_diana',
    name: 'Diana Prince',
    gender: 'Female',
    age: 31,
    ethnicity: 'Mediterranean',
    height: '5\'11"',
    build: 'Athletic / Toned',
    eyeColor: 'Dark Amber',
    hairStyle: 'Long Voluminous Waves',
    hairColor: 'Raven Black',
    clothing: 'Tactical Leather Utility Vest & Dark Denim',
    accessories: 'Polished Steel Cuffs',
    vocalRange: 'Mezzo-Soprano (Commanding)',
    accent: 'Classical Greek / European Nuance',
    pitch: 5,
    timbre: 'Commanding & Rich',
    speakingSpeed: 'Measured',
    actingStyle: 'Relentless Warrior / Diplomatic Envoy',
    genres: ['Action', 'Superhero', 'Adventure'],
    notableRoles: ['Pantheon Rising (2019)', 'Elysium Fields (2023)'],
    emotions: { joy: 5, anger: 8, sorrow: 6, fear: 3, comedic: 4, dramatic: 8, action: 10, dance: 6, sing: 5 }
  },
  {
    id: 'act_elena',
    name: 'Elena "Stardust" Rostova',
    gender: 'Female',
    age: 32,
    ethnicity: 'Eastern European',
    height: '5\'8"',
    build: 'Sinuous',
    eyeColor: 'Vibrant Emerald',
    hairStyle: 'Sleek Vintage Wave Bob',
    hairColor: 'Plum Black',
    clothing: 'Satin Midnight Trench Coat & Silk Scarf',
    accessories: 'Oversized Dark Sunglasses, Silver Locket',
    vocalRange: 'Mezzo-Soprano (Velvety & Breathy)',
    accent: 'Slight Slavic / International',
    pitch: 6,
    timbre: 'Velvety & Breathy',
    speakingSpeed: 'Deliberate & Melodramatic',
    actingStyle: 'Femme Fatale / High-Stakes Operative',
    genres: ['Mystery', 'Drama', 'Sci-Fi', 'Thriller'],
    notableRoles: ['Rain in the Mirror (2018)', 'Silicon Whispers (2024)'],
    emotions: { joy: 4, anger: 7, sorrow: 8, fear: 6, comedic: 5, dramatic: 9, action: 8, dance: 8, sing: 9 }
  },
  {
    id: 'act_fiona',
    name: 'Fiona Gallagher',
    gender: 'Female',
    age: 27,
    ethnicity: 'Irish-American',
    height: '5\'6"',
    build: 'Wiry / Slender',
    eyeColor: 'Bright Blue',
    hairStyle: 'Messy High Bun',
    hairColor: 'Light Chestnut',
    clothing: 'Faded Denim Jacket & Distressed Boots',
    accessories: 'Braided Leather Bracelet',
    vocalRange: 'Soprano (Expressive & Quick)',
    accent: 'Working-Class Chicago',
    pitch: 8,
    timbre: 'Bright & Husky',
    speakingSpeed: 'Rapid Fire',
    actingStyle: 'Resilient Matriarch / High-Energy Rebel',
    genres: ['Comedy', 'Drama', 'Biography'],
    notableRoles: ['Southside Hustle (2020)', 'Grit and Grace (2025)'],
    emotions: { joy: 8, anger: 9, sorrow: 9, fear: 7, comedic: 8, dramatic: 9, action: 6, dance: 7, sing: 6 }
  },
  {
    id: 'act_gabriel',
    name: 'Gabriel Thorne',
    gender: 'Male',
    age: 45,
    ethnicity: 'Anglo-Saxon',
    height: '6\'3"',
    build: 'Broad-Shouldered',
    eyeColor: 'Slate Gray',
    hairStyle: 'Slicked-Back Undercut',
    hairColor: 'Silver-Streaked Black',
    facialHair: 'Manicured Beard',
    clothing: 'Double-Breasted Charcoal Suit & Silk Tie',
    accessories: 'Platinum Cufflinks',
    vocalRange: 'Bass (Gravelly & Booming)',
    accent: 'New York Upper-Class',
    pitch: 2,
    timbre: 'Gravelly & Booming',
    speakingSpeed: 'Slow & Imperial',
    actingStyle: 'Calculating Corporate Antagonist / Political Kingmaker',
    genres: ['Drama', 'Sci-Fi', 'Thriller'],
    notableRoles: ['Syndicate Boardroom (2017)', 'Chroma Core (2022)'],
    emotions: { joy: 3, anger: 8, sorrow: 6, fear: 2, comedic: 3, dramatic: 10, action: 6, dance: 2, sing: 3 }
  },
  {
    id: 'act_hannah',
    name: 'Hannah Abbott',
    gender: 'Female',
    age: 24,
    ethnicity: 'Anglo-Saxon',
    height: '5\'5"',
    build: 'Petite',
    eyeColor: 'Baby Blue',
    hairStyle: 'Double French Braids',
    hairColor: 'Honey Blonde',
    clothing: 'Heavy Knit Wool Sweater & Corduroy Pants',
    accessories: 'Leather Satchel',
    vocalRange: 'Soprano (Sweet & Clear)',
    accent: 'Standard Canadian',
    pitch: 8,
    timbre: 'Sweet & Melodic',
    speakingSpeed: 'Lively & Enthusiastic',
    actingStyle: 'Curious Explorer / Empathetic Protege',
    genres: ['Adventure', 'Fantasy', 'Family'],
    notableRoles: ['Wilderness Calls (2021)', 'Whispering Woods (2024)'],
    emotions: { joy: 9, anger: 4, sorrow: 5, fear: 8, comedic: 7, dramatic: 6, action: 7, dance: 8, sing: 7 }
  },
  {
    id: 'act_jax',
    name: 'Jax "Hyperion" Cross',
    gender: 'Non-Binary',
    age: 26,
    ethnicity: 'Androgynous European',
    height: '6\'0"',
    build: 'Androgynous / Slender',
    eyeColor: 'Chameleon Violet',
    hairStyle: 'Asymmetrical Spiked Crop',
    hairColor: 'Platinum Gray',
    clothing: 'Sleek Technical Jumpsuit & Smart Fabric Parka',
    accessories: 'Wireless Comm Earpiece, Monocle Visor',
    vocalRange: 'Tenor (Clean & Resonant)',
    accent: 'Mid-Atlantic Cultured',
    pitch: 5,
    timbre: 'Warm & Resonant',
    speakingSpeed: 'Analytical & Measured',
    actingStyle: 'Savant Cyber-Investigator / Tech Specialist',
    genres: ['Sci-Fi', 'Thriller', 'Superhero', 'Mystery'],
    notableRoles: ['Gridlock Nexus (2019)', 'Silicon Whispers (2023)'],
    emotions: { joy: 5, anger: 5, sorrow: 5, fear: 5, comedic: 4, dramatic: 8, action: 8, dance: 7, sing: 6 }
  },
  {
    id: 'act_marcus',
    name: 'Marcus "Iron Fist" Vance',
    gender: 'Male',
    age: 45,
    ethnicity: 'East-Asian / Pacific',
    height: '6\'2"',
    build: 'Muscular / Heavyweight',
    eyeColor: 'Dark Obsidian',
    hairStyle: 'Military Buzzcut',
    hairColor: 'Salt & Pepper',
    facialHair: 'Rugged Stubble Beard',
    clothing: 'Tactical Leather Utility Jacket, Cargo Pants',
    accessories: 'Fingerless Combat Gloves, Silver Dog Tags',
    vocalRange: 'Bass-Baritone (Booming)',
    accent: 'Standard American (Gruff)',
    pitch: 2,
    timbre: 'Gravelly & Intense',
    speakingSpeed: 'Slow & Gritty',
    actingStyle: 'Stoic Guardian / Ruthless Enforcer',
    genres: ['Action', 'Martial Arts', 'Superhero', 'Thriller'],
    notableRoles: ['Concrete Dragon (1998)', 'Zero Latency (2012)', 'Shadow Protocol (2024)'],
    emotions: { joy: 2, anger: 9, sorrow: 6, fear: 3, comedic: 3, dramatic: 8, action: 10, dance: 3, sing: 2 }
  },
  {
    id: 'act_penelope',
    name: 'Penelope "Penny" Stirling',
    gender: 'Female',
    age: 22,
    ethnicity: 'Gaelic',
    height: '5\'6"',
    build: 'Slender / Elegant',
    eyeColor: 'Emerald Green',
    hairStyle: 'Natural Red Waves',
    hairColor: 'Deep Copper',
    clothing: 'Cashmere Cardigan & Vintage Tweed Skirt',
    accessories: 'Gold Locket',
    vocalRange: 'Soprano (Bright & Expressive)',
    accent: 'Estuary English / London Upper-class',
    pitch: 8,
    timbre: 'Melodious & Crisp',
    speakingSpeed: 'Lively & Articulate',
    actingStyle: 'Quirky Companion / High-Intellect Investigator',
    genres: ['Mystery', 'Comedy', 'Drama', 'Period Piece'],
    notableRoles: ['Cotswold Secrets (2015)', 'The Cryptic Cipher (2022)'],
    emotions: { joy: 9, anger: 4, sorrow: 5, fear: 6, comedic: 9, dramatic: 6, action: 5, dance: 8, sing: 8 }
  }
];

const ALPHABET = 'ALLABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

// Helper to generate a completely new random actor matching a starting letter
const generateRandomActor = (letter: string, idSuffix: string): Actor => {
  const isMale = Math.random() > 0.5;
  const isNonBinary = !isMale && Math.random() > 0.8;
  const gender = isNonBinary ? 'Non-Binary' : (isMale ? 'Male' : 'Female');
  
  const maleFirstNames = ['Arthur', 'Benjamin', 'Charles', 'Daniel', 'Ethan', 'Frank', 'George', 'Harry', 'Ian', 'Jack', 'Kevin', 'Liam', 'Marcus', 'Nathan', 'Oliver', 'Peter', 'Quincy', 'Robert', 'Silas', 'Thomas', 'Ulysses', 'Victor', 'Wyatt', 'Xavier', 'Yusef', 'Zachary'];
  const femaleFirstNames = ['Alice', 'Beatrice', 'Clara', 'Diana', 'Elena', 'Fiona', 'Grace', 'Hannah', 'Isabella', 'Julia', 'Katherine', 'Lily', 'Monica', 'Natalie', 'Olivia', 'Penelope', 'Queenie', 'Rachel', 'Sophia', 'Trinity', 'Ursula', 'Victoria', 'Wendy', 'Xena', 'Yvonne', 'Zoe'];
  const nonBinaryFirstNames = ['Alex', 'Charlie', 'Dakota', 'Emery', 'Finley', 'Gray', 'Harlow', 'Indigo', 'Jordan', 'Kai', 'Logan', 'Morgan', 'Nova', 'Onyx', 'Peyton', 'Quinn', 'Rowan', 'Sage', 'Taylor', 'Umber', 'Val', 'Wren', 'Xael', 'Yael', 'Zion'];
  
  const lastNames = ['Adams', 'Barksdale', 'Cross', 'Dunbar', 'Eastwood', 'Fox', 'Garrison', 'Howell', 'Irons', 'Jackson', 'Kensington', 'Logan', 'McQueen', 'Nash', 'Oaks', 'Patterson', 'Quinn', 'Rutherford', 'Sterling', 'Thorne', 'Underwood', 'Vance', 'West', 'Xavier', 'Yates', 'Zimmerman'];
  
  // Force name to start with letter
  let firstName = '';
  const charIdx = letter === 'ALL' ? Math.floor(Math.random() * 26) : letter.charCodeAt(0) - 65;
  const safeCharIdx = Math.max(0, Math.min(25, charIdx));
  
  if (gender === 'Male') {
    firstName = maleFirstNames[safeCharIdx] || 'Marcus';
  } else if (gender === 'Female') {
    firstName = femaleFirstNames[safeCharIdx] || 'Elena';
  } else {
    firstName = nonBinaryFirstNames[safeCharIdx] || 'Jax';
  }
  
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const name = `${firstName} ${lastName}`;
  
  const age = Math.floor(Math.random() * 50) + 20; // 20-70
  const ethnicities = ['African-American', 'Caucasian', 'East-Asian Descent', 'Latino', 'Mediterranean', 'Scandinavian', 'South-Asian Descent', 'Multiracial'];
  const ethnicity = ethnicities[Math.floor(Math.random() * ethnicities.length)];
  
  const heights = ['5\'4"', '5\'6"', '5\'8"', '5\'10"', '6\'0"', '6\'1"', '6\'2"', '6\'4"'];
  const height = heights[Math.floor(Math.random() * heights.length)];
  
  const builds = ['Slender', 'Athletic / Toned', 'Medium / Average', 'Rugged / Fit', 'Broad-Shouldered', 'Muscular', 'Heavy Set'];
  const build = builds[Math.floor(Math.random() * builds.length)];
  
  const eyeColors = ['Dark Brown', 'Steel Blue', 'Emerald Green', 'Hazel', 'Amber Grey', 'Ice Blue', 'Deep Obsidian'];
  const eyeColor = eyeColors[Math.floor(Math.random() * eyeColors.length)];
  
  const hairStyles = ['Classic Fade Part', 'Messy Waves', 'Slicked-Back Undercut', 'Shoulder Length Bob', 'Buzz Cut', 'Crew Cut', 'Long Curly Tresses', 'Shaved', 'Voluminous Waves'];
  const hairStyle = hairStyles[Math.floor(Math.random() * hairStyles.length)];
  
  const hairColors = ['Dark Brown', 'Raven Black', 'Platinum Blonde', 'Honey Blonde', 'Auburn Red', 'Silver-Streaked Black', 'Copper Red', 'Ash Brown'];
  const hairColor = hairColors[Math.floor(Math.random() * hairColors.length)];
  
  const clothingStyles = [
    'Tailored Charcoal Suit & Crisp Oxford Shirt',
    'Tactical Leather Jacket & Dark Fitted Denim',
    'Silk Blouse & Sleek Wool Trouser',
    'Knit Wool Sweater & Classic Chinos',
    'Distressed Canvas Jacket & Work Boots',
    'Satin Trench Coat & Silk Scarf',
    'Double-Breasted Blazer & Italian Leather Loafers'
  ];
  const clothing = clothingStyles[Math.floor(Math.random() * clothingStyles.length)];
  
  const accessoriesList = ['Vintage Silver Chronograph', 'Minimalist Gold Ring', 'Classic Leather Watch', 'Gold Locket Pendant', 'Fine-framed Wire Spectacles', 'Leather Messenger Bag', 'None'];
  const accessories = accessoriesList[Math.floor(Math.random() * accessoriesList.length)];
  
  const vocalRanges = ['Bass (Deep & Booming)', 'Baritone (Resonant & Warm)', 'Tenor (Bright & Clear)', 'Mezzo-Soprano (Velvety & Breathy)', 'Soprano (Melodic & Expressive)'];
  const vocalRange = vocalRanges[Math.floor(Math.random() * vocalRanges.length)];
  
  const accents = ['Standard American', 'East Coast American', 'Southern American', 'Standard British (RP)', 'Estuary London', 'Irish Dialect', 'Standard Canadian', 'Australian Accent', 'International Slavic Accent'];
  const accent = accents[Math.floor(Math.random() * accents.length)];
  
  const timbres = ['Gravelly & Resonant', 'Smooth & Rich', 'Velvety & Breathy', 'Crisp & Melodic', 'Metallic & Clean', 'Warm & Whispering'];
  const timbre = timbres[Math.floor(Math.random() * timbres.length)];
  
  const speeds = ['Measured', 'Deliberate', 'Rapid Fire', 'Lively', 'Slow & Gritty', 'Casual'];
  const speakingSpeed = speeds[Math.floor(Math.random() * speeds.length)];
  
  const actingStyles = ['Intense Dramatic Protagonist', 'Quirky High-Intellect Investigator', 'Calculating Antagonist', 'Stoic Guardian', 'High-Energy Rebel', 'Enigmatic Catalyst'];
  const actingStyle = actingStyles[Math.floor(Math.random() * actingStyles.length)];
  
  const filmGenres = ['Drama', 'Action', 'Thriller', 'Crime', 'Sci-Fi', 'Mystery', 'Comedy', 'Adventure', 'Film Noir', 'Period Piece', 'Romance'];
  const actorGenres = [
    filmGenres[Math.floor(Math.random() * filmGenres.length)],
    filmGenres[Math.floor(Math.random() * filmGenres.length)]
  ].filter((v, i, self) => self.indexOf(v) === i);
  
  const roles = [
    `The ${actingStyle.split(' ')[0]} Gambit (${2015 + Math.floor(Math.random() * 11)})`,
    `Chronicles of ${lastName} (${2010 + Math.floor(Math.random() * 16)})`
  ];

  return {
    id: `act_gen_${letter.toLowerCase()}_${idSuffix}`,
    name,
    gender,
    age,
    ethnicity,
    height,
    build,
    eyeColor,
    hairStyle,
    hairColor,
    clothing,
    accessories,
    vocalRange,
    accent,
    pitch: Math.floor(Math.random() * 8) + 2, // 2-9
    timbre,
    speakingSpeed,
    actingStyle,
    genres: actorGenres,
    notableRoles: roles,
    emotions: {
      joy: Math.floor(Math.random() * 7) + 3,
      anger: Math.floor(Math.random() * 8) + 2,
      sorrow: Math.floor(Math.random() * 8) + 2,
      fear: Math.floor(Math.random() * 7) + 3,
      comedic: Math.floor(Math.random() * 8) + 2,
      dramatic: Math.floor(Math.random() * 7) + 4, // Higher baseline drama
      action: Math.floor(Math.random() * 8) + 2,
      dance: Math.floor(Math.random() * 6) + 3,
      sing: Math.floor(Math.random() * 7) + 3
    }
  };
};

export const ActorCasting: React.FC<{
  onSelectActor?: (actor: Actor) => void;
  selectedActorIds?: string[];
}> = ({ onSelectActor, selectedActorIds = [] }) => {
  const [actors, setActors] = useState<Actor[]>(PRESET_ACTORS);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(PRESET_ACTORS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [selectedAlphabet, setSelectedAlphabet] = useState('ALL');
  const [favorites, setFavorites] = useState<string[]>(['act_christian', 'act_elena']);

  // Edit controls
  const [editName, setEditName] = useState('');
  const [editAge, setEditAge] = useState(25);
  const [editEthnicity, setEditEthnicity] = useState('');
  const [editHeight, setEditHeight] = useState('');
  const [editBuild, setEditBuild] = useState('');
  const [editEyeColor, setEditEyeColor] = useState('');
  const [editHairStyle, setEditHairStyle] = useState('');
  const [editHairColor, setEditHairColor] = useState('');
  const [editClothing, setEditClothing] = useState('');
  const [editAccessories, setEditAccessories] = useState('');
  const [editAccent, setEditAccent] = useState('');
  const [editPitch, setEditPitch] = useState(5);
  const [editTimbre, setEditTimbre] = useState('');
  const [editSpeed, setEditSpeed] = useState('');
  const [editActingStyle, setEditActingStyle] = useState('');
  const [editEmotions, setEditEmotions] = useState<Actor['emotions']>({
    joy: 5, anger: 5, sorrow: 5, fear: 5, comedic: 5, dramatic: 5, action: 5, dance: 5, sing: 5
  });

  const loadActorForEditing = (actor: Actor) => {
    setSelectedActor(actor);
    setEditName(actor.name);
    setEditAge(actor.age);
    setEditEthnicity(actor.ethnicity);
    setEditHeight(actor.height);
    setEditBuild(actor.build);
    setEditEyeColor(actor.eyeColor);
    setEditHairStyle(actor.hairStyle);
    setEditHairColor(actor.hairColor);
    setEditClothing(actor.clothing);
    setEditAccessories(actor.accessories);
    setEditAccent(actor.accent);
    setEditPitch(actor.pitch);
    setEditTimbre(actor.timbre);
    setEditSpeed(actor.speakingSpeed);
    setEditActingStyle(actor.actingStyle);
    setEditEmotions({ ...actor.emotions });
  };

  const saveCustomizedActor = () => {
    if (!selectedActor) return;
    const updatedActor: Actor = {
      ...selectedActor,
      name: editName,
      age: editAge,
      ethnicity: editEthnicity,
      height: editHeight,
      build: editBuild,
      eyeColor: editEyeColor,
      hairStyle: editHairStyle,
      hairColor: editHairColor,
      clothing: editClothing,
      accessories: editAccessories,
      accent: editAccent,
      pitch: editPitch,
      timbre: editTimbre,
      speakingSpeed: editSpeed,
      actingStyle: editActingStyle,
      emotions: { ...editEmotions },
      customized: true
    };

    setActors(prev => prev.map(a => a.id === selectedActor.id ? updatedActor : a));
    setSelectedActor(updatedActor);
  };

  const createOriginalActor = () => {
    const newId = `act_custom_${Math.random().toString(36).substring(7)}`;
    const newActor: Actor = {
      id: newId,
      name: 'Julian Vance',
      gender: 'Male',
      age: 33,
      ethnicity: 'Multiracial',
      height: '6\'0"',
      build: 'Athletic',
      eyeColor: 'Charcoal Grey',
      hairStyle: 'Classic Taper Part',
      hairColor: 'Dark Brown',
      clothing: 'Tailored Wool Coat & Cashmere Turtleneck',
      accessories: 'Silver Signet Ring',
      vocalRange: 'Baritone',
      accent: 'Standard American',
      pitch: 4,
      timbre: 'Resonant & Smooth',
      speakingSpeed: 'Deliberate',
      actingStyle: 'Intense Brooding Protagonist',
      genres: ['Crime', 'Drama'],
      notableRoles: ['The High-Rise Syndicate (2026)'],
      emotions: { joy: 5, anger: 7, sorrow: 6, fear: 4, comedic: 4, dramatic: 9, action: 8, dance: 5, sing: 5 }
    };
    setActors(prev => [...prev, newActor]);
    loadActorForEditing(newActor);
  };

  // Simulated infinite scroll generator: Spawns 10 more actors based on current filter letter
  const loadMoreActors = () => {
    const spawned: Actor[] = [];
    const letterToUse = selectedAlphabet === 'ALL' ? 'M' : selectedAlphabet;
    for (let i = 0; i < 12; i++) {
      spawned.push(generateRandomActor(letterToUse, `${Date.now()}_${i}`));
    }
    setActors(prev => [...prev, ...spawned]);
  };

  const exportActorProfile = (actor: Actor) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(actor, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `bmg_actor_${actor.name.toLowerCase().replace(/ /g, '_')}.json`);
    dlAnchorElem.click();
  };

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  // Filter pipeline
  const filteredActors = useMemo(() => {
    return actors.filter(actor => {
      const matchesSearch = actor.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            actor.actingStyle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            actor.accent.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = genreFilter === '' || actor.genres.includes(genreFilter);
      const matchesGender = genderFilter === '' || actor.gender === genderFilter;
      
      const firstLetter = actor.name.trim().charAt(0).toUpperCase();
      const matchesAlphabet = selectedAlphabet === 'ALL' || firstLetter === selectedAlphabet;

      return matchesSearch && matchesGenre && matchesGender && matchesAlphabet;
    });
  }, [actors, searchQuery, genreFilter, genderFilter, selectedAlphabet]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4">
      {/* Top Alphabet Filter Banner */}
      <div className="lg:col-span-12 flex flex-col gap-2 bg-[var(--bmg-bg-secondary)] border border-[var(--bmg-border)] p-3 rounded-lg">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-[var(--bmg-accent-primary)] uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> A–Z Directory Roster Index
          </span>
          <span className="text-[10px] font-mono text-[var(--bmg-text-muted)]">
            Total Loaded: {filteredActors.length} / {actors.length} Performers
          </span>
        </div>
        <div className="flex flex-wrap gap-1 items-center justify-between">
          {ALPHABET.map(letter => (
            <button
              key={letter}
              onClick={() => setSelectedAlphabet(letter)}
              className={`min-w-[28px] h-[28px] text-[10px] font-bold rounded flex items-center justify-center transition-all ${
                selectedAlphabet === letter
                  ? 'bg-[var(--bmg-accent-primary)] text-[#0e0e10] font-black shadow-lg shadow-[var(--bmg-accent-glow)]'
                  : 'text-[var(--bmg-text-secondary)] hover:bg-[var(--bmg-bg-hover)] hover:text-[var(--bmg-text-primary)]'
              }`}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* List / Search Column */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bmg-card p-4">
          <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--bmg-text-primary)] mb-3 flex items-center gap-2">
            <span>🎬 CASTING WORKSTATION</span>
          </h3>
          <p className="text-[11px] text-[var(--bmg-text-secondary)] mb-4 italic leading-relaxed">
            Search, filter, and calibrate elite Screen & Voice actors for your production chapters.
          </p>
          
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[var(--bmg-text-muted)]" />
              <input 
                type="text" 
                placeholder="Search performer, accent, style..." 
                className="w-full pl-9 pr-4 py-2 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded-md text-[var(--bmg-text-primary)] focus:border-[var(--bmg-accent-primary)] outline-none"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <select 
                className="p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] focus:border-[var(--bmg-accent-primary)] outline-none"
                value={genreFilter}
                onChange={e => setGenreFilter(e.target.value)}
              >
                <option value="">All Genres</option>
                <option value="Action">Action</option>
                <option value="Crime">Crime</option>
                <option value="Drama">Drama</option>
                <option value="Sci-Fi">Sci-Fi</option>
                <option value="Mystery">Mystery</option>
                <option value="Comedy">Comedy</option>
                <option value="Thriller">Thriller</option>
                <option value="Adventure">Adventure</option>
              </select>
              <select 
                className="p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] focus:border-[var(--bmg-accent-primary)] outline-none"
                value={genderFilter}
                onChange={e => setGenreFilter(e.target.value)}
              >
                <option value="">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Non-Binary">Non-Binary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Actor Index List */}
        <div className="bmg-card p-2 flex flex-col gap-2 max-h-[500px] overflow-y-auto">
          {filteredActors.length > 0 ? (
            filteredActors.map(actor => {
              const isSelected = selectedActor?.id === actor.id;
              const isFav = favorites.includes(actor.id);
              const isAssigned = selectedActorIds.includes(actor.id);

              return (
                <div 
                  key={actor.id}
                  onClick={() => loadActorForEditing(actor)}
                  className={`p-2.5 border rounded cursor-pointer transition-all flex items-center justify-between ${
                    isSelected 
                      ? 'border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-tertiary)] shadow-md shadow-[var(--bmg-accent-glow)]' 
                      : 'border-[var(--bmg-border)] hover:bg-[var(--bmg-bg-hover)] bg-[var(--bmg-bg-secondary)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-[var(--bmg-bg-hover)] border border-[var(--bmg-border-light)] rounded-full flex items-center justify-center text-xs text-[var(--bmg-accent-primary)] font-bold">
                      {actor.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs text-[var(--bmg-text-primary)]">{actor.name}</h4>
                      <p className="text-[10px] text-[var(--bmg-text-secondary)] font-mono">
                        {actor.gender} • Age {actor.age} • {actor.vocalRange.split(' ')[0]}
                      </p>
                      {isAssigned && (
                        <span className="inline-block mt-1 px-1 bg-[var(--bmg-success)]/10 text-[var(--bmg-success)] text-[8px] font-black uppercase rounded border border-[var(--bmg-success)]/30">
                          Assigned Lead
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={(e) => toggleFavorite(actor.id, e)} 
                      className="p-1.5 text-[var(--bmg-text-muted)] hover:text-red-500 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                    {onSelectActor && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSelectActor(actor); }}
                        className="px-2 py-1 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-[9px] font-black uppercase rounded hover:opacity-90"
                      >
                        Cast
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-[var(--bmg-text-muted)] italic">
              No matching profiles found in static index.
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <button 
              onClick={loadMoreActors}
              className="w-full py-2 bg-[var(--bmg-bg-tertiary)] border border-dashed border-[var(--bmg-border-light)] text-[var(--bmg-accent-primary)] text-xs font-bold uppercase rounded flex items-center justify-center gap-1.5 hover:bg-[var(--bmg-bg-hover)]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Spawn Endless A–Z Talents
            </button>

            <button 
              onClick={createOriginalActor}
              className="w-full py-2 bg-[var(--bmg-accent-primary)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center justify-center gap-1.5 hover:opacity-90"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Draft New Custom Profile
            </button>
          </div>
        </div>
      </div>

      {/* Editor / Inspector Column */}
      <div className="lg:col-span-8">
        {selectedActor ? (
          <div className="bmg-card p-5 border-[var(--bmg-accent-primary)] bg-[var(--bmg-bg-secondary)] relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button 
                onClick={() => exportActorProfile(selectedActor)}
                title="Export actor blueprint json" 
                className="p-2 bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded hover:bg-[var(--bmg-bg-hover)] text-[var(--bmg-text-primary)] transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Actor Header Info */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pb-5 border-b border-[var(--bmg-border)]">
              <div className="w-14 h-14 bg-[var(--bmg-bg-tertiary)] border-2 border-[var(--bmg-accent-primary)] rounded-full flex items-center justify-center text-lg font-black text-[var(--bmg-accent-primary)] shadow-md">
                {editName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 w-full">
                <span className="px-2 py-0.5 bg-[var(--bmg-accent-primary)]/10 text-[var(--bmg-accent-primary)] text-[9px] font-black uppercase rounded border border-[var(--bmg-accent-primary)]/20">
                  {selectedActor.customized ? 'Configured DNA Profile' : 'System Baseline'}
                </span>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="block mt-1.5 font-bold text-lg text-[var(--bmg-text-primary)] bg-transparent border-b border-transparent hover:border-[var(--bmg-border-light)] focus:border-[var(--bmg-accent-primary)] outline-none py-0.5 w-full max-w-sm"
                />
                <p className="text-[10px] font-mono text-[var(--bmg-text-muted)] mt-1 uppercase">
                  Biometric ID: <span className="text-[var(--bmg-accent-secondary)]">{selectedActor.id}</span>
                </p>
              </div>
            </div>

            {/* Customization Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Appearance Block */}
              <div className="space-y-4">
                <h4 className="text-xs font-black tracking-wider text-[var(--bmg-accent-primary)] uppercase flex items-center gap-1.5">
                  <span>🎭 BIOMETRIC STATS & APPRAISE</span>
                </h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Age Spectrum</label>
                    <div className="flex items-center gap-2 bg-[var(--bmg-bg-tertiary)] px-2 py-1 rounded border border-[var(--bmg-border-light)]">
                      <input 
                        type="range" min="18" max="90" 
                        value={editAge} 
                        onChange={e => setEditAge(Number(e.target.value))}
                        className="w-full h-1 bg-black rounded outline-none appearance-none"
                      />
                      <span className="font-mono text-[10px] font-bold text-[var(--bmg-text-primary)] whitespace-nowrap">{editAge} yrs</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Ancestry / Breed</label>
                    <input 
                      type="text" value={editEthnicity} onChange={e => setEditEthnicity(e.target.value)}
                      className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Height</label>
                    <input 
                      type="text" value={editHeight} onChange={e => setEditHeight(e.target.value)}
                      className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Build</label>
                    <input 
                      type="text" value={editBuild} onChange={e => setEditBuild(e.target.value)}
                      className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Eye Hue</label>
                    <input 
                      type="text" value={editEyeColor} onChange={e => setEditEyeColor(e.target.value)}
                      className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Hair Cut</label>
                    <input 
                      type="text" value={editHairStyle} onChange={e => setEditHairStyle(e.target.value)}
                      className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Hair Tone</label>
                    <input 
                      type="text" value={editHairColor} onChange={e => setEditHairColor(e.target.value)}
                      className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Costume</label>
                    <input 
                      type="text" value={editClothing} onChange={e => setEditClothing(e.target.value)}
                      className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                  <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Accessories & Props</label>
                  <input 
                    type="text" value={editAccessories} onChange={e => setEditAccessories(e.target.value)}
                    className="w-full p-2 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none focus:border-[var(--bmg-accent-primary)]"
                  />
                </div>
              </div>

              {/* Voice Block */}
              <div className="space-y-4">
                <h4 className="text-xs font-black tracking-wider text-[var(--bmg-accent-primary)] uppercase flex items-center gap-1.5">
                  <span>🎙️ ACOUSTIC VOCALPRINT VECTORS</span>
                </h4>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Voice Pitch</label>
                    <div className="flex items-center gap-2 bg-[var(--bmg-bg-tertiary)] px-2.5 py-1.5 rounded border border-[var(--bmg-border-light)]">
                      <Volume2 className="w-3.5 h-3.5 text-[var(--bmg-accent-primary)]" />
                      <input 
                        type="range" min="1" max="10" 
                        value={editPitch} 
                        onChange={e => setEditPitch(Number(e.target.value))}
                        className="w-full h-1 bg-black rounded outline-none appearance-none"
                      />
                      <span className="font-mono text-xs font-bold text-[var(--bmg-text-primary)]">{editPitch}/10</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Accent Dialect</label>
                      <input 
                        type="text" value={editAccent} onChange={e => setEditAccent(e.target.value)}
                        className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Acoustic Timbre</label>
                      <input 
                        type="text" value={editTimbre} onChange={e => setEditTimbre(e.target.value)}
                        className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Speaking Speed</label>
                      <select 
                        value={editSpeed} onChange={e => setEditSpeed(e.target.value)}
                        className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none font-bold"
                      >
                        <option value="Measured">Measured</option>
                        <option value="Deliberate">Deliberate</option>
                        <option value="Rapid Fire">Rapid Fire</option>
                        <option value="Lively">Lively</option>
                        <option value="Slow & Gritty">Slow & Gritty</option>
                        <option value="Casual">Casual</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase text-[var(--bmg-text-muted)]">Primary Persona</label>
                      <input 
                        type="text" value={editActingStyle} onChange={e => setEditActingStyle(e.target.value)}
                        className="w-full p-1.5 text-xs bg-[var(--bmg-bg-tertiary)] border border-[var(--bmg-border-light)] rounded text-[var(--bmg-text-primary)] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Simulated Audio Spectrum */}
                <div className="bg-[#0e0e10] p-2.5 border border-[var(--bmg-border-light)] rounded-lg mt-3">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[8px] font-mono font-bold uppercase text-[var(--bmg-text-muted)]">Biometric Voiceprint Vector Map</span>
                    <span className="text-[8px] bg-[var(--bmg-success)]/10 text-[var(--bmg-success)] font-black px-1 rounded uppercase">Realtime Sync</span>
                  </div>
                  <div className="flex gap-1 h-8 items-end">
                    {[12, 28, 18, 42, 29, 35, 10, 15, 25, 45, 12, 32, 21, 38, 14, 50, 8, 20].map((h, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-[var(--bmg-accent-primary)] rounded-t border-t border-[var(--bmg-border-light)]"
                        style={{ height: `${(h * (editPitch / 5)).toFixed(0)}%`, opacity: 0.4 + (i % 3) * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Ability Metrics */}
            <div className="mt-8 pt-5 border-t border-[var(--bmg-border)]">
              <h4 className="text-xs font-black tracking-wider text-[var(--bmg-success)] mb-4 uppercase">
                📊 EMOTIONAL STRENGTHS & RANGE CAPABILITY VECTOR
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3.5">
                {Object.keys(editEmotions).map(key => {
                  const val = editEmotions[key as keyof Actor['emotions']];
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex justify-between text-[9px] font-bold uppercase">
                        <span className="text-[var(--bmg-text-secondary)]">{key}</span>
                        <span className="font-mono text-[var(--bmg-success)]">{val}/10</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-[var(--bmg-bg-tertiary)] px-2 py-1 rounded border border-[var(--bmg-border-light)]">
                        <input 
                          type="range" min="1" max="10" 
                          value={val}
                          onChange={e => {
                            const v = Number(e.target.value);
                            setEditEmotions(prev => ({ ...prev, [key]: v }));
                          }}
                          className="w-full h-1 bg-black rounded outline-none appearance-none"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commit / Save Controls */}
            <div className="mt-8 flex flex-wrap gap-3 justify-end">
              <button 
                onClick={saveCustomizedActor}
                className="py-2.5 px-4 bg-[var(--bmg-success)] text-[#0e0e10] text-xs font-black uppercase rounded flex items-center gap-1.5 hover:opacity-90 transition-all"
              >
                <Save className="w-3.5 h-3.5" />
                Commit Actor DNA Blueprint
              </button>
            </div>
          </div>
        ) : (
          <div className="bmg-card p-12 bg-[var(--bmg-bg-secondary)] flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-3 text-[var(--bmg-accent-primary)]">🎬</span>
            <h3 className="font-bold text-sm text-[var(--bmg-text-primary)] uppercase tracking-wider mb-1">Select an actor profile</h3>
            <p className="text-[11px] text-[var(--bmg-text-muted)] max-w-sm">
              Calibrate distinct biometric ranges, physical traits, and speaking registers for high-fidelity multimedia playback.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
