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

export function CreateUserModal({
  open,
  busy = false,
  onClose,
  onSubmit,
}: CreateUserModalProps) {
  const { t } = useI18n();
  const [value, setValue] = useState<CreateUserFormValue>({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const canSubmit = useMemo(() => {
    const v = value;
    if (!v.username.trim() || v.username.trim().length < 3) return false;
    if (!v.fullName.trim() || v.fullName.trim().length < 3) return false;
    if (!v.email.trim() || !v.email.includes("@")) return false;
    if (!PASSWORD_REGEX.test(v.password)) return false;
    if (v.confirmPassword !== v.password) return false;
    return true;
  }, [value]);

  useEffect(() => {
    if (!open) return;
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
            <Field
              label={t("adminUsers.create.fields.username")}
              placeholder="john.doe"
              value={value.username}
              onChange={(v) => setValue((s) => ({ ...s, username: v }))}
              disabled={busy}
            />
            <Field
              label={t("adminUsers.create.fields.fullName")}
              placeholder="John Doe"
              value={value.fullName}
              onChange={(v) => setValue((s) => ({ ...s, fullName: v }))}
              disabled={busy}
            />
            <Field
              label={t("adminUsers.create.fields.email")}
              placeholder="john@example.com"
              value={value.email}
              onChange={(v) => setValue((s) => ({ ...s, email: v }))}
              disabled={busy}
              inputMode="email"
            />

            <Field
              label={t("adminUsers.create.fields.password")}
              value={value.password}
              onChange={(v) => setValue((s) => ({ ...s, password: v }))}
              disabled={busy}
              type="password"
            />
            <Field
              label={t("adminUsers.create.fields.confirmPassword")}
              value={value.confirmPassword}
              onChange={(v) => setValue((s) => ({ ...s, confirmPassword: v }))}
              disabled={busy}
              type="password"
            />

            <p className="rounded-xl bg-surface-container-low px-3 py-2 text-xs text-on-surface-variant">
              {t("adminUsers.create.passwordHint")}
            </p>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="h-11 rounded-xl px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
            >
              {t("adminUsers.actions.cancel")}
            </button>
            <button
              type="button"
              disabled={busy || !canSubmit}
              onClick={() => onSubmit(value)}
              className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? t("adminUsers.actions.saving") : t("adminUsers.actions.create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  disabled,
  type = "text",
  inputMode,
}: {
  readonly label: string;
  readonly placeholder?: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly disabled?: boolean;
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
        className="h-11 w-full rounded-xl border border-outline-variant/40 bg-surface px-3 text-sm text-on-surface outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
}

