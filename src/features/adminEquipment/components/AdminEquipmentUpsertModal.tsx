import { useEffect, useMemo, useState } from "react";
import { cn } from "@shared/utils/cn";
import { useI18n } from "@shared/i18n/useI18n";

export interface AdminEquipmentUpsertValue {
  nameVi: string;
  nameEn: string;
  descVi: string;
  descEn: string;
}

export interface AdminEquipmentUpsertModalProps {
  readonly open: boolean;
  readonly mode: "create" | "edit";
  readonly busy?: boolean;
  readonly initialValue?: Partial<AdminEquipmentUpsertValue>;
  readonly onClose: () => void;
  readonly onSubmit: (value: AdminEquipmentUpsertValue) => void;
}

export function AdminEquipmentUpsertModal({
  open,
  mode,
  busy = false,
  initialValue,
  onClose,
  onSubmit,
}: AdminEquipmentUpsertModalProps) {
  const { t } = useI18n();
  const [value, setValue] = useState<AdminEquipmentUpsertValue>({
    nameVi: "",
    nameEn: "",
    descVi: "",
    descEn: "",
  });

  useEffect(() => {
    if (!open) return;
    setValue({
      nameVi: initialValue?.nameVi ?? "",
      nameEn: initialValue?.nameEn ?? "",
      descVi: initialValue?.descVi ?? "",
      descEn: initialValue?.descEn ?? "",
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [initialValue?.descEn, initialValue?.descVi, initialValue?.nameEn, initialValue?.nameVi, onClose, open]);

  const validation = useMemo(() => {
    const nameVi = value.nameVi.trim();
    const nameEn = value.nameEn.trim();
    return {
      nameVi,
      nameEn,
      nameViOk: nameVi.length >= 2 && nameVi.length <= 120,
      nameEnOk: nameEn.length >= 2 && nameEn.length <= 120,
      canSubmit:
        nameVi.length >= 2 &&
        nameVi.length <= 120 &&
        nameEn.length >= 2 &&
        nameEn.length <= 120,
    };
  }, [value.nameEn, value.nameVi]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center p-4"
      role="presentation"
      onMouseDown={() => !busy && onClose()}
    >
      <div className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={
          mode === "create"
            ? t("adminEquipment.upsert.createTitle")
            : t("adminEquipment.upsert.editTitle")
        }
        className={cn(
          "relative w-full max-w-xl overflow-hidden rounded-2xl border border-outline-variant/20",
          "bg-surface-container-lowest/80 shadow-2xl backdrop-blur-md",
        )}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="font-headline text-lg font-extrabold text-on-surface">
                {mode === "create"
                  ? t("adminEquipment.upsert.createTitle")
                  : t("adminEquipment.upsert.editTitle")}
              </h2>
              <p className="mt-1 text-sm text-on-surface-variant">
                {t("adminEquipment.upsert.subtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-on-surface-variant hover:bg-surface-container-low disabled:opacity-50"
              aria-label={t("adminEquipment.actions.close")}
              title={t("adminEquipment.actions.close")}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <Field
              label={t("adminEquipment.upsert.fields.nameVi")}
              value={value.nameVi}
              onChange={(v) => setValue((s) => ({ ...s, nameVi: v }))}
              disabled={busy}
              error={
                !validation.nameViOk && value.nameVi.trim().length > 0
                  ? t("adminEquipment.upsert.errors.name")
                  : undefined
              }
            />
            <Field
              label={t("adminEquipment.upsert.fields.nameEn")}
              value={value.nameEn}
              onChange={(v) => setValue((s) => ({ ...s, nameEn: v }))}
              disabled={busy}
              error={
                !validation.nameEnOk && value.nameEn.trim().length > 0
                  ? t("adminEquipment.upsert.errors.name")
                  : undefined
              }
            />

            <TextAreaField
              label={t("adminEquipment.upsert.fields.descVi")}
              value={value.descVi}
              onChange={(v) => setValue((s) => ({ ...s, descVi: v }))}
              disabled={busy}
            />
            <TextAreaField
              label={t("adminEquipment.upsert.fields.descEn")}
              value={value.descEn}
              onChange={(v) => setValue((s) => ({ ...s, descEn: v }))}
              disabled={busy}
            />
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={busy}
              className="h-11 rounded-xl px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container-high disabled:opacity-50"
            >
              {t("adminEquipment.actions.cancel")}
            </button>
            <button
              type="button"
              disabled={busy || !validation.canSubmit}
              onClick={() =>
                onSubmit({
                  nameVi: validation.nameVi,
                  nameEn: validation.nameEn,
                  descVi: value.descVi.trim(),
                  descEn: value.descEn.trim(),
                })
              }
              className="h-11 rounded-xl bg-primary px-5 text-sm font-bold text-on-primary hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy
                ? t("adminEquipment.actions.saving")
                : mode === "create"
                  ? t("adminEquipment.actions.create")
                  : t("adminEquipment.actions.save")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  disabled,
  error,
}: {
  readonly label: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly disabled?: boolean;
  readonly error?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-11 w-full rounded-xl border bg-surface px-3 text-sm text-on-surface outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-error/60 focus:border-error/60 focus:ring-error/10"
            : "border-outline-variant/40 focus:border-primary/50 focus:ring-primary/10",
        )}
      />
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  disabled,
}: {
  readonly label: string;
  readonly value: string;
  readonly onChange: (v: string) => void;
  readonly disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-widest text-on-surface-variant/60">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        className={cn(
          "w-full resize-none rounded-xl border bg-surface px-3 py-2 text-sm text-on-surface outline-none transition-all focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50",
          "border-outline-variant/40 focus:border-primary/50 focus:ring-primary/10",
        )}
      />
    </div>
  );
}

