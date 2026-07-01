import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
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
  Plus,
  CreditCard,
  Grid3x3,
  Wifi,
  Globe,
  User,
  Settings,
  Layers,
  PieChart,
  Mail,
  Smartphone,
  ScanFace,
  Download,
  LogIn,
  Sliders,
  Building2,
  Wrench,
  Lock,
  Delete,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "aloQa — мобильное приложение" },
      { name: "description", content: "CJM прототип мобильного приложения aloQa" },
    ],
  }),
  component: App,
});

type Screen =
  | "splash"
  | "welcome"
  
  | "sim-notice"
  | "sim-map"
  | "sim-docs"
  | "home";

type Lang = "ru" | "tg" | "ky" | "uz";
type Tab = "svyaz" | "bank" | "uslugi";

const LANGS: { code: Lang; label: string; hello: string; native: string; flag: React.ReactNode }[] = [
  {
    code: "ru",
    label: "Русский",
    hello: "Добро пожаловать",
    native: "Русский",
    flag: (
      <svg viewBox="0 0 36 24" className="w-8 h-5 rounded shadow-sm">
        <rect width="36" height="8" fill="#FFFFFF" />
        <rect y="8" width="36" height="8" fill="#0039A6" />
        <rect y="16" width="36" height="8" fill="#D52B1E" />
      </svg>
    ),
  },
  {
    code: "tg",
    label: "Тоҷикӣ",
    hello: "Хуш омадед",
    native: "Тоҷикӣ",
    flag: (
      <svg viewBox="0 0 36 24" className="w-8 h-5 rounded shadow-sm">
        <rect width="36" height="7" fill="#CC0000" />
        <rect y="7" width="36" height="10" fill="#FFFFFF" />
        <rect y="17" width="36" height="7" fill="#006600" />
        <g transform="translate(18,12)" fill="#FFD700">
          <path d="M0,-5 L1.2,-1.5 L4.5,-1.5 L1.8,0.8 L2.8,4 L0,2 L-2.8,4 L-1.8,0.8 L-4.5,-1.5 L-1.2,-1.5 Z" />
          <circle cx="0" cy="-7" r="0.8" />
          <circle cx="-4.5" cy="-4.5" r="0.8" />
          <circle cx="4.5" cy="-4.5" r="0.8" />
          <circle cx="-5.5" cy="1" r="0.8" />
          <circle cx="5.5" cy="1" r="0.8" />
          <circle cx="-3" cy="5.5" r="0.8" />
          <circle cx="3" cy="5.5" r="0.8" />
        </g>
      </svg>
    ),
  },
  {
    code: "ky",
    label: "Кыргызча",
    hello: "Кош келиңиз",
    native: "Кыргызча",
    flag: (
      <svg viewBox="0 0 36 24" className="w-8 h-5 rounded shadow-sm">
        <rect width="36" height="24" fill="#E4002B" />
        <g transform="translate(18,12)" fill="#FFED00">
          <circle r="5" />
          <g stroke="#FFED00" strokeWidth="1.2">
            <path d="M0,-11 L0,-7 M0,7 L0,11 M-11,0 L-7,0 M7,0 L11,0 M-7.8,-7.8 L-5,-5 M5,5 L7.8,7.8 M-7.8,7.8 L-5,5 M5,-5 L7.8,-7.8" />
          </g>
        </g>
      </svg>
    ),
  },
  {
    code: "uz",
    label: "O‘zbekcha",
    hello: "Xush kelibsiz",
    native: "O‘zbekcha",
    flag: (
      <svg viewBox="0 0 36 24" className="w-8 h-5 rounded shadow-sm">
        <rect width="36" height="8" fill="#1EB53A" />
        <rect y="8" width="36" height="8" fill="#FFFFFF" />
        <rect y="16" width="36" height="8" fill="#0099B5" />
        <rect y="7.75" width="36" height="0.5" fill="#DC143C" />
        <rect y="15.75" width="36" height="0.5" fill="#DC143C" />
        <g transform="translate(8,12)">
          <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
          <circle cx="1.5" cy="0" r="3.5" fill="#0099B5" />
          <g fill="#FFFFFF">
            <circle cx="12" cy="-3" r="0.6" />
            <circle cx="16" cy="-1" r="0.6" />
            <circle cx="18" cy="2" r="0.6" />
            <circle cx="16" cy="5" r="0.6" />
            <circle cx="12" cy="7" r="0.6" />
          </g>
        </g>
      </svg>
    ),
  },
];

const BEELINE_PREFIXES = ["903","905","906","909","951","953","960","961","963","964","965","966","967","968"];
function detectOperator(phone: string): "beeline" | "mts" | "megafon" | "tele2" | "other" {
  const p = phone.slice(0, 3);
  if (BEELINE_PREFIXES.includes(p)) return "beeline";
  if (["910","915","916","917","919"].includes(p)) return "mts";
  if (["920","921","925","926","927","929"].includes(p)) return "megafon";
  if (["900","901","902","904","908","950","952","958"].includes(p)) return "tele2";
  return "other";
}
function operatorLabel(op: ReturnType<typeof detectOperator>) {
  return { beeline: "Билайн", mts: "МТС", megafon: "МегаФон", tele2: "Tele2", other: "Другой оператор" }[op];
}

function App() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [lang, setLang] = useState<Lang>("ru");
  const [showLangPopup, setShowLangPopup] = useState(false);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [tab, setTab] = useState<Tab>("svyaz");
  // bound numbers: primary (currently shown) + additional
  const [primary, setPrimary] = useState<string>("");
  const [additional, setAdditional] = useState<string[]>([]);
  const [showAdNotice, setShowAdNotice] = useState(false);
  const [bindMode, setBindMode] = useState(false);
  const [devMsg, setDevMsg] = useState<string | null>(null);
  // bank auth: 'login' = first-time data entry, 'passcode' = subsequent, 'in' = unlocked
  const [bankAuth, setBankAuth] = useState<"login" | "passcode" | "in">("login");

  const operator = useMemo(() => detectOperator(primary || phone), [primary, phone]);
  const showDev = (m = "Раздел в разработке") => setDevMsg(m);

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

        {screen === "splash" && (
          <Splash
            lang={lang}
            setLang={setLang}
            showLangPopup={showLangPopup}
            setShowLangPopup={setShowLangPopup}
            onContinue={() => setScreen("welcome")}
          />
        )}

        {screen === "welcome" && (
          <Welcome
            phone={phone}
            setPhone={setPhone}
            otp={otp}
            setOtp={setOtp}
            onOrder={() => setScreen("sim-notice")}
            onLogin={() => {
              setPrimary(phone);
              setScreen("home");
              setTab("svyaz");
              const op = detectOperator(phone);
              if (op !== "beeline") setShowAdNotice(true);
              setOtp("");
            }}
          />
        )}

        {screen === "sim-notice" && (
          <SimNotice
            onBack={() => setScreen(primary ? "home" : "welcome")}
            onToMap={() => setScreen("sim-map")}
          />
        )}

        {screen === "sim-map" && (
          <SimMap
            onBack={() => setScreen("sim-notice")}
            onDocs={() => setScreen("sim-docs")}
          />
        )}

        {screen === "sim-docs" && (
          <SimDocs onBack={() => setScreen("sim-map")} />
        )}

        {screen === "home" && (
          <Home
            primary={primary}
            additional={additional}
            operator={operator}
            tab={tab}
            setTab={setTab}
            onLogout={() => {
              setPrimary("");
              setAdditional([]);
              setPhone("");
              setOtp("");
              setBankAuth("login");
              setScreen("welcome");
            }}
            showAdNotice={showAdNotice && operator !== "beeline"}
            dismissAd={() => setShowAdNotice(false)}
            onOrderSim={() => {
              setShowAdNotice(false);
              setScreen("sim-notice");
            }}
            bindMode={bindMode}
            openBind={() => setBindMode(true)}
            closeBind={() => setBindMode(false)}
            onBindNumber={(newPhone) => {
              setAdditional((a) => [primary, ...a]);
              setPrimary(newPhone);
              setBindMode(false);
              const op = detectOperator(newPhone);
              setShowAdNotice(op !== "beeline");
            }}
            showDev={showDev}
            bankAuth={bankAuth}
            setBankAuth={setBankAuth}
          />
        )}

        {devMsg && <DevToast text={devMsg} onClose={() => setDevMsg(null)} />}
      </div>
    </div>
  );
}

function DevToast({ text, onClose }: { text: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="absolute inset-x-0 bottom-24 z-50 flex justify-center px-6 pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-foreground text-background shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
        <div className="w-8 h-8 rounded-xl bg-brand grid place-items-center shrink-0">
          <Wrench className="h-4 w-4 text-brand-foreground" />
        </div>
        <div className="text-sm font-bold">{text}</div>
      </div>
    </div>
  );
}

/* ---------- SPLASH ---------- */
function Splash({
  lang,
  setLang,
  showLangPopup,
  setShowLangPopup,
  onContinue,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  showLangPopup: boolean;
  setShowLangPopup: (v: boolean) => void;
  onContinue: () => void;
}) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (showLangPopup) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % LANGS.length), 1800);
    return () => clearInterval(t);
  }, [showLangPopup]);

  const active = LANGS.find((l) => l.code === lang) ?? LANGS[0];

  return (
    <div className={`relative flex flex-col h-[calc(100vh-44px)] ${showLangPopup ? "" : ""}`}>
      <div className={`flex-1 flex flex-col items-center justify-center px-6 transition ${showLangPopup ? "blur-md scale-[0.98]" : ""}`}>
        <AloqaLogo className="w-20 h-20 rounded-3xl shadow-xl mb-8" />
        <div className="text-sm font-black tracking-tight text-muted-foreground mb-3">
          aloQa
        </div>
        <div className="h-32 flex flex-col items-center justify-center">
          {showLangPopup ? (
            <>
              {LANGS.map((l) => (
                <div key={l.code} className="text-2xl font-black text-center leading-tight">
                  {l.hello}
                </div>
              ))}
            </>
          ) : (
            <div key={idx} className="text-4xl font-black text-center leading-tight animate-in fade-in slide-in-from-bottom-2 duration-500">
              {LANGS[idx].hello}
            </div>
          )}
        </div>
        {!showLangPopup && (
          <>
            <div className="mt-6 text-sm text-muted-foreground">
              Язык: <span className="font-semibold text-foreground">{active.native}</span>
              <button onClick={() => setShowLangPopup(true)} className="ml-2 underline">
                сменить
              </button>
            </div>
            <button
              onClick={() => setShowLangPopup(true)}
              className="mt-10 h-14 px-10 rounded-2xl bg-brand text-brand-foreground font-bold text-base flex items-center gap-2"
            >
              Продолжить
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {showLangPopup && (
        <div className="absolute inset-0 z-30 flex items-end bg-black/30 backdrop-blur-sm">
          <div className="w-full bg-background rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300">
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-brand grid place-items-center">
                <Globe className="h-5 w-5 text-brand-foreground" />
              </div>
              <div>
                <div className="font-black text-lg leading-tight">Выберите язык</div>
                <div className="text-xs text-muted-foreground">Забан · Тил · Til · Язык</div>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition ${
                    lang === l.code
                      ? "border-foreground bg-brand/10"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-3 text-left">
                    <span className="flex items-center justify-center" aria-hidden>{l.flag}</span>
                    <div>
                      <div className="font-bold">{l.native}</div>
                      <div className="text-xs text-muted-foreground">{l.hello}</div>
                    </div>
                  </div>
                  {lang === l.code && (
                    <div className="w-6 h-6 rounded-full bg-brand grid place-items-center">
                      <Check className="h-3.5 w-3.5 text-brand-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setShowLangPopup(false); onContinue(); }}
              className="mt-5 w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold"
            >
              Продолжить
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- WELCOME ---------- */
const slides = [
  {
    title: "aloQa — связь, которая ведёт к цели",
    text: "Управляйте номером и балансом в одном приложении.",
    icon: Sparkles,
  },
  {
    title: "Выгодные тарифы рядом",
    text: "Звонки, интернет и роуминг без переплат.",
    icon: Wallet,
  },
  {
    title: "Поддержка 24/7",
    text: "Чат, звонок и ближайший офис — всегда под рукой.",
    icon: ShieldCheck,
  },
];

function Welcome({
  phone,
  setPhone,
  otp,
  setOtp,
  onOrder,
  onLogin,
}: {
  phone: string;
  setPhone: (v: string) => void;
  otp: string;
  setOtp: (v: string) => void;
  onOrder: () => void;
  onLogin: () => void;
}) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, []);
  const S = slides[i].icon;
  const formatted = useMemo(() => formatPhoneInput(phone), [phone]);
  const valid = phone.length === 10;

  return (
    <div className="flex flex-col h-[calc(100vh-44px)] overflow-auto">
      <div className="px-6 pt-4 flex items-center justify-between">
        <Logo />
      </div>

      <div className="px-6 pt-5">
        <div className="rounded-3xl bg-surface text-white p-6 h-[300px] flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-56 h-56 rounded-full bg-brand/90" />
          <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-brand/20" />
          <div className="relative">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-brand text-brand-foreground mb-4">
              <S className="h-5 w-5" />
            </div>
            <h2 key={i} className="text-2xl font-black leading-tight tracking-tight animate-in fade-in duration-500">
              {slides[i].title}
            </h2>
            <p className="mt-2 text-white/80 text-[14px] leading-relaxed">{slides[i].text}</p>
          </div>
          <div className="relative flex items-center justify-between">
            <div className="flex gap-1.5">
              {slides.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === i ? "w-6 bg-brand" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] uppercase tracking-widest text-white/50">авто</span>
          </div>
        </div>
      </div>

      {/* Auth form */}
      <div className="px-6 mt-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-bold">
          Войти по номеру телефона
        </div>
        <div className="flex items-center gap-3 h-14 px-4 rounded-2xl border-2 border-foreground bg-card">
          <Phone className="h-5 w-5" />
          <span className="font-bold text-base tracking-wider">+7</span>
          <input
            inputMode="numeric"
            placeholder="(___) ___-__-__"
            value={formatted}
            readOnly={step === "otp"}
            onChange={(e) => {
              setPhone(normalizePhoneDigits(e.target.value));
            }}
            className="flex-1 bg-transparent outline-none font-bold text-base tracking-wider"
          />
        </div>
        {valid && step === "phone" && (
          <div className="mt-2 text-[11px] text-muted-foreground">
            Оператор определяется автоматически через ЦНИИС:&nbsp;
            <span className="font-bold text-foreground">{operatorLabel(detectOperator(phone))}</span>
          </div>
        )}
        <button
          type="button"
          onClick={() => setPhone("9035551234")}
          className="mt-3 w-full text-[12px] font-bold text-brand underline underline-offset-4"
        >
          Демо: войти как абонент Билайн
        </button>

        {step === "otp" && (
          <div className="mt-4">
            <div className="text-sm text-muted-foreground mb-2">
              Код отправлен на <span className="font-black text-foreground">{formatPhone(phone)}</span>
            </div>
            <div className="flex items-center gap-3 h-14 px-4 rounded-2xl border-2 border-foreground bg-card">
              <ShieldCheck className="h-5 w-5" />
              <input
                inputMode="numeric"
                placeholder="Смс-код"
                maxLength={4}
                value={otp}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                  setOtp(val);
                }}
                className="flex-1 bg-transparent outline-none font-bold text-base tracking-wider"
              />
            </div>
            <button
              onClick={() => { setOtp(""); setStep("phone"); }}
              className="mt-2 text-[12px] font-bold text-brand"
            >
              Изменить номер
            </button>
          </div>
        )}
      </div>

      <div className="p-6 pt-4 space-y-3 mt-auto">
        {step === "phone" ? (
          <button
            disabled={!valid}
            onClick={() => { setOtp(""); setStep("otp"); }}
            className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-base active:scale-[0.98] transition disabled:opacity-40"
          >
            Получить смс-код
          </button>
        ) : (
          <button
            disabled={otp.length !== 4}
            onClick={onLogin}
            className="w-full h-14 rounded-2xl bg-foreground text-background font-bold text-base active:scale-[0.98] transition disabled:opacity-40"
          >
            Войти
          </button>
        )}
        <button
          onClick={onOrder}
          className="w-full h-14 rounded-2xl border-2 border-foreground bg-background text-foreground font-bold text-base flex items-center justify-center gap-2 active:scale-[0.98] transition"
        >
          Заказать сим-карту
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

function AloqaLogo({ className }: { className?: string }) {
  return (
    <div className={cn("bg-brand grid place-items-center overflow-hidden", className)}>
      <svg viewBox="0 0 48 48" className="w-[62%] h-[62%]">
        <g fill="none" stroke="white" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
          {/* compass star */}
          <path d="M24 5 L24 13 M24 35 L24 43 M5 24 L13 24 M35 24 L43 24" />
          {/* Q body / compass ring */}
          <path d="M32 28 C28 34 18 34 16 26 C14 18 22 12 30 16 C33 18 34 22 32 26" />
          {/* Q tail */}
          <path d="M28 28 L37 39" />
        </g>
      </svg>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <AloqaLogo className="w-9 h-9 rounded-xl" />
      <div className="leading-tight">
        <div className="text-[15px] font-black tracking-tight">aloQa</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
          связь с целью
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

/* ---------- SIM NOTICE (Beeline /dobro/notice/ flow) ---------- */
const noticeDocs = [
  {
    icon: FileText,
    t: "Оригинал паспорта",
    d: "И заверенный перевод паспорта — его можно получить в бюро переводов.",
  },
  {
    icon: CreditCard,
    t: "СНИЛС",
    d: "Оформи в МФЦ, Социальном фонде России или у работодателя. Понадобится паспорт и нотариально заверенный перевод.",
  },
  {
    icon: Mail,
    t: "Адрес электронной почты",
    d: "Создай его заранее — пригодится для регистрации на госуслугах.",
  },
  {
    icon: ShieldCheck,
    t: "Учётная запись на Госуслугах",
    d: "Создай и подтверди её в МФЦ.",
  },
  {
    icon: ScanFace,
    t: "Биометрические данные",
    d: "Голос и лицо — сдай в любом банке, который участвует в ЕБС.",
  },
];

const appSteps = [
  { icon: Smartphone, t: "Установи сим в смартфон" },
  { icon: Download, t: "Установи приложение «aloQa»" },
  { icon: LogIn, t: "Нажми «Войти»" },
  { icon: Phone, t: "Зайди по номеру, который дали в офисе" },
  { icon: Sliders, t: "Управляй сим в приложении" },
];

function SimNotice({ onBack, onToMap }: { onBack: () => void; onToMap: () => void }) {
  return (
    <div className="flex flex-col h-[calc(100vh-44px)]">
      <TopBar title="Заказ сим-карты" onBack={onBack} />
      <div className="flex-1 overflow-auto">
        {/* Hero */}
        <div className="relative rounded-b-3xl bg-surface text-white p-6 overflow-hidden">
          <div className="absolute -right-12 -top-12 w-44 h-44 rounded-full bg-brand/90" />
          <div className="absolute -left-16 -bottom-20 w-44 h-44 rounded-full bg-brand/20" />
          <div className="relative">
            <div className="text-[11px] uppercase tracking-widest text-white/60">
              Памятка для иностранных граждан
            </div>
            <div className="text-2xl font-black mt-2 leading-tight">
              Как оформить
              <br />сим-карту
            </div>
            <p className="mt-3 text-white/80 text-sm leading-relaxed">
              Пошаговая инструкция — от подготовки документов до настройки приложения.
            </p>
          </div>
        </div>

        {/* Step 1 */}
        <div className="px-5 pt-6">
          <StepHeader n="1" title="Подготовь документы" subtitle="Если чего-то не хватает — обратись в МФЦ" />
          <div className="mt-4 space-y-2.5">
            {noticeDocs.map((d) => {
              const Icon = d.icon;
              return (
                <div
                  key={d.t}
                  className="flex gap-3 p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="w-11 h-11 rounded-2xl bg-brand text-brand-foreground grid place-items-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm leading-tight">{d.t}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {d.d}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 2 */}
        <div className="px-5 pt-6 pb-6">
          <StepHeader
            n="2"
            title="Приходи в офис Билайн"
            subtitle="С готовыми документами и смартфоном"
          />
          <div className="mt-4 space-y-2">
            {offices.map((o) => (
              <div
                key={o.id}
                className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
              >
                <div className="w-11 h-11 rounded-2xl bg-brand text-brand-foreground grid place-items-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm leading-tight">{o.name}</div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {o.hours} · {o.dist}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step 3 */}
        <div className="px-5 pb-6">
          <StepHeader
            n="3"
            title="Настрой сим и управляй тарифом"
            subtitle="Через приложение «aloQa»"
          />
          <div className="mt-4 space-y-2.5">
            {appSteps.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.t}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
                >
                  <div className="w-11 h-11 rounded-2xl bg-brand text-brand-foreground grid place-items-center shrink-0">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 font-bold text-sm leading-tight">{s.t}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="p-5 border-t border-border bg-background">
        <button
          onClick={onBack}
          className="w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold text-base flex items-center justify-center gap-2"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}

function StepHeader({ n, title, subtitle }: { n: string; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-2xl bg-foreground text-background grid place-items-center font-black shrink-0">
        {n}
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-bold">
          Шаг {n}
        </div>
        <div className="font-black text-lg leading-tight mt-0.5">{title}</div>
        <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
      </div>
    </div>
  );
}

/* ---------- SIM MAP ---------- */
const offices = [
  { id: 1, name: "Билайн — Ленина 24", dist: "320 м", hours: "09:00 – 21:00", x: 38, y: 42 },
  { id: 2, name: "Билайн — ТЦ Восток", dist: "1.2 км", hours: "10:00 – 22:00", x: 65, y: 30 },
  { id: 3, name: "Билайн — Гагарина 7", dist: "2.4 км", hours: "09:00 – 20:00", x: 22, y: 70 },
  { id: 4, name: "Билайн — Мира 101", dist: "3.1 км", hours: "10:00 – 21:00", x: 78, y: 65 },
];

function SimMap({ onBack, onDocs }: { onBack: () => void; onDocs: () => void }) {
  const [geo, setGeo] = useState(false);
  const [selected, setSelected] = useState(offices[0]);
  const [routing, setRouting] = useState(false);

  return (
    <div className="flex flex-col h-[calc(100vh-44px)]">
      <TopBar title="Офисы Билайн" onBack={onBack} />

      <div className="relative flex-1 bg-[#e6eef3] overflow-hidden">
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

        {geo && (
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: "50%", top: "50%" }}
          >
            <span className="absolute inset-0 -m-3 rounded-full bg-blue-500/20 animate-ping" />
            <span className="relative block w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow" />
          </div>
        )}

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
            <div className={`relative ${selected.id === o.id ? "scale-110" : "scale-100"} transition`}>
              <div className="w-9 h-9 rounded-full bg-brand grid place-items-center shadow-lg ring-2 ring-surface">
                <MapPin className="h-5 w-5 text-surface" fill="currentColor" />
              </div>
              <div className="w-2 h-2 bg-brand rotate-45 mx-auto -mt-1 ring-2 ring-surface" />
            </div>
          </button>
        ))}

        <div className="absolute top-3 left-3 right-3">
          <div className="flex items-center gap-2 h-11 px-4 rounded-2xl bg-white shadow-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              placeholder="Поиск ближайшего офиса"
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <button
          onClick={() => setGeo(true)}
          className={`absolute right-3 bottom-3 w-12 h-12 rounded-full grid place-items-center shadow-lg transition ${
            geo ? "bg-brand text-brand-foreground" : "bg-white text-foreground"
          }`}
        >
          <Navigation className="h-5 w-5" fill={geo ? "currentColor" : "none"} />
        </button>
      </div>

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
          <div key={d.t} className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
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


function formatPhone(d: string) {
  if (!d) return "";
  const p = ["+7"];
  if (d.length > 0) p.push(" (" + d.slice(0, 3));
  if (d.length >= 3) p.push(") " + d.slice(3, 6));
  if (d.length >= 6) p.push("-" + d.slice(6, 8));
  if (d.length >= 8) p.push("-" + d.slice(8, 10));
  return p.join("");
}

function formatPhoneInput(d: string) {
  if (!d) return "";
  const p = ["(" + d.slice(0, 3)];
  if (d.length >= 3) p.push(") " + d.slice(3, 6));
  if (d.length >= 6) p.push("-" + d.slice(6, 8));
  if (d.length >= 8) p.push("-" + d.slice(8, 10));
  return p.join("");
}

function normalizePhoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.length > 10 && (digits[0] === "7" || digits[0] === "8")) {
    digits = digits.slice(1);
  }
  return digits.slice(0, 10);
}

/* ---------- HOME (with bottom nav) ---------- */
function Home({
  primary,
  additional,
  operator,
  tab,
  setTab,
  onLogout,
  showAdNotice,
  dismissAd,
  onOrderSim,
  bindMode,
  openBind,
  closeBind,
  onBindNumber,
  showDev,
  bankAuth,
  setBankAuth,
}: {
  primary: string;
  additional: string[];
  operator: ReturnType<typeof detectOperator>;
  tab: Tab;
  setTab: (t: Tab) => void;
  onLogout: () => void;
  showAdNotice: boolean;
  dismissAd: () => void;
  onOrderSim: () => void;
  bindMode: boolean;
  openBind: () => void;
  closeBind: () => void;
  onBindNumber: (p: string) => void;
  showDev: (m?: string) => void;
  bankAuth: "login" | "passcode" | "in";
  setBankAuth: (s: "login" | "passcode" | "in") => void;
}) {
  return (
    <div className="relative flex flex-col h-[calc(100vh-44px)] bg-background">
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <Logo />
        <button
          onClick={onLogout}
          className="text-xs font-semibold text-muted-foreground px-3 py-2 rounded-full hover:bg-muted"
        >
          Выйти
        </button>
      </div>

      <div className="flex-1 overflow-auto pb-24">
        {tab === "svyaz" && (
          <TabSvyaz
            primary={primary}
            additional={additional}
            operator={operator}
            showAdNotice={showAdNotice}
            dismissAd={dismissAd}
            onOrderSim={onOrderSim}
            openBind={openBind}
            showDev={showDev}
          />
        )}
        {tab === "bank" && (
          <TabBank
            auth={bankAuth}
            setAuth={setBankAuth}
            onLock={() => setBankAuth("passcode")}
          />
        )}
        {tab === "uslugi" && <TabUslugi />}
      </div>

      {/* Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 bg-background border-t border-border">
        <div className="grid grid-cols-3 px-2 py-2 pb-3">
          <NavBtn icon={Wifi} label="Связь" active={tab === "svyaz"} onClick={() => setTab("svyaz")} />
          <NavBtn icon={CreditCard} label="Банк" active={tab === "bank"} onClick={() => setTab("bank")} />
          <NavBtn icon={Grid3x3} label="Услуги" active={tab === "uslugi"} onClick={() => setTab("uslugi")} />
        </div>
      </div>

      {bindMode && <BindNumberSheet onClose={closeBind} onBind={onBindNumber} />}
    </div>
  );
}

function NavBtn({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Wifi;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 rounded-2xl transition ${
        active ? "bg-brand/15" : ""
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? "text-foreground" : "text-muted-foreground"}`} />
      <span className={`text-[11px] font-bold ${active ? "text-foreground" : "text-muted-foreground"}`}>
        {label}
      </span>
    </button>
  );
}

function TabSvyaz({
  primary,
  additional,
  operator,
  showAdNotice,
  dismissAd,
  onOrderSim,
  openBind,
  showDev,
}: {
  primary: string;
  additional: string[];
  operator: ReturnType<typeof detectOperator>;
  showAdNotice: boolean;
  dismissAd: () => void;
  onOrderSim: () => void;
  openBind: () => void;
  showDev: (m?: string) => void;
}) {
  const isBeeline = operator === "beeline";
  return (
    <div className="px-5 pt-2 space-y-4">
      {/* User header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border">
        <div className="w-12 h-12 rounded-full bg-muted grid place-items-center shrink-0">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="min-w-0">
          <div className="font-black text-base tracking-tight">{formatPhone(primary)}</div>
          <div className="text-xs text-muted-foreground">Алина Петрова</div>
        </div>
      </div>

      {isBeeline ? (
        <>
          {/* Balance card */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-3xl font-black tracking-tight">2 250 ₽</div>
                <div className="text-xs text-muted-foreground mt-1">на балансе</div>
              </div>
              <button
                onClick={() => showDev("Пополнение — раздел в разработке")}
                className="h-11 px-5 rounded-full bg-brand text-brand-foreground font-bold text-sm shrink-0 active:scale-[0.98] transition"
              >
                Пополнить
              </button>
            </div>
          </div>

          {/* Tariff */}
          <div className="flex items-center gap-2 px-1">
            <h2 className="text-base font-black">Тариф</h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand text-brand-foreground">
              твой тариф
            </span>
          </div>
          <div className="relative">
            <div className="grid grid-cols-2 gap-3 blur-md select-none pointer-events-none">
              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="text-2xl font-black">25<span className="text-muted-foreground">/35</span></div>
                <div className="text-xs text-muted-foreground mt-1">Гигабайты</div>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border">
                <div className="text-2xl font-black">200<span className="text-muted-foreground">/250</span></div>
                <div className="text-xs text-muted-foreground mt-1">Минуты</div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-foreground/90 text-background text-xs font-bold shadow-lg">
                <Wrench className="h-3.5 w-3.5" />
                Раздел в разработке
              </div>
            </div>
          </div>

          {/* Round actions */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            {[
              { icon: Settings, label: "Настроить\nтариф" },
              { icon: Layers, label: "Услуги\nи сервисы" },
              { icon: PieChart, label: "Мои\nрасходы" },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => showDev(`${label.replace("\n", " ")} — в разработке`)}
                className="flex flex-col items-center gap-2 active:scale-[0.97] transition"
              >
                <div className="w-14 h-14 rounded-full bg-card border border-border grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[11px] text-center text-muted-foreground leading-tight whitespace-pre-line">
                  {label}
                </span>
              </button>
            ))}
          </div>

          {/* Special offers */}
          <div className="pt-2">
            <h2 className="text-base font-black px-1 mb-2">Специальные предложения</h2>
            <div className="rounded-2xl bg-surface text-white p-5">
              <div className="font-bold text-sm leading-snug">
                Следите за вашим балансом<br />и управляйте связью
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Non-Beeline balance placeholder */}
          <div className="rounded-2xl bg-card border border-border p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-3xl font-black tracking-tight text-muted-foreground">—</div>
                <div className="text-xs text-muted-foreground mt-1">
                  баланс недоступен · {operatorLabel(operator)}
                </div>
              </div>
            </div>
          </div>

          {/* Bind new number */}
          <button
            onClick={openBind}
            className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-foreground/30 bg-card active:scale-[0.99] transition"
          >
            <div className="w-11 h-11 rounded-2xl bg-brand grid place-items-center shrink-0">
              <Plus className="h-5 w-5 text-brand-foreground" />
            </div>
            <div className="text-left min-w-0">
              <div className="font-bold text-sm">Привязать новый номер</div>
              <div className="text-xs text-muted-foreground">
                Текущий номер сохранится в профиле как дополнительный
              </div>
            </div>
          </button>

          {/* Ad notice */}
          {showAdNotice && (
            <div className="relative rounded-2xl bg-brand p-5 overflow-hidden">
              <button
                onClick={dismissAd}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-surface/10 grid place-items-center"
              >
                <X className="h-4 w-4 text-surface" />
              </button>
              <div className="w-11 h-11 rounded-2xl bg-surface text-brand grid place-items-center mb-3">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="text-surface font-black text-lg leading-tight">
                Закажите номер Билайн
              </div>
              <p className="text-surface/80 text-sm mt-1">
                Полный доступ к сервисам «aloQa» — только с сим-картой Билайн.
              </p>
              <button
                onClick={onOrderSim}
                className="mt-4 h-12 px-5 rounded-2xl bg-brand text-brand-foreground font-bold text-sm inline-flex items-center gap-2 active:scale-[0.98] transition"
              >
                Заказать сим-карту
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Additional numbers */}
      {additional.length > 0 && (
        <div className="space-y-2 pt-2">
          <div className="text-xs uppercase tracking-wider text-muted-foreground font-bold px-1">
            Дополнительные номера в профиле
          </div>
          {additional.map((p) => (
            <div
              key={p}
              className="flex items-center gap-3 p-4 rounded-2xl bg-card border border-border"
            >
              <div className="w-10 h-10 rounded-xl bg-muted grid place-items-center">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm">{formatPhone(p)}</div>
                <div className="text-[11px] text-muted-foreground">
                  {operatorLabel(detectOperator(p))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TabBank({
  auth,
  setAuth,
}: {
  auth: "login" | "passcode" | "in";
  setAuth: (s: "login" | "passcode" | "in") => void;
  onLock: () => void;
}) {
  if (auth === "login") return <BankLogin onDone={() => setAuth("in")} />;
  if (auth === "passcode") return <BankPasscode onDone={() => setAuth("in")} />;
  return <BankWebview onLock={() => setAuth("passcode")} />;
}

function TajikFlag() {
  // Round Tajikistan flag: red-white-green with gold crown+stars
  return (
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <defs>
        <clipPath id="tjc"><circle cx="20" cy="20" r="20" /></clipPath>
      </defs>
      <g clipPath="url(#tjc)">
        <rect width="40" height="14" fill="#cc0000" />
        <rect y="14" width="40" height="12" fill="#ffffff" />
        <rect y="26" width="40" height="14" fill="#006600" />
        <g fill="#f8c300">
          <path d="M14 18h12v1.5H14zM15 20h10l-1 1.5H16z" />
          <circle cx="20" cy="17" r="0.8" />
          <circle cx="17" cy="17.3" r="0.6" />
          <circle cx="23" cy="17.3" r="0.6" />
        </g>
      </g>
    </svg>
  );
}

function MirCard({ last4 = "4821" }: { last4?: string }) {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[1.586/1] shadow-lg" style={{ background: "hsl(160 100% 33%)" }}>
      <div className="absolute inset-0 opacity-90"
           style={{ background: "linear-gradient(135deg, hsl(160 100% 33%) 0%, hsl(165 100% 28%) 60%, hsl(165 100% 22%) 100%)" }} />
      {/* Flag circle */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full overflow-hidden ring-4 ring-white/10">
        <TajikFlag />
      </div>
      {/* Chip */}
      <div className="absolute left-5 top-5 w-9 h-7 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600 grid grid-cols-3 grid-rows-2 gap-[1px] p-[2px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-yellow-800/40 rounded-sm" />
        ))}
      </div>
      {/* aloQa label */}
      <div className="absolute left-16 top-5 text-white font-black text-lg leading-none tracking-tight">
        aloQa
      </div>
      {/* Number */}
      <div className="absolute left-5 bottom-10 text-white/90 font-mono text-sm tracking-widest">
        •••• •••• •••• {last4}
      </div>
      {/* МИР logo */}
      <div className="absolute right-4 bottom-4 text-white font-black italic text-xl tracking-tight">
        мир
      </div>
    </div>
  );
}

function BankWebview({ onLock }: { onLock: () => void }) {
  const history = [
    { day: "Сегодня", who: "Коргоо Маркет", cat: "Финансовые операции", sum: -1656.94, sign: "-", icon: "K", color: "#22c55e" },
    { day: "Вчера", who: "Иван Х.", cat: "Перевод от друга", sum: 3656.74, sign: "+", icon: "И", color: "#ef4444" },
    { day: "Вчера", who: "Иван Х.", cat: "Перевод от друга", sum: 3656.74, sign: "+", icon: "И", color: "#ef4444" },
    { day: "Вчера", who: "Lamoda", cat: "Покупки онлайн", sum: -3656.74, sign: "-", icon: "la", color: "#111827" },
  ];

  return (
    <div className="bg-background min-h-full">
      {/* Webview browser bar */}
      <div className="px-4 pt-3 pb-2 flex items-center justify-between bg-card border-b border-border">
        <button onClick={onLock} className="text-xs font-semibold text-muted-foreground inline-flex items-center gap-1">
          <Lock className="h-3.5 w-3.5" /> Закрыть
        </button>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 text-[10px] font-bold uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          Webview · Альфа-Банк
        </div>
        <div className="w-6" />
      </div>

      {/* Header */}
      <div className="px-5 pt-4 pb-2 flex items-center justify-between">
        <div className="w-6" />
      <div className="text-center">
          <div className="text-base font-bold">Карта aloQa</div>
          <button className="text-[11px] text-brand font-semibold mt-0.5 inline-flex items-center gap-0.5">
            Цифровая карта <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        <button onClick={onLock} className="w-8 h-8 grid place-items-center rounded-full bg-muted">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pt-3 space-y-5">
        {/* Card */}
        <MirCard />

        {/* Balance */}
        <div className="text-center">
          <div className="text-4xl font-black tracking-tight">12 480,00 ₽</div>
          <div className="text-xs text-muted-foreground mt-1">Доступно на карте</div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around">
          {[
            { icon: Plus, label: "Пополнить" },
            { icon: ArrowRight, label: "Перевести" },
            { icon: Sliders, label: "Действия" },
          ].map((a) => (
            <div key={a.label} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 rounded-full bg-card border border-border grid place-items-center shadow-sm">
                <a.icon className="h-5 w-5" />
              </div>
              <div className="text-[11px] font-semibold">{a.label}</div>
            </div>
          ))}
        </div>

        {/* Recommend block */}
        <div className="rounded-2xl bg-card border border-border p-4 flex items-center gap-3">
          <div className="flex-1">
            <div className="font-bold text-sm">Рекомендуйте карту aloQa</div>
            <div className="mt-1 grid grid-cols-2 gap-2 text-[11px]">
              <div><span className="text-muted-foreground">Вам</span> <span className="font-bold">1 200 ₽</span></div>
              <div><span className="text-muted-foreground">Другу</span> <span className="font-bold">300 ₽</span></div>
            </div>
            <button className="mt-3 h-9 px-4 rounded-full bg-foreground text-background text-xs font-bold">
              Рекомендовать
            </button>
          </div>
          <div className="w-16 h-16 rounded-xl grid place-items-center shrink-0"
               style={{ background: "linear-gradient(135deg,hsl(160 100% 33%),hsl(165 100% 22%))" }}>
            <CreditCard className="h-7 w-7 text-white" />
          </div>
        </div>

        {/* History */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-lg font-black">История</div>
            <button className="text-xs font-semibold text-muted-foreground">Все</button>
          </div>
          <div className="space-y-3">
            {history.map((h, i) => {
              const showDay = i === 0 || history[i - 1].day !== h.day;
              return (
                <React.Fragment key={i}>
                  {showDay && (
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground pt-2">{h.day}</div>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full grid place-items-center text-white font-black text-sm shrink-0"
                         style={{ background: h.color }}>
                      {h.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{h.who}</div>
                      <div className="text-[11px] text-muted-foreground truncate">{h.cat}</div>
                    </div>
                    <div className={`text-sm font-bold ${h.sign === "+" ? "text-green-600" : "text-foreground"}`}>
                      {h.sign === "+" ? "+" : "−"}{Math.abs(h.sum).toLocaleString("ru-RU", { minimumFractionDigits: 2 })} ₽
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Footer note */}
        <div className="pb-6 pt-2 text-center text-[10px] text-muted-foreground leading-relaxed">
          Банковские услуги предоставляет АО «Альфа-Банк».<br />
          Экран открыт во встроенном веб-браузере приложения.
        </div>
      </div>
    </div>
  );
}

function BankLogin({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<"data" | "create-passcode">("data");
  const [fio, setFio] = useState("");
  const [birth, setBirth] = useState("");
  const [passport, setPassport] = useState("");
  const [pin, setPin] = useState("");
  const [pin2, setPin2] = useState("");

  if (step === "data") {
    const valid = fio.trim().length > 3 && birth.length === 10 && passport.replace(/\D/g, "").length === 10;
    return (
      <div className="px-5 pt-4 pb-8 space-y-4">
        <div>
          <h1 className="text-xl font-black tracking-tight">Билайн Банк</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Первый вход. Подтвердите свои данные, чтобы открыть счёт.
          </p>
        </div>
        <div className="space-y-3">
          <BankField label="ФИО" placeholder="Иванов Иван Иванович" value={fio} onChange={setFio} />
          <BankField
            label="Дата рождения"
            placeholder="ДД.ММ.ГГГГ"
            value={birth}
            onChange={(v) => setBirth(maskDate(v))}
            inputMode="numeric"
          />
          <BankField
            label="Серия и номер паспорта"
            placeholder="0000 000000"
            value={passport}
            onChange={(v) => setPassport(maskPassport(v))}
            inputMode="numeric"
          />
        </div>
        <div className="p-3 rounded-2xl bg-brand/15 text-[11px] leading-snug text-foreground/80">
          Нажимая «Продолжить», вы соглашаетесь на обработку персональных данных и условия открытия счёта.
        </div>
        <button
          disabled={!valid}
          onClick={() => setStep("create-passcode")}
          className="w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold disabled:opacity-40 active:scale-[0.98] transition"
        >
          Продолжить
        </button>
      </div>
    );
  }

  const ok = pin.length === 4 && pin === pin2;
  return (
    <div className="px-5 pt-4 pb-8 space-y-5">
      <div>
        <h1 className="text-xl font-black tracking-tight">Придумайте код-пароль</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Код потребуется для входа в банк в следующий раз.
        </p>
      </div>
      <PinDisplay value={pin} label="Новый код" />
      <PinDisplay value={pin2} label="Повторите код" />
      <PinKeypad
        onDigit={(d) => {
          if (pin.length < 4) setPin(pin + d);
          else if (pin2.length < 4) setPin2(pin2 + d);
        }}
        onBack={() => {
          if (pin2.length > 0) setPin2(pin2.slice(0, -1));
          else setPin(pin.slice(0, -1));
        }}
      />
      <button
        disabled={!ok}
        onClick={onDone}
        className="w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold disabled:opacity-40 active:scale-[0.98] transition"
      >
        Сохранить и войти
      </button>
    </div>
  );
}

function BankPasscode({ onDone }: { onDone: () => void }) {
  const [pin, setPin] = useState("");
  const [err, setErr] = useState(false);
  useEffect(() => {
    if (pin.length === 4) {
      // demo: any 4 digits accepted
      const t = setTimeout(onDone, 250);
      return () => clearTimeout(t);
    }
    setErr(false);
  }, [pin, onDone]);
  return (
    <div className="px-5 pt-6 pb-8 space-y-6 flex flex-col items-center">
      <div className="w-16 h-16 rounded-3xl bg-brand grid place-items-center shadow-lg">
        <Lock className="h-7 w-7 text-brand-foreground" />
      </div>
      <div className="text-center">
        <h1 className="text-xl font-black tracking-tight">Введите код-пароль</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Для входа в Билайн Банк
        </p>
      </div>
      <PinDisplay value={pin} label="" error={err} />
      <PinKeypad
        onDigit={(d) => pin.length < 4 && setPin(pin + d)}
        onBack={() => setPin(pin.slice(0, -1))}
      />
      <button
        onClick={() => setPin("")}
        className="text-xs font-semibold text-muted-foreground underline"
      >
        Забыли код-пароль?
      </button>
    </div>
  );
}

function BankField({
  label,
  placeholder,
  value,
  onChange,
  inputMode,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  inputMode?: "text" | "numeric";
}) {
  return (
    <label className="block">
      <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5 px-1">
        {label}
      </div>
      <input
        inputMode={inputMode ?? "text"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 px-4 rounded-2xl border-2 border-foreground/10 bg-card font-semibold text-sm outline-none focus:border-foreground transition"
      />
    </label>
  );
}

function PinDisplay({ value, label, error }: { value: string; label: string; error?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {label && <div className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">{label}</div>}
      <div className="flex gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full border-2 transition ${
              error
                ? "border-destructive bg-destructive"
                : value.length > i
                  ? "border-foreground bg-foreground"
                  : "border-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function PinKeypad({ onDigit, onBack }: { onDigit: (d: string) => void; onBack: () => void }) {
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"];
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[280px] mx-auto">
      {keys.map((k, i) => {
        if (k === "") return <div key={i} />;
        if (k === "back")
          return (
            <button
              key={i}
              onClick={onBack}
              className="h-16 rounded-2xl bg-muted grid place-items-center active:scale-95 transition"
            >
              <Delete className="h-5 w-5" />
            </button>
          );
        return (
          <button
            key={i}
            onClick={() => onDigit(k)}
            className="h-16 rounded-2xl bg-card border border-border text-2xl font-black active:scale-95 active:bg-muted transition"
          >
            {k}
          </button>
        );
      })}
    </div>
  );
}

function maskDate(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 8);
  const p: string[] = [];
  if (d.length > 0) p.push(d.slice(0, 2));
  if (d.length >= 3) p.push(d.slice(2, 4));
  if (d.length >= 5) p.push(d.slice(4, 8));
  return p.join(".");
}
function maskPassport(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 10);
  if (d.length <= 4) return d;
  return d.slice(0, 4) + " " + d.slice(4);
}

function TabUslugi() {
  return (
    <div className="px-5 pt-4 pb-10 space-y-4 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-20 h-20 rounded-3xl bg-brand grid place-items-center shadow-lg">
        <Wrench className="h-9 w-9 text-brand-foreground" />
      </div>
      <h1 className="text-2xl font-black tracking-tight">Услуги</h1>
      <p className="text-sm text-muted-foreground max-w-[280px]">
        Раздел в разработке. Скоро здесь появятся домашний интернет, ТВ, роуминг, подписки и поддержка.
      </p>
    </div>
  );
}

function BindNumberSheet({
  onClose,
  onBind,
}: {
  onClose: () => void;
  onBind: (p: string) => void;
}) {
  const [v, setV] = useState("");
  const formatted = useMemo(() => formatPhoneInput(v), [v]);
  const valid = v.length === 10;
  const op = detectOperator(v);
  return (
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex items-end">
      <div className="w-full bg-background rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-300">
        <div className="flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-brand grid place-items-center">
            <Plus className="h-6 w-6 text-brand-foreground" />
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-muted grid place-items-center"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <h3 className="mt-5 text-2xl font-black leading-tight">Привязать новый номер</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Текущий номер останется в профиле как дополнительный.
        </p>

        <div className="mt-5 flex items-center gap-3 h-14 px-4 rounded-2xl border-2 border-foreground bg-card">
          <Phone className="h-5 w-5" />
          <span className="font-bold text-base tracking-wider">+7</span>
          <input
            autoFocus
            inputMode="numeric"
            placeholder="(___) ___-__-__"
            value={formatted}
            onChange={(e) => {
              setV(normalizePhoneDigits(e.target.value));
            }}
            className="flex-1 bg-transparent outline-none font-bold text-base tracking-wider"
          />
        </div>
        {valid && (
          <div className="mt-2 text-[11px] text-muted-foreground">
            Оператор по ЦНИИС: <span className="font-bold text-foreground">{operatorLabel(op)}</span>
          </div>
        )}

        <button
          disabled={!valid}
          onClick={() => onBind(v)}
          className="mt-5 w-full h-14 rounded-2xl bg-brand text-brand-foreground font-bold disabled:opacity-40"
        >
          Привязать номер
        </button>
      </div>
    </div>
  );
}
