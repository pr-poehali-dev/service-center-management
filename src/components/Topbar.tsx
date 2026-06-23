import Icon from '@/components/ui/icon';

const Topbar = ({ search = '', onSearch }: { search?: string; onSearch?: (v: string) => void }) => {
  return (
    <header className="sticky top-0 z-10 glass border-b border-border px-5 lg:px-8 py-4 flex items-center gap-4">
      <div className="lg:hidden w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
        <Icon name="Wrench" className="text-white" size={20} />
      </div>
      <div className="relative flex-1 max-w-md">
        <Icon name="Search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
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
  );
};

export default Topbar;
