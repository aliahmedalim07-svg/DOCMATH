import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useI18n } from "../../contexts/I18nContext";
import type { TranslationKey } from "../../contexts/I18nContext";
import { useAuth } from "../../contexts/AuthContext";
import { AccountType } from "../../lib/types";
import { validatePhone, toApiPhone } from "../../lib/phone";

const registerSchema = (t: (key: TranslationKey) => string) => z.object({
  name: z.string().min(1, t("enterFullName")),
  username: z.string().min(1, t("enterUsername")),
  phone: z.string().refine((val) => !val || validatePhone(val).valid, t("phoneInvalid")).optional(),
  accountType: z.enum(["Student", "Parent", "Admin"]),
  password: z.string().min(6, t("useMinChars")),
  parentPhone: z.string().optional(),
  parentPhoneNumber: z.string().refine((val) => !val || validatePhone(val).valid, t("parentPhoneInvalid")).optional(),
}).refine(
  (data) => data.accountType !== "Student" || !data.phone || !data.parentPhoneNumber || data.phone !== data.parentPhoneNumber,
  {
    message: t("phoneMustDifferFromParent"),
    path: ["phone"],
  }
);

type RegisterForm = z.infer<ReturnType<typeof registerSchema>>;

export default function RegisterUser() {
  const { t } = useI18n();
  const { createAccount } = useAuth();
  const [createdUsername, setCreatedUsername] = useState("");
  const [submitError, setSubmitError] = useState("");
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema(t)),
    defaultValues: {
      accountType: "Student",
      password: "Temp1234",
    },
  });

  const accountType = watch("accountType");

  const onSubmit = async (values: RegisterForm) => {
    setSubmitError("");
    try {
      const accountTypeValue = values.accountType === "Admin" ? AccountType.Admin
        : values.accountType === "Parent" ? AccountType.Parent
        : AccountType.Student;

      await createAccount({
        username: values.username,
        name: values.name,
        phone: values.phone ? toApiPhone(values.phone) : undefined,
        accountType: accountTypeValue,
        parentPhone: values.parentPhoneNumber ? toApiPhone(values.parentPhoneNumber) : undefined,
        tempPassword: values.password,
      });
      setCreatedUsername(values.name);
      reset({ accountType: "Student", password: "Temp1234" });
    } catch (err: any) {
      setSubmitError(err?.message || t("failedToCreateAccount"));
    }
  };

  return (
    <div className="space-y-5">
      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <p className="text-xs font-bold uppercase text-ziad-primary">{t("adminOnly")}</p>
        <h1 className="text-3xl font-extrabold text-ziad-ink">{t("registerUser")}</h1>
        <p className="mt-2 text-sm text-ziad-ink/62">{t("createsAccountsDirectly")}</p>
      </section>

      <section className="rounded-card border border-ziad-line bg-ziad-panel p-5 shadow-sm">
        <form className="grid gap-4 lg:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <label>
            <span className="text-sm font-bold text-ziad-ink">{t("fullName")}</span>
            <input {...register("name")} className="mt-2 h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary" />
            {errors.name ? <span className="mt-1 block text-sm font-semibold text-red-700">{errors.name.message}</span> : null}
          </label>
          <label>
            <span className="text-sm font-bold text-ziad-ink">{t("username")}</span>
            <input {...register("username")} className="mt-2 h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary" />
            {errors.username ? <span className="mt-1 block text-sm font-semibold text-red-700">{errors.username.message}</span> : null}
          </label>
          <label>
            <span className="text-sm font-bold text-ziad-ink">{t("phoneLabel")}</span>
            <input {...register("phone")} className="mt-2 h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary" />
            {errors.phone ? <span className="mt-1 block text-sm font-semibold text-red-700">{errors.phone.message}</span> : null}
          </label>
          <label>
            <span className="text-sm font-bold text-ziad-ink">{t("accountType")}</span>
            <select {...register("accountType")} className="mt-2 h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary">
              <option value="Student">{t("student")}</option>
              <option value="Parent">{t("parent")}</option>
              <option value="Admin">{t("adminRole")}</option>
            </select>
          </label>
          <label>
            <span className="text-sm font-bold text-ziad-ink">{t("password")}</span>
            <input type="password" {...register("password")} className="mt-2 h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary" />
            {errors.password ? <span className="mt-1 block text-sm font-semibold text-red-700">{errors.password.message}</span> : null}
          </label>
          {accountType === "Student" && (
            <label>
              <span className="text-sm font-bold text-ziad-ink">{t("parentsPhone")}</span>
              <input {...register("parentPhoneNumber")} placeholder={t("parentsPhoneNumber")} className="mt-2 h-11 w-full rounded-button border border-ziad-line bg-white px-3 text-sm font-semibold outline-none focus:border-ziad-primary" />
            </label>
          )}
          <div className="lg:col-span-2">
            {createdUsername ? <p className="mb-3 rounded-button border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">{t("createdAccountFor").replace("{username}", createdUsername)}</p> : null}
            {submitError ? <p className="mb-3 rounded-button border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{submitError}</p> : null}
            <button type="submit" disabled={isSubmitting} className="inline-flex h-11 items-center justify-center gap-2 rounded-button bg-ziad-primary px-5 text-sm font-extrabold text-ziad-light hover:bg-ziad-ink disabled:opacity-60">
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? t("creatingDots") : t("createAccountButton")}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
