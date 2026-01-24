export type Theme = {
  card: string;
  cardStatic: string;
  input: string;
  tagContainer: string;
  textMuted: string;
  textDim: string;
  moodBtn: string;
  filterBtn: string;
};

export const themes: Record<string, Theme> = {
  clouds: {
    // Glassmorphism (Glass Texture) for Clouds mode
    card: "bg-zinc-900/30 hover:bg-zinc-900/40 border-white/30 shadow-2xl backdrop-blur-xl transition-all duration-300 backdrop-saturate-150",
    cardStatic: "bg-zinc-900/30 border-white/30 shadow-2xl backdrop-blur-xl backdrop-saturate-150",
    input: "bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 backdrop-blur-lg",
    tagContainer: "bg-white/10 border-white/20 backdrop-blur-lg",
    textMuted: "text-white/80",
    textDim: "text-white/60",
    moodBtn: "bg-white/10 border-white/20 hover:bg-white/20 backdrop-blur-lg hover:border-white/40",
    filterBtn: "bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-lg"
  },
  default: {
    card: "bg-white/[0.03] hover:bg-white/[0.05] border-white/10",
    cardStatic: "bg-white/[0.03] border-white/10",
    input: "bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-700",
    tagContainer: "bg-white/[0.03] border-white/10",
    textMuted: "text-zinc-500",
    textDim: "text-zinc-400",
    moodBtn: "bg-white/[0.03] border-white/10 hover:bg-white/[0.08]",
    filterBtn: "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white"
  },
  // Example of how to add a new theme:
  // sunset: {
  //   card: "bg-orange-900/40 ...",
  //   ...
  // }
};
