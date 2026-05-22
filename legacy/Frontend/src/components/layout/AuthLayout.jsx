export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base font-body p-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20"
        style={{ backgroundImage: "linear-gradient(#1c1c3a 1px, transparent 1px), linear-gradient(90deg, #1c1c3a 1px, transparent 1px)", backgroundSize: "52px 52px", WebkitMaskImage: "radial-gradient(ellipse 80% 65% at 50% 50%, black, transparent)" }} />
      <div className="fixed -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[450px] rounded-full pointer-events-none z-0"
        style={{ background: "radial-gradient(ellipse, rgba(108,92,231,0.15) 0%, transparent 70%)" }} />
      <div className="relative z-10 w-full flex flex-col items-center">{children}</div>
    </div>
  );
}
