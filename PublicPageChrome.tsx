import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, Languages, Lock, User } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../contexts/I18nContext";
// import { demoPassword } from "../../data/mockData";
import { dashboardPathForAccess } from "../../lib/utils";

import type { TranslationKey } from "../../contexts/I18nContext";

const loginSchema = (t: (key: TranslationKey) => string) => z.object({
  username: z.string().min(1, t("usernameRequired")),
  password: z.string().min(6, t("passwordMinLength")),
  remember: z.boolean().default(true),
});

type LoginForm = z.infer<ReturnType<typeof loginSchema>>;

export default function LoginPage() {
  const { user, roles, signIn } = useAuth();
  const { t, language, toggleLanguage } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      username: "",
      password: "",
      remember: true,
    },
  });

  if (user) return <Navigate to={dashboardPathForAccess(user.accountType, roles)} replace />;

  const from = (location.state as { from?: string } | null)?.from;

  const onSubmit = async (values: LoginForm) => {
    setSubmitError("");
    try {
      const profile = await signIn(values.username, values.password, values.remember);
      navigate(from && from !== "/login" ? from : dashboardPathForAccess(profile.accountType, roles), { replace: true });
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message.includes("Unauthorized")
          ? t("wrongUsernameOrPassword")
          : error instanceof Error
            ? error.message
            : t("unableToLogin"),
      );
    }
  };

  return (
    <main className="grid min-h-screen bg-ziad-light lg:grid-cols-[1fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-ziad-primary lg:block">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-ziad-accent/10 blur-[100px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -right-20 h-[500px] w-[500px] rounded-full bg-white/5 blur-[120px]" 
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-ziad-light">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex w-fit flex-col"
          >
            <span className="text-3xl font-black tracking-tight text-ziad-light">
              {t("appName")}
            </span>
            <span className="mt-1 w-fit rounded-button bg-ziad-light/12 px-2.5 py-1 text-xs font-extrabold uppercase tracking-[0.28em] text-ziad-light shadow-sm ring-1 ring-ziad-light/18">
              {t("learningPortal")}
            </span>
          </motion.div>

          <div className="max-w-xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex rounded-button bg-ziad-light/14 px-3 py-1.5 text-sm font-extrabold uppercase tracking-[0.2em] text-ziad-light shadow-sm ring-1 ring-ziad-light/20"
            >
              {t("heroTagline")}
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-6xl font-[900] leading-[1.1] tracking-tight"
            >
              {t("heroTitle")} <span className="text-ziad-mint drop-shadow-sm">{t("heroHighlight")}</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-8 max-w-lg text-xl font-semibold leading-relaxed text-ziad-light/92"
            >
              {t("heroSubtitle")}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-3 gap-4"
          >
            {[
              { label: t("featureRole"), icon: "🎯" },
              { label: t("featureWeak"), icon: "📊" },
              { label: t("featureBilingual"), icon: "🌍" }
            ].map((item) => (
              <motion.div 
                key={item.label}
                whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.15)" }}
                className="group rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-colors"
              >
                <p className="text-2xl mb-2">{item.icon}</p>
                <p className="text-sm font-bold text-white/90">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="relative flex items-center justify-center px-4 py-8 sm:px-6 overflow-hidden">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          type="button"
          onClick={toggleLanguage}
          className="absolute end-4 top-4 inline-flex h-10 items-center justify-center gap-2 rounded-button border border-ziad-line bg-ziad-panel px-3 text-sm font-bold text-ziad-ink transition hover:bg-ziad-light"
        >
          <Languages className="h-4 w-4" />
          {language === "en" ? t("languageAr") : t("languageEn")}
        </motion.button>
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <img src="/square_logo.png" alt={t("altLogo")} className="h-12 w-auto rounded-card shadow-soft" />
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-soft sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("learningPortal")}</p>
              <h2 className="mt-2 text-3xl font-extrabold text-ziad-ink">{t("login")}</h2>
              <p className="mt-2 text-sm leading-6 text-ziad-ink/65">{t("loginWelcome")}</p>
            </motion.div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <motion.label 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="block"
              >
                <span className="text-sm font-bold text-ziad-ink">{t("username")}</span>
                <span className="mt-2 flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-3 focus-within:border-ziad-primary">
                  <User className="h-4 w-4 text-ziad-ink/65" />
                  <input
                    type="text"
                    autoComplete="username"
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold text-ziad-ink outline-none"
                    placeholder={t("username")}
                    {...register("username")}
                  />
                </span>
                {errors.username ? <span className="mt-1 block text-sm font-semibold text-red-700">{errors.username.message}</span> : null}
              </motion.label>

              <motion.label 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block"
              >
                <span className="text-sm font-bold text-ziad-ink">{t("password")}</span>
                <span className="mt-2 flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-3 focus-within:border-ziad-primary">
                  <Lock className="h-4 w-4 text-ziad-ink/65" />
                  <input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className="h-11 min-w-0 flex-1 bg-transparent text-sm font-semibold text-ziad-ink outline-none"
                    placeholder={"••••••••"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="grid h-8 w-8 place-items-center rounded-button text-ziad-ink/60 hover:bg-ziad-light"
                    aria-label={t("togglePassword")}
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </span>
                {errors.password ? <span className="mt-1 block text-sm font-semibold text-red-700">{errors.password.message}</span> : null}
              </motion.label>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between gap-3"
              >
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-ziad-ink/75">
                  <input type="checkbox" className="h-4 w-4 rounded border-ziad-line text-ziad-primary" {...register("remember")} />
                  {t("rememberMe")}
                </label>
              </motion.div>

              {submitError ? (
                <motion.p 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-button border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                >
                  {submitError}
                </motion.p>
              ) : null}

              <motion.button
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.6 }}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 w-full items-center justify-center rounded-button bg-ziad-primary px-4 text-sm font-extrabold text-ziad-light transition hover:bg-ziad-ink disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? t("signingIn") : t("login")}
              </motion.button>
            </form>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.7 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-ziad-ink/65">
                {t("noAccount")}{" "}
                <Link to="/register" className="font-bold text-ziad-primary hover:text-ziad-ink underline">
                  {t("createAccountLink")}
                </Link>
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

