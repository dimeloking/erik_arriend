type IconName =
  | 'home'
  | 'plus'
  | 'check'
  | 'chev_r'
  | 'chev_l'
  | 'chev_d'
  | 'arrow_up'
  | 'arrow_dr'
  | 'calendar'
  | 'user'
  | 'settings'
  | 'bell'
  | 'search'
  | 'money'
  | 'chart'
  | 'edit'
  | 'trash'
  | 'x'
  | 'phone'
  | 'pin'
  | 'download'
  | 'filter'
  | 'sparkle'
  | 'logout'
  | 'shield'
  | 'key';

const PATHS: Record<IconName, string> = {
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

export type IconProps = {
  name: IconName;
  size?: number;
  className?: string;
};

export const Icon = (props: IconProps) => (
  <svg
    width={props.size ?? 18}
    height={props.size ?? 18}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
    aria-hidden
  >
    <path d={PATHS[props.name]} />
  </svg>
);
