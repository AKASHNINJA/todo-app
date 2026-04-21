export type OrbitThemeName = "deepSpace" | "sunset" | "brat";

export type OrbitTheme = {
  bgTop: string;
  bgBottom: string;
  card: string;
  cardBorder: string;
  textPrimary: string;
  textMuted: string;
  accent: string;
  success: string;
};

export const THEMES: Record<OrbitThemeName, OrbitTheme> = {
  deepSpace: {
    bgTop: "#060B1F",
    bgBottom: "#131B3B",
    card: "#141D40CC",
    cardBorder: "#7DFF9D3A",
    textPrimary: "#F7F8FF",
    textMuted: "#A8B0DA",
    accent: "#7DFF9D",
    success: "#68F593",
  },
  sunset: {
    bgTop: "#2E102C",
    bgBottom: "#7A3A3A",
    card: "#4A2034CC",
    cardBorder: "#FFC28C54",
    textPrimary: "#FFF7F0",
    textMuted: "#F0C8B0",
    accent: "#FF9A62",
    success: "#FFE38A",
  },
  brat: {
    bgTop: "#071205",
    bgBottom: "#0A1E08",
    card: "#12280FCC",
    cardBorder: "#A6FF0054",
    textPrimary: "#E8FFE8",
    textMuted: "#B8D9B8",
    accent: "#A6FF00",
    success: "#C8FF66",
  },
};
