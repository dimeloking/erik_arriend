import type { AccentKey, PaymentStatus } from '../lib';
import { Icon } from './Icon';

type CardProps = {
  className?: string;
  children: React.ReactNode;
};

export const Card = (props: CardProps) => (
  <div
    className={`rounded-2xl border border-cream-200 bg-white ring-soft ${props.className ?? ''}`}
  >
    {props.children}
  </div>
);

type ButtonVariant = 'primary' | 'soft' | 'ghost' | 'mint' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

const BTN_SIZES: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-5 text-[15px]',
};

const BTN_VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-ink-900 text-cream-50 hover:bg-ink-700 active:bg-ink-900',
  soft: 'bg-cream-100 text-ink-900 hover:bg-cream-200 border border-cream-200',
  ghost: 'bg-transparent text-ink-700 hover:bg-cream-100',
  mint: 'bg-mint-100 text-mint-700 hover:bg-mint-200',
  danger: 'bg-rose-50 text-rose-500 hover:bg-rose-100',
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export const Button = (props: ButtonProps) => {
  const { variant = 'primary', size = 'md', className = '', children, ...rest } = props;
  return (
    <button
      type="button"
      {...rest}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${BTN_SIZES[size]} ${BTN_VARIANTS[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

type AvatarProps = {
  name: string;
  color?: AccentKey;
  size?: number;
};

export const Avatar = (props: AvatarProps) => {
  const initials = (props.name || '?')
    .split(/\s+/u)
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  const size = props.size ?? 36;
  return (
    <div
      className={`chip-${props.color ?? 'mint'} flex items-center justify-center rounded-full serif font-medium`}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
    >
      {initials}
    </div>
  );
};

const STATUS_MAP: Record<PaymentStatus, { label: string; cls: string }> = {
  paid: { label: 'Pagado', cls: 'chip-mint' },
  late: { label: 'Atrasado', cls: 'chip-peach' },
  pending: { label: 'Pendiente', cls: 'bg-cream-100 text-ink-500 border border-cream-200' },
  overdue: { label: 'Vencido', cls: 'chip-rose' },
};

export const StatusPill = (props: { status: PaymentStatus }) => {
  const s = STATUS_MAP[props.status] ?? STATUS_MAP.pending;
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[11px] font-medium ${s.cls}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {s.label}
    </span>
  );
};

export const Sparkline = (props: {
  values: number[];
  color?: string;
  height?: number;
  width?: number;
}) => {
  const { values } = props;
  if (!values || values.length === 0) {
    return null;
  }
  const height = props.height ?? 36;
  const width = props.width ?? 120;
  const color = props.color ?? '#6fa37b';
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const points = values
    .map(
      (v, i) =>
        `${(i * step).toFixed(1)},${(height - 4 - ((v - min) / span) * (height - 8)).toFixed(1)}`,
    )
    .join(' ');
  return (
    <svg width={width} height={height} className="overflow-visible" aria-hidden>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {values.map((v, i) => {
        const x = i * step;
        const y = height - 4 - ((v - min) / span) * (height - 8);
        return (
          <circle
            key={`${x}-${y}`}
            cx={x}
            cy={y}
            r={i === values.length - 1 ? 2.5 : 0}
            fill={color}
          />
        );
      })}
    </svg>
  );
};

type LabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  wrapperClassName?: string;
};

export const Field = (props: LabelInputProps) => {
  const { label, hint, prefix, suffix, wrapperClassName = '', className = '', ...rest } = props;
  return (
    <label className="block">
      {label && (
        <div className="mb-1.5 text-[12px] tracking-[0.08em] text-ink-500 uppercase">{label}</div>
      )}
      <div
        className={`flex h-11 items-center gap-2 rounded-xl border border-cream-200 bg-cream-50 px-3 transition focus-within:border-ink-900 ${wrapperClassName}`}
      >
        {prefix && <span className="text-sm text-ink-500">{prefix}</span>}
        <input
          {...rest}
          className={`flex-1 bg-transparent text-[15px] text-ink-900 outline-none placeholder:text-ink-400 ${className}`}
        />
        {suffix && <span className="text-sm text-ink-500">{suffix}</span>}
      </div>
      {hint && <div className="mt-1 text-[12px] text-ink-400">{hint}</div>}
    </label>
  );
};

type SelectProps = {
  label?: string;
  hint?: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  options: readonly { value: string; label: string }[];
  className?: string;
};

export const FieldSelect = (props: SelectProps) => (
  <label className="block">
    {props.label && (
      <div className="mb-1.5 text-[12px] tracking-[0.08em] text-ink-500 uppercase">
        {props.label}
      </div>
    )}
    <div
      className={`relative h-11 rounded-xl border border-cream-200 bg-cream-50 transition focus-within:border-ink-900 ${props.className ?? ''}`}
    >
      <select
        name={props.name}
        defaultValue={props.defaultValue}
        value={props.value}
        onChange={props.onChange}
        className="h-full w-full appearance-none bg-transparent pr-9 pl-3 text-[15px] text-ink-900 outline-none"
      >
        {props.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-500">
        <Icon name="chev_d" size={14} />
      </div>
    </div>
    {props.hint && <div className="mt-1 text-[12px] text-ink-400">{props.hint}</div>}
  </label>
);
