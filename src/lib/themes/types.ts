export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface ThemeFonts {
  sans: string;
  serif: string;
  mono: string;
}

export interface ThemeShadows {
  "2xs": string;
  xs: string;
  sm: string;
  default: string;
  md: string;
  lg: string;
  xl: string;
  "2xl": string;
}

export interface ThemeConfig {
  name: string;
  displayName: string;
  description?: string;
  radius: string;
  fonts: ThemeFonts;
  shadows: ThemeShadows;
  light: ThemeColors;
  dark: ThemeColors;
}

export interface ThemeContextType {
  currentTheme: string;
  themes: ThemeConfig[];
  setTheme: (theme: string) => void;
  mode: "light" | "dark" | "system";
  setMode: (mode: "light" | "dark" | "system") => void;
}

export type ThemeMode = "light" | "dark" | "system"; 