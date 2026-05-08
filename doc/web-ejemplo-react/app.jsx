// Casero — App principal
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/ {
  accent: 'mint',
  showSparklines: true,
  density: 'comfortable',
  showLogin: false,
} /*EDITMODE-END*/;

const PAYMENT_METHODS = [
  { value: 'bancolombia', label: 'Bancolombia' },
  { value: 'davivienda', label: 'Davivienda' },
  { value: 'bbva', label: 'BBVA Colombia' },
  { value: 'bogota', label: 'Banco de Bogotá' },
  { value: 'popular', label: 'Banco Popular' },
  { value: 'scotiabank', label: 'Scotiabank Colpatria' },
  { value: 'avvillas', label: 'Banco AV Villas' },
  { value: 'cajasocial', label: 'Banco Caja Social' },
  { value: 'falabella', label: 'Banco Falabella' },
  { value: 'itau', label: 'Itaú' },
  { value: 'nequi', label: 'Nequi' },
  { value: 'daviplata', label: 'Daviplata' },
  { value: 'pse', label: 'PSE — pago en línea' },
  { value: 'efectivo', label: 'Efectivo' },
];

const ACCENTS = {
  mint: { 50: '#eaf5ed', 100: '#d4ecd9', 500: '#6fa37b', 700: '#4a7a55', label: 'Menta' },
  peach: { 50: '#faecdf', 100: '#f4d4c2', 500: '#c98863', 700: '#985f3c', label: 'Durazno' },
  lavender: { 50: '#efe9f5', 100: '#dcd1ec', 500: '#8b76b8', 700: '#604c8a', label: 'Lavanda' },
  sky: { 50: '#e6eff4', 100: '#c8dde8', 500: '#5d8aa3', 700: '#3f6075', label: 'Cielo' },
};

// ============ LOGIN (Clerk-inspired, original) ============
function LoginScreen({ onAuth }) {
  const [email, setEmail] = useState('camila.alarcon@arriendos.cl');
  const [pw, setPw] = useState('••••••••••');
  const [loading, setLoading] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => onAuth({ email, name: 'Camila Alarcón' }), 700);
  };
  return (
    <div className="fade-in grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-mint-50 grid-paper p-10 lg:flex">
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-cream-50">
            <Icon name="home" size={18} />
          </div>
          <div className="serif text-[22px] tracking-tight">Casero</div>
        </div>
        <div className="relative z-10 max-w-md">
          <div className="mb-4 text-[13px] tracking-[0.16em] text-mint-700 uppercase">
            Control de arriendos
          </div>
          <h1 className="serif text-[44px] leading-[1.05] tracking-tight text-ink-900">
            Tus propiedades,
            <br /> mes a mes,
            <br />
            <span className="text-mint-700 italic">sin Excel.</span>
          </h1>
          <p className="mt-5 text-[15px] leading-relaxed text-ink-500">
            Lleva el balance de cada arriendo, programa el reajuste anual y guarda el historial de
            pagos en un solo lugar.
          </p>
        </div>
        <div className="relative z-10 grid max-w-md grid-cols-3 gap-3">
          {[
            { k: '4', l: 'propiedades' },
            { k: '$2.34M', l: 'mensual' },
            { k: '94%', l: 'al día' },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-mint-100 bg-white/70 p-3.5">
              <div className="num text-[20px] text-ink-900">{s.k}</div>
              <div className="mt-0.5 text-[12px] text-ink-500">{s.l}</div>
            </div>
          ))}
        </div>
        {/* decorative chips */}
        <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-peach-100/50"></div>
        <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-lavender-100/40"></div>
      </div>
      {/* Right — form */}
      <div className="flex items-center justify-center bg-cream-50 p-6 lg:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-900 text-cream-50">
              <Icon name="home" size={18} />
            </div>
            <div className="serif text-[22px]">Casero</div>
          </div>
          <h2 className="serif text-[32px] text-ink-900">Hola de nuevo</h2>
          <p className="mt-1.5 text-[15px] text-ink-500">Inicia sesión para ver tu balance.</p>

          <div className="mt-7 grid grid-cols-2 gap-2">
            <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-cream-200 bg-white text-sm transition hover:bg-cream-100">
              <span className="h-4 w-4 rounded-full bg-gradient-to-br from-peach-200 to-mint-200"></span>{' '}
              Google
            </button>
            <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-cream-200 bg-white text-sm transition hover:bg-cream-100">
              <Icon name="key" size={14} /> Passkey
            </button>
          </div>
          <div className="my-5 flex items-center gap-3 text-[12px] tracking-[0.1em] text-ink-400 uppercase">
            <div className="h-px flex-1 bg-cream-200"></div> o con correo{' '}
            <div className="h-px flex-1 bg-cream-200"></div>
          </div>

          <form onSubmit={submit} className="space-y-3.5">
            <Input
              label="Correo"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Contraseña"
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
            />
            <Button type="submit" size="lg" className="mt-2 w-full" disabled={loading}>
              {loading ? 'Verificando…' : 'Entrar'} <Icon name="chev_r" size={16} />
            </Button>
          </form>
          <p className="mt-6 flex items-center gap-1.5 text-[12px] text-ink-400">
            <Icon name="shield" size={13} /> Protegido por autenticación segura.
          </p>
        </div>
      </div>
    </div>
  );
}

// ============ PROPERTY CARD ============
function PropertyCard({ p, onOpen }) {
  const last12 = p.payments.slice(-12).map((x) => x.amount);
  const current = p.payments.at(-1);
  const accent = ACCENTS[p.color] ?? ACCENTS.mint;
  return (
    <button
      onClick={onOpen}
      className="group overflow-hidden rounded-2xl border border-cream-200 bg-white text-left ring-soft transition-all hover:border-ink-300"
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
        <StatusPill status={current.status} />
      </div>
      <div className="flex items-center justify-between px-5 pb-4">
        <div>
          <div className="text-[11px] tracking-[0.1em] text-ink-400 uppercase">Arriendo actual</div>
          <div className="mt-0.5 num text-[22px] text-ink-900">
            {fmtCLP(current.amount)}
            <span className="font-sans text-[13px] text-ink-400">/mes</span>
          </div>
        </div>
        <Sparkline values={last12} color={accent[500]} />
      </div>
      <div className="flex items-center justify-between border-t border-cream-200 px-5 py-3 text-[12.5px] text-ink-500">
        <span className="flex items-center gap-1.5">
          <Icon name="user" size={13} /> {p.tenant}
        </span>
        <span className="flex items-center gap-1 text-ink-700 transition group-hover:translate-x-0.5">
          ver detalle <Icon name="chev_r" size={13} />
        </span>
      </div>
    </button>
  );
}

// ============ DASHBOARD ============
function FilterMenu({ filter, setFilter }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) {
      return;
    }
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => {
      document.removeEventListener('mousedown', onDoc);
    };
  }, [open]);
  const activeCount = (filter.status !== 'all' ? 1 : 0) + (filter.color !== 'all' ? 1 : 0);
  return (
    <div className="relative" ref={ref}>
      <Button variant="soft" size="md" onClick={() => setOpen((o) => !o)}>
        <Icon name="filter" size={14} /> Filtrar
        {activeCount > 0 && (
          <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-ink-900 px-1.5 text-[11px] text-cream-50">
            {activeCount}
          </span>
        )}
      </Button>
      {open && (
        <div className="fade-in absolute top-12 right-0 z-30 w-64 rounded-2xl border border-cream-200 bg-cream-50 p-4 shadow-xl ring-soft">
          <div className="mb-2 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
            Estado del mes
          </div>
          <div className="mb-4 flex flex-wrap gap-1.5">
            {[
              { v: 'all', l: 'Todas' },
              { v: 'paid', l: 'Al día' },
              { v: 'late', l: 'Atraso' },
              { v: 'pending', l: 'Pendiente' },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setFilter((f) => ({ ...f, status: o.v }))}
                className={`h-8 rounded-full border px-3 text-[12.5px] transition ${filter.status === o.v ? 'border-ink-900 bg-ink-900 text-cream-50' : 'border-cream-200 bg-white text-ink-700 hover:border-ink-300'}`}
              >
                {o.l}
              </button>
            ))}
          </div>
          <div className="mb-2 text-[11px] tracking-[0.1em] text-ink-500 uppercase">Etiqueta</div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter((f) => ({ ...f, color: 'all' }))}
              className={`h-8 rounded-full border px-3 text-[12.5px] transition ${filter.color === 'all' ? 'border-ink-900 bg-ink-900 text-cream-50' : 'border-cream-200 bg-white text-ink-700 hover:border-ink-300'}`}
            >
              Todas
            </button>
            {Object.entries(ACCENTS).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setFilter((f) => ({ ...f, color: k }))}
                className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-[12.5px] transition ${filter.color === k ? 'border-ink-900' : 'border-cream-200 hover:border-ink-300'}`}
                style={{ background: filter.color === k ? v[100] : '#fff', color: v[700] }}
              >
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: v[500] }}></span>
                {v.label}
              </button>
            ))}
          </div>
          {activeCount > 0 && (
            <button
              onClick={() => setFilter({ status: 'all', color: 'all' })}
              className="mt-4 text-[12.5px] text-ink-500 hover:text-ink-900"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Dashboard({ properties: allProperties, onOpen, onAdd, tweaks }) {
  const [filter, setFilter] = useState({ status: 'all', color: 'all' });
  const ym = todayYM();
  const properties = allProperties.filter((p) => {
    if (filter.color !== 'all' && p.color !== filter.color) {
      return false;
    }
    if (filter.status !== 'all') {
      const cur = p.payments.find((x) => x.month === ym) ?? p.payments.at(-1);
      if (filter.status === 'paid' && cur.status !== 'paid') {
        return false;
      }
      if (filter.status === 'late' && cur.status !== 'late') {
        return false;
      }
      if (filter.status === 'pending' && cur.status !== 'pending') {
        return false;
      }
    }
    return true;
  });
  const month = properties.flatMap((p) =>
    p.payments.filter((x) => x.month === ym).map((x) => ({ ...x, propId: p.id })),
  );
  const expected = month.reduce((s, x) => s + x.amount, 0);
  const collected = month.filter((x) => x.status === 'paid').reduce((s, x) => s + x.amount, 0);
  const pending = expected - collected;
  const ytd = properties.reduce(
    (s, p) =>
      s +
      p.payments
        .filter((x) => x.month.startsWith('2026') && x.status !== 'pending')
        .reduce((a, b) => a + b.amount, 0),
    0,
  );

  // last 6 months stack
  const months = useMemo(() => {
    const s = new Set();
    properties.forEach((p) => p.payments.forEach((x) => s.add(x.month)));
    return [...s].toSorted().slice(-6);
  }, [properties]);
  const monthlyTotals = months.map((m) => ({
    m,
    total: properties.reduce((s, p) => s + (p.payments.find((x) => x.month === m)?.amount ?? 0), 0),
  }));
  const maxTotal = Math.max(...monthlyTotals.map((x) => x.total), 1);

  const upcoming = properties
    .map((p) => {
      const next = p.payments.find((x) => x.status === 'pending');
      return next ? { p, next } : null;
    })
    .filter(Boolean);

  return (
    <div className="fade-up space-y-6">
      {/* Hero summary */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="relative overflow-hidden p-6 lg:col-span-2">
          <div
            className="absolute -top-16 -right-16 h-56 w-56 rounded-full"
            style={{ background: ACCENTS[tweaks.accent][50] }}
          ></div>
          <div className="relative">
            <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">
              Mes actual · {fmtMonthLong(ym)}
            </div>
            <div className="mt-2 flex items-end gap-3">
              <div className="num serif text-[52px] leading-none text-ink-900">
                {fmtCLP(collected)}
              </div>
              <div className="mb-2 text-ink-500">de {fmtCLP(expected)} esperados</div>
            </div>
            <div className="mt-4 h-2 max-w-md overflow-hidden rounded-full bg-cream-100">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${expected ? (collected / expected) * 100 : 0}%`,
                  background: ACCENTS[tweaks.accent][500],
                }}
              ></div>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[13px]">
              <span className="flex items-center gap-1.5 text-mint-700">
                <span className="h-2 w-2 rounded-full bg-mint-500"></span> Cobrado{' '}
                {fmtCLP(collected)}
              </span>
              <span className="flex items-center gap-1.5 text-peach-700">
                <span className="h-2 w-2 rounded-full bg-peach-500"></span> Pendiente{' '}
                {fmtCLP(pending)}
              </span>
              <span className="flex items-center gap-1.5 text-ink-500">
                <span className="h-2 w-2 rounded-full bg-ink-300"></span> {properties.length}{' '}
                propiedades
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">Acumulado 2026</div>
          <div className="mt-1 num serif text-[32px] text-ink-900">{fmtCLP(ytd)}</div>
          <div className="mt-1 flex items-center gap-1 text-[13px] text-mint-700">
            <Icon name="arrow_up" size={13} /> +6,8% vs 2025
          </div>
          <div className="mt-5 flex h-20 items-end gap-1.5">
            {monthlyTotals.map(({ m, total }) => (
              <div key={m} className="flex flex-1 flex-col items-center gap-1.5">
                <div
                  className="w-full rounded-md transition-all"
                  style={{
                    height: `${(total / maxTotal) * 100}%`,
                    background: ACCENTS[tweaks.accent][100],
                    minHeight: 4,
                  }}
                ></div>
                <div className="text-[10px] text-ink-400">{fmtMonth(m).split(' ')[0]}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Properties */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="serif text-[26px] text-ink-900">Mis propiedades</h2>
          <div className="text-[13px] text-ink-500">{properties.length} en tu cartera</div>
        </div>
        <div className="flex gap-2">
          <FilterMenu filter={filter} setFilter={setFilter} />
          <Button onClick={onAdd}>
            <Icon name="plus" size={14} /> Agregar propiedad
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} p={p} onOpen={() => onOpen(p.id)} />
        ))}
        <button
          onClick={onAdd}
          className="flex min-h-[200px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-cream-200 text-ink-400 transition hover:border-ink-300 hover:text-ink-700"
        >
          <Icon name="plus" size={22} />
          <div className="text-sm">Agregar propiedad</div>
        </button>
      </div>

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="serif text-[20px] text-ink-900">Cobros del mes</h3>
            <span className="text-[12.5px] text-ink-500">{upcoming.length} pendientes</span>
          </div>
          <div className="divide-y divide-cream-200">
            {upcoming.map(({ p, next }) => (
              <div key={p.id} className="flex items-center gap-4 py-3">
                <Avatar name={p.tenant} color={p.color} />
                <div className="min-w-0 flex-1">
                  <div className="text-[15px] text-ink-900">{p.tenant}</div>
                  <div className="truncate text-[12.5px] text-ink-500">
                    {p.nickname} · {fmtMonthLong(next.month)}
                  </div>
                </div>
                <div className="num text-[15px] text-ink-900">{fmtCLP(next.amount)}</div>
                <Button size="sm" variant="mint" onClick={() => onOpen(p.id)}>
                  <Icon name="check" size={13} /> Registrar
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ============ PROPERTY DETAIL ============
function PropertyDetail({ property: p, onBack, onPay, onEdit, onIncrease, tweaks }) {
  const accent = ACCENTS[p.color];
  const totalCollected = p.payments
    .filter((x) => x.status !== 'pending')
    .reduce((s, x) => s + x.amount, 0);
  const totalExpected = p.payments.reduce((s, x) => s + x.amount, 0);
  const pending = p.payments.filter((x) => x.status === 'pending');
  const months = p.payments;
  const { startDate } = p;
  const months_active = p.payments.length;

  // Annual increases — group by year and detect step ups
  const yearGroups = useMemo(() => {
    const g = {};
    p.payments.forEach((x) => {
      const y = x.month.slice(0, 4);
      g[y] ??= [];
      g[y].push(x);
    });
    return g;
  }, [p.payments]);

  const [tab, setTab] = useState('historial');

  return (
    <div className="fade-up space-y-5">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-[13px] text-ink-500 hover:text-ink-900"
      >
        <Icon name="chev_l" size={14} /> Volver al panel
      </button>

      {/* Header */}
      <Card className="overflow-hidden">
        <div
          className="relative px-7 pt-6 pb-5"
          style={{ background: `linear-gradient(180deg, ${accent[50]} 0%, #ffffff 100%)` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: accent[100], color: accent[700] }}
              >
                <Icon name="home" size={26} />
              </div>
              <div>
                <div className="text-[12px] tracking-[0.1em] text-ink-500 uppercase">Propiedad</div>
                <h2 className="serif text-[34px] leading-tight text-ink-900">{p.nickname}</h2>
                <div className="mt-0.5 flex items-center gap-1.5 text-[13.5px] text-ink-500">
                  <Icon name="pin" size={13} /> {p.address}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="soft" size="sm" onClick={onEdit}>
                <Icon name="edit" size={13} /> Editar
              </Button>
              <Button onClick={onPay} size="sm">
                <Icon name="plus" size={13} /> Registrar pago
              </Button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card className="p-4">
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                Arriendo actual
              </div>
              <div className="mt-1 num text-[22px] text-ink-900">
                {fmtCLP(p.payments.at(-1).amount)}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                Inicio contrato
              </div>
              <div className="mt-1 text-[15px] text-ink-900">{fmtDate(p.startDate)}</div>
              <div className="text-[12px] text-ink-400">{p.contractMonths} meses</div>
            </Card>
            <Card className="p-4">
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                Reajuste anual
              </div>
              <div className="mt-1 num text-[22px] text-ink-900">+{p.increasePct}%</div>
              <div className="text-[12px] text-ink-400">
                cada {fmtMonthLong(`2025-${p.increaseAnchor}`).split(' ')[0]}
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">Garantía</div>
              <div className="mt-1 num text-[22px] text-ink-900">{fmtCLP(p.deposit)}</div>
            </Card>
          </div>
        </div>

        {/* Tenant strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-cream-200 px-7 py-4">
          <div className="flex items-center gap-3">
            <Avatar name={p.tenant} color={p.color} size={42} />
            <div>
              <div className="text-[15px] text-ink-900">{p.tenant}</div>
              <div className="flex items-center gap-3 text-[12.5px] text-ink-500">
                <span className="flex items-center gap-1">
                  <Icon name="phone" size={12} /> {p.tenantPhone}
                </span>
              </div>
            </div>
          </div>
          <div className="max-w-md text-[12.5px] text-ink-500">{p.notes}</div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-cream-200">
        {[
          { k: 'historial', l: 'Historial de pagos' },
          { k: 'balance', l: 'Balance' },
          { k: 'reajustes', l: 'Reajustes' },
        ].map((t) => (
          <button
            key={t.k}
            onClick={() => setTab(t.k)}
            className={`-mb-px h-10 border-b-2 px-4 text-sm transition ${tab === t.k ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-500 hover:text-ink-900'}`}
          >
            {t.l}
          </button>
        ))}
      </div>

      {tab === 'historial' && (
        <Card className="overflow-hidden">
          <div className="grid grid-cols-12 gap-3 border-b border-cream-200 bg-cream-50 px-5 py-3 text-[11px] tracking-[0.1em] text-ink-500 uppercase">
            <div className="col-span-3">Mes</div>
            <div className="col-span-3">Estado</div>
            <div className="col-span-3">Pagado el</div>
            <div className="col-span-3 text-right">Monto</div>
          </div>
          {[...p.payments].toReversed().map((x, i) => {
            const prev = p.payments[p.payments.length - 2 - i];
            const isIncrease = prev && x.amount > prev.amount;
            return (
              <div
                key={x.month}
                className="grid grid-cols-12 items-center gap-3 border-b border-cream-100 px-5 py-3.5 last:border-0 hover:bg-cream-50/60"
              >
                <div className="col-span-3">
                  <div className="text-[14.5px] text-ink-900">{fmtMonthLong(x.month)}</div>
                  {isIncrease && (
                    <div className="mt-0.5 flex items-center gap-1 text-[11px] text-mint-700">
                      <Icon name="arrow_up" size={10} /> Reajuste anual
                    </div>
                  )}
                </div>
                <div className="col-span-3">
                  <StatusPill status={x.status} />
                </div>
                <div className="col-span-3 num text-[13px] text-ink-700">{fmtDate(x.paidOn)}</div>
                <div className="col-span-3 text-right num text-[15px] text-ink-900">
                  {fmtCLP(x.amount)}
                </div>
              </div>
            );
          })}
        </Card>
      )}

      {tab === 'balance' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="p-5 md:col-span-2">
            <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              Resumen del contrato
            </div>
            <div className="mt-1.5 num serif text-[40px] text-ink-900">
              {fmtCLP(totalCollected)}
            </div>
            <div className="text-[13px] text-ink-500">
              cobrados desde {fmtDate(startDate)} ({months_active} meses)
            </div>
            <div className="mt-6 space-y-3">
              {Object.entries(yearGroups).map(([year, items]) => {
                const cobrado = items
                  .filter((i) => i.status !== 'pending')
                  .reduce((s, x) => s + x.amount, 0);
                const total = items.reduce((s, x) => s + x.amount, 0);
                return (
                  <div key={year}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <div className="serif text-[18px] text-ink-900">{year}</div>
                      <div className="num text-[14px] text-ink-700">
                        {fmtCLP(cobrado)} <span className="text-ink-400">/ {fmtCLP(total)}</span>
                      </div>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-cream-100">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${(cobrado / total) * 100}%`, background: accent[500] }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
              Próximos cobros
            </div>
            <div className="mt-3 space-y-3">
              {pending.length === 0 && (
                <div className="text-[13.5px] text-ink-500">Todo al día.</div>
              )}
              {pending.map((x) => (
                <div
                  key={x.month}
                  className="flex items-center justify-between border-b border-cream-100 py-2 last:border-0"
                >
                  <div>
                    <div className="text-[14px] text-ink-900">{fmtMonthLong(x.month)}</div>
                    <div className="text-[11.5px] text-ink-500">
                      vence el día {p.startDate.split('-')[2]}
                    </div>
                  </div>
                  <div className="num text-[15px] text-ink-900">{fmtCLP(x.amount)}</div>
                </div>
              ))}
            </div>
            <Button onClick={onPay} className="mt-4 w-full">
              <Icon name="check" size={13} /> Marcar como pagado
            </Button>
          </Card>
        </div>
      )}

      {tab === 'reajustes' && (
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] tracking-[0.1em] text-ink-500 uppercase">
                Política de reajuste
              </div>
              <div className="mt-1 serif text-[22px] text-ink-900">
                +{p.increasePct}% cada año, en{' '}
                {fmtMonthLong(`2025-${p.increaseAnchor}`).split(' ')[0]}
              </div>
            </div>
            <Button onClick={onIncrease} variant="soft">
              <Icon name="settings" size={13} /> Cambiar política
            </Button>
          </div>
          <div className="relative mt-6">
            <div className="absolute top-2 bottom-2 left-3 w-px bg-cream-200"></div>
            {Object.entries(yearGroups).map(([year, items], i) => {
              const start = items[0];
              const prevYear = String(+year - 1);
              const prev = yearGroups[prevYear]?.[0];
              const delta = prev
                ? Math.round(((start.amount - prev.amount) / prev.amount) * 100)
                : 0;
              return (
                <div key={year} className="relative pb-6 pl-9 last:pb-0">
                  <div
                    className="absolute top-0.5 left-0 flex h-6 w-6 items-center justify-center rounded-full"
                    style={{ background: accent[100], color: accent[700] }}
                  >
                    <Icon name="sparkle" size={12} />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="serif text-[18px] text-ink-900">{year}</div>
                    {prev && (
                      <div className="text-[13px] text-mint-700">
                        +{delta}% vs {prevYear}
                      </div>
                    )}
                  </div>
                  <div className="mt-0.5 num text-[15px] text-ink-700">
                    {fmtCLP(start.amount)}{' '}
                    <span className="text-[12.5px] text-ink-400">
                      / mes desde {fmtMonth(start.month)}
                    </span>
                  </div>
                </div>
              );
            })}
            {/* Future projection */}
            {(() => {
              const last = p.payments.at(-1).amount;
              const next = Math.round(last * (1 + p.increasePct / 100));
              const nextYear = String(+p.payments.at(-1).month.slice(0, 4) + 1);
              return (
                <div className="relative pl-9">
                  <div className="absolute top-0.5 left-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-dashed border-cream-300 text-ink-400">
                    <Icon name="sparkle" size={12} />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="serif text-[18px] text-ink-400">
                      {nextYear}{' '}
                      <span className="text-[12px] tracking-[0.1em] uppercase">(proyectado)</span>
                    </div>
                    <div className="text-[13px] text-ink-500">+{p.increasePct}%</div>
                  </div>
                  <div className="mt-0.5 num text-[15px] text-ink-500">
                    {fmtCLP(next)} <span className="text-[12.5px] text-ink-400">/ mes</span>
                  </div>
                </div>
              );
            })()}
          </div>
        </Card>
      )}
    </div>
  );
}

// ============ ADD PROPERTY MODAL ============
function PropertyForm({ initial }) {
  const [form, setForm] = useState({
    nickname: initial?.nickname ?? '',
    address: initial?.address ?? '',
    tenant: initial?.tenant ?? '',
    tenantPhone: initial?.tenantPhone ?? '',
    rent: initial ? String(initial.rent) : '',
    deposit: initial ? String(initial.deposit) : '',
    startDate: initial?.startDate ?? '',
    increasePct: initial ? String(initial.increasePct) : '8',
    color: initial?.color ?? 'mint',
    notes: initial?.notes ?? '',
  });
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="space-y-3.5 pb-2">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Apodo"
          placeholder="Casa Providencia"
          value={form.nickname}
          onChange={(e) => set('nickname', e.target.value)}
        />
        <Input
          label="Dirección"
          placeholder="Av. ..."
          value={form.address}
          onChange={(e) => set('address', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Arrendatario"
          placeholder="Nombre completo"
          value={form.tenant}
          onChange={(e) => set('tenant', e.target.value)}
        />
        <Input
          label="Teléfono"
          placeholder="+56 9 ..."
          value={form.tenantPhone}
          onChange={(e) => set('tenantPhone', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Arriendo mensual"
          prefix="$"
          placeholder="500.000"
          value={form.rent}
          onChange={(e) => set('rent', e.target.value)}
        />
        <Input
          label="Garantía"
          prefix="$"
          placeholder="500.000"
          value={form.deposit}
          onChange={(e) => set('deposit', e.target.value)}
        />
        <Input
          label="Reajuste"
          suffix="%"
          placeholder="8"
          value={form.increasePct}
          onChange={(e) => set('increasePct', e.target.value)}
        />
      </div>
      <Input
        label="Inicio del contrato"
        type="date"
        value={form.startDate}
        onChange={(e) => set('startDate', e.target.value)}
      />
      <div>
        <div className="mb-2 text-[12px] tracking-[0.08em] text-ink-500 uppercase">
          Color de etiqueta
        </div>
        <div className="flex gap-2">
          {Object.entries(ACCENTS).map(([k, v]) => (
            <button
              key={k}
              onClick={() => set('color', k)}
              className={`flex h-10 items-center gap-2 rounded-full border px-4 text-[13px] font-medium transition ${form.color === k ? 'border-ink-900' : 'border-cream-200'}`}
              style={{ background: v[100], color: v[700] }}
            >
              <span className="h-3 w-3 rounded-full" style={{ background: v[500] }}></span>{' '}
              {v.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ APP ROOT ============
function App() {
  const [tweaks, setTweaks] = useTweaks(TWEAK_DEFAULTS);
  const [auth, setAuth] = useState(null);
  const [view, setView] = useState({ name: 'dashboard' });
  const [properties, setProperties] = useState(window.SEED_PROPERTIES);
  const [showAdd, setShowAdd] = useState(false);
  const [payModal, setPayModal] = useState(null); // propId or null
  const [editModal, setEditModal] = useState(null); // propId or null
  const [payMethod, setPayMethod] = useState('bancolombia');

  // Apply accent CSS var
  useEffect(() => {
    document.documentElement.style.setProperty('--accent-700', ACCENTS[tweaks.accent][700]);
    document.documentElement.style.setProperty('--accent-500', ACCENTS[tweaks.accent][500]);
  }, [tweaks.accent]);

  useEffect(() => {
    if (tweaks.showLogin && !auth) {
      return;
    }
    if (!tweaks.showLogin && !auth) {
      setAuth({ email: 'camila@arriendos.cl', name: 'Camila Alarcón' });
    }
  }, [tweaks.showLogin, auth]);

  if (tweaks.showLogin && !auth) {
    return (
      <>
        <LoginScreen onAuth={setAuth} />
        <TweaksUI tweaks={tweaks} setTweak={setTweaks} />
      </>
    );
  }

  const property = view.name === 'property' ? properties.find((p) => p.id === view.id) : null;

  const handleMarkPaid = (propId) => {
    setProperties((ps) =>
      ps.map((p) => {
        if (p.id !== propId) {
          return p;
        }
        const idx = p.payments.findIndex((x) => x.status === 'pending');
        if (idx === -1) {
          return p;
        }
        const today = new Date().toISOString().slice(0, 10);
        const np = [...p.payments];
        np[idx] = { ...np[idx], status: 'paid', paidOn: today };
        return { ...p, payments: np };
      }),
    );
    setPayModal(null);
  };

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-cream-200 bg-cream-50/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
          <button
            onClick={() => setView({ name: 'dashboard' })}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink-900 text-cream-50">
              <Icon name="home" size={16} />
            </div>
            <div className="serif text-[20px] tracking-tight">Casero</div>
          </button>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <button
              onClick={() => setView({ name: 'dashboard' })}
              className={`h-9 rounded-full px-3 ${view.name === 'dashboard' ? 'bg-cream-100 text-ink-900' : 'text-ink-500 hover:text-ink-900'}`}
            >
              Panel
            </button>
            <button className="h-9 rounded-full px-3 text-ink-500 hover:text-ink-900">Pagos</button>
            <button className="h-9 rounded-full px-3 text-ink-500 hover:text-ink-900">
              Reportes
            </button>
          </nav>
          <div className="flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100">
              <Icon name="search" size={16} />
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-ink-500 hover:bg-cream-100">
              <Icon name="bell" size={16} />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-peach-500"></span>
            </button>
            <div className="ml-1 flex items-center gap-2 border-l border-cream-200 pl-2">
              <Avatar name={auth?.name ?? 'C A'} color={tweaks.accent} size={32} />
              <div className="hidden leading-tight sm:block">
                <div className="text-[13px] text-ink-900">{auth?.name}</div>
                <div className="text-[11px] text-ink-500">Plan personal</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {view.name === 'dashboard' && (
          <Dashboard
            properties={properties}
            tweaks={tweaks}
            onOpen={(id) => setView({ name: 'property', id })}
            onAdd={() => setShowAdd(true)}
          />
        )}
        {view.name === 'property' && property && (
          <PropertyDetail
            property={property}
            tweaks={tweaks}
            onBack={() => setView({ name: 'dashboard' })}
            onPay={() => setPayModal(property.id)}
            onEdit={() => setEditModal(property.id)}
            onIncrease={() => {}}
          />
        )}
      </main>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Nueva propiedad"
        width={620}
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowAdd(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setShowAdd(false)}>
              <Icon name="check" size={14} /> Guardar
            </Button>
          </>
        }
      >
        <PropertyForm />
      </Modal>

      <Modal
        open={!!editModal}
        onClose={() => setEditModal(null)}
        title="Editar propiedad"
        width={620}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditModal(null)}>
              Cancelar
            </Button>
            <Button onClick={() => setEditModal(null)}>
              <Icon name="check" size={14} /> Guardar cambios
            </Button>
          </>
        }
      >
        {editModal && <PropertyForm initial={properties.find((x) => x.id === editModal)} />}
      </Modal>

      <Modal
        open={!!payModal}
        onClose={() => setPayModal(null)}
        title="Registrar pago"
        width={460}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPayModal(null)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                handleMarkPaid(payModal);
              }}
            >
              <Icon name="check" size={14} /> Confirmar pago
            </Button>
          </>
        }
      >
        {payModal &&
          (() => {
            const p = properties.find((x) => x.id === payModal);
            const next = p.payments.find((x) => x.status === 'pending');
            if (!next) {
              return (
                <div className="py-4 text-sm text-ink-500">
                  No hay cuotas pendientes en esta propiedad.
                </div>
              );
            }
            return (
              <div className="space-y-3 pb-2">
                <Card className="flex items-center gap-3 p-4">
                  <Avatar name={p.tenant} color={p.color} />
                  <div className="flex-1">
                    <div className="text-[15px] text-ink-900">{p.tenant}</div>
                    <div className="text-[12.5px] text-ink-500">
                      {p.nickname} · {fmtMonthLong(next.month)}
                    </div>
                  </div>
                  <div className="num text-[18px] text-ink-900">{fmtCLP(next.amount)}</div>
                </Card>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Fecha del pago"
                    type="date"
                    defaultValue={new Date().toISOString().slice(0, 10)}
                  />
                  <Select
                    label="Método de pago"
                    value={payMethod}
                    onChange={setPayMethod}
                    options={[{ value: '', label: '— Selecciona —' }, ...PAYMENT_METHODS]}
                  />
                </div>
                <Input label="Referencia / N° transacción" placeholder="Opcional" />
                <Input label="Notas" placeholder="Opcional" />
              </div>
            );
          })()}
      </Modal>

      <TweaksUI tweaks={tweaks} setTweak={setTweaks} />
    </div>
  );
}

// ============ TWEAKS PANEL ============
function TweaksUI({ tweaks, setTweak }) {
  return (
    <TweaksPanel>
      <TweakSection label="Apariencia">
        <TweakColor
          label="Color de acento"
          value={tweaks.accent}
          options={['mint', 'peach', 'lavender', 'sky'].map((k) => ACCENTS[k][500])}
          onChange={(hex) => {
            const k = Object.keys(ACCENTS).find((k) => ACCENTS[k][500] === hex);
            if (k) {
              setTweak('accent', k);
            }
          }}
        />
        <TweakSelect
          label="Acento"
          value={tweaks.accent}
          onChange={(v) => setTweak('accent', v)}
          options={[
            { value: 'mint', label: 'Menta' },
            { value: 'peach', label: 'Durazno' },
            { value: 'lavender', label: 'Lavanda' },
            { value: 'sky', label: 'Cielo' },
          ]}
        />
        <TweakToggle
          label="Minigráficos"
          value={tweaks.showSparklines}
          onChange={(v) => setTweak('showSparklines', v)}
        />
      </TweakSection>
      <TweakSection label="Vista">
        <TweakToggle
          label="Pantalla de login"
          value={tweaks.showLogin}
          onChange={(v) => setTweak('showLogin', v)}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.querySelector('#root')).render(<App />);
