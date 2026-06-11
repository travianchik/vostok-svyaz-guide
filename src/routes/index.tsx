import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  MapPin,
  Navigation,
  FileText,
  Phone,
  Wallet,
  Signal,
  Sparkles,
  ShieldCheck,
  X,
  Check,
  Search,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Восток связь — мобильное приложение" },
      { name: "description", content: "CJM прототип мобильного приложения Восток связь" },
    ],
  }),
  component: App,
});

type Screen =
  | "welcome"
  | "sim-map"
  | "sim-docs"
  | "auth-phone"
  | "auth-otp"
  | "home-beeline"
  | "home-other";

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [operator, setOperator] = useState<"beeline" | "other">("beeline");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-200 flex items-start justify-center">
      <div className="relative w-full max-w-[440px] min-h-screen bg-background overflow-hidden shadow-2xl">
        {/* Status bar */}
        <div className="h-11 px-6 flex items-center justify-between text-[13px] font-semibold bg-background text-foreground">
          <span>9:41</span>
          <span className="flex items-center gap-1.5">
            <Signal className="h-3.5 w-3.5" />
            <span className="text-xs">5G</span>
            <span className="ml-1 inline-block w-6 h-3 rounded-sm border border-foreground relative">
              <span className="absolute inset-0.5 bg-foreground rounded-[1px]" />
            </span>
          </span>
        </div>

        {screen === "welcome" && (
          <Welcome
            onOrder={() => setScreen("sim-map")}
            onLogin={() => setScreen("auth-phone")}
          />
        )}
        {screen === "sim-map" && (
          <SimMap onBack={() => setScreen("welcome")} onDocs={() => setScreen("sim-docs")} />
        )}
        {screen === "sim-docs" && (
          <SimDocs onBack={() => setScreen("sim-map")} />
        )}
        {screen === "auth-phone" && (
          <AuthPhone
            phone={phone}
            setPhone={setPhone}
            operator={operator}
            setOperator={setOperator}
            onBack={() => setScreen("welcome")}
            onNext={() => setScreen("auth-otp")}
          />
        )}
        {screen === "auth-otp" && (
          <AuthOtp
            phone={phone}
            otp={otp}
            setOtp={setOtp}
            onBack={() => setScreen("auth-phone")}
            onLogin={() => {
              if (operator === "beeline") setScreen("home-beeline");
              else {
                setScreen("home-other");
                setShowPopup(true);
              }
            }}
          />
        )}
        {screen === "home-beeline" && (
          <HomeBeeline phone={phone} onLogout={() => setScreen("welcome")} />
        )}
        {screen === "home-other" && (
          <HomeOther
            phone={phone}
            onLogout={() => setScreen("welcome")}
            onOrder={() => {
              setShowPopup(false);
              setScreen("sim-map");
            }}
            showPopup={showPopup}
            setShowPopup={setShowPopup}
          />
        )}
      </div>
    </div>
  );
}

/* ---------- WELCOME ---------- */

const slides = [
  {
    title: "Связь, которая работает на Востоке",
    text: "Управляйте номером, балансом и тарифом в одном приложении.",
    icon: Sparkles,
  },
  {
    title: "Выгодные тарифы рядом",
    text: "Подберите тариф под себя — звонки, интернет и роуминг без переплат.",
    icon: Wallet,
  },
  {
    title: "Поддержка 24/7",
    text: "Чат, звонок и ближайший офис — всегда под рукой.",
    icon: ShieldCheck,
  },
];

function Welcome({ onOrder, onLogin }: { onOrder: () => void; onLogin: () => void }) {
  const [i, setI] = useState(0);
  const S = slides[i].icon;
  return (
    <div className="flex flex-col h-[calc(100vh-44px)]">
      <div className="px-6 pt-4 flex items-center justify-between">
        <Logo />
      </div>

      <div className="flex-1 px-6 pt-6">
        <div className="rounded-3xl bg-surface text-white p-6 h-[420px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-brand/90" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-brand/20" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand text-brand-foreground mb-6">
              <S className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black leading-tight tracking-tight">
              {slides[i].title}
            </h2>
            <p className="mt-3 text-white/80 text-[15px] leading-relaxed">{slides[i].text}</p>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setI(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-6 bg-brand" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={() => setI((i + 1) % slides.length)}
              className="w-11 h-11 rounded-full bg-white/10 backdrop-blur flex items-center justify-center hover:bg-white/20 transition"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-3">
        <button
          onClick={onOrder}
          className="w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition"
        >
          Заказать сим-карту
          <ChevronRight className="h-5 w-5" />
        </button>
        <button
          onClick={onLogin}
          className="w-full h-14 rounded-2xl border-2 border-foreground text-foreground font-bold text-base active:scale-[0.98] transition"
        >
          Зарегистрироваться / Войти
        </button>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-brand grid place-items-center">
        <div className="w-4 h-4 rounded-full bg-surface" />
      </div>
      <div className="leading-tight">
        <div className="text-[15px] font-black tracking-tight">Восток связь</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          от Билайн
        </div>
      </div>
    </div>
  );
}

/* ---------- TOPBAR ---------- */
function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="px-4 h-14 flex items-center gap-3 border-b border-border bg-background">
      <button
        onClick={onBack}
        className="w-10 h-10 rounded-full grid place-items-center hover:bg-muted active:scale-95 transition"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
      <h1 className="font-bold text-lg">{title}</h1>
    </div>
  );
}

/* ---------- SIM MAP ---------- */

const offices = [
  { id: 1, name: "Восток связь — Ленина 24", dist: "320 м", hours: "09:00 – 21:00", x: 38, y: 42 },
  { id: 2, name: "Восток связь — ТЦ Восток", dist: "1.2 км", hours: "10:00 – 22:00", x: 65, y: 30 },
  { id: 3, name: "Восток связь — Гагарина 7", dist: "2.4 км", hours: "09:00 – 20:00", x: 22, y: 70 },
  { id: 4, name: "Восток связь — Мира 101", dist: "3.1 км", hours: "10:00 – 21:00", x: 78, y: 65 },
];

function SimMap({ onBack, onDocs }: { onBack: () => void; onDocs: () => void }) {
  const [geo, setGeo] = useState(false);
  const [selected, setSelected] = useState(offices[0]);
  const [routing, setRouting] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-44px)]">
      <TopBar title="Офисы Билайн" onBack={onBack} />

      {/* Map */}
      <div className="relative flex-1 bg-[#e6eef3] overflow-hidden">
        {/* Streets */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0 50 L100 45" stroke="#cdd8e0" strokeWidth="2" fill="none" />
          <path d="M50 0 L55 100" stroke="#cdd8e0" strokeWidth="2" fill="none" />
          <path d="M0 80 Q40 75 100 85" stroke="#cdd8e0" strokeWidth="1.5" fill="none" />
          <path d="M20 0 L25 100" stroke="#dde5ec" strokeWidth="1" fill="none" />
          <path d="M80 0 L75 100" stroke="#dde5ec" strokeWidth="1" fill="none" />
          <rect x="10" y="10" width="25" height="20" fill="#dfe8d8" opacity="0.6" />
          <rect x="60" y="55" width="30" height="25" fill="#dfe8d8" opacity="0.6" />
          {routing && selected && geo && (
            <path
              d={`M50 50 Q${(50 + selected.x) / 2} ${(50 + selected.y) / 2 - 10} ${selected.x} ${selected.y}`}
              stroke="#0a0a0a"
              strokeWidth="0.8"
              strokeDasharray="2 1.5"
              fill="none"
            />
          )}
        </svg>

        {/* Geo dot */}
        {geo && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: "50%", top: "50%" }}
          >
            <span className="absolute inset-0 -m-3 rounded-full bg-blue-500/20 animate-ping" />
            <span className="relative block w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
          </div>
        )}

        {/* Pins */}
        {offices.map((o) => (
          <button
            key={o.id}
            onClick={() => {
              setSelected(o);
              setRouting(false);
            }}
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${o.x}%`, top: `${o.y}%` }}
          >
            <div
              className={`relative ${
                selected.id === o.id ? "scale-110" : "scale-100"
              } transition`}
            >
              <div className="w-9 h-9 rounded-full bg-brand grid place-items-center shadow-lg ring-2 ring-surface">
                <MapPin className="h-5 w-5 text-surface" fill="currentColor" />
              </div>
              <div className="w-2 h-2 bg-brand rotate-45 mx-auto -mt-1 ring-2 ring-surface" />
            </div>
          </button>
        ))}

        {/* Search */}
        <div className="absolute top-3 left-3 right-3">
          <div className="flex items-center gap-2 h-11 px-4 rounded-2xl bg-white shadow-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Поиск ближайшего офиса"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        {/* Geo button */}
        <button
          onClick={() => setGeo(true)}
          className={`absolute right-3 bottom-3 w-12 h-12 rounded-full grid place-items-center shadow-lg transition ${
            geo ? "bg-brand text-brand-foreground" : "bg-white text-foreground"
          }`}
        >
          <Navigation className="h-5 w-5" fill={geo ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Geo accept sheet */}
      {!geo && (
        <div className="absolute left-0 right-0 bottom-0 max-w-[440px] mx-auto p-4 bg-background border-t border-border rounded-t-3xl shadow-2xl">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-2xl bg-brand grid place-items-center shrink-0">
              <Navigation className="h-5 w-5 text-brand-foreground" />
            </div>
            <div className="min-w-0">
              <div className="font-bold">Разрешить геолокацию?</div>
              <p className="text-sm text-muted-foreground mt-1">
                Чтобы показать ближайший офис и построить маршрут.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setGeo(false)}
              className="h-12 rounded-2xl bg-muted font-semibold text-sm"
            >
              Не сейчас
            </button>
            <button
              onClick={() => setGeo(true)}
              className="h-12 rounded-2xl bg-brand text-brand-foreground font-bold text-sm"
            >
              Разрешить
            </button>
          </div>
        </div>
      )}

      {/* Selected office card */}
      {geo && (
        <div className="bg-background border-t border-border p-4 rounded-t-3xl shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-3" />
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-bold text-base truncate">{selected.name}</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {selected.hours} · {selected.dist} от вас
              </div>
            </div>
            <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full bg-brand text-brand-foreground">
              Открыто
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setRouting(true)}
              className="h-12 rounded-2xl bg-brand text-brand-foreground font-bold text-sm flex items-center justify-center gap-2"
            >
              <Navigation className="h-4 w-4" />
              Маршрут
            </button>
            <button
              onClick={onDocs}
              className="h-12 rounded-2xl border-2 border-foreground font-bold text-sm flex items-center justify-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Документы
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- DOCS ---------- */
const docs = [
  { t: "Паспорт гражданина РФ", d: "Оригинал документа" },
  { t: "СНИЛС", d: "При наличии" },
  { t: "Заявление", d: "Заполняется в офисе" },
  { t: "Для иностранных граждан", d: "Паспорт + миграционная карта" },
];

function SimDocs({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-[calc(100vh-44px)]">
      <TopBar title="Документы" onBack={onBack} />
      <div className="flex-1 overflow-auto p-5 space-y-3">
        <div className="rounded-3xl bg-surface text-white p-5">
          <div className="text-sm text-white/70">Для оформления сим-карты</div>
          <div className="text-xl font-black mt-1">Возьмите с собой</div>
        </div>
        {docs.map((d) => (
          <div
            key={d.t}
            className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
          >
            <div className="w-10 h-10 rounded-xl bg-brand grid place-items-center shrink-0">
              <Check className="h-5 w-5 text-brand-foreground" />
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-sm">{d.t}</div>
              <div className="text-xs text-muted-foreground">{d.d}</div>
            </div>
          </div>
        ))}
        <div className="p-4 rounded-2xl bg-brand/20 text-sm">
          После оформления номер автоматически появится в приложении.
        </div>
      </div>
    </div>
  );
}

/* ---------- AUTH PHONE ---------- */
function AuthPhone({
  phone,
  setPhone,
  operator,
  setOperator,
  onBack,
  onNext,
}: {
  phone: string;
  setPhone: (v: string) => void;
  operator: "beeline" | "other";
  setOperator: (v: "beeline" | "other") => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const formatted = useMemo(() => formatPhone(phone), [phone]);
  const valid = phone.length === 10;

  return (
    <div className="flex flex-col h-[calc(100vh-44px)]">
      <TopBar title="Вход" onBack={onBack} />
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-2xl font-black leading-tight">
          Введите номер
          <br /> телефона
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Мы отправим одноразовый код для входа.
        </p>

        <div className="mt-8">
          <div className="flex items-center gap-3 h-16 px-4 rounded-2xl border-2 border-foreground bg-card">
            <Phone className="h-5 w-5" />
            <input
              autoFocus
              inputMode="numeric"
              placeholder="+7 (___) ___-__-__"
              value={formatted}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(-10);
                setPhone(digits);
              }}
              className="flex-1 bg-transparent outline-none font-bold text-lg tracking-wider"
            />
          </div>

          <div className="mt-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold">
              Демо: оператор номера
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOperator("beeline")}
                className={`h-12 rounded-2xl font-bold text-sm transition ${
                  operator === "beeline"
                    ? "bg-brand text-brand-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                Билайн
              </button>
              <button
                onClick={() => setOperator("other")}
                className={`h-12 rounded-2xl font-bold text-sm transition ${
                  operator === "other"
                    ? "bg-foreground text-background"
                    : "bg-muted text-foreground"
                }`}
              >
                Другой оператор
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <button
          disabled={!valid}
          onClick={onNext}
          className="w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold text-base active:scale-[0.98] transition disabled:opacity-40"
        >
          Получить смс-код
        </button>
        <p className="text-[11px] text-muted-foreground text-center mt-3">
          Нажимая кнопку, вы соглашаетесь с условиями использования.
        </p>
      </div>
    </div>
  );
}

function formatPhone(d: string) {
  if (!d) return "";
  const p = ["+7"];
  if (d.length > 0) p.push(" (" + d.slice(0, 3));
  if (d.length >= 3) p.push(") " + d.slice(3, 6));
  if (d.length >= 6) p.push("-" + d.slice(6, 8));
  if (d.length >= 8) p.push("-" + d.slice(8, 10));
  return p.join("");
}

/* ---------- AUTH OTP ---------- */
function AuthOtp({
  phone,
  otp,
  setOtp,
  onBack,
  onLogin,
}: {
  phone: string;
  otp: string;
  setOtp: (v: string) => void;
  onBack: () => void;
  onLogin: () => void;
}) {
  const digits = otp.padEnd(4, " ").split("");
  return (
    <div className="flex flex-col h-[calc(100vh-44px)]">
      <TopBar title="Подтверждение" onBack={onBack} />
      <div className="flex-1 overflow-auto p-6">
        <h2 className="text-2xl font-black leading-tight">Введите код из СМС</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Отправили на {formatPhone(phone)}
        </p>

        <div className="mt-10 grid grid-cols-4 gap-3">
          {digits.map((d, i) => (
            <div
              key={i}
              className={`h-16 rounded-2xl border-2 grid place-items-center text-2xl font-black ${
                i === otp.length
                  ? "border-foreground bg-brand/10"
                  : "border-border bg-card"
              }`}
            >
              {d.trim()}
            </div>
          ))}
        </div>

        <input
          autoFocus
          inputMode="numeric"
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="opacity-0 absolute pointer-events-none"
        />

        <div className="mt-8 grid grid-cols-3 gap-2">
          {["1","2","3","4","5","6","7","8","9","","0","⌫"].map((k, i) => (
            <button
              key={i}
              onClick={() => {
                if (k === "⌫") setOtp(otp.slice(0, -1));
                else if (k && otp.length < 4) setOtp(otp + k);
              }}
              disabled={!k}
              className="h-14 rounded-2xl bg-muted font-bold text-xl active:bg-brand active:text-brand-foreground transition disabled:bg-transparent"
            >
              {k}
            </button>
          ))}
        </div>

        <button className="mt-4 text-sm text-muted-foreground w-full text-center">
          Отправить код повторно через 0:42
        </button>
      </div>
      <div className="p-6">
        <button
          disabled={otp.length !== 4}
          onClick={onLogin}
          className="w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold text-base disabled:opacity-40"
        >
          Войти
        </button>
      </div>
    </div>
  );
}

/* ---------- HOME (BEELINE) ---------- */
function HomeBeeline({ phone, onLogout }: { phone: string; onLogout: () => void }) {
  return (
    <div className="flex flex-col h-[calc(100vh-44px)] bg-background">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <Logo />
        <button
          onClick={onLogout}
          className="text-xs font-semibold text-muted-foreground px-3 py-2 rounded-full hover:bg-muted"
        >
          Выйти
        </button>
      </div>
      <div className="px-5 pb-2">
        <h1 className="text-xl font-bold">Добро пожаловать, Абонент</h1>
      </div>

      <div className="px-5 pt-2 overflow-auto flex-1 pb-8">
        {/* Balance card */}
        <div className="relative rounded-3xl bg-surface text-white p-6 overflow-hidden">
          <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-brand/90" />
          <div className="absolute -right-6 top-20 w-24 h-24 rounded-full bg-brand/30" />
          <div className="relative">
            <div className="text-xs uppercase tracking-widest text-white/60">Ваш номер</div>
            <div className="text-2xl font-black tracking-wide mt-1">{formatPhone(phone)}</div>
            <div className="mt-6 text-xs uppercase tracking-widest text-white/60">Баланс</div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-5xl font-black">847</span>
              <span className="text-xl font-bold">,50 ₽</span>
            </div>
          </div>
        </div>


        <div className="mt-6 p-4 rounded-2xl bg-brand/20 text-sm">
          В этой версии приложения доступен просмотр номера и баланса. Управление тарифом
          появится в следующих обновлениях.
        </div>
      </div>
    </div>
  );
}

/* ---------- HOME (OTHER OPERATOR) ---------- */
function HomeOther({
  phone,
  onLogout,
  onOrder,
  showPopup,
  setShowPopup,
}: {
  phone: string;
  onLogout: () => void;
  onOrder: () => void;
  showPopup: boolean;
  setShowPopup: (v: boolean) => void;
}) {
  return (
    <div className="relative flex flex-col h-[calc(100vh-44px)]">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <Logo />
        <button
          onClick={onLogout}
          className="text-xs font-semibold text-muted-foreground px-3 py-2 rounded-full hover:bg-muted"
        >
          Выйти
        </button>
      </div>

      <div className="px-5 overflow-auto flex-1 pb-8 opacity-60 pointer-events-none">
        <div className="relative rounded-3xl bg-surface text-white p-6 overflow-hidden">
          <div className="text-xs uppercase tracking-widest text-white/60">Ваш номер</div>
          <div className="text-2xl font-black tracking-wide mt-1">{formatPhone(phone)}</div>
          <div className="mt-6 text-xs uppercase tracking-widest text-white/60">Баланс</div>
          <div className="text-5xl font-black mt-1">—</div>
        </div>
      </div>

      {showPopup && (
        <div className="absolute inset-0 bg-black/50 z-20 flex items-end">
          <div className="w-full bg-background rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-brand grid place-items-center">
                <Sparkles className="h-6 w-6 text-brand-foreground" />
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="w-9 h-9 rounded-full bg-muted grid place-items-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <h3 className="mt-5 text-2xl font-black leading-tight">
              Для полного доступа нужен номер Билайн
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Сервис «Восток связь» работает только с сим-картами Билайн. Закажите карту —
              это займёт пару минут.
            </p>
            <ul className="mt-4 space-y-2">
              {["Выгодные тарифы", "Бесплатная доставка в офис", "Сохраним ваш номер"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2 text-sm">
                    <div className="w-5 h-5 rounded-full bg-brand grid place-items-center">
                      <Check className="h-3 w-3 text-brand-foreground" />
                    </div>
                    {t}
                  </li>
                ),
              )}
            </ul>
            <button
              onClick={onOrder}
              className="mt-6 w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold text-base"
            >
              Заказать сим-карту
            </button>
            <button
              onClick={() => setShowPopup(false)}
              className="mt-2 w-full h-12 rounded-2xl font-semibold text-sm text-muted-foreground"
            >
              Позже
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
