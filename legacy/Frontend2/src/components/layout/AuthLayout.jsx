export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-tb-bg font-sans py-6 px-4 relative">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{ backgroundImage: 'linear-gradient(#232840 1px, transparent 1px), linear-gradient(90deg, #232840 1px, transparent 1px)', backgroundSize: '52px 52px', maskImage: 'radial-gradient(ellipse 80% 65% at 50% 50%, black, transparent)' }} />
      <div className="fixed -top-[200px] left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(79,140,255,0.13) 0%, transparent 70%)' }} />
      <div className="relative z-10 w-full flex flex-col items-center">{children}</div>
    </div>
  );
}
