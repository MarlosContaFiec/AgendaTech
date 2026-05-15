export const colors = {
  bg: '#0a0a1a',
  surface: '#111128',
  surfaceHover: '#1a1a3e',
  border: '#1e1e3f',
  accent: '#6c5ce7',
  accentHover: '#7c6ef7',
  neon: '#00d4ff',
  neonPink: '#ff006e',
  danger: '#ff4757',
  success: '#00e676',
  warning: '#ffd600',
  textPrimary: '#e8e8f0',
  textSecondary: '#8888aa',
  textMuted: '#555577',
};

export const sidebar = `
  fixed top-0 left-0 h-full w-60
  bg-[#0d0d24] border-r border-[#1e1e3f]
  flex flex-col z-50
  transition-all duration-300
`;

export const sidebarItem = `
  flex items-center gap-3 px-4 py-3
  text-[#8888aa] text-sm font-medium
  rounded-lg mx-2 mb-1
  transition-all duration-200
  hover:bg-[#1a1a3e] hover:text-[#e8e8f0]
  cursor-pointer
`;

export const sidebarItemActive = `
  flex items-center gap-3 px-4 py-3
  text-sm font-medium rounded-lg mx-2 mb-1
  bg-[#6c5ce7]/15 text-[#00d4ff]
  border-l-2 border-[#00d4ff]
  cursor-pointer
`;

export const card = `
  bg-[#111128] border border-[#1e1e3f]
  rounded-xl p-5
  transition-all duration-300
  hover:border-[#6c5ce7]/40 hover:shadow-lg hover:shadow-[#6c5ce7]/10
`;

export const btnPrimary = `
  bg-[#6c5ce7] hover:bg-[#7c6ef7]
  text-white font-semibold
  px-5 py-2.5 rounded-lg
  transition-all duration-200
  active:scale-95
  disabled:opacity-50 disabled:cursor-not-allowed
`;

export const btnNeon = `
  bg-transparent border border-[#00d4ff]
  text-[#00d4ff] font-semibold
  px-5 py-2.5 rounded-lg
  transition-all duration-200
  hover:bg-[#00d4ff]/10 hover:shadow-lg hover:shadow-[#00d4ff]/20
  active:scale-95
`;

export const btnDanger = `
  bg-[#ff4757]/15 border border-[#ff4757]/30
  text-[#ff4757] font-semibold
  px-5 py-2.5 rounded-lg
  transition-all duration-200
  hover:bg-[#ff4757]/25
  active:scale-95
`;

export const input = `
  w-full bg-[#0a0a1a] border border-[#1e1e3f]
  text-[#e8e8f0] text-sm
  px-4 py-3 rounded-lg
  outline-none
  transition-all duration-200
  focus:border-[#6c5ce7] focus:ring-1 focus:ring-[#6c5ce7]/30
  placeholder:text-[#555577]
`;

export const label = `
  text-[#8888aa] text-xs font-medium
  uppercase tracking-wider mb-1.5 block
`;

export const title = `
  text-[#e8e8f0] text-2xl font-bold
`;

export const subtitle = `
  text-[#8888aa] text-sm
`;

export const pageContainer = `
  ml-60 min-h-screen bg-[#0a0a1a] p-8
`;

export const fadeIn = `
  opacity-0 animate-[fadeUp_0.5s_ease_forwards]
`;

export const stagger1 = `animation-delay-[0.1s]`;
export const stagger2 = `animation-delay-[0.2s]`;
export const stagger3 = `animation-delay-[0.3s]`;
export const stagger4 = `animation-delay-[0.4s]`;
