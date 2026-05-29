export function Toast({ msg, type }) {
  if (!msg) return null;
  const c = type === 'error'
    ? { bg: 'bg-red-950/80', border: 'border-red-500', text: 'text-red-400' }
    : type === 'success'
    ? { bg: 'bg-green-950/80', border: 'border-green-500', text: 'text-green-400' }
    : { bg: 'bg-blue-950/80', border: 'border-blue-500', text: 'text-blue-300' };
  return (
    <div className={'fixed bottom-6 right-6 ' + c.bg + ' border ' + c.border + ' ' + c.text + ' py-3 px-5 rounded-[10px] text-[0.85rem] font-bold z-[300] animate-slideIn'}>
      {msg}
    </div>
  );
}
