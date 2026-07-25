export interface DirectorEncyclopediaEntry {
  id: string;
  name: string;
  aliases: string[];
  yearsActive: string;
  country: string;
  type: "film" | "music_video" | "hybrid";
  biography: string;
  careerOverview: string;
  visualStyle: string;
  cameraLanguage: string;
  editingTechniques: string[];
  lightingStyle: string;
  colorGrading: string;
  transitions: string[];
  lensPreferences: string[];
  storytellingMethods: string[];
  productionWorkflow: string;
  learningExercises: string[];
  relatedDirectors: string[];
  referenceWorks: string[];
  awards: string[];
  timeline: { year: string; event: string }[];
  historicalImpact: string;
  legacy: string;
  difficulty: {
    beginner: string;
    intermediate: string;
    advanced: string;
  };
  quizzes: {
    question: string;
    options: string[];
    correct: string;
    explanation: string;
  }[];
}

export const DIRECTORS_ENCYCLOPEDIA: DirectorEncyclopediaEntry[] = [
  {
    id: "alfred_hitchcock",
    name: "Alfred Hitchcock",
    aliases: ["The Master of Suspense", "Sir Alfred Hitchcock"],
    yearsActive: "1919 - 1980",
    country: "United Kingdom / United States",
    type: "film",
    biography: "Sir Alfred Joseph Hitchcock was an English filmmaker widely regarded as one of the most influential figures in cinema history. Over a career spanning six decades, he directed over 50 feature films, pioneering many camera techniques and narrative patterns that defined the modern thriller genre.",
    careerOverview: "Hitchcock started in silent cinema in London, rising to fame with 'The Lodger' (1927). He moved to Hollywood in 1939, producing masterpieces like 'Rebecca', 'Rear Window', 'Vertigo', 'North by Northwest', and 'Psycho'. He was renowned for his absolute, tyrannical control over every visual element of his films.",
    visualStyle: "Highly controlled, psychological framing. Hitchcock believed in 'pure cinema'—the idea that editing and camera movement, rather than dialogue, should carry the emotional weight. He composed shots to simulate voyeurism, making the audience complicit in the characters' crimes or terrors.",
    cameraLanguage: "Subjective camera angles. He frequently placed the camera directly at a character's eye line (POV shots), panning to show what they see, then cutting back to show their reaction. He pioneered the Dolly Zoom (the 'Vertigo effect') to visually represent psychological acrophobia.",
    editingTechniques: [
      "Kuleshov effect juxtaposition to imply psychological thoughts",
      "Rhythmic montage cutting (as seen in the famous Psycho shower scene)",
      "Long, unbroken tracking shots that survey a room to build heavy suspense"
    ],
    lightingStyle: "Chiaroscuro lighting. heavily influenced by German Expressionism, Hitchcock used deep, stark shadows, high contrast ratios, and shafts of light to project inner psychological torment and guilt onto physical sets.",
    colorGrading: "Highly symbolic color palettes. In his color era, he used specific hues to represent obsession and danger (e.g., the neon green glow in Vertigo, or the stark crimson red in Marnie).",
    transitions: [
      "Match cuts on shapes (e.g., a draining drain to a dead eye)",
      "Dissolves that bleed psychological symbols together",
      "Wipes that track physical objects to reveal new scenes"
    ],
    lensPreferences: ["50mm Standard Lens (simulating natural human vision)", "Wide lenses for deep-focus background actions"],
    storytellingMethods: [
      "The 'MacGuffin'—an object or goal that characters pursue, which drives the plot but has zero intrinsic importance",
      "Suspense vs. Surprise—giving the audience crucial information that the characters do not have (e.g., showing a bomb under a table)",
      "The innocent man wrongly accused, fleeing both police and actual criminals"
    ],
    productionWorkflow: "Hitchcock famously claimed that his films were 'made' during the writing and storyboarding phase. He storyboarded every frame of his movies with microscopic detail. Once on set, he rarely looked through the viewfinder, claiming that shooting was simply the tedious mechanical execution of a pre-existing blueprint.",
    learningExercises: [
      "Storyboard a 3-shot scene showing an character realizing they are being followed, using POV editing.",
      "Shoot a simple 2-minute scene where suspense is created purely by showing a hidden object to the viewer."
    ],
    relatedDirectors: ["Brian De Palma", "David Fincher", "Martin Scorsese", "Steven Spielberg"],
    referenceWorks: ["Vertigo (1958)", "Psycho (1960)", "Rear Window (1954)", "North by Northwest (1959)"],
    awards: ["AFI Life Achievement Award (1979)", "Knighted by Queen Elizabeth II (1980)", "5x Academy Award Best Director Nominee"],
    timeline: [
      { year: "1927", event: "Directed 'The Lodger: A Story of the London Fog', his first major suspense film." },
      { year: "1940", event: "His American debut 'Rebecca' won the Academy Award for Best Picture." },
      { year: "1958", event: "Released 'Vertigo', pioneering the dolly zoom and complex color psychology." },
      { year: "1960", event: "Directed 'Psycho', breaking distribution standards and forever changing editing rhythm." }
    ],
    historicalImpact: "Hitchcock elevated the mystery-thriller from cheap pulp fiction to a highly sophisticated psychological art form, establishing the director as the absolute visual author (auteur) of the film.",
    legacy: "His camera grammar, suspense mechanics, and storytelling principles remain the standard textbook for modern thrillers, horror, and narrative cinema across the globe.",
    difficulty: {
      beginner: "Understand POV shot construction and the difference between suspense and surprise.",
      intermediate: "Recreate a German Expressionist high-contrast lighting scheme with deep shadows.",
      advanced: "Calculate and execute a physical Dolly Zoom, coordinating camera tracking and focal lens adjustments perfectly."
    },
    quizzes: [
      {
        question: "What term did Hitchcock use to describe an object or plot device that drives the story but holds no real value?",
        options: ["The MacGuffin", "The Red Herring", "The Suspense Hook", "The Clue-Grip"],
        correct: "The MacGuffin",
        explanation: "Hitchcock popularized the word 'MacGuffin' to describe a plot device that characters care about intensely, but is ultimately secondary to the psychological story."
      },
      {
        question: "Which film pioneered the 'dolly zoom' (Vertigo effect) to simulate acrophobia?",
        options: ["Vertigo", "Psycho", "Rear Window", "Rebecca"],
        correct: "Vertigo",
        explanation: "Vertigo (1958), filmed by DP Irma Roberts, used the dolly zoom—moving the camera backward while zooming in—to represent visual acrophobia."
      }
    ]
  },
  {
    id: "hype_williams",
    name: "Hype Williams (Harold Williams)",
    aliases: ["Hype", "Harold Williams"],
    yearsActive: "1991 - Present",
    country: "United States",
    type: "music_video",
    biography: "Harold 'Hype' Williams is an American music video director, film director, and photographer. He is widely celebrated as the definitive visual architect of the golden MTV era of hip-hop and R&B, completely transforming music videos into high-budget, high-concept, highly stylized cinematic spectacles.",
    careerOverview: "Williams began as a graffiti writer in Queens, New York, before moving into film. In the mid-1990s, his collaborations with Missy Elliott, Busta Rhymes, Tupac Shakur, Notorious B.I.G., and Jay-Z revolutionized music video aesthetics, making hip-hop the dominant visual culture on global television.",
    visualStyle: "Futuristic, hyper-saturated, larger-than-life. Hype used extremely wide lens angles, glowing neon colors, highly reflective latex outfits, and dramatic sci-fi backdrops. His framing was bold and theatrical, centering the artist like a modern superhero.",
    cameraLanguage: "Extreme fish-eye perspective and rapid tracking. Hype popularized the use of the 8mm fish-eye lens, placing it inches from the artist's face while they performed directly to the lens, creating a striking, immersive, curved-world effect.",
    editingTechniques: [
      "Strobe-like flash frames that align with drum transients",
      "Cinematic widescreen letterbox bars that active text or images bleed over",
      "Staccato jump cuts that emphasize high-energy dance movements"
    ],
    lightingStyle: "Ultra-bright neon and glowing ring lights. He pioneered high-contrast rim lighting, illuminating artists with vibrant blues, purples, and hot pinks, while utilizing backlighting to silhouette actors in stylized frames.",
    colorGrading: "Highly saturated, metallic gloss. Skin tones are rendered with a rich, glossy sheen, while blues, silvers, and reds are pushed to their maximum electronic vibrance.",
    transitions: [
      "Whip-pans that mimic camera rushes",
      "Lens flares that temporarily wash out the frame",
      "Digital slide splits that divide the screen into animated grids"
    ],
    lensPreferences: ["8mm Fish-Eye Lens (for extreme curved performance takes)", "Anamorphic widescreen lenses"],
    storytellingMethods: [
      "Performance-first narrative, where the artist's physical charisma and style *is* the central story",
      "High-fashion avant-garde costume concepts that subvert traditional rap video tropes",
      "Futuristic, sci-fi world-building, portraying hip-hop culture as hyper-advanced"
    ],
    productionWorkflow: "Hype ran intense, fast-paced commercial shoots, directing multiple performance sets simultaneously. He was highly collaborative with costume designers and art directors, often building custom reflective rooms and glossy floor sets to bounce light shafts back at the camera.",
    learningExercises: [
      "Shoot a 30-second performance clip using a wide-angle mobile lens, capturing low-angle shots directly at the performer.",
      "Grade a video clip using highly saturated neon secondary overlays (hot pink/electric blue) to emulate 1997 MTV vibes."
    ],
    relatedDirectors: ["Director X", "Dave Meyers", "Melina Matsoukas", "Cole Bennett"],
    referenceWorks: ["The Rain (Missy Elliott, 1997)", "Mo Money Mo Problems (Notorious B.I.G.)", "Put Your Hands Where My Eyes Could See (Busta Rhymes)", "Belly (Feature Film, 1998)"],
    awards: ["MTV Video Vanguard Award (2006)", "Billboard Music Video Director of the Year (1998)", "BET Hip Hop Award for Best Video Director"],
    timeline: [
      { year: "1994", event: "Directed Craig Mack's 'Flava in Ya Ear', establishing a clean, bold aesthetic." },
      { year: "1997", event: "Directed Missy Elliott's 'The Rain', featuring the iconic blow-up trash bag suit." },
      { year: "1998", event: "Directed 'Belly', his debut feature film, celebrated for its legendary neon blacklight cinematography." },
      { year: "2010", event: "Directed Kanye West's 'Runaway' 35-minute cinematic film, fusing high art with pop music." }
    ],
    historicalImpact: "Hype Williams took hip-hop music videos out of gritty street realism and placed them inside a multi-million dollar, futuristic, high-fashion universe, establishing rap artists as global pop icons.",
    legacy: "His fish-eye angles, glossy neon lighting schemes, and letterbox boundaries redefined pop-culture cinematography, heavily influencing directors, fashion lines, and digital animators up to the modern day.",
    difficulty: {
      beginner: "Learn how wide-angle lenses distort perspective and block dynamic artist movements.",
      intermediate: "Coordinate saturated neon lighting gels and rim-lights on reflective surfaces.",
      advanced: "Design a high-concept sci-fi production set utilizing glossy black vinyl flooring and wide anamorphic lens structures."
    },
    quizzes: [
      {
        question: "Which camera lens did Hype Williams popularize to create his signature curved hip-hop performance shots?",
        options: ["Fish-Eye Lens", "Telephoto Lens", "Macro Lens", "Tilt-Shift Lens"],
        correct: "Fish-Eye Lens",
        explanation: "Hype famously utilized ultra-wide Fish-Eye lenses (often 8mm) to capture energetic, distorted artist performances close to the camera."
      },
      {
        question: "What is the title of Hype Williams' visually stunning 1998 debut feature film starring DMX and Nas?",
        options: ["Belly", "Juice", "Paid in Full", "He Got Game"],
        correct: "Belly",
        explanation: "Belly (1998) is Hype's directorial film debut, widely praised for its opening blacklight sequence and highly stylized, saturated cinematography."
      }
    ]
  }
];
