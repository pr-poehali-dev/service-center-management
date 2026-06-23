import { useState } from 'react';
import Icon from '@/components/ui/icon';

const NAV = [
  { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard' },
  { id: 'clients', label: 'Клиенты', icon: 'Users' },
  { id: 'orders', label: 'Заявки', icon: 'Wrench' },
  { id: 'masters', label: 'Мастера', icon: 'HardHat' },
  { id: 'reports', label: 'Отчёты', icon: 'BarChart3' },
  { id: 'parts', label: 'Запчасти', icon: 'Cpu' },
  { id: 'profile', label: 'Профиль', icon: 'CircleUser' },
];

const STATS = [
  { label: 'Активных заявок', value: '28', delta: '+5 за неделю', icon: 'Wrench', tone: 'from-violet-500 to-purple-600' },
  { label: 'Готово к выдаче', value: '12', delta: '4 уведомления', icon: 'PackageCheck', tone: 'from-emerald-500 to-teal-600' },
  { label: 'Мастеров на смене', value: '6', delta: 'из 9 всего', icon: 'HardHat', tone: 'from-sky-500 to-blue-600' },
  { label: 'Выручка за месяц', value: '₽487к', delta: '+18% к прошлому', icon: 'TrendingUp', tone: 'from-fuchsia-500 to-pink-600' },
];

const STATUS: Record<string, { label: string; cls: string }> = {
  diag: { label: 'Диагностика', cls: 'bg-amber-100 text-amber-700' },
  repair: { label: 'В ремонте', cls: 'bg-violet-100 text-violet-700' },
  wait: { label: 'Ждёт запчасть', cls: 'bg-rose-100 text-rose-700' },
  ready: { label: 'Готово', cls: 'bg-emerald-100 text-emerald-700' },
};

const ORDERS = [
  { id: '№1042', device: 'MacBook Pro 14"', icon: 'Laptop', client: 'Анна Кравцова', master: 'И. Петров', status: 'repair', price: '12 400 ₽' },
  { id: '№1041', device: 'iPhone 14 Pro', icon: 'Smartphone', client: 'Дмитрий Лосев', master: 'А. Сидоров', status: 'ready', price: '8 900 ₽' },
  { id: '№1040', device: 'ПК сборка ATX', icon: 'Monitor', client: 'ООО «Вектор»', master: 'И. Петров', status: 'diag', price: '— ₽' },
  { id: '№1039', device: 'Samsung Galaxy S23', icon: 'Smartphone', client: 'Олег Минин', master: 'А. Сидоров', status: 'wait', price: '6 200 ₽' },
  { id: '№1038', device: 'Asus ROG Strix', icon: 'Laptop', client: 'Марина Гусь', master: 'К. Орлова', status: 'repair', price: '15 700 ₽' },
];

const NOTIFS = [
  { name: 'Дмитрий Лосев', text: 'Устройство готово к выдаче', time: '5 мин назад', icon: 'PackageCheck', tone: 'text-emerald-600 bg-emerald-50' },
  { name: 'Олег Минин', text: 'Ожидается запчасть, +2 дня', time: '40 мин назад', icon: 'Clock', tone: 'text-rose-600 bg-rose-50' },
  { name: 'Анна Кравцова', text: 'Начат ремонт устройства', time: '2 ч назад', icon: 'Wrench', tone: 'text-violet-600 bg-violet-50' },
];

const Index = () => {
  const [active, setActive] = useState('dashboard');

  return (
    <div className="min-h-screen mesh-bg flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border bg-white/60 backdrop-blur-xl p-5">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
            <Icon name="Wrench" className="text-white" size={22} />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-none">FixHub</p>
            <p className="text-xs text-muted-foreground mt-1">Сервис-центр</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                active === item.id
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-gradient-to-br from-primary to-accent p-4 text-white">
          <Icon name="Sparkles" size={20} className="mb-2" />
          <p className="text-sm font-semibold leading-snug">Авто-уведомления клиентам включены</p>
          <p className="text-xs text-white/70 mt-1">SMS и Telegram при смене статуса</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-10 glass border-b border-border px-5 lg:px-8 py-4 flex items-center gap-4">
          <div className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Icon name="Wrench" className="text-white" size={20} />
          </div>
          <div className="relative flex-1 max-w-md">
            <Icon name="Search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Поиск по заявкам, клиентам, телефону…"
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-white border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
            />
          </div>
          <button className="relative w-11 h-11 rounded-xl bg-white border border-border flex items-center justify-center hover:bg-secondary transition">
            <Icon name="Bell" size={19} />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-accent" />
          </button>
          <button className="flex items-center gap-3 pl-1 pr-3 py-1.5 rounded-xl bg-white border border-border hover:bg-secondary transition">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-fuchsia-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">А</div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold leading-none">Администратор</p>
              <p className="text-xs text-muted-foreground mt-0.5">Главный офис</p>
            </div>
          </button>
        </header>

        <div className="p-5 lg:p-8 space-y-7">
          {/* Hero */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-sm font-medium text-primary mb-1">Понедельник, 23 июня</p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Панель управления</h1>
            </div>
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition">
              <Icon name="Plus" size={18} />
              Новая заявка
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <div
                key={s.label}
                className="hover-lift rounded-3xl bg-white border border-border p-5 animate-scale-in"
                style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.tone} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon name={s.icon} className="text-white" size={22} />
                </div>
                <p className="text-3xl font-display font-bold tracking-tight">{s.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                <p className="text-xs font-medium text-primary mt-2">{s.delta}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* Orders */}
            <div className="xl:col-span-2 rounded-3xl bg-white border border-border p-5 lg:p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold">Последние заявки</h2>
                <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  Все заявки <Icon name="ArrowRight" size={15} />
                </button>
              </div>
              <div className="space-y-2">
                {ORDERS.map((o) => {
                  const st = STATUS[o.status];
                  return (
                    <div
                      key={o.id}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary transition cursor-pointer group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-secondary group-hover:bg-white flex items-center justify-center shrink-0 transition">
                        <Icon name={o.icon} size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{o.device}</p>
                        <p className="text-xs text-muted-foreground truncate">{o.client} · {o.master}</p>
                      </div>
                      <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                      <div className="text-right shrink-0 w-20">
                        <p className="text-sm font-bold">{o.price}</p>
                        <p className="text-xs text-muted-foreground">{o.id}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Notifications */}
            <div className="rounded-3xl bg-white border border-border p-5 lg:p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-5">
                <Icon name="BellRing" size={20} className="text-primary" />
                <h2 className="font-display text-xl font-bold">Уведомления</h2>
              </div>
              <div className="space-y-3">
                {NOTIFS.map((n, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-2xl bg-secondary/60">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.tone}`}>
                      <Icon name={n.icon} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{n.name}</p>
                      <p className="text-xs text-muted-foreground">{n.text}</p>
                      <p className="text-[11px] text-muted-foreground/70 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-primary/40 text-sm font-medium text-primary hover:bg-primary/5 transition flex items-center justify-center gap-2">
                <Icon name="Send" size={16} />
                Отправить уведомление вручную
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
