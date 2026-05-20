import Link from 'next/link';
import { ACCENTS, fmtCLP, getAccentKey, getPaymentStatus } from '../lib';
import type { PropertyWithPayments } from '../queries';
import { Icon } from '../ui/Icon';
import { Sparkline, StatusPill } from '../ui/primitives';

export const PropertyCard = (props: { property: PropertyWithPayments }) => {
  const p = props.property;
  const last12 = p.payments.slice(-12).map((x) => x.amountClp);
  const current = p.payments.at(-1);
  const accent = ACCENTS[getAccentKey(p.color)];

  return (
    <Link
      href={`/dashboard/properties/${p.id}`}
      className="group block overflow-hidden rounded-2xl border border-cream-200 bg-white text-left ring-soft transition-all hover:border-ink-300"
    >
      <div className="flex items-start justify-between gap-3 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-xl"
            style={{ background: accent[100], color: accent[700] }}
          >
            <Icon name="home" size={20} />
          </div>
          <div className="min-w-0">
            <div className="truncate serif text-[19px] leading-tight text-ink-900">
              {p.nickname}
            </div>
            <div className="truncate text-[12.5px] text-ink-500">{p.address}</div>
          </div>
        </div>
        {current && <StatusPill status={getPaymentStatus(current.status)} />}
      </div>
      <div className="flex items-center justify-between px-5 pb-4">
        <div>
          <div className="text-[11px] tracking-[0.1em] text-ink-400 uppercase">Arriendo actual</div>
          <div className="mt-0.5 num text-[22px] text-ink-900">
            {fmtCLP(p.rentClp)}
            <span className="font-sans text-[13px] text-ink-400">/mes</span>
          </div>
        </div>
        {last12.length > 1 && <Sparkline values={last12} color={accent[500]} />}
      </div>
      <div className="flex items-center justify-between border-t border-cream-200 px-5 py-3 text-[12.5px] text-ink-500">
        <span className="flex items-center gap-1.5">
          <Icon name="user" size={13} /> {p.tenantName}
        </span>
        <span className="flex items-center gap-1 text-ink-700 transition group-hover:translate-x-0.5">
          ver detalle <Icon name="chev_r" size={13} />
        </span>
      </div>
    </Link>
  );
};
