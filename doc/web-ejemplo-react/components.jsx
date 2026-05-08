// Componentes UI reutilizables para Casero
const { useState, useEffect, useRef, useMemo, createContext, useContext } = React;

// ---------- Icons (line, 1.5px, currentColor) ----------
const Icon = ({ name, size = 18, className = '' }) => {
  const paths = {
    home: 'M3 11.5 12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-8.5Z',
    plus: 'M12 5v14M5 12h14',
    check: 'm5 12 5 5L20 7',
    chev_r: 'm9 6 6 6-6 6',
    chev_l: 'm15 6-6 6 6 6',
    chev_d: 'm6 9 6 6 6-6',
    arrow_up: 'M12 19V5m0 0-6 6m6-6 6 6',
    arrow_dr: 'M7 7h10v10M7 17 17 7',
    calendar:
      'M3 8h18M3 8v11a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8M3 8V6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2M8 3v4m8-4v4',
    user: 'M5 21a7 7 0 0 1 14 0M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    settings:
      'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm7.4-3a7.4 7.4 0 0 0-.1-1.3l2-1.6-2-3.4-2.4.8a7.4 7.4 0 0 0-2.2-1.3L14 2h-4l-.7 2.6a7.4 7.4 0 0 0-2.2 1.3l-2.4-.8-2 3.4 2 1.6A7.4 7.4 0 0 0 4.6 12c0 .4 0 .8.1 1.3l-2 1.6 2 3.4 2.4-.8a7.4 7.4 0 0 0 2.2 1.3L10 22h4l.7-2.6a7.4 7.4 0 0 0 2.2-1.3l2.4.8 2-3.4-2-1.6c.1-.5.1-.9.1-1.3Z',
    bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9Zm4 13a2 2 0 0 0 4 0',
    search: 'M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm10 2-4.3-4.3',
    money: 'M12 6v12M9 9h4.5a2 2 0 1 1 0 4h-3a2 2 0 1 0 0 4H15',
    chart: 'M4 20V10m6 10V4m6 16v-7m6 7V8',
    edit: 'M4 20h4l10-10-4-4L4 16v4ZM14 6l4 4',
    trash:
      'M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m1 0v13a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V7m4 4v6m4-6v6',
    x: 'M6 6l12 12M18 6 6 18',
    phone: 'M5 4h4l2 5-3 2a11 11 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z',
    pin: 'M12 21s7-7.5 7-12a7 7 0 1 0-14 0c0 4.5 7 12 7 12Zm0-9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    download: 'M12 4v12m0 0-5-5m5 5 5-5M4 20h16',
    filter: 'M4 5h16l-6 8v6l-4-2v-4L4 5Z',
    sparkle: 'm12 3 2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6Z',
    logout: 'M15 4h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4M10 17l-5-5 5-5M5 12h12',
    shield: 'M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z',
    key: 'M21 3l-7 7m0 0a4 4 0 1 1-5.7 5.7L3 21l3-3 3 3 3-3-2-2 4-4Z',
  };
  const d = paths[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
};

// ---------- Format helpers ----------
const fmtCLP = (n) => `$${(n ?? 0).toLocaleString('es-CL')}`;
const fmtMonth = (ym) => {
  const [y, m] = ym.split('-');
  const names = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  return `${names[+m - 1]} ${y}`;
};
const fmtMonthLong = (ym) => {
  const [y, m] = ym.split('-');
  const names = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];
  return `${names[+m - 1]} ${y}`;
};
const fmtDate = (d) => {
  if (!d) {
    return '—';
  }
  const [y, m, day] = d.split('-');
  return `${day}/${m}/${y}`;
};
const todayYM = () => {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}`;
};

// ---------- Primitives ----------
const Card = ({ className = '', children, ...rest }) => (
  <div className={`rounded-2xl border border-cream-200 bg-white ring-soft ${className}`} {...rest}>
    {children}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'md', className = '', ...rest }) => {
  const sizes = {
    sm: 'h-8 px-3 text-[13px]',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-5 text-[15px]',
  };
  const variants = {
    primary: 'bg-ink-900 text-cream-50 hover:bg-ink-700 active:bg-ink-900',
    soft: 'bg-cream-100 text-ink-900 hover:bg-cream-200 border border-cream-200',
    ghost: 'bg-transparent text-ink-700 hover:bg-cream-100',
    mint: 'bg-mint-100 text-mint-700 hover:bg-mint-200',
    danger: 'bg-rose-50 text-rose-500 hover:bg-rose-100',
  };
  return (
    <button
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, hint, prefix, suffix, className = '', ...rest }) => (
  <label className="block">
    {label && (
      <div className="mb-1.5 text-[12px] tracking-[0.08em] text-ink-500 uppercase">{label}</div>
    )}
    <div
      className={`flex h-11 items-center gap-2 rounded-xl border border-cream-200 bg-cream-50 px-3 transition focus-within:border-ink-900 ${className}`}
    >
      {prefix && <span className="text-sm text-ink-500">{prefix}</span>}
      <input
        {...rest}
        className="flex-1 bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-400"
      />
      {suffix && <span className="text-sm text-ink-500">{suffix}</span>}
    </div>
    {hint && <div className="mt-1 text-[12px] text-ink-400">{hint}</div>}
  </label>
);

const Select = ({ label, value, onChange, options, hint, className = '' }) => (
  <label className="block">
    {label && (
      <div className="mb-1.5 text-[12px] tracking-[0.08em] text-ink-500 uppercase">{label}</div>
    )}
    <div
      className={`relative h-11 rounded-xl border border-cream-200 bg-cream-50 transition focus-within:border-ink-900 ${className}`}
    >
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full appearance-none bg-transparent pr-9 pl-3 text-[15px] text-ink-900 outline-none"
      >
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : o;
          return (
            <option key={v} value={v}>
              {l}
            </option>
          );
        })}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-500">
        <Icon name="chev_d" size={14} />
      </div>
    </div>
    {hint && <div className="mt-1 text-[12px] text-ink-400">{hint}</div>}
  </label>
);

const Avatar = ({ name, color = 'mint', size = 36 }) => {
  const initials = (name ?? '?')
    .split(/\s+/)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <div
      className={`chip-${color} flex items-center justify-center rounded-full serif font-medium`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initials}
    </div>
  );
};

const StatusPill = ({ status }) => {
  const map = {
    paid: { label: 'Pagado', cls: 'chip-mint' },
    late: { label: 'Atrasado', cls: 'chip-peach' },
    pending: { label: 'Pendiente', cls: 'bg-cream-100 text-ink-500 border border-cream-200' },
    overdue: { label: 'Vencido', cls: 'chip-rose' },
  };
  const s = map[status] ?? map.pending;
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium ${s.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
      {s.label}
    </span>
  );
};

// ---------- Modal ----------
const Modal = ({ open, onClose, title, children, footer, width = 520 }) => {
  if (!open) {
    return null;
  }
  return (
    <div
      className="fade-in fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-[2px]"></div>
      <div
        className="fade-up relative rounded-3xl border border-cream-200 bg-cream-50 shadow-2xl"
        style={{ width: '100%', maxWidth: width }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <h3 className="serif text-[22px] text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100"
          >
            <Icon name="x" />
          </button>
        </div>
        <div className="px-6 pb-2">{children}</div>
        {footer && (
          <div className="flex items-center justify-end gap-2 border-t border-cream-200 px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Tiny sparkline ----------
const Sparkline = ({ values, color = '#6fa37b', height = 36, width = 120 }) => {
  if (!values || values.length === 0) {
    return null;
  }
  const min = Math.min(...values),
    max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const points = values
    .map(
      (v, i) =>
        `${(i * step).toFixed(1)},${(height - 4 - ((v - min) / span) * (height - 8)).toFixed(1)}`,
    )
    .join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = i * step,
          y = height - 4 - ((v - min) / span) * (height - 8);
        return <circle key={i} cx={x} cy={y} r={i === values.length - 1 ? 2.5 : 0} fill={color} />;
      })}
    </svg>
  );
};

Object.assign(window, {
  Icon,
  fmtCLP,
  fmtMonth,
  fmtMonthLong,
  fmtDate,
  todayYM,
  Card,
  Button,
  Input,
  Select,
  Avatar,
  StatusPill,
  Modal,
  Sparkline,
});
