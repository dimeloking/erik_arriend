'use client';

import Link from 'next/link';
import { useState } from 'react';
import { fmtCLP, fmtMonthLong } from '../lib';
import { Icon } from '../ui/Icon';

type Notification = {
  propertyId: string;
  propertyNickname: string;
  tenantName: string;
  month: string;
  amountClp: number;
  status: string;
};

type NotificationMenuProps = {
  notifications: Notification[];
};

export const NotificationMenu = ({ notifications }: NotificationMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const count = notifications.length;

  return (
    <div className="relative">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={count > 0 ? `${count} pagos pendientes` : 'Sin pagos pendientes'}
        className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100"
        onClick={() => {
          setIsOpen((value) => !value);
        }}
      >
        <Icon name="bell" size={16} />
        {count > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-peach-500 px-1 text-[11px] font-semibold text-white">
            {count}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute top-11 right-0 z-50 w-80 overflow-hidden rounded-xl border border-cream-200 bg-white shadow-xl shadow-ink-900/10"
        >
          <div className="border-b border-cream-100 px-4 py-3">
            <div className="text-[13px] font-semibold text-ink-900">Notificaciones</div>
            <div className="text-[12px] text-ink-500">
              {count > 0 ? 'Arriendos pendientes del mes actual' : 'No hay pagos pendientes'}
            </div>
          </div>

          {count === 0 ? (
            <div className="px-4 py-5 text-[13px] text-ink-500">
              Desde el día 2 aparecerán aquí los arriendos del mes que sigan sin pago.
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto py-1">
              {notifications.map((notification) => (
                <Link
                  key={`${notification.propertyId}-${notification.month}`}
                  href={`/dashboard/properties/${notification.propertyId}`}
                  role="menuitem"
                  tabIndex={0}
                  className="block px-4 py-3 hover:bg-cream-50"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-semibold text-ink-900">
                        {notification.propertyNickname}
                      </div>
                      <div className="truncate text-[12px] text-ink-500">
                        {notification.tenantName} · {fmtMonthLong(notification.month)}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-[13px] font-semibold text-ink-900">
                        {fmtCLP(notification.amountClp)}
                      </div>
                      <div className="text-[11px] font-medium text-peach-700">
                        {notification.status === 'overdue' ? 'Vencido' : 'Pendiente'}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
