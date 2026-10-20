import { useEffect, useMemo, useState } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";

export interface CreateUserFormValue {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface CreateUserModalProps {
  readonly open: boolean;
  readonly busy?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (value: CreateUserFormValue) => void;
}

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PASSWORD_LOWER = "abcdefghijklmnopqrstuvwxyz";
const PASSWORD_UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const PASSWORD_DIGITS = "0123456789";
const PASSWORD_SPECIAL = "@$!%*?&";
const PASSWORD_ALL = `${PASSWORD_LOWER}${PASSWORD_UPPER}${PASSWORD_DIGITS}${PASSWORD_SPECIAL}`;

function randomInt(maxExclusive: number) {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
    throw new Error("randomInt(maxExclusive) requires maxExclusive > 0");
  }
  const maxUint32 = 0xffff_ffff;
  const limit = maxUint32 - (maxUint32 % maxExclusive);
  const buf = new Uint32Array(1);
  while (true) {
    crypto.getRandomValues(buf);
    const x = buf[0]!;
    if (x < limit) return x % maxExclusive;
  }
}

function pickChar(chars: string) {
  return chars[randomInt(chars.length)]!;
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function generatePassword({
  length = 16,
}: {
  readonly length?: number;
} = {}) {
  const clampedLength = Math.max(8, Math.min(64, length));

  const chars: string[] = [
    pickChar(PASSWORD_LOWER),
    pickChar(PASSWORD_UPPER),
    pickChar(PASSWORD_DIGITS),
    pickChar(PASSWORD_SPECIAL),
  ];

  while (chars.length < clampedLength) {
    chars.push(pickChar(PASSWORD_ALL));
  }

  const password = shuffleInPlace(chars).join("");
  if (!PASSWORD_REGEX.test(password)) return generatePassword({ length: clampedLength });
  return password;
}

export function CreateUserModal({
  open,
  busy = false,
  onClose,
  onSubmit,
}: CreateUserModalProps) {
  const { t } = useI18n();
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [showPassword, setShowPassword] = useState(false);
  const [lastGeneratedPassword, setLastGeneratedPassword] = useState<string | null>(null);
  const [value, setValue] = useState<CreateUserFormValue>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const validation = useMemo(() => {
    const username = value.username.trim();
    const fullName = value.fullName.trim();
    const email = value.email.trim();
    const password = value.password;
    const confirmPassword = value.confirmPassword;

    const usernameOk = username.length >= 3 && username.length <= 30;
    const fullNameOk = fullName.length >= 3 && fullName.length <= 100;
    const emailOk = EMAIL_REGEX.test(email);

    const hasMinLen = password.length >= 8 && password.length <= 64;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecial = /[@$!%*?&]/.test(password);
    const passwordOk = hasMinLen && hasUpper && hasLower && hasDigit && hasSpecial;

    const confirmOk = confirmPassword.length > 0 && confirmPassword === password;

    return {
      username,
      fullName,
      email,
      usernameOk,
      fullNameOk,
      emailOk,
      hasMinLen,
      hasUpper,
      hasLower,
      hasDigit,
      hasSpecial,
      passwordOk,
      confirmOk,
      canSubmit: usernameOk && fullNameOk && emailOk && passwordOk && confirmOk,
    };
  }, [value.confirmPassword, value.email, value.fullName, value.password, value.username]);

  useEffect(() => {
    if (!open) return;
    setStep("form");
    setShowPassword(false);
    setLastGeneratedPassword(null);
    setValue({
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleGenerate = () => {
    const next = generatePassword();
    setValue((s) => ({
      ...s,
      password: next,
      confirmPassword: next,
    }));
    setShowPassword(true);
    setLastGeneratedPassword(next);
  };

  const copyPassword = async () => {
    if (!value.password) return;
    try {
      await navigator.clipboard.writeText(value.password);
      presentAppSuccess(t("adminUsers.toasts.copiedPassword"));
    } catch {
      // ignore
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
      onMouseDown={() => !busy && onClose()}
    >
      <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("adminUsers.create.modalTitle")}
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-3xl border border-outline-variant/20",
          "bg-surface-container-lowest/95 shadow-2xl backdrop-blur-xl",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-7">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-[24px]">person_add</span>
              </div>
              <div>
                <h2 className="font-headline text-lg font-extrabold text-on-surface">
                  {t("adminUsers.create.title")}
                </h2>
                <p className="mt-0.5 text-xs text-on-surface-variant">
                  {t("adminUsers.create.subtitle")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex h-9 w-9 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
              aria-label={t("adminUsers.actions.close")}
              title={t("adminUsers.actions.close")}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="mt-6 space-y-4">
            {step === "form" ? (
              <>
                <Field
                  icon="account_circle"
                  label={t("adminUsers.create.fields.username")}
                  placeholder="ví dụ: nguyenvana"
                  value={value.username}
                  onChange={(v) => setValue((s) => ({ ...s, username: v }))}
                  disabled={busy}
                  error={
                    !validation.usernameOk && value.username.trim().length > 0
                      ? t("adminUsers.create.errors.username")
                      : undefined
                  }
                />

                <Field
                  icon="badge"
                  label={t("adminUsers.create.fields.fullName")}
                  placeholder="ví dụ: Nguyễn Văn A"
                  value={value.fullName}
                  onChange={(v) => setValue((s) => ({ ...s, fullName: v }))}
                  disabled={busy}
                  error={
                    !validation.fullNameOk && value.fullName.trim().length > 0
                      ? t("adminUsers.create.errors.fullName")
                      : undefined
                  }
                />

                <Field
                  icon="mail"
                  label={t("adminUsers.create.fields.email")}
                  placeholder="nguyenvana@university.edu.vn"
                  value={value.email}
                  onChange={(v) => setValue((s) => ({ ...s, email: v }))}
                  disabled={busy}
                  inputMode="email"
                  error={
                    !validation.emailOk && value.email.trim().length > 0
                      ? t("adminUsers.create.errors.email")
                      : undefined
                  }
                />

                {/* Password input with Generator Button */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
                      {t("adminUsers.create.fields.password")}
                    </label>
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
                      {t("adminUsers.create.generatePassword")}
                    </button>
                  </div>

                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-on-surface-variant/60">
                      lock
                    </span>
                    <input
                      value={value.password}
                      onChange={(e) => setValue((s) => ({ ...s, password: e.target.value }))}
                      placeholder="••••••••••••"
                      type={showPassword ? "text" : "password"}
                      disabled={busy}
                      className={cn(
                        "h-11 w-full rounded-xl border bg-surface py-2.5 pl-11 pr-11 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:ring-2 disabled:opacity-50",
                        !validation.passwordOk && value.password.length > 0
                          ? "border-error/60 focus:border-error focus:ring-error/10"
                          : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      disabled={busy}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-on-surface-variant/70 hover:bg-surface-container-high hover:text-on-surface"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      <span className="material-symbols-outlined text-[19px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>

                  {/* Password requirement chips */}
                  <div className="mt-2 grid grid-cols-2 gap-1.5 rounded-xl bg-surface-container-low/50 p-2.5 text-[11px]">
                    <CheckItem check={validation.hasMinLen} label="Ít nhất 8 ký tự" />
                    <CheckItem check={validation.hasUpper && validation.hasLower} label="Chữ hoa & thường" />
                    <CheckItem check={validation.hasDigit} label="Chữ số (0-9)" />
                    <CheckItem check={validation.hasSpecial} label="Ký tự đặc biệt (@$!%*?&)" />
                  </div>

                  {lastGeneratedPassword ? (
                    <div className="mt-2 flex items-center justify-between gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-xs">
                      <div className="min-w-0">
                        <span className="font-semibold text-primary">Mật khẩu vừa tạo: </span>
                        <span className="font-mono font-bold text-on-surface">{lastGeneratedPassword}</span>
                      </div>
                      <button
                        type="button"
                        onClick={copyPassword}
                        className="inline-flex items-center gap-1 rounded-lg bg-primary px-2.5 py-1 text-[11px] font-bold text-on-primary hover:opacity-90"
                      >
                        <span className="material-symbols-outlined text-[13px]">content_copy</span>
                        {t("adminUsers.create.copyGenerated")}
                      </button>
                    </div>
                  ) : null}
                </div>

                {/* Confirm Password */}
                <Field
                  icon="lock_reset"
                  label={t("adminUsers.create.fields.confirmPassword")}
                  placeholder="••••••••••••"
                  value={value.confirmPassword}
                  onChange={(v) => setValue((s) => ({ ...s, confirmPassword: v }))}
                  disabled={busy}
                  type={showPassword ? "text" : "password"}
                  error={
                    !validation.confirmOk && value.confirmPassword.length > 0
                      ? t("adminUsers.create.errors.confirmPassword")
                      : undefined
                  }
                />
              </>
            ) : (
              /* Step 2: Confirmation Overview */
              <div className="space-y-4">
                <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low/40 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-on-surface-variant">
                    {t("adminUsers.create.confirm.title")}
                  </p>

                  <div className="mt-3.5 space-y-2.5">
                    <ConfirmRow
                      label={t("adminUsers.create.fields.username")}
                      value={validation.username}
                    />
                    <ConfirmRow
                      label={t("adminUsers.create.fields.fullName")}
                      value={validation.fullName}
                    />
                    <ConfirmRow
                      label={t("adminUsers.create.fields.email")}
                      value={validation.email}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
                    info
                  </span>
                  <p className="leading-relaxed">
                    {t("adminUsers.create.confirm.note")}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="mt-7 flex items-center justify-end gap-3 border-t border-outline-variant/20 pt-4">
            <button
              type="button"
              onClick={() => {
                if (step === "confirm") {
                  setStep("form");
                  return;
                }
                onClose();
              }}
              disabled={busy}
              className="h-11 rounded-xl px-4 text-sm font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:opacity-50"
            >
              {step === "confirm"
                ? t("adminUsers.actions.back")
                : t("adminUsers.actions.cancel")}
            </button>

            <button
              type="button"
              disabled={busy || !validation.canSubmit}
              onClick={() => {
                if (step === "form") {
                  setStep("confirm");
                  return;
                }
                onSubmit({
                  username: validation.username,
                  fullName: validation.fullName,
                  email: validation.email,
                  password: value.password,
                  confirmPassword: value.confirmPassword,
                });
              }}
              className={cn(
                "inline-flex h-11 items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold text-on-primary transition-all disabled:cursor-not-allowed disabled:opacity-40",
                "bg-gradient-to-r from-primary to-primary-container shadow-md shadow-primary/20 hover:shadow-primary/30",
              )}
            >
              {busy ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">
                    progress_activity
                  </span>
                  <span>{t("adminUsers.actions.saving")}</span>
                </>
              ) : step === "form" ? (
                <>
                  <span>{t("adminUsers.actions.continue")}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                  <span>{t("adminUsers.actions.confirmCreate")}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckItem({ check, label }: { readonly check: boolean; readonly label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "material-symbols-outlined text-[15px]",
          check ? "text-emerald-500 font-bold" : "text-on-surface-variant/40",
        )}
      >
        {check ? "check_circle" : "radio_button_unchecked"}
      </span>
      <span className={cn(check ? "text-on-surface font-semibold" : "text-on-surface-variant/70")}>
        {label}
      </span>
    </div>
  );
}

function ConfirmRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-outline-variant/10 bg-surface-container-lowest/80 px-3.5 py-2">
      <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/60">
        {label}
      </p>
      <p className="truncate text-sm font-bold text-on-surface">{value}</p>
    </div>
  );
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  disabled,
  error,
  type = "text",
  inputMode,
}: {
  readonly icon?: string;
  readonly label: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
  readonly type?: string;
  readonly inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant/70">
        {label}
      </label>
      <div className="relative">
        {icon ? (
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[19px] text-on-surface-variant/60">
            {icon}
          </span>
        ) : null}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          type={type}
          inputMode={inputMode}
          disabled={disabled}
          className={cn(
            "h-11 w-full rounded-xl border bg-surface py-2.5 pr-3 text-sm text-on-surface outline-none transition-all placeholder:text-on-surface-variant/40 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
            icon ? "pl-11" : "px-3",
            error
              ? "border-error/60 focus:border-error focus:ring-error/10"
              : "border-outline-variant/30 focus:border-primary/50 focus:ring-primary/20",
          )}
        />
      </div>
      {error ? <p className="mt-1 text-xs text-error font-medium">{error}</p> : null}
    </div>
  );
}
