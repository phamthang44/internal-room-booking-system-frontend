import type { FieldError, UseFormSetValue } from "react-hook-form";
import { cn } from "@shared/utils/cn";
import { Input } from "@shared/components/Input";

export interface EquipmentCatalogItem {
  id: number;
  name: string;
  hint?: string;
}

export interface SelectedEquipment {
  id: number;
  quantity: number;
}

interface Props {
  t: (key: string) => string;
  catalog: readonly EquipmentCatalogItem[];
  selected: readonly SelectedEquipment[];
  setValue: UseFormSetValue<{
    equipments: SelectedEquipment[];
  }>;
  disabled: boolean;
  error?: FieldError;
}

export function RoomEquipmentSection({
  t,
  catalog,
  selected,
  setValue,
  disabled,
  error,
}: Props) {
  const isSelected = (eqId: number) => selected.some((e) => e.id === eqId);
  const getQuantity = (eqId: number) =>
    selected.find((e) => e.id === eqId)?.quantity ?? 1;

  const toggleEquipment = (eqId: number) => {
    if (isSelected(eqId)) {
      setValue(
        "equipments",
        selected.filter((e) => e.id !== eqId),
        { shouldValidate: true },
      );
    } else {
      setValue("equipments", [...selected, { id: eqId, quantity: 1 }], {
        shouldValidate: true,
      });
    }
  };

  const setEquipmentQuantity = (eqId: number, quantity: number) => {
    setValue(
      "equipments",
      selected.map((e) =>
        e.id === eqId
          ? { ...e, quantity: Number.isFinite(quantity) ? quantity : 1 }
          : e,
      ),
      { shouldValidate: true },
    );
  };

  return (
    <section
      data-field="equipments"
      className={cn(
        "rounded-2xl bg-surface-container-lowest p-8 shadow-[0_2px_12px_rgba(24,28,30,0.06)]",
        error?.message && "ring-2 ring-error/30",
      )}
    >
      <div className="mb-6 flex items-center gap-3 border-b border-surface-container-low pb-4">
        <span className="material-symbols-outlined text-primary">
          construction
        </span>
        <h2 className="font-headline text-lg font-bold text-primary">
          {t("adminRooms.upsert.equipment.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {catalog.map((eq) => {
          const picked = isSelected(eq.id);
          const quantity = getQuantity(eq.id);
          return (
            <div
              key={eq.id}
              className={cn(
                "flex h-full min-h-[168px] flex-col rounded-2xl bg-surface-container-low p-4 transition-colors",
                "hover:bg-secondary-container/30",
              )}
            >
              <label className="flex min-h-0 cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={picked}
                  disabled={disabled}
                  onChange={() => toggleEquipment(eq.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 text-primary focus:ring-primary/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-blue-900">
                    {eq.name}
                  </p>
                  {eq.hint ? (
                    <p className="text-[10px] text-on-surface-variant">
                      {eq.hint}
                    </p>
                  ) : null}
                </div>
              </label>

              <div className="mt-auto flex min-h-[76px] flex-col justify-end pt-4">
                {picked ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-on-surface-variant">
                      {t("adminRooms.upsert.equipment.quantity")}
                    </p>
                    <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        disabled={disabled}
                        onClick={() =>
                          setEquipmentQuantity(eq.id, Math.max(1, quantity - 1))
                        }
                        aria-label={t("adminRooms.upsert.equipment.decreaseQty")}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          remove
                        </span>
                      </button>
                      <Input
                        type="number"
                        value={quantity}
                        disabled={disabled}
                        onChange={(e) =>
                          setEquipmentQuantity(
                            eq.id,
                            Math.min(10, Math.max(1, Number(e.target.value))),
                          )
                        }
                        className="h-9 w-14 shrink-0 px-2 py-0 text-center text-sm tabular-nums"
                      />
                      <button
                        type="button"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high transition-colors"
                        disabled={disabled}
                        onClick={() =>
                          setEquipmentQuantity(eq.id, Math.min(10, quantity + 1))
                        }
                        aria-label={t("adminRooms.upsert.equipment.increaseQty")}
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          add
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-[76px]" aria-hidden />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {error?.message ? (
        <p className="mt-3 text-xs text-error">{String(error.message)}</p>
      ) : null}
    </section>
  );
}

