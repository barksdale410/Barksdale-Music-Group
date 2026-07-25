// Barksdale Music Group - Dynamic Genre Theme Engine (2026 Modern Workstation)

export interface GenreTheme {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  colors: {
    primaryBg: string;
    secondaryBg: string;
    tertiaryBg: string;
    cardBg: string;
    hoverBg: string;
    accentPrimary: string;
    accentSecondary: string;
    accentAmber: string;
    accentGlow: string;
    border: string;
    borderLight: string;
    textPrimary: string;
    textSecondary: string;
  };
}

export const GENRE_THEMES: Record<string, GenreTheme> = {
  hiphop: {
    id: "hiphop",
    name: "Hip Hop & Trap",
    category: "Urban",
    icon: "🔥",
    description: "Gold & Amber studio heat with heavy 808s and urban neon highlights",
    colors: {
      primaryBg: "#0a0a0f",
      secondaryBg: "#12121c",
      tertiaryBg: "#1a1a28",
      cardBg: "#1f1f30",
      hoverBg: "#2d2d45",
      accentPrimary: "#f59e0b", // Flame Gold
      accentSecondary: "#d97706",
      accentAmber: "#fbbf24",
      accentGlow: "rgba(245, 158, 11, 0.25)",
      border: "rgba(245, 158, 11, 0.15)",
      borderLight: "rgba(245, 158, 11, 0.3)",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1"
    }
  },
  electronic: {
    id: "electronic",
    name: "Electronic & Synthwave",
    category: "EDM / Synth",
    icon: "⚡",
    description: "Cyberpunk Neon Cyan & Electric Purple lasers with futuristic synth glows",
    colors: {
      primaryBg: "#060814",
      secondaryBg: "#0f132a",
      tertiaryBg: "#181f3f",
      cardBg: "#1e2850",
      hoverBg: "#2c3b72",
      accentPrimary: "#06b6d4", // Electric Cyan
      accentSecondary: "#a855f7", // Neon Violet
      accentAmber: "#38bdf8",
      accentGlow: "rgba(6, 182, 212, 0.3)",
      border: "rgba(6, 182, 212, 0.2)",
      borderLight: "rgba(6, 182, 212, 0.4)",
      textPrimary: "#f0f9ff",
      textSecondary: "#bae6fd"
    }
  },
  rock: {
    id: "rock",
    name: "Rock & Alternative",
    category: "Guitar",
    icon: "🎸",
    description: "High-energy Crimson Red & Cobalt carbon fiber overdrive aesthetics",
    colors: {
      primaryBg: "#0d0707",
      secondaryBg: "#1a0f0f",
      tertiaryBg: "#281717",
      cardBg: "#331d1d",
      hoverBg: "#4a2a2a",
      accentPrimary: "#ef4444", // Crimson Red
      accentSecondary: "#b91c1c",
      accentAmber: "#f87171",
      accentGlow: "rgba(239, 68, 68, 0.3)",
      border: "rgba(239, 68, 68, 0.2)",
      borderLight: "rgba(239, 68, 68, 0.4)",
      textPrimary: "#fef2f2",
      textSecondary: "#fca5a5"
    }
  },
  pop: {
    id: "pop",
    name: "Pop & Cyber Pop",
    category: "Mainstream",
    icon: "✨",
    description: "Vibrant Hot Pink & Neon Teal futuristic billboard shine",
    colors: {
      primaryBg: "#0e0612",
      secondaryBg: "#1a0d24",
      tertiaryBg: "#2a153a",
      cardBg: "#371c4c",
      hoverBg: "#50296e",
      accentPrimary: "#ec4899", // Neon Hot Pink
      accentSecondary: "#14b8a6", // Teal
      accentAmber: "#f472b6",
      accentGlow: "rgba(236, 72, 153, 0.3)",
      border: "rgba(236, 72, 153, 0.2)",
      borderLight: "rgba(236, 72, 153, 0.4)",
      textPrimary: "#fdf2f8",
      textSecondary: "#fbcfe8"
    }
  },
  jazz: {
    id: "jazz",
    name: "Jazz & Neo-Soul",
    category: "Acoustic / Soul",
    icon: "🎷",
    description: "Deep Velvet Purple & Champagne Rose luxury lounge ambiance",
    colors: {
      primaryBg: "#0b0712",
      secondaryBg: "#160e22",
      tertiaryBg: "#231735",
      cardBg: "#2e1e46",
      hoverBg: "#432c66",
      accentPrimary: "#a855f7", // Royal Purple
      accentSecondary: "#f43f5e", // Velvet Rose
      accentAmber: "#c084fc",
      accentGlow: "rgba(168, 85, 247, 0.3)",
      border: "rgba(168, 85, 247, 0.2)",
      borderLight: "rgba(168, 85, 247, 0.4)",
      textPrimary: "#faf5ff",
      textSecondary: "#e9d5ff"
    }
  },
  cinematic: {
    id: "cinematic",
    name: "Orchestral & Film Score",
    category: "Symphonic",
    icon: "🎻",
    description: "Royal Midnight Blue & Golden Brass orchestral halo atmosphere",
    colors: {
      primaryBg: "#050a14",
      secondaryBg: "#0b1528",
      tertiaryBg: "#13223e",
      cardBg: "#1a2c50",
      hoverBg: "#274175",
      accentPrimary: "#3b82f6", // Royal Sapphire
      accentSecondary: "#eab308", // Orchestral Gold
      accentAmber: "#60a5fa",
      accentGlow: "rgba(59, 130, 246, 0.3)",
      border: "rgba(59, 130, 246, 0.2)",
      borderLight: "rgba(59, 130, 246, 0.4)",
      textPrimary: "#eff6ff",
      textSecondary: "#bfdbfe"
    }
  },
  ambient: {
    id: "ambient",
    name: "Ambient & Lo-Fi",
    category: "Chill",
    icon: "🌿",
    description: "Calming Emerald Jade & Forest Mint serene acoustics",
    colors: {
      primaryBg: "#040e0b",
      secondaryBg: "#091c16",
      tertiaryBg: "#102c23",
      cardBg: "#163a2e",
      hoverBg: "#225443",
      accentPrimary: "#10b981", // Emerald Jade
      accentSecondary: "#059669",
      accentAmber: "#34d399",
      accentGlow: "rgba(16, 185, 129, 0.3)",
      border: "rgba(16, 185, 129, 0.2)",
      borderLight: "rgba(16, 185, 129, 0.4)",
      textPrimary: "#ecfdf5",
      textSecondary: "#a7f3d0"
    }
  },
  latin: {
    id: "latin",
    name: "Latin & Reggaeton",
    category: "Rhythm",
    icon: "🔥",
    description: "Tropical Sunburst Coral & Sunset Amber Dembow riddim heat",
    colors: {
      primaryBg: "#120804",
      secondaryBg: "#211009",
      tertiaryBg: "#331a0e",
      cardBg: "#422213",
      hoverBg: "#5c301c",
      accentPrimary: "#f97316", // Sunset Orange
      accentSecondary: "#f43f5e", // Tropical Pink
      accentAmber: "#fb923c",
      accentGlow: "rgba(249, 115, 22, 0.3)",
      border: "rgba(249, 115, 22, 0.2)",
      borderLight: "rgba(249, 115, 22, 0.4)",
      textPrimary: "#fff7ed",
      textSecondary: "#fed7aa"
    }
  },
  reggae: {
    id: "reggae",
    name: "Reggae & Afrobeat",
    category: "Island & World",
    icon: "🌴",
    description: "Sun Yellow & Island Emerald green riddim vibrations",
    colors: {
      primaryBg: "#0b0c05",
      secondaryBg: "#171a0b",
      tertiaryBg: "#252b12",
      cardBg: "#313818",
      hoverBg: "#465023",
      accentPrimary: "#84cc16", // Lime Emerald
      accentSecondary: "#eab308", // Sun Yellow
      accentAmber: "#a3e635",
      accentGlow: "rgba(132, 204, 22, 0.3)",
      border: "rgba(132, 204, 22, 0.2)",
      borderLight: "rgba(132, 204, 22, 0.4)",
      textPrimary: "#f7fee7",
      textSecondary: "#d9f99d"
    }
  },
  metal: {
    id: "metal",
    name: "Metal & Industrial",
    category: "Heavy",
    icon: "⚡",
    description: "Obsidian Carbon & Molten Lava Metal combat distortion",
    colors: {
      primaryBg: "#08080a",
      secondaryBg: "#121217",
      tertiaryBg: "#1c1c24",
      cardBg: "#252530",
      hoverBg: "#363646",
      accentPrimary: "#dc2626", // Molten Lava
      accentSecondary: "#64748b", // Slate Iron
      accentAmber: "#ef4444",
      accentGlow: "rgba(220, 38, 38, 0.35)",
      border: "rgba(220, 38, 38, 0.2)",
      borderLight: "rgba(220, 38, 38, 0.4)",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8"
    }
  },
  country: {
    id: "country",
    name: "Country & Folk",
    category: "Acoustic",
    icon: "🤠",
    description: "Warm Leather & Copper Mahogany roots acoustic warmth",
    colors: {
      primaryBg: "#0d0a07",
      secondaryBg: "#1a140f",
      tertiaryBg: "#281e17",
      cardBg: "#35291e",
      hoverBg: "#4a3a2b",
      accentPrimary: "#d97706", // Copper Bronze
      accentSecondary: "#854d0e",
      accentAmber: "#f59e0b",
      accentGlow: "rgba(217, 119, 6, 0.28)",
      border: "rgba(217, 119, 6, 0.2)",
      borderLight: "rgba(217, 119, 6, 0.4)",
      textPrimary: "#fffbeb",
      textSecondary: "#fde68a"
    }
  },
  vintage_70s: {
    id: "vintage_70s",
    name: "1970s Crime Noir Gold",
    category: "Vintage Film",
    icon: "🎷",
    description: "Warm vintage amber, mahogany, and analog tube saturation tones",
    colors: {
      primaryBg: "#0f0c08",
      secondaryBg: "#1c1810",
      tertiaryBg: "#2b2418",
      cardBg: "#382e1e",
      hoverBg: "#4d3f28",
      accentPrimary: "#f59e0b", // Warm Amber
      accentSecondary: "#d97706", // Vintage Gold
      accentAmber: "#fbbf24",
      accentGlow: "rgba(245, 158, 11, 0.35)",
      border: "rgba(245, 158, 11, 0.25)",
      borderLight: "rgba(245, 158, 11, 0.45)",
      textPrimary: "#fef3c7",
      textSecondary: "#fde68a"
    }
  },
  vaporwave_80s: {
    id: "vaporwave_80s",
    name: "1980s Neon Vaporwave",
    category: "Retro Synth",
    icon: "🌆",
    description: "Hot Magenta, Cyan grid lasers, and retro VHS cassette vibes",
    colors: {
      primaryBg: "#0b0512",
      secondaryBg: "#180a26",
      tertiaryBg: "#290f3e",
      cardBg: "#381354",
      hoverBg: "#521d78",
      accentPrimary: "#f43f5e", // Hot Pink
      accentSecondary: "#06b6d4", // Cyan
      accentAmber: "#fb7185",
      accentGlow: "rgba(244, 63, 94, 0.35)",
      border: "rgba(244, 63, 94, 0.25)",
      borderLight: "rgba(244, 63, 94, 0.45)",
      textPrimary: "#fff1f2",
      textSecondary: "#fecdd3"
    }
  },
  motown_gold: {
    id: "motown_gold",
    name: "Motown Soul Brass",
    category: "Soul / R&B",
    icon: "🎺",
    description: "Rich Golden Brass, Velvet Maroon, and Detroit vinyl warmth",
    colors: {
      primaryBg: "#120808",
      secondaryBg: "#210f0f",
      tertiaryBg: "#331717",
      cardBg: "#421d1d",
      hoverBg: "#5e2929",
      accentPrimary: "#eab308", // Motown Gold
      accentSecondary: "#9f1239", // Velvet Maroon
      accentAmber: "#fde047",
      accentGlow: "rgba(234, 179, 8, 0.3)",
      border: "rgba(234, 179, 8, 0.2)",
      borderLight: "rgba(234, 179, 8, 0.4)",
      textPrimary: "#fefce8",
      textSecondary: "#fef08a"
    }
  },
  slate_minimal: {
    id: "slate_minimal",
    name: "Minimalist Studio Slate",
    category: "Modern Precision",
    icon: "🎛️",
    description: "Sleek Charcoal Slate, Cool Titanium, and ultra-clean studio UI",
    colors: {
      primaryBg: "#0f172a",
      secondaryBg: "#1e293b",
      tertiaryBg: "#334155",
      cardBg: "#475569",
      hoverBg: "#64748b",
      accentPrimary: "#38bdf8", // Sky Blue
      accentSecondary: "#94a3b8", // Titanium
      accentAmber: "#7dd3fc",
      accentGlow: "rgba(56, 189, 248, 0.25)",
      border: "rgba(56, 189, 248, 0.18)",
      borderLight: "rgba(56, 189, 248, 0.35)",
      textPrimary: "#f8fafc",
      textSecondary: "#cbd5e1"
    }
  },
  afrobeat: {
    id: "afrobeat",
    name: "Afrobeat & Highlife Gold",
    category: "World / African",
    icon: "🥁",
    description: "Vibrant Lagos Sunset Gold, Emerald Palms, and West African rhythm",
    colors: {
      primaryBg: "#0d1109",
      secondaryBg: "#172010",
      tertiaryBg: "#233318",
      cardBg: "#314722",
      hoverBg: "#425e2d",
      accentPrimary: "#10b981", // Emerald
      accentSecondary: "#f59e0b", // Gold
      accentAmber: "#fcd34d",
      accentGlow: "rgba(16, 185, 129, 0.3)",
      border: "rgba(16, 185, 129, 0.2)",
      borderLight: "rgba(16, 185, 129, 0.4)",
      textPrimary: "#ecfdf5",
      textSecondary: "#a7f3d0"
    }
  },
  baroque: {
    id: "baroque",
    name: "Baroque & Classical Court",
    category: "Classical",
    icon: "🎻",
    description: "Royal Crimson, Gold Filigree, and 1700s Vienna Orchestral elegance",
    colors: {
      primaryBg: "#12080a",
      secondaryBg: "#240f13",
      tertiaryBg: "#38171d",
      cardBg: "#4d1f27",
      hoverBg: "#662833",
      accentPrimary: "#f43f5e", // Crimson
      accentSecondary: "#eab308", // Royal Gold
      accentAmber: "#fde047",
      accentGlow: "rgba(244, 63, 94, 0.3)",
      border: "rgba(244, 63, 94, 0.2)",
      borderLight: "rgba(244, 63, 94, 0.4)",
      textPrimary: "#fff1f2",
      textSecondary: "#fecdd3"
    }
  },
  cyberpunk2099: {
    id: "cyberpunk2099",
    name: "Cyberpunk 2099 Sci-Fi",
    category: "Futuristic",
    icon: "🤖",
    description: "Ultra-violet lasers, toxic neon green, and dystopian grid glow",
    colors: {
      primaryBg: "#050014",
      secondaryBg: "#0d0029",
      tertiaryBg: "#190040",
      cardBg: "#260057",
      hoverBg: "#3a007f",
      accentPrimary: "#a855f7", // Neon Violet
      accentSecondary: "#22c55e", // Toxic Green
      accentAmber: "#c084fc",
      accentGlow: "rgba(168, 85, 247, 0.35)",
      border: "rgba(168, 85, 247, 0.25)",
      borderLight: "rgba(168, 85, 247, 0.45)",
      textPrimary: "#faf5ff",
      textSecondary: "#e9d5ff"
    }
  },
  kpop_neon: {
    id: "kpop_neon",
    name: "K-Pop Neon Bubblegum",
    category: "Pop",
    icon: "🎤",
    description: "Electric Magenta, Pastel Cyan, and Seoul stadium stage lights",
    colors: {
      primaryBg: "#120510",
      secondaryBg: "#240a20",
      tertiaryBg: "#380f31",
      cardBg: "#4d1543",
      hoverBg: "#661c58",
      accentPrimary: "#ec4899", // Bubblegum Pink
      accentSecondary: "#06b6d4", // Cyan
      accentAmber: "#f472b6",
      accentGlow: "rgba(236, 72, 153, 0.35)",
      border: "rgba(236, 72, 153, 0.25)",
      borderLight: "rgba(236, 72, 153, 0.45)",
      textPrimary: "#fdf2f8",
      textSecondary: "#fbcfe8"
    }
  },
  metal_industrial: {
    id: "metal_industrial",
    name: "Heavy Metal & Industrial",
    category: "Rock / Metal",
    icon: "⚡",
    description: "Volcanic Rust, Molten Iron, and high-gain overdrive energy",
    colors: {
      primaryBg: "#0a0a0a",
      secondaryBg: "#171717",
      tertiaryBg: "#262626",
      cardBg: "#333333",
      hoverBg: "#454545",
      accentPrimary: "#ef4444", // Molten Red
      accentSecondary: "#f97316", // Flame Orange
      accentAmber: "#fb923c",
      accentGlow: "rgba(239, 68, 68, 0.35)",
      border: "rgba(239, 68, 68, 0.25)",
      borderLight: "rgba(239, 68, 68, 0.45)",
      textPrimary: "#fef2f2",
      textSecondary: "#fca5a5"
    }
  },
  zero_g_space: {
    id: "zero_g_space",
    name: "Zero-G Deep Space Synth",
    category: "Ambient",
    icon: "🌌",
    description: "Deep Cosmic Void, Nebula Blue, and starlight acoustic spatialization",
    colors: {
      primaryBg: "#030712",
      secondaryBg: "#0b1329",
      tertiaryBg: "#131f42",
      cardBg: "#1d2e5c",
      hoverBg: "#2a407a",
      accentPrimary: "#6366f1", // Cosmic Indigo
      accentSecondary: "#38bdf8", // Nebula Sky
      accentAmber: "#818cf8",
      accentGlow: "rgba(99, 102, 241, 0.35)",
      border: "rgba(99, 102, 241, 0.25)",
      borderLight: "rgba(99, 102, 241, 0.45)",
      textPrimary: "#eef2ff",
      textSecondary: "#c7d2fe"
    }
  }
};

/**
 * Applies the selected genre theme CSS variables dynamically to document.documentElement
 */
export function applyGenreTheme(themeId: string): GenreTheme {
  const theme = GENRE_THEMES[themeId] || GENRE_THEMES.hiphop;
  const root = document.documentElement;

  root.style.setProperty('--bmg-bg-primary', theme.colors.primaryBg);
  root.style.setProperty('--bmg-bg-secondary', theme.colors.secondaryBg);
  root.style.setProperty('--bmg-bg-tertiary', theme.colors.tertiaryBg);
  root.style.setProperty('--bmg-bg-card', theme.colors.cardBg);
  root.style.setProperty('--bmg-bg-hover', theme.colors.hoverBg);
  root.style.setProperty('--bmg-accent-primary', theme.colors.accentPrimary);
  root.style.setProperty('--bmg-accent-secondary', theme.colors.accentSecondary);
  root.style.setProperty('--bmg-accent-amber', theme.colors.accentAmber);
  root.style.setProperty('--bmg-accent-glow', theme.colors.accentGlow);
  root.style.setProperty('--bmg-border', theme.colors.border);
  root.style.setProperty('--bmg-border-light', theme.colors.borderLight);
  root.style.setProperty('--bmg-text-primary', theme.colors.textPrimary);
  root.style.setProperty('--bmg-text-secondary', theme.colors.textSecondary);

  // Set attribute for optional CSS selectors
  document.body.setAttribute('data-genre-theme', theme.id);

  // Persist preference
  try {
    localStorage.setItem('bmg_selected_genre_theme', theme.id);
  } catch (e) {
    // Ignore storage restrictions
  }

  // Dispatch custom event for real-time React component listening
  window.dispatchEvent(new CustomEvent('bmg_genre_theme_changed', { detail: { theme } }));

  return theme;
}

export function getCurrentGenreThemeId(): string {
  try {
    return localStorage.getItem('bmg_selected_genre_theme') || 'hiphop';
  } catch (e) {
    return 'hiphop';
  }
}
