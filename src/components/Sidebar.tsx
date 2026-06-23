import { useNavigate, useLocation } from 'react-router-dom';
import Icon from '@/components/ui/icon';

const NAV = [
  { id: 'dashboard', label: 'Главная', icon: 'LayoutDashboard', path: '/' },
  { id: 'clients', label: 'Клиенты', icon: 'Users', path: '/clients' },
  { id: 'orders', label: 'Заявки', icon: 'Wrench', path: '/orders' },
  { id: 'masters', label: 'Мастера', icon: 'HardHat', path: '/masters' },
  { id: 'reports', label: 'Отчёты', icon: 'BarChart3', path: '/reports' },
  { id: 'parts', label: 'Запчасти', icon: 'Cpu', path: '/parts' },
  { id: 'profile', label: 'Профиль', icon: 'CircleUser', path: '/profile' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
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
        {NAV.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon name={item.icon} size={19} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl bg-gradient-to-br from-primary to-accent p-4 text-white">
        <Icon name="Sparkles" size={20} className="mb-2" />
        <p className="text-sm font-semibold leading-snug">Авто-уведомления клиентам включены</p>
        <p className="text-xs text-white/70 mt-1">SMS и Telegram при смене статуса</p>
      </div>
    </aside>
  );
};

export default Sidebar;
