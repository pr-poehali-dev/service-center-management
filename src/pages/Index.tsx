import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '@/components/ui/icon';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ORDERS_URL, Order } from '@/lib/api';

const STATUS: Record<string, { label: string; cls: string }> = {
  diag: { label: 'Диагностика', cls: 'bg-amber-100 text-amber-700' },
  repair: { label: 'В ремонте', cls: 'bg-violet-100 text-violet-700' },
  wait: { label: 'Ждёт запчасть', cls: 'bg-rose-100 text-rose-700' },
  ready: { label: 'Готово', cls: 'bg-emerald-100 text-emerald-700' },
};

const DEVICE_ICON: Record<string, string> = {
  phone: 'Smartphone', laptop: 'Laptop', pc: 'Monitor', tablet: 'Tablet', other: 'HardDrive',
};

const NOTIFS = [
  { name: 'Дмитрий Лосев', text: 'Устройство готово к выдаче', time: '5 мин назад', icon: 'PackageCheck', tone: 'text-emerald-600 bg-emerald-50' },
  { name: 'Олег Минин', text: 'Ожидается запчасть, +2 дня', time: '40 мин назад', icon: 'Clock', tone: 'text-rose-600 bg-rose-50' },
  { name: 'Анна Кравцова', text: 'Начат ремонт устройства', time: '2 ч назад', icon: 'Wrench', tone: 'text-violet-600 bg-violet-50' },
];

const Index = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetch(ORDERS_URL).then((r) => r.json()).then((d) => setOrders(d.orders || [])).catch(() => {});
  }, []);

  const active = orders.filter((o) => o.status !== 'ready').length;
  const ready = orders.filter((o) => o.status === 'ready').length;
  const revenue = orders.reduce((s, o) => s + (o.price || 0), 0);

  const STATS = [
    { label: 'Активных заявок', value: String(active), delta: 'в работе сейчас', icon: 'Wrench', tone: 'from-violet-500 to-purple-600' },
    { label: 'Готово к выдаче', value: String(ready), delta: `${ready} уведомлений`, icon: 'PackageCheck', tone: 'from-emerald-500 to-teal-600' },
    { label: 'Мастеров на смене', value: '6', delta: 'из 9 всего', icon: 'HardHat', tone: 'from-sky-500 to-blue-600' },
    { label: 'Сумма заявок', value: `${(revenue / 1000).toFixed(0)}к ₽`, delta: 'за текущий период', icon: 'TrendingUp', tone: 'from-fuchsia-500 to-pink-600' },
  ];

  return (
    <div className="min-h-screen mesh-bg flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Topbar />
        <div className="p-5 lg:p-8 space-y-7">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-sm font-medium text-primary mb-1">Понедельник, 23 июня</p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Панель управления</h1>
            </div>
            <button
              onClick={() => navigate('/orders')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition"
            >
              <Icon name="Plus" size={18} />
              Новая заявка
            </button>
          </div>

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
            <div className="xl:col-span-2 rounded-3xl bg-white border border-border p-5 lg:p-6 animate-fade-in">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-bold">Последние заявки</h2>
                <button onClick={() => navigate('/orders')} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                  Все заявки <Icon name="ArrowRight" size={15} />
                </button>
              </div>
              <div className="space-y-2">
                {orders.slice(0, 5).map((o) => {
                  const st = STATUS[o.status] || STATUS.diag;
                  return (
                    <div
                      key={o.id}
                      onClick={() => navigate('/orders')}
                      className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary transition cursor-pointer group"
                    >
                      <div className="w-11 h-11 rounded-xl bg-secondary group-hover:bg-white flex items-center justify-center shrink-0 transition">
                        <Icon name={DEVICE_ICON[o.device_type] || 'HardDrive'} size={20} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{o.device_model}</p>
                        <p className="text-xs text-muted-foreground truncate">{o.client_name} · {o.master || '—'}</p>
                      </div>
                      <span className={`hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-semibold ${st.cls}`}>
                        {st.label}
                      </span>
                      <div className="text-right shrink-0 w-20">
                        <p className="text-sm font-bold">{o.price ? `${o.price.toLocaleString('ru')} ₽` : '—'}</p>
                        <p className="text-xs text-muted-foreground">№{o.id}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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
