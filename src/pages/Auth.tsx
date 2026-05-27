import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Icon from "@/components/ui/icon";
import { apiRegister, apiVerify, apiLogin } from "@/lib/api";

const LOGO_URL =
  "https://cdn.poehali.dev/projects/891548a8-eed9-4caa-9d36-eef8d7a9fb58/files/378b058f-cdc3-44fe-9124-064116bda400.jpg";

type Step = "choose" | "login" | "register" | "verify";

export default function Auth() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("choose");
  const [phone, setPhone] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debugCode, setDebugCode] = useState("");

  function saveSession(token: string, nick: string) {
    localStorage.setItem("tw_token", token);
    localStorage.setItem("tw_nickname", nick);
  }

  async function handleRegister() {
    setError("");
    setLoading(true);
    const res = await apiRegister(phone, nickname, password);
    setLoading(false);
    if (res.error) return setError(res.error);
    if (res.debug_code) setDebugCode(res.debug_code);
    setStep("verify");
  }

  async function handleVerify() {
    setError("");
    setLoading(true);
    const res = await apiVerify(phone, code);
    setLoading(false);
    if (res.error) return setError(res.error);
    saveSession(res.token, res.nickname);
    navigate("/app");
  }

  async function handleLogin() {
    setError("");
    setLoading(true);
    const res = await apiLogin(phone, password);
    setLoading(false);
    if (res.need_verify) {
      setStep("verify");
      return;
    }
    if (res.error) return setError(res.error);
    saveSession(res.token, res.nickname);
    navigate("/app");
  }

  return (
    <div className="min-h-screen bg-[#1a1c2e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Лого */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-3 shadow-2xl shadow-[#6c63ff]/30">
            <img src={LOGO_URL} alt="TalkWave" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-white text-2xl font-bold">TalkWave</h1>
          <p className="text-[#6b6f85] text-sm mt-1">Защищённые звонки и сообщения</p>
        </div>

        <div className="bg-[#12141f] rounded-2xl border border-[#2a2d3e] p-6">

          {/* Выбор входа или регистрации */}
          {step === "choose" && (
            <div className="space-y-3">
              <h2 className="text-white text-xl font-semibold text-center mb-6">Добро пожаловать!</h2>
              <Button
                className="w-full bg-[#6c63ff] hover:bg-[#574fd6] text-white py-3 rounded-xl text-base font-semibold"
                onClick={() => setStep("register")}
              >
                <Icon name="UserPlus" size={18} className="mr-2" />
                Зарегистрироваться
              </Button>
              <Button
                variant="ghost"
                className="w-full border border-[#2a2d3e] text-[#c8cadd] hover:bg-[#1f2235] py-3 rounded-xl text-base"
                onClick={() => setStep("login")}
              >
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </Button>
            </div>
          )}

          {/* Форма регистрации */}
          {step === "register" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep("choose")} className="text-[#6b6f85] hover:text-white">
                  <Icon name="ArrowLeft" size={18} />
                </button>
                <h2 className="text-white text-lg font-semibold">Регистрация</h2>
              </div>
              <div>
                <Label className="text-[#8b8fa8] text-sm mb-1.5 block">Номер телефона</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 900 000 00 00"
                  className="bg-[#1f2235] border-[#2a2d3e] text-white placeholder:text-[#4a4e6b] focus:border-[#6c63ff] rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[#8b8fa8] text-sm mb-1.5 block">Никнейм</Label>
                <Input
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="your_nickname"
                  className="bg-[#1f2235] border-[#2a2d3e] text-white placeholder:text-[#4a4e6b] focus:border-[#6c63ff] rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[#8b8fa8] text-sm mb-1.5 block">Пароль</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Минимум 6 символов"
                  className="bg-[#1f2235] border-[#2a2d3e] text-white placeholder:text-[#4a4e6b] focus:border-[#6c63ff] rounded-xl"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                className="w-full bg-[#6c63ff] hover:bg-[#574fd6] text-white py-3 rounded-xl text-base font-semibold"
                onClick={handleRegister}
                disabled={loading}
              >
                {loading ? "Отправляем код..." : "Получить SMS-код"}
              </Button>
            </div>
          )}

          {/* Форма входа */}
          {step === "login" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep("choose")} className="text-[#6b6f85] hover:text-white">
                  <Icon name="ArrowLeft" size={18} />
                </button>
                <h2 className="text-white text-lg font-semibold">Вход</h2>
              </div>
              <div>
                <Label className="text-[#8b8fa8] text-sm mb-1.5 block">Номер телефона</Label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 900 000 00 00"
                  className="bg-[#1f2235] border-[#2a2d3e] text-white placeholder:text-[#4a4e6b] focus:border-[#6c63ff] rounded-xl"
                />
              </div>
              <div>
                <Label className="text-[#8b8fa8] text-sm mb-1.5 block">Пароль</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ваш пароль"
                  className="bg-[#1f2235] border-[#2a2d3e] text-white placeholder:text-[#4a4e6b] focus:border-[#6c63ff] rounded-xl"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                className="w-full bg-[#6c63ff] hover:bg-[#574fd6] text-white py-3 rounded-xl text-base font-semibold"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Входим..." : "Войти"}
              </Button>
              <p className="text-center text-sm text-[#6b6f85]">
                Нет аккаунта?{" "}
                <button className="text-[#6c63ff] hover:underline" onClick={() => setStep("register")}>
                  Зарегистрироваться
                </button>
              </p>
            </div>
          )}

          {/* Подтверждение SMS */}
          {step === "verify" && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-[#6c63ff]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Smartphone" size={22} className="text-[#6c63ff]" />
                </div>
                <h2 className="text-white text-lg font-semibold">Подтвердите номер</h2>
                <p className="text-[#6b6f85] text-sm mt-1">
                  Введите 6-значный код, отправленный на <span className="text-white">{phone}</span>
                </p>
              </div>
              {debugCode && (
                <div className="bg-[#20c997]/10 border border-[#20c997]/30 rounded-xl p-3 text-center">
                  <p className="text-[#6b6f85] text-xs mb-1">Тестовый код (уберём в продакшене):</p>
                  <p className="text-[#20c997] font-bold text-2xl tracking-widest">{debugCode}</p>
                </div>
              )}
              <div>
                <Label className="text-[#8b8fa8] text-sm mb-1.5 block">Код из SMS</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  maxLength={6}
                  className="bg-[#1f2235] border-[#2a2d3e] text-white placeholder:text-[#4a4e6b] focus:border-[#6c63ff] rounded-xl text-center text-2xl tracking-widest"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <Button
                className="w-full bg-[#6c63ff] hover:bg-[#574fd6] text-white py-3 rounded-xl text-base font-semibold"
                onClick={handleVerify}
                disabled={loading}
              >
                {loading ? "Проверяем..." : "Подтвердить"}
              </Button>
            </div>
          )}
        </div>

        <p className="text-center text-[#4a4e6b] text-xs mt-6">
          Регистрируясь, вы соглашаетесь с условиями использования.<br />
          Все данные защищены шифрованием.
        </p>
      </div>
    </div>
  );
}
