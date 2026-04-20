import { useEffect, useMemo, useState } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";

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
// Must match the allowed special-character set in PASSWORD_REGEX.
const PASSWORD_SPECIAL = "@$!%*?&";
const PASSWORD_ALL = `${PASSWORD_LOWER}${PASSWORD_UPPER}${PASSWORD_DIGITS}${PASSWORD_SPECIAL}`;

function randomInt(maxExclusive: number) {
  if (!Number.isFinite(maxExclusive) || maxExclusive <= 0) {
    throw new Error("randomInt(maxExclusive) requires maxExclusive > 0");
  }
  // Rejection sampling to avoid modulo bias.
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

  // Ensure it satisfies the existing regex requirements.
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
  // Extremely defensive: should always pass due to construction.
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
    const passwordOk = PASSWORD_REGEX.test(password);
    const confirmOk = confirmPassword.length > 0 && confirmPassword === password;

    return {
      username,
      fullName,
      email,
      usernameOk,
      fullNameOk,
      emailOk,
      passwordOk,
      confirmOk,
      canSubmit: usernameOk && fullNameOk && emailOk && passwordOk && confirmOk,
    };
  }, [value.confirmPassword, value.email, value.fullName, value.password, value.username]);

  useEffect(() => {
    if (!open) return;
    setStep("form");
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={() => !busy && onClose()}
    >
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("adminUsers.create.modalTitle")}
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-2xl border border-outline-variant/20",
          "bg-surface-container-lowest/80 shadow-2xl backdrop-blur-md",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-headline text-lg font-extrabold text-on-surface">
                {t("adminUsers.create.title")}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {t("adminUsers.create.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
              aria-label={t("adminUsers.actions.close")}
              title={t("adminUsers.actions.close")}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4">
            {step === "form" ? (
              <>
                <Field
                  label={t("adminUsers.create.fields.username")}
                  placeholder="john.doe"
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
                  label={t("adminUsers.create.fields.fullName")}
                  placeholder="John Doe"
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
                  label={t("adminUsers.create.fields.email")}
                  placeholder="john@example.com"
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

                <Field
                  label={t("adminUsers.create.fields.password")}
                  value={value.password}
                  onChange={(v) => setValue((s) => ({ ...s, password: v }))}
                  disabled={busy}
                  type="password"
                  error={
                    !validation.passwordOk && value.password.length > 0
                      ? t("adminUsers.create.errors.password")
                      : undefined
                  }
                />
                <div className="-mt-2 flex justify-end">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => {
                      const next = generatePassword();
                      setValue((s) => ({
                        ...s,
                        password: next,
                        confirmPassword: next,
                      }));
                    }}
                    className="inline-flex h-9 items-center gap-2 rounded-xl bg-surface-container-low px-3 text-xs font-bold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
                    aria-label="Generate a random password"
                    title="Generate a random password"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      auto_awesome
                    </span>
                    Generate password
                  </button>
                </div>
                <Field
                  label={t("adminUsers.create.fields.confirmPassword")}
                  value={value.confirmPassword}
                  onChange={(v) =>
                    setValue((s) => ({ ...s, confirmPassword: v }))
                  }
                  disabled={busy}
                  type="password"
                  error={
                    !validation.confirmOk && value.confirmPassword.length > 0
                      ? t("adminUsers.create.errors.confirmPassword")
                      : undefined
                  }
                />

                <p className="rounded-xl bg-surface-container-low px-3 py-2 text-xs text-on-surface-variant">
                  {t("adminUsers.create.passwordHint")}
                </p>
              </>
            ) : (
              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-lowest/70 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {t("adminUsers.create.confirm.title")}
                </p>
                <div className="mt-3 space-y-2">
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
                <p className="mt-3 text-xs text-on-surface-variant">
                  {t("adminUsers.create.confirm.note")}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 flex justify-end gap-2">
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
              className="h-11 rounded-xl px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
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
              className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? t("adminUsers.actions.saving")
                : step === "form"
                  ? t("adminUsers.actions.continue")
                  : t("adminUsers.actions.confirmCreate")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-container-low/50 px-3 py-2">
      <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </p>
      <p className="truncate text-sm font-semibold text-on-surface">{value}</p>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  error,
  type = "text",
  inputMode,
}: {
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
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        type={type}
        inputMode={inputMode}
        disabled={disabled}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3 text-sm text-on-surface outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error/60 focus:border-error/60 focus:ring-error/10"
            : "border-outline-variant/40 focus:border-primary/50 focus:ring-primary/10",
        )}
      />
      {error ? (
        <p className="mt-1 text-xs text-error">{error}</p>
      ) : null}
    </div>
  );
}

