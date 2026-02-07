export type Theme = {
  // Existing
  card: string;
  cardStatic: string;
  input: string;
  tagContainer: string;
  textMuted: string;
  textDim: string;
  moodBtn: string;
  filterBtn: string;

  // Global Layout
  background: string;
  selection: string;
  textMain: string;
  textSecondary: string; // For welcome message "Hi,"

  // Navbar Buttons
  themeToggleBtn: string;
  cloudToggleBtn: string;
  cloudToggleBtnActive: string;
  proBtn: string;
  proBtnIcon: string;
  logoutBtn: string;
  
  // Heatmap
  heatmapText: string; // Month/Day labels
  heatmapYearBtn: string;
  heatmapDropdown: string;
  heatmapDropdownItem: string;
  heatmapDropdownItemActive: string;
  heatmapGrid0: string;
  heatmapGrid1: string;
  heatmapGrid2: string;
  heatmapGrid3: string;

  // Sections & Tags
  sectionTitle: string;
  sectionIconBg: string;
  tagItem: string;
  tagInput: string;
  tagAddBtn: string;
  tagSuggestion: string;

  // Modal
  modalBg: string;
  modalBorder: string;
  modalHeaderBg: string;
  modalHeaderBorder: string;
  modalTitle: string;
  modalContent: string;
  modalCloseBtn: string;

  // Filter Dropdown
  dropdownBg: string;
  dropdownBorder: string;
  dropdownShadow: string;
  dropdownInputBg: string;
  dropdownInputBorder: string;
  dropdownInputText: string;
  dropdownInputPlaceholder: string;
  dropdownItemText: string;
  dropdownItemHoverBg: string;
  dropdownItemHoverText: string;
  dropdownScrollbar: string;
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
    filterBtn: "bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-lg",

    // Layout
    background: "bg-zinc-950 text-white", // Fallback if vanta fails
    selection: "selection:bg-indigo-500/30",
    textMain: "text-white",
    textSecondary: "text-zinc-400",

    // Navbar
    themeToggleBtn: "text-zinc-400 hover:text-white hover:bg-white/10",
    cloudToggleBtn: "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10",
    cloudToggleBtnActive: "bg-sky-500/20 border border-sky-500/30 text-sky-200",
    proBtn: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-500/30 text-amber-200",
    proBtnIcon: "text-amber-400",
    logoutBtn: "text-zinc-400 hover:text-white hover:bg-white/5",

    // Heatmap
    heatmapText: "text-zinc-100",
    heatmapYearBtn: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20",
    heatmapDropdown: "bg-zinc-900/90 border-white/10",
    heatmapDropdownItem: "text-zinc-400 hover:text-white hover:bg-white/5",
    heatmapDropdownItemActive: "bg-indigo-500/20 text-indigo-300",
    heatmapGrid0: "bg-white/5 border-transparent",
    heatmapGrid1: "bg-indigo-900/60 border-indigo-800/50 shadow-[0_0_5px_rgba(79,70,229,0.2)]",
    heatmapGrid2: "bg-indigo-700/80 border-indigo-600/50 shadow-[0_0_8px_rgba(79,70,229,0.4)]",
    heatmapGrid3: "bg-indigo-400 border-indigo-300/50 shadow-[0_0_12px_rgba(129,140,248,0.6)]",

    // Sections & Tags
    sectionTitle: "text-white", // Clouds specific
    sectionIconBg: "bg-indigo-500/10 text-indigo-400",
    tagItem: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    tagInput: "text-zinc-200 placeholder:text-zinc-600",
    tagAddBtn: "bg-white/5 hover:bg-indigo-500 text-zinc-500 hover:text-white",
    tagSuggestion: "bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-zinc-400 hover:text-indigo-300",

    // Modal
    modalBg: "bg-zinc-900/95 backdrop-blur-xl",
    modalBorder: "border-white/10",
    modalHeaderBg: "bg-zinc-900/95 backdrop-blur-xl",
    modalHeaderBorder: "border-white/5",
    modalTitle: "text-white",
    modalContent: "text-zinc-300",
    modalCloseBtn: "text-zinc-400 hover:text-white hover:bg-white/5",

    // Filter Dropdown
    dropdownBg: "bg-zinc-900/95 backdrop-blur-xl",
    dropdownBorder: "border-white/10",
    dropdownShadow: "shadow-2xl",
    dropdownInputBg: "bg-white/5",
    dropdownInputBorder: "border-white/10",
    dropdownInputText: "text-white",
    dropdownInputPlaceholder: "placeholder:text-zinc-600",
    dropdownItemText: "text-zinc-400",
    dropdownItemHoverBg: "hover:bg-white/5",
    dropdownItemHoverText: "hover:text-white",
    dropdownScrollbar: "custom-scrollbar"
  },
  default: {
    card: "bg-white/[0.03] hover:bg-white/[0.05] border-white/10",
    cardStatic: "bg-white/[0.03] border-white/10",
    input: "bg-white/[0.03] border-white/10 text-white placeholder:text-zinc-700",
    tagContainer: "bg-white/[0.03] border-white/10",
    textMuted: "text-zinc-500",
    textDim: "text-zinc-400",
    moodBtn: "bg-white/[0.03] border-white/10 hover:bg-white/[0.08]",
    filterBtn: "bg-white/5 text-zinc-400 border-white/10 hover:bg-white/10 hover:text-white",

    // Layout
    background: "bg-zinc-950 text-white",
    selection: "selection:bg-indigo-500/30",
    textMain: "text-white",
    textSecondary: "text-zinc-400",

    // Navbar
    themeToggleBtn: "text-zinc-400 hover:text-white hover:bg-white/10",
    cloudToggleBtn: "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10",
    cloudToggleBtnActive: "bg-sky-500/20 border border-sky-500/30 text-sky-200",
    proBtn: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border-amber-500/30 text-amber-200",
    proBtnIcon: "text-amber-400",
    logoutBtn: "text-zinc-400 hover:text-white hover:bg-white/5",

    // Heatmap
    heatmapText: "text-zinc-100",
    heatmapYearBtn: "bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 hover:bg-indigo-500/20",
    heatmapDropdown: "bg-zinc-900/90 border-white/10",
    heatmapDropdownItem: "text-zinc-400 hover:text-white hover:bg-white/5",
    heatmapDropdownItemActive: "bg-indigo-500/20 text-indigo-300",
    heatmapGrid0: "bg-white/5 border-transparent",
    heatmapGrid1: "bg-indigo-900/60 border-indigo-800/50 shadow-[0_0_5px_rgba(79,70,229,0.2)]",
    heatmapGrid2: "bg-indigo-700/80 border-indigo-600/50 shadow-[0_0_8px_rgba(79,70,229,0.4)]",
    heatmapGrid3: "bg-indigo-400 border-indigo-300/50 shadow-[0_0_12px_rgba(129,140,248,0.6)]",

    // Sections & Tags
    sectionTitle: "text-zinc-400",
    sectionIconBg: "bg-indigo-500/10 text-indigo-400",
    tagItem: "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30",
    tagInput: "text-zinc-200 placeholder:text-zinc-600",
    tagAddBtn: "bg-white/5 hover:bg-indigo-500 text-zinc-500 hover:text-white",
    tagSuggestion: "bg-white/5 hover:bg-indigo-500/20 border border-white/5 hover:border-indigo-500/30 text-zinc-400 hover:text-indigo-300",

    // Modal
    modalBg: "bg-zinc-900/95 backdrop-blur-xl",
    modalBorder: "border-white/10",
    modalHeaderBg: "bg-zinc-900/95 backdrop-blur-xl",
    modalHeaderBorder: "border-white/10",
    modalTitle: "text-white",
    modalContent: "text-zinc-300",
    modalCloseBtn: "text-zinc-400 hover:text-white hover:bg-white/10",

    // Filter Dropdown
    dropdownBg: "bg-zinc-900/95 backdrop-blur-xl",
    dropdownBorder: "border-white/10",
    dropdownShadow: "shadow-2xl",
    dropdownInputBg: "bg-white/5",
    dropdownInputBorder: "border-white/10",
    dropdownInputText: "text-white",
    dropdownInputPlaceholder: "placeholder:text-zinc-600",
    dropdownItemText: "text-zinc-400",
    dropdownItemHoverBg: "hover:bg-white/5",
    dropdownItemHoverText: "hover:text-white",
    dropdownScrollbar: "custom-scrollbar"
  },
  day: {
    card: "bg-white hover:bg-zinc-50 border-zinc-200 shadow-xl shadow-zinc-200/50 text-zinc-800",
    cardStatic: "bg-white border-zinc-200 shadow-xl shadow-zinc-200/50 text-zinc-800",
    input: "bg-zinc-50 border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-indigo-500/50 focus:ring-indigo-500/20",
    tagContainer: "bg-zinc-50 border-zinc-200",
    textMuted: "text-zinc-500",
    textDim: "text-zinc-400",
    moodBtn: "bg-white border-zinc-200 hover:bg-zinc-50 hover:border-indigo-300 text-zinc-700 shadow-sm",
    filterBtn: "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50 hover:text-indigo-600 hover:border-indigo-300 shadow-sm",

    // Layout
    background: "bg-zinc-50 text-zinc-900",
    selection: "selection:bg-indigo-500/20",
    textMain: "text-zinc-800",
    textSecondary: "text-zinc-500",

    // Navbar
    themeToggleBtn: "text-purple-600 hover:bg-purple-100",
    cloudToggleBtn: "bg-white/5 border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100", // Adapted for day
    cloudToggleBtnActive: "bg-sky-50 border border-sky-200 text-sky-600", // Adapted for day
    proBtn: "bg-gradient-to-r from-amber-100 to-orange-100 hover:from-amber-200 hover:to-orange-200 border-amber-200 text-amber-700",
    proBtnIcon: "text-amber-600",
    logoutBtn: "text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100",

    // Heatmap
    heatmapText: "text-zinc-500",
    heatmapYearBtn: "bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100",
    heatmapDropdown: "bg-white/90 border-zinc-200 shadow-zinc-200/50",
    heatmapDropdownItem: "text-zinc-600 hover:bg-zinc-50",
    heatmapDropdownItemActive: "bg-indigo-50 text-indigo-600",
    heatmapGrid0: "bg-zinc-100 border-transparent",
    heatmapGrid1: "bg-indigo-200 border-indigo-200 shadow-sm",
    heatmapGrid2: "bg-indigo-400 border-indigo-400 shadow-md",
    heatmapGrid3: "bg-indigo-600 border-indigo-600 shadow-lg",

    // Sections & Tags
    sectionTitle: "text-zinc-800",
    sectionIconBg: "bg-indigo-50 text-indigo-600",
    tagItem: "bg-indigo-100 text-indigo-700 border border-indigo-200",
    tagInput: "text-zinc-800 placeholder:text-zinc-400",
    tagAddBtn: "bg-zinc-100 hover:bg-indigo-500 text-zinc-500 hover:text-white",
    tagSuggestion: "bg-zinc-50 hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-200 text-zinc-600 hover:text-indigo-600",

    // Modal
    modalBg: "bg-white/95 backdrop-blur-xl",
    modalBorder: "border-zinc-200",
    modalHeaderBg: "bg-white/95 backdrop-blur-xl",
    modalHeaderBorder: "border-zinc-100",
    modalTitle: "text-zinc-900",
    modalContent: "text-zinc-600",
    modalCloseBtn: "text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100",

    // Filter Dropdown
    dropdownBg: "bg-white/95 backdrop-blur-xl",
    dropdownBorder: "border-zinc-200",
    dropdownShadow: "shadow-xl",
    dropdownInputBg: "bg-zinc-50",
    dropdownInputBorder: "border-zinc-200",
    dropdownInputText: "text-zinc-800",
    dropdownInputPlaceholder: "placeholder:text-zinc-400",
    dropdownItemText: "text-zinc-500",
    dropdownItemHoverBg: "hover:bg-zinc-100",
    dropdownItemHoverText: "hover:text-zinc-900",
    dropdownScrollbar: "custom-scrollbar-light"
  }
};
