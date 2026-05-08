import { UserButton } from '@clerk/nextjs';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import { listPendingPaymentNotifications } from '../queries';
import { Icon } from '../ui/Icon';
import { NotificationMenu } from './NotificationMenu';

export const TopBar = async () => {
  const user = await currentUser();
  const notifications = await listPendingPaymentNotifications();
  const firstName =
    user?.firstName ?? user?.emailAddresses[0]?.emailAddress.split('@')[0] ?? 'Usuario';

  return (
    <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-cream-50">
            <Icon name="home" size={16} />
          </div>
          <div className="serif text-[20px] tracking-tight">Casero</div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100"
          >
            <Icon name="search" size={16} />
          </button>
          <NotificationMenu notifications={notifications} />
          <div className="ml-1 flex items-center gap-2 border-l border-cream-200 pl-2">
            <UserButton
              userProfileMode="modal"
              appearance={{
                elements: {
                  userButtonAvatarBox: 'h-8 w-8',
                },
              }}
            />
            <div className="hidden leading-tight sm:block">
              <div className="text-[13px] text-ink-900">{firstName}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
