import { useEffect, useState } from 'react';
import Icon from '@/components/ui/icon';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import { ORDERS_URL, Order } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

const STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  diag: { label: 'Диагностика', cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  repair: { label: 'В ремонте', cls: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  wait: { label: 'Ждёт запчасть', cls: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500' },
  ready: { label: 'Готово', cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

const DEVICE_ICON: Record<string, string> = {
  phone: 'Smartphone', laptop: 'Laptop', pc: 'Monitor', tablet: 'Tablet', other: 'HardDrive',
};

const STATUS_FLOW = ['diag', 'repair', 'wait', 'ready'];

const FILTERS = [
  { id: 'all', label: 'Все' },
  { id: 'diag', label: 'Диагностика' },
  { id: 'repair', label: 'В ремонте' },
  { id: 'wait', label: 'Ждут запчасть' },
  { id: 'ready', label: 'Готовы' },
];

const emptyForm = {
  client_name: '', client_phone: '', device_type: 'phone',
  device_model: '', issue: '', master: '', price: '',
};

const Orders = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(ORDERS_URL);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch {
      toast({ title: 'Не удалось загрузить заявки', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.client_name || !form.client_phone || !form.device_model) {
      toast({ title: 'Заполните имя, телефон и модель устройства', variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(ORDERS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price) || 0, status: 'diag' }),
      });
      if (!res.ok) throw new Error();
      toast({ title: 'Заявка создана', description: 'Клиенту отправлено уведомление о приёме устройства' });
      setForm(emptyForm);
      setOpen(false);
      load();
    } catch {
      toast({ title: 'Ошибка при создании заявки', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (order: Order) => {
    const idx = STATUS_FLOW.indexOf(order.status);
    const next = STATUS_FLOW[(idx + 1) % STATUS_FLOW.length];
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: next } : o)));
    try {
      await fetch(ORDERS_URL, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: order.id, status: next }),
      });
      toast({
        title: `Статус: ${STATUS[next].label}`,
        description: `${order.client_name} — уведомление отправлено`,
      });
    } catch {
      toast({ title: 'Не удалось обновить статус', variant: 'destructive' });
      load();
    }
  };

  const filtered = orders.filter((o) => {
    const byStatus = filter === 'all' || o.status === filter;
    const q = search.toLowerCase();
    const bySearch = !q
      || o.client_name.toLowerCase().includes(q)
      || o.client_phone.toLowerCase().includes(q)
      || o.device_model.toLowerCase().includes(q);
    return byStatus && bySearch;
  });

  return (
    <div className="min-h-screen mesh-bg flex">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <Topbar search={search} onSearch={setSearch} />
        <div className="p-5 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-in">
            <div>
              <p className="text-sm font-medium text-primary mb-1">Управление ремонтами</p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold tracking-tight">Заявки</h1>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition">
                  <Icon name="Plus" size={18} />
                  Принять устройство
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="font-display text-2xl">Новая заявка</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Имя клиента *" value={form.client_name} onChange={(v) => setForm({ ...form, client_name: v })} placeholder="Иван Иванов" />
                    <Field label="Телефон *" value={form.client_phone} onChange={(v) => setForm({ ...form, client_phone: v })} placeholder="+7 900 000-00-00" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Тип устройства</label>
                      <Select value={form.device_type} onValueChange={(v) => setForm({ ...form, device_type: v })}>
                        <SelectTrigger className="rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Телефон</SelectItem>
                          <SelectItem value="laptop">Ноутбук</SelectItem>
                          <SelectItem value="pc">Компьютер</SelectItem>
                          <SelectItem value="tablet">Планшет</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Field label="Модель *" value={form.device_model} onChange={(v) => setForm({ ...form, device_model: v })} placeholder="iPhone 14 Pro" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Описание неисправности</label>
                    <textarea
                      value={form.issue}
                      onChange={(e) => setForm({ ...form, issue: e.target.value })}
                      rows={2}
                      placeholder="Что случилось с устройством…"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 transition resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Мастер" value={form.master} onChange={(v) => setForm({ ...form, master: v })} placeholder="И. Петров" />
                    <Field label="Стоимость, ₽" value={form.price} onChange={(v) => setForm({ ...form, price: v.replace(/\D/g, '') })} placeholder="0" />
                  </div>
                </div>
                <DialogFooter>
                  <button
                    onClick={submit}
                    disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition disabled:opacity-60"
                  >
                    {saving ? <Icon name="Loader2" size={18} className="animate-spin" /> : <Icon name="Check" size={18} />}
                    Создать заявку
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  filter === f.id
                    ? 'bg-primary text-white shadow-md shadow-primary/25'
                    : 'bg-white border border-border text-muted-foreground hover:bg-secondary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="rounded-3xl bg-white border border-border p-3 lg:p-4 animate-fade-in">
            {loading ? (
              <div className="py-20 flex flex-col items-center text-muted-foreground">
                <Icon name="Loader2" size={28} className="animate-spin mb-3" />
                Загружаем заявки…
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 flex flex-col items-center text-muted-foreground">
                <Icon name="Inbox" size={32} className="mb-3" />
                Заявок не найдено
              </div>
            ) : (
              <div className="space-y-1.5">
                {filtered.map((o) => {
                  const st = STATUS[o.status] || STATUS.diag;
                  return (
                    <div key={o.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-secondary transition group">
                      <div className="w-12 h-12 rounded-xl bg-secondary group-hover:bg-white flex items-center justify-center shrink-0 transition">
                        <Icon name={DEVICE_ICON[o.device_type] || 'HardDrive'} size={22} className="text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">{o.device_model}</p>
                        <p className="text-xs text-muted-foreground truncate">{o.client_name} · {o.client_phone}</p>
                        {o.issue && <p className="text-xs text-muted-foreground/70 truncate mt-0.5">{o.issue}</p>}
                      </div>
                      <div className="hidden md:block text-xs text-muted-foreground w-24 truncate">
                        {o.master || '—'}
                      </div>
                      <button
                        onClick={() => changeStatus(o)}
                        title="Нажмите, чтобы сменить статус"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition hover:scale-105 ${st.cls}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        {st.label}
                      </button>
                      <div className="text-right shrink-0 w-20">
                        <p className="text-sm font-bold">{o.price ? `${o.price.toLocaleString('ru')} ₽` : '—'}</p>
                        <p className="text-xs text-muted-foreground">№{o.id}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const Field = ({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) => (
  <div>
    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-border text-sm outline-none focus:ring-2 focus:ring-primary/30 transition"
    />
  </div>
);

export default Orders;
