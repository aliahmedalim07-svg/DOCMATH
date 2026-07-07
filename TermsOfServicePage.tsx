import { zodResolver } from "@hookform/resolvers/zod";
import { Languages, Lock, Phone, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import { useI18n } from "../../contexts/I18nContext";
import type { TranslationKey } from "../../contexts/I18nContext";
import { validatePhone, toApiPhone } from "../../lib/phone";

const registerSchema = (t: (key: TranslationKey) => string) => z
  .object({
    accountType: z.enum(["1", "2"]),
    name: z.string().min(3, t("fullNameRequired")),
    username: z.string().min(3, t("usernameMinLength")).regex(/^[a-zA-Z0-9_]+$/, t("usernameInvalidChars")),
    phone: z.string().refine((val) => validatePhone(val).valid, t("phoneInvalid")),
    parentPhone: z.preprocess(
      (val) => (typeof val === "string" && val.trim() === "" ? undefined : val),
      z.string().refine((val) => validatePhone(val).valid, t("parentPhoneInvalid")).optional()
    ),
    password: z.string().min(6, t("passwordMinLength")),
    confirmPassword: z.string().min(6, t("confirmPasswordRequired")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("passwordsDontMatch"),
    path: ["confirmPassword"],
  })
  .refine(
    (data) => data.accountType === "2" || (!!data.parentPhone && validatePhone(data.parentPhone).valid),
    {
      message: t("parentPhoneInvalid"),
      path: ["parentPhone"],
    }
  )
  .refine(
    (data) => data.accountType === "2" || data.phone !== data.parentPhone,
    {
      message: t("phoneMustDifferFromParent"),
      path: ["phone"],
    }
  );

type RegisterForm = z.infer<ReturnType<typeof registerSchema>>;

export default function RegisterPage() {
  const { createAccount, signIn } = useAuth();
  const { t, language, toggleLanguage } = useI18n();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema(t)),
    defaultValues: { accountType: "1" },
  });

  const accountType = watch("accountType", "1");

  const onSubmit = async (values: RegisterForm) => {
    setSubmitError("");
    try {
      await createAccount({
        username: values.username,
        name: values.name,
        phone: toApiPhone(values.phone),
        parentPhone: values.parentPhone ? toApiPhone(values.parentPhone) : undefined,
        accountType: values.accountType === "1" ? 1 : 2,
        tempPassword: values.password,
        linkedStudentId: values.accountType === "1" ? values.parentPhone : undefined,
      });
      
      // Auto login after registration
      await signIn(values.username, values.password, true);
      navigate("/student/dashboard");
    } catch (error) {
      setSubmitError(
        error instanceof Error && error.message.includes("Conflict")
          ? t("usernameExists")
          : error instanceof Error
            ? error.message
            : t("registrationFailed"),
      );
    }
  };

  const onError = (_errs: any) => {
    setSubmitError(t("checkHighlightedFields"));
  };

  return (
    <main className="grid min-h-screen bg-ziad-light lg:grid-cols-[1.1fr_1fr]">
      {/* Dynamic Branding Section */}
      <section className="relative hidden overflow-hidden bg-ziad-primary lg:block">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], rotate: [0, -5, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-ziad-accent/15 blur-[100px]" 
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -left-20 h-[600px] w-[600px] rounded-full bg-white/5 blur-[130px]" 
        />

        <div className="relative flex h-full flex-col justify-between p-12 text-ziad-light">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">{t("appName")}</h1>
            </div>
          </motion.div>

          <div className="max-w-xl">
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex rounded-full border border-ziad-light/20 bg-ziad-light/8 px-3 py-1 text-sm font-bold uppercase tracking-[0.2em] text-ziad-light shadow-sm"
            >
              {t("levelUpMath")}
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-6 text-6xl font-[900] leading-[1.1] tracking-tight"
            >
              {t("startJourney")}<span className="text-ziad-light drop-shadow-sm">{t("successWord")}</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="mt-8 max-w-lg text-xl leading-relaxed text-ziad-light/92 font-medium"
            >
              {t("createAccountDescription")}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex gap-12"
          >
            <div>
              <p className="text-3xl font-black">200+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-ziad-light/85 mt-1">{t("assignmentsCount")}</p>
            </div>
            <div>
              <p className="text-3xl font-black">15k+</p>
              <p className="text-xs font-bold uppercase tracking-widest text-ziad-light/85 mt-1">{t("questionsCount")}</p>
            </div>
            <div>
              <p className="text-3xl font-black">💯</p>
              <p className="text-xs font-bold uppercase tracking-widest text-ziad-light/85 mt-1">{t("excellence")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative flex items-center justify-center px-4 py-10 sm:px-6 bg-ziad-light/50 overflow-y-auto">
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
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <h1 className="text-2xl font-extrabold text-ziad-ink">{t("appName")}</h1>
          </div>

          <div className="rounded-card border border-ziad-line bg-ziad-panel p-6 shadow-soft sm:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-xs font-bold uppercase text-ziad-primary">{t("newStudent")}</p>
              <h2 className="mt-2 text-3xl font-extrabold text-ziad-ink">{t("createAccount")}</h2>
              <p className="mt-2 text-sm leading-6 text-ziad-ink/65">{t("registerSubtitle")}</p>
            </motion.div>

            <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit, onError)}>
              <motion.label 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="sm:col-span-2"
              >
                <span className="text-sm font-bold text-ziad-ink ml-1 mb-1.5 block">{t("fullName")}</span>
                <span className="flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-4 transition-all focus-within:border-ziad-primary focus-within:ring-2 focus-within:ring-ziad-primary/10">
                  <User className="h-4 w-4 text-ziad-ink/65" />
                  <input {...register("name")} placeholder={t("fullNameRequired")} className="h-12 flex-1 bg-transparent text-sm font-semibold outline-none" />
                </span>
                {errors.name ? <span className="mt-1.5 block text-xs font-bold text-red-600 ml-1">{errors.name.message}</span> : null}
              </motion.label>

              <motion.label 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.31 }}
                className="sm:col-span-2"
              >
                <span className="text-sm font-bold text-ziad-ink ml-1 mb-1.5 block">{t("username")}</span>
                <span className="flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-4 transition-all focus-within:border-ziad-primary focus-within:ring-2 focus-within:ring-ziad-primary/10">
                  <User className="h-4 w-4 text-ziad-ink/65" />
                  <input {...register("username")} placeholder={t("username")} className="h-12 flex-1 bg-transparent text-sm font-semibold outline-none" />
                </span>
                {errors.username ? <span className="mt-1.5 block text-xs font-bold text-red-600 ml-1">{errors.username.message}</span> : null}
              </motion.label>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 }}
                className="sm:col-span-2"
              >
                <span className="text-sm font-bold text-ziad-ink">{t("accountType")}</span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <Controller
                    control={control}
                    name="accountType"
                    render={({ field }) => (
                      <>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            value="1"
                            checked={field.value === "1"}
                            onChange={() => field.onChange("1")}
                          />
                          <span className="font-semibold">{t("studentLabel")}</span>
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            value="2"
                            checked={field.value === "2"}
                            onChange={() => field.onChange("2")}
                          />
                          <span className="font-semibold">{t("parentLabel")}</span>
                        </label>
                      </>
                    )}
                  />
                </div>
              </motion.div>

              <motion.label
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <span className="text-sm font-bold text-ziad-ink">{accountType === "2" ? t("phoneOnly") : t("studentPhone")}</span>
                <span className="flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-4 transition-all focus-within:border-ziad-primary focus-within:ring-2 focus-within:ring-ziad-primary/10">
                  <Phone className="h-4 w-4 text-ziad-ink/65" />
                  <input {...register("phone")} placeholder="" className="h-12 flex-1 bg-transparent text-sm font-semibold outline-none" />
                </span>
                {errors.phone ? <span className="mt-1.5 block text-xs font-bold text-red-600 ml-1">{errors.phone.message}</span> : null}
              </motion.label>

              {accountType === "1" && (
                <motion.label
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="text-sm font-bold text-ziad-ink">{t("parentPhone")}</span>
                  <span className="flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-4 transition-all focus-within:border-ziad-primary focus-within:ring-2 focus-within:ring-ziad-primary/10">
                    <Phone className="h-4 w-4 text-ziad-ink/65" />
                    <input {...register("parentPhone")} placeholder="" className="h-12 flex-1 bg-transparent text-sm font-semibold outline-none" />
                  </span>
                  {errors.parentPhone ? <span className="mt-1.5 block text-xs font-bold text-red-600 ml-1">{errors.parentPhone.message}</span> : null}
                </motion.label>
              )}

              <motion.label
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <span className="text-sm font-bold text-ziad-ink ml-1 mb-1.5 block">{t("password")}</span>
                <span className="flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-4 transition-all focus-within:border-ziad-primary focus-within:ring-2 focus-within:ring-ziad-primary/10">
                  <Lock className="h-4 w-4 text-ziad-ink/65" />
                  <input type="password" {...register("password")} placeholder="••••••••" className="h-12 flex-1 bg-transparent text-sm font-semibold outline-none" />
                </span>
                {errors.password ? <span className="mt-1.5 block text-xs font-bold text-red-600 ml-1">{errors.password.message}</span> : null}
              </motion.label>

              <motion.label
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <span className="text-sm font-bold text-ziad-ink">{t("confirmPassword")}</span>
                <span className="flex items-center gap-2 rounded-button border border-ziad-line bg-white/80 px-4 transition-all focus-within:border-ziad-primary focus-within:ring-2 focus-within:ring-ziad-primary/10">
                  <Lock className="h-4 w-4 text-ziad-ink/65" />
                  <input type="password" {...register("confirmPassword")} placeholder="••••••••" className="h-12 flex-1 bg-transparent text-sm font-semibold outline-none" />
                </span>
                {errors.confirmPassword ? <span className="mt-1.5 block text-xs font-bold text-red-600 ml-1">{errors.confirmPassword.message}</span> : null}
              </motion.label>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="sm:col-span-2 mt-2"
              >
                {submitError ? (
                  <p className="mb-4 rounded-button border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{submitError}</p>
                ) : null}

                <motion.button
                  whileHover={{ scale: 1.01, backgroundColor: "#1A232E" }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-button bg-ziad-primary px-4 text-sm font-[900] text-ziad-light transition-all hover:shadow-lg disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {t("creatingAccount")}
                    </span>
                  ) : (
                    t("registerAction")
                  )}
                </motion.button>
              </motion.div>
            </form>

            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 0.65 }}
              className="mt-8 text-center text-sm font-bold text-ziad-ink/75"
            >
              <p className="text-sm text-ziad-ink/65">
                {t("alreadyHaveAccount")}{" "}
                <Link to="/login" className="font-bold text-ziad-primary hover:text-ziad-ink underline">
                  {t("loginLink")}
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

