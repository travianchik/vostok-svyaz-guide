import { createFileRoute } from "@tanstack/react-router";
import {
  Banknote,
  Bluetooth,
  Grid3X3,
  Layers,
  Mail,
  MessageSquare,
  Phone,
  PieChart,
  Settings,
  Smartphone,
  User,
  Vibrate,
  Wifi,
  Wrench,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "aloQa — связь с целью" },
      {
        name: "description",
        content: "Экран управления связью и балансом в приложении aloQa.",
      },
      { property: "og:title", content: "aloQa — связь с целью" },
      {
        property: "og:description",
        content: "Экран управления связью и балансом в приложении aloQa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: AloqaScreen,
});

function BrandMark() {
  return (
    <svg viewBox="0 0 48 48" className="h-11 w-11 shrink-0" aria-label="aloQa">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="23" cy="23" r="13.5" strokeWidth="2.4" />
        <circle cx="23" cy="23" r="8.5" strokeWidth="2.4" />
        <path d="M29 29.5 37.5 38M23 5v4M23 37v4M5 23h4M37 23h4M10.3 10.3l3 3M32.7 32.7l3 3M35.7 10.3l-3 3M13.3 32.7l-3 3" strokeWidth="2" />
        <path d="m23 1.5 2.1 5.7L23 9.5l-2.1-2.3L23 1.5ZM44.5 23l-5.7 2.1-2.3-2.1 2.3-2.1 5.7 2.1Z" fill="currentColor" stroke="none" />
        <path d="M20.5 27.5V18.4h3.1c3.3 0 5.5 1.7 5.5 4.6 0 2.8-2.2 4.5-5.5 4.5h-3.1Zm6.2-.4 3.2 3.2" strokeWidth="2.2" />
      </g>
    </svg>
  );
}

function RussianFlag() {
  return (
    <svg viewBox="0 0 30 20" className="h-4 w-6 overflow-hidden rounded-[3px] shadow-sm" aria-label="Флаг России">
      <rect width="30" height="20" fill="var(--color-card)" />
      <rect y="6.67" width="30" height="6.67" fill="#3157A4" />
      <rect y="13.34" width="30" height="6.66" fill="#D33D43" />
    </svg>
  );
}

function CellularBars() {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-label="Уровень сигнала">
      {[4, 6, 9, 12].map((height) => (
        <span key={height} className="w-[2px] rounded-[1px] bg-ink" style={{ height }} />
      ))}
    </span>
  );
}

function StatusBar() {
  return (
    <div className="flex h-8 items-center justify-between px-4 text-[10px] leading-[11px] text-ink">
      <div className="flex items-center gap-2">
        <div className="font-medium">
          <div>MegaFon</div>
          <div>MTS 5G</div>
        </div>
        <span className="text-[18px] font-bold leading-none">12:45</span>
        <div className="flex items-center gap-1">
          <Bluetooth className="h-3.5 w-3.5" strokeWidth={2.5} />
          <Vibrate className="h-3.5 w-3.5 fill-ink" strokeWidth={2.4} />
          <MessageSquare className="h-3.5 w-3.5 fill-ink" strokeWidth={2.4} />
          <Mail className="h-3.5 w-3.5 fill-ink" strokeWidth={2.4} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-right font-bold leading-[9px]">501<br />B/s</span>
        <Wifi className="h-4 w-4" strokeWidth={2.6} />
        <span className="relative rounded-[3px] bg-ink px-1 py-[2px] text-[8px] font-bold text-card">
          VoLTE<span className="absolute -right-1.5 -top-1 text-[7px] text-ink">2</span>
        </span>
        <CellularBars />
        <CellularBars />
        <span className="rounded-[4px] bg-ink px-1.5 py-[2px] text-[10px] font-bold text-card">89</span>
      </div>
    </div>
  );
}

function Ornament() {
  return (
    <svg viewBox="0 0 120 120" className="absolute -right-9 -top-9 h-32 w-32 text-line opacity-80" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="4">
        <circle cx="60" cy="60" r="45" />
        <path d="M60 14c5 17 17 28 34 33-17 5-29 17-34 34-5-17-17-29-34-34 17-5 29-16 34-33Z" />
        <path d="M31 22c2 15 10 22 25 25-15 3-23 11-25 26-3-15-11-23-26-26 15-3 23-10 26-25ZM89 22c-2 15-10 22-25 25 15 3 23 11 25 26 3-15 11-23 26-26-15-3-23-10-26-25Z" />
        <circle cx="60" cy="60" r="12" />
      </g>
    </svg>
  );
}

function Header() {
  return (
    <header className="flex h-[72px] items-center justify-between gap-3 px-4 py-3">
      <div className="flex min-w-0 items-center gap-2 text-green">
        <BrandMark />
        <div className="min-w-0 leading-none">
          <div className="text-[19px] font-extrabold text-ink">aloQa</div>
          <div className="mt-1 whitespace-nowrap text-[9px] font-medium uppercase tracking-[0.22em] text-muted">СВЯЗЬ С ЦЕЛЬЮ</div>
        </div>
      </div>
      <div className="flex min-w-0 items-center gap-3 text-[12px] font-semibold">
        <div className="flex shrink-0 items-center gap-1.5 text-muted"><RussianFlag /><span>RU</span></div>
        <span className="max-w-[54px] truncate text-red">Удалить аккаунт</span>
        <span className="max-w-[38px] truncate text-ink">Выйти</span>
      </div>
    </header>
  );
}

function PhoneCard() {
  return (
    <section className="relative mx-4 mt-1 flex h-[92px] items-center gap-4 overflow-hidden rounded-[26px] bg-card p-4 shadow-soft">
      <Ornament />
      <div className="z-[1] grid h-14 w-14 shrink-0 place-items-center rounded-full bg-avatar">
        <User className="h-6 w-6 text-muted" strokeWidth={1.7} />
      </div>
      <div className="z-[1] whitespace-nowrap text-[20px] font-extrabold text-ink">+7 988 016 19 75</div>
    </section>
  );
}

function BalanceCard() {
  return (
    <section className="mx-4 mt-3 flex min-h-[150px] items-start justify-between gap-3 rounded-[26px] bg-card p-5 shadow-soft">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            {[0, 1, 2, 3].map((dot) => <span key={dot} className="h-2.5 w-2.5 rounded-full bg-faint" />)}
          </div>
          <span className="ml-1 text-[30px] font-bold leading-none text-faint">₽</span>
        </div>
        <p className="mt-5 max-w-[170px] text-[13px] leading-[1.35] text-muted">
          Для отображения баланса нужно согласие на передачу данных оператора.
        </p>
      </div>
      <button type="button" className="mt-11 shrink-0 rounded-full bg-dark px-5 py-3 text-[13px] font-semibold text-card">
        Показывать баланс
      </button>
    </section>
  );
}

function TariffSection() {
  return (
    <section className="mx-4 mt-5">
      <div className="flex items-center gap-2">
        <h2 className="text-[20px] font-extrabold leading-none text-ink">Тариф</h2>
        <span className="rounded-full bg-green px-3 py-1 text-[10px] font-bold uppercase text-card">ТВОЙ ТАРИФ</span>
      </div>
      <div className="relative mt-4">
        <div className="grid grid-cols-2 gap-3">
          <TariffCard value="25/35" label="Гигабайты" />
          <TariffCard value="200/250" label="Минуты" />
        </div>
        <div className="absolute inset-0 z-10 grid place-items-center">
          <div className="flex items-center gap-2 rounded-full bg-dark px-4 py-2.5 text-[12px] font-semibold text-card shadow-lg">
            <Wrench className="h-4 w-4" strokeWidth={2} />
            <span>Раздел в разработке</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TariffCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="h-[104px] rounded-[22px] border border-line bg-soft-card p-4">
      <div className="whitespace-nowrap text-[28px] font-extrabold leading-none text-faint blur-[1.5px]">{value}</div>
      <div className="mt-4 text-[12px] text-muted blur-[1.5px]">{label}</div>
    </div>
  );
}

const actions = [
  { icon: Settings, first: "Настроить", second: "тариф" },
  { icon: Layers, first: "Услуги", second: "и сервисы" },
  { icon: PieChart, first: "Мои", second: "расходы" },
];

function ActionSection() {
  return (
    <section className="mx-4 mt-5 grid grid-cols-3 gap-2">
      {actions.map(({ icon: Icon, first, second }) => (
        <div key={first} className="flex flex-col items-center text-center">
          <div className="grid h-[68px] w-[68px] place-items-center rounded-full border border-line bg-card shadow-soft">
            <Icon className="h-6 w-6 text-ink" strokeWidth={1.8} />
          </div>
          <div className="mt-2 text-[12px] leading-[1.3] text-muted">{first}<br />{second}</div>
        </div>
      ))}
    </section>
  );
}

function Offers() {
  return (
    <section className="mx-4 mt-6">
      <h2 className="text-[18px] font-extrabold text-ink">Специальные предложения</h2>
      <div className="mt-3 min-h-[106px] rounded-[22px] bg-dark p-5 text-[16px] font-semibold leading-snug text-card">
        Следите за вашим балансом<br />и управляйте связью
      </div>
    </section>
  );
}

function BottomTabs() {
  return (
    <nav className="absolute inset-x-0 bottom-9 z-20 grid h-[66px] grid-cols-3 border-t border-line bg-card py-2">
      <Tab icon={Phone} label="Связь" active />
      <Tab icon={Banknote} label="Банк" />
      <Tab icon={Grid3X3} label="Услуги" />
    </nav>
  );
}

function Tab({ icon: Icon, label, active = false }: { icon: typeof Phone; label: string; active?: boolean }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-1 text-[11px] ${active ? "text-green" : "text-muted"}`}>
      <Icon className="h-5 w-5" strokeWidth={2.3} />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function AndroidNavigation() {
  return (
    <div className="absolute inset-x-0 bottom-0 flex h-9 items-center justify-around bg-system text-system-icon">
      <span className="h-0 w-0 border-y-[8px] border-r-[13px] border-y-transparent border-r-current" />
      <span className="h-[19px] w-[19px] rounded-full border-2 border-current" />
      <span className="h-[18px] w-[18px] border-2 border-current" />
    </div>
  );
}

function AloqaScreen() {
  return (
    <main className="flex min-h-screen justify-center bg-stage font-sans">
      <div className="relative h-[844px] max-h-screen w-full max-w-[390px] overflow-hidden bg-background text-foreground shadow-phone">
        <StatusBar />
        <Header />
        <div className="h-[calc(100%-206px)] overflow-hidden pb-[102px]">
          <PhoneCard />
          <BalanceCard />
          <TariffSection />
          <ActionSection />
          <Offers />
        </div>
        <BottomTabs />
        <AndroidNavigation />
      </div>
    </main>
  );
}