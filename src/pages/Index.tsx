import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  ArrowRight,
  Users,
  Mic,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Video,
  Lock,
  Phone,
  MessageCircle,
  UserPlus,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Icon from "@/components/ui/icon";
import { apiWaitlist } from "@/lib/api";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/891548a8-eed9-4caa-9d36-eef8d7a9fb58/files/378b058f-cdc3-44fe-9124-064116bda400.jpg";

const APP_NAME = "TalkWave";
const APP_TAGLINE = "Безопасные звонки и сообщения";

const Index = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [waitlistPhone, setWaitlistPhone] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [waitlistMsg, setWaitlistMsg] = useState("");

  async function handleWaitlist() {
    if (!waitlistPhone.trim()) return;
    setWaitlistStatus("loading");
    const res = await apiWaitlist(waitlistPhone.trim());
    if (res.success) {
      setWaitlistStatus("success");
      setWaitlistMsg(res.message || "Вы в списке!");
    } else {
      setWaitlistStatus("error");
      setWaitlistMsg(res.error || "Ошибка, попробуйте ещё раз");
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1c2e] text-white overflow-x-hidden">
      {/* Навигация */}
      <nav className="bg-[#12141f] border-b border-[#2a2d3e] px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden">
              <img src={LOGO_URL} alt={APP_NAME} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">{APP_NAME}</h1>
              <p className="text-xs text-[#8b8fa8] hidden sm:block">{APP_TAGLINE}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <Button variant="ghost" className="text-[#8b8fa8] hover:text-white hover:bg-[#2a2d3e]">
              Возможности
            </Button>
            <Button variant="ghost" className="text-[#8b8fa8] hover:text-white hover:bg-[#2a2d3e]">
              Безопасность
            </Button>
            <Button
              className="bg-[#6c63ff] hover:bg-[#574fd6] text-white px-6 py-2 rounded-lg text-sm font-medium"
              onClick={() => navigate("/auth")}
            >
              Войти / Регистрация
            </Button>
          </div>
          <Button
            variant="ghost"
            className="sm:hidden text-[#8b8fa8] hover:text-white hover:bg-[#2a2d3e] p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-[#2a2d3e]">
            <div className="flex flex-col gap-3">
              <Button variant="ghost" className="text-[#8b8fa8] hover:text-white hover:bg-[#2a2d3e] justify-start">
                Возможности
              </Button>
              <Button variant="ghost" className="text-[#8b8fa8] hover:text-white hover:bg-[#2a2d3e] justify-start">
                Безопасность
              </Button>
              <Button className="bg-[#6c63ff] hover:bg-[#574fd6] text-white px-6 py-2 rounded-lg text-sm font-medium">
                Скачать бесплатно
              </Button>
            </div>
          </div>
        )}
      </nav>

      {/* Макет в стиле мессенджера */}
      <div className="flex min-h-screen">
        {/* Боковая панель — иконки разделов */}
        <div className="hidden lg:flex w-[72px] bg-[#0f1018] flex-col items-center py-3 gap-2">
          <div className="w-12 h-12 rounded-xl overflow-hidden">
            <img src={LOGO_URL} alt={APP_NAME} className="w-full h-full object-cover" />
          </div>
          <div className="w-8 h-[2px] bg-[#2a2d3e] rounded-full my-1"></div>
          {[
            { icon: "Phone", label: "Звонки" },
            { icon: "MessageCircle", label: "Чаты" },
            { icon: "Users", label: "Друзья" },
            { icon: "Shield", label: "Приватность" },
          ].map((item) => (
            <div
              key={item.label}
              title={item.label}
              className="w-12 h-12 bg-[#1a1c2e] rounded-3xl hover:rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer hover:bg-[#6c63ff] group"
            >
              <Icon name={item.icon} size={22} className="text-[#8b8fa8] group-hover:text-white" />
            </div>
          ))}
        </div>

        {/* Боковая панель разделов */}
        <div className={`${mobileSidebarOpen ? "block" : "hidden"} lg:block w-full lg:w-60 bg-[#12141f] flex flex-col`}>
          <div className="p-4 border-b border-[#2a2d3e] flex items-center justify-between">
            <h2 className="text-white font-semibold text-base">{APP_NAME}</h2>
            <Button
              variant="ghost"
              className="lg:hidden text-[#8b8fa8] hover:text-white hover:bg-[#2a2d3e] p-1"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex-1 p-2">
            <div className="mb-4">
              <div className="flex items-center gap-1 px-2 py-1 text-[#6b6f85] text-xs font-semibold uppercase tracking-wide">
                <ArrowRight className="w-3 h-3" />
                <span>Возможности</span>
              </div>
              <div className="mt-1 space-y-0.5">
                {[
                  { name: "видеозвонки", icon: "Video" },
                  { name: "аудиозвонки", icon: "Phone" },
                  { name: "сообщения", icon: "MessageCircle" },
                  { name: "шифрование", icon: "Lock" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-[#6b6f85] hover:text-[#c8cadd] hover:bg-[#1f2235] cursor-pointer"
                  >
                    <Icon name={item.icon} size={16} />
                    <span className="text-sm">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1 px-2 py-1 text-[#6b6f85] text-xs font-semibold uppercase tracking-wide">
                <ArrowRight className="w-3 h-3" />
                <span>Демо-чат</span>
              </div>
              <div className="mt-1 space-y-0.5">
                {["Иван — онлайн 🟢", "Мария — онлайн 🟢"].map((contact) => (
                  <div
                    key={contact}
                    className="flex items-center gap-1.5 px-2 py-1 rounded text-[#6b6f85] hover:text-[#c8cadd] hover:bg-[#1f2235] cursor-pointer"
                  >
                    <Mic className="w-4 h-4" />
                    <span className="text-sm">{contact}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Область пользователя */}
          <div className="p-2 bg-[#0f1018] flex items-center gap-2">
            <div className="w-8 h-8 bg-[#6c63ff] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">А</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">alex_user</div>
              <div className="text-[#6b6f85] text-xs truncate">🟢 онлайн</div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-[#2a2d3e]">
                <Mic className="w-4 h-4 text-[#8b8fa8]" />
              </Button>
              <Button variant="ghost" size="sm" className="w-8 h-8 p-0 hover:bg-[#2a2d3e]">
                <Settings className="w-4 h-4 text-[#8b8fa8]" />
              </Button>
            </div>
          </div>
        </div>

        {/* Основная область */}
        <div className="flex-1 flex flex-col">
          {/* Заголовок чата */}
          <div className="h-12 bg-[#1a1c2e] border-b border-[#2a2d3e] flex items-center px-4 gap-2">
            <Button
              variant="ghost"
              className="lg:hidden text-[#6b6f85] hover:text-[#c8cadd] hover:bg-[#2a2d3e] p-1 mr-2"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <MessageCircle className="w-5 h-5 text-[#6b6f85]" />
            <span className="text-white font-semibold">сообщения</span>
            <div className="w-px h-6 bg-[#2a2d3e] mx-2 hidden sm:block"></div>
            <span className="text-[#6b6f85] text-sm hidden sm:block">Защищённые end-to-end шифрованием</span>
            <div className="ml-auto flex items-center gap-2 sm:gap-4">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b8fa8] cursor-pointer hover:text-[#c8cadd]" />
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b8fa8] cursor-pointer hover:text-[#c8cadd]" />
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#8b8fa8] cursor-pointer hover:text-[#c8cadd]" />
            </div>
          </div>

          {/* Контент */}
          <div className="flex-1 p-2 sm:p-4 space-y-4 sm:space-y-6 overflow-y-auto">

            {/* Hero секция */}
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shadow-[#6c63ff]/30">
                  <img src={LOGO_URL} alt={APP_NAME} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="inline-flex items-center gap-2 bg-[#6c63ff]/20 text-[#a89cff] px-4 py-1.5 rounded-full text-sm font-medium mb-4">
                <Lock className="w-3 h-3" />
                <span>End-to-End шифрование</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                Звони и общайся<br />
                <span className="text-[#6c63ff]">без прослушки</span>
              </h2>
              <p className="text-[#8b8fa8] text-base sm:text-lg max-w-xl mx-auto mb-8">
                {APP_NAME} — приложение для защищённых видео и аудиозвонков. Регистрация по номеру телефона, звонки только друзьям, все сообщения зашифрованы.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  className="bg-[#6c63ff] hover:bg-[#574fd6] text-white px-8 py-3 rounded-xl text-base font-semibold"
                  onClick={() => navigate("/auth")}
                >
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Зарегистрироваться
                </Button>
                <Button
                  variant="ghost"
                  className="text-[#8b8fa8] hover:text-white hover:bg-[#2a2d3e] px-8 py-3 rounded-xl text-base border border-[#2a2d3e]"
                  onClick={() => navigate("/auth")}
                >
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти
                </Button>
              </div>
            </div>

            {/* Демо Rich Presence — в стиле звонка */}
            <div className="max-w-3xl mx-auto px-4">
              <div className="bg-[#12141f] rounded-2xl p-4 sm:p-6 border border-[#2a2d3e]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="text-[#8b8fa8] text-sm">Видеозвонок активен</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-[#1a1c2e] rounded-xl aspect-video flex flex-col items-center justify-center gap-2 border border-[#2a2d3e]">
                    <div className="w-12 h-12 bg-[#6c63ff] rounded-full flex items-center justify-center text-xl font-bold">И</div>
                    <span className="text-[#c8cadd] text-sm font-medium">ivan_98</span>
                  </div>
                  <div className="bg-[#1a1c2e] rounded-xl aspect-video flex flex-col items-center justify-center gap-2 border border-[#2a2d3e]">
                    <div className="w-12 h-12 bg-[#20c997] rounded-full flex items-center justify-center text-xl font-bold">М</div>
                    <span className="text-[#c8cadd] text-sm font-medium">maria_m</span>
                  </div>
                </div>
                <div className="flex justify-center gap-3">
                  <Button size="sm" className="bg-[#2a2d3e] hover:bg-[#363a4f] text-white rounded-full w-10 h-10 p-0">
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-[#2a2d3e] hover:bg-[#363a4f] text-white rounded-full w-10 h-10 p-0">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white rounded-full w-10 h-10 p-0">
                    <Phone className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Блок фич */}
            <div className="max-w-3xl mx-auto px-4">
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-6 text-center">Всё что нужно для общения</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: "Phone",
                    color: "#6c63ff",
                    title: "Регистрация по SMS",
                    desc: "Только номер телефона, никнейм и пароль. Никаких лишних данных.",
                  },
                  {
                    icon: "UserPlus",
                    color: "#20c997",
                    title: "Система друзей",
                    desc: "Найди по номеру или никнейму. Звонок только после принятия в друзья.",
                  },
                  {
                    icon: "Video",
                    color: "#fd7e14",
                    title: "Видео и аудиозвонки",
                    desc: "HD качество, низкая задержка. Работает даже на медленном интернете.",
                  },
                  {
                    icon: "Lock",
                    color: "#e83e8c",
                    title: "Шифрование E2E",
                    desc: "Все сообщения и звонки зашифрованы. Только вы и собеседник читаете переписку.",
                  },
                  {
                    icon: "Users",
                    color: "#17a2b8",
                    title: "Импорт контактов",
                    desc: "Дай доступ к контактам — TalkWave сам найдёт зарегистрированных друзей.",
                  },
                  {
                    icon: "Shield",
                    color: "#6f42c1",
                    title: "Полная приватность",
                    desc: "Никакой рекламы, никакой аналитики. Ваши данные принадлежат только вам.",
                  },
                ].map((feat) => (
                  <div key={feat.title} className="bg-[#12141f] rounded-xl p-4 border border-[#2a2d3e] hover:border-[#6c63ff]/50 transition-colors">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: feat.color + "22" }}
                    >
                      <Icon name={feat.icon} size={20} style={{ color: feat.color }} />
                    </div>
                    <h4 className="text-white font-semibold text-sm mb-1">{feat.title}</h4>
                    <p className="text-[#6b6f85] text-xs leading-relaxed">{feat.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Как это работает */}
            <div className="max-w-3xl mx-auto px-4">
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-6 text-center">Начать за 3 шага</h3>
              <div className="space-y-3">
                {[
                  { step: "1", title: "Зарегистрируйся", desc: "Введи номер телефона, придумай никнейм и пароль. Подтверди номер кодом из SMS.", color: "#6c63ff" },
                  { step: "2", title: "Добавь друзей", desc: "Найди их по номеру или никнейму, или дай доступ к контактам — мы найдём сами.", color: "#20c997" },
                  { step: "3", title: "Звони и пиши", desc: "Видеозвонки, аудиозвонки, защищённые чаты — всё в одном приложении.", color: "#fd7e14" },
                ].map((item) => (
                  <div key={item.step} className="bg-[#12141f] rounded-xl p-4 border border-[#2a2d3e] flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.step}
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">{item.title}</h4>
                      <p className="text-[#6b6f85] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Демо чат */}
            <div className="max-w-3xl mx-auto px-4">
              <h3 className="text-white font-bold text-xl sm:text-2xl mb-4 text-center">Защищённый чат</h3>
              <div className="bg-[#12141f] rounded-2xl border border-[#2a2d3e] overflow-hidden">
                <div className="p-3 border-b border-[#2a2d3e] flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#6c63ff] rounded-full flex items-center justify-center text-sm font-bold">И</div>
                  <div>
                    <div className="text-white text-sm font-medium">ivan_98</div>
                    <div className="text-[#6b6f85] text-xs flex items-center gap-1"><Lock className="w-3 h-3" /> E2E шифрование</div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button size="sm" className="bg-[#6c63ff] hover:bg-[#574fd6] text-white rounded-full w-8 h-8 p-0">
                      <Phone className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="sm" className="bg-[#20c997] hover:bg-[#17a589] text-white rounded-full w-8 h-8 p-0">
                      <Video className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-[#6c63ff] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">И</div>
                    <div className="bg-[#1f2235] rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
                      <p className="text-[#c8cadd] text-sm">Привет! Как дела? 👋</p>
                      <p className="text-[#4a4e6b] text-xs mt-1">14:32</p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-[#6c63ff]/20 rounded-2xl rounded-tr-sm px-3 py-2 max-w-xs">
                      <p className="text-[#c8cadd] text-sm">Отлично! Созвонимся сегодня?</p>
                      <p className="text-[#4a4e6b] text-xs mt-1 text-right">14:33 ✓✓</p>
                    </div>
                    <div className="w-7 h-7 bg-[#20c997] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">А</div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 bg-[#6c63ff] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">И</div>
                    <div className="bg-[#1f2235] rounded-2xl rounded-tl-sm px-3 py-2 max-w-xs">
                      <p className="text-[#c8cadd] text-sm">Да! В 18:00? Видеозвонок 📹</p>
                      <p className="text-[#4a4e6b] text-xs mt-1">14:33</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 py-2">
                    <Lock className="w-3 h-3 text-[#4a4e6b]" />
                    <span className="text-[#4a4e6b] text-xs">Сообщения защищены end-to-end шифрованием</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="max-w-3xl mx-auto px-4 pb-8">
              <div className="bg-gradient-to-r from-[#6c63ff]/20 to-[#20c997]/20 rounded-2xl p-6 sm:p-8 border border-[#6c63ff]/30 text-center">
                <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg shadow-[#6c63ff]/30">
                  <img src={LOGO_URL} alt={APP_NAME} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-white font-bold text-xl sm:text-2xl mb-2">{APP_NAME} — общайся свободно</h3>
                <p className="text-[#8b8fa8] mb-6 text-sm sm:text-base">Оставьте номер — пришлём уведомление когда выйдет мобильное приложение.</p>

                {waitlistStatus === "success" ? (
                  <div className="flex items-center justify-center gap-2 bg-[#20c997]/10 border border-[#20c997]/30 rounded-xl px-4 py-3 mb-4">
                    <CheckCircle className="w-5 h-5 text-[#20c997]" />
                    <span className="text-[#20c997] font-medium">{waitlistMsg}</span>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4">
                    <Input
                      value={waitlistPhone}
                      onChange={(e) => setWaitlistPhone(e.target.value)}
                      placeholder="+7 900 000 00 00"
                      className="bg-[#1a1c2e] border-[#2a2d3e] text-white placeholder:text-[#4a4e6b] focus:border-[#6c63ff] rounded-xl flex-1"
                    />
                    <Button
                      className="bg-[#6c63ff] hover:bg-[#574fd6] text-white px-6 py-2 rounded-xl font-semibold whitespace-nowrap"
                      onClick={handleWaitlist}
                      disabled={waitlistStatus === "loading"}
                    >
                      {waitlistStatus === "loading" ? "Отправляем..." : "Уведомить меня"}
                    </Button>
                  </div>
                )}
                {waitlistStatus === "error" && (
                  <p className="text-red-400 text-sm mb-3">{waitlistMsg}</p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
                  <Button
                    className="bg-[#6c63ff] hover:bg-[#574fd6] text-white px-8 py-3 rounded-xl text-base font-semibold"
                    onClick={() => navigate("/auth")}
                  >
                    Зарегистрироваться сейчас
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-4">
                  {["Бесплатно", "Без рекламы", "Шифрование E2E"].map((tag) => (
                    <div key={tag} className="flex items-center gap-1 text-[#6b6f85] text-xs">
                      <CheckCircle className="w-3 h-3 text-[#20c997]" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0f1018] border-t border-[#2a2d3e] py-6 px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-7 h-7 rounded-lg overflow-hidden">
            <img src={LOGO_URL} alt={APP_NAME} className="w-full h-full object-cover" />
          </div>
          <span className="text-white font-semibold">{APP_NAME}</span>
        </div>
        <p className="text-[#6b6f85] text-xs">© 2025 {APP_NAME}. Все звонки и сообщения защищены шифрованием.</p>
      </footer>
    </div>
  );
};

export default Index;