import logo from '../../img/logo.png'

export default function Logo({ size = 50 }) {
  return (
    <div className="flex items-center gap-2.5">
      <div style={{ width: size, height: size, borderRadius: size * 0.3}}
        className="flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={logo} alt="AgendaTech" style={{ width: size, height: size, objectFit: 'contain'}} />
      </div>
      <div>
        <div style={{ fontSize: size * 0.56 }} className="font-black tracking-tight text-tb-text leading-[1.1]">
          AgendaTech
        </div>
        <div style={{ fontSize: size * 0.3 }} className="text-tb-muted tracking-[0.04em] mt-px">
          agendamento inteligente
        </div>
      </div>
    </div>
  );
}
