import type { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";
import { useMemo } from "react";
import { FormField } from "@shared/components/FormField";
import { Input } from "@shared/components/Input";
import { CustomSelect } from "@shared/components/CustomSelect";

export interface RoomBasicInfoValues {
  roomName: string;
  buildingId: number;
  capacity: number;
  roomTypeId: number;
}

export interface BasicOption {
  value: number;
  label: string;
}

interface Props {
  t: (key: string) => string;
  register: UseFormRegister<RoomBasicInfoValues>;
  setValue: UseFormSetValue<RoomBasicInfoValues>;
  errors: FieldErrors<RoomBasicInfoValues>;
  saving: boolean;
  loadPending: boolean;
  buildingId: number;
  roomTypeId: number;
  buildingOptions: readonly BasicOption[];
  roomTypeOptions: readonly BasicOption[];
}

export function RoomBasicInfoSection({
  t,
  register,
  setValue,
  errors,
  saving,
  loadPending,
  buildingId,
  roomTypeId,
  buildingOptions,
  roomTypeOptions,
}: Props) {
  const disabled = saving || loadPending;

  const buildingSelectOptions = useMemo(
    () => buildingOptions.map((o) => ({ value: o.value, label: o.label })),
    [buildingOptions],
  );
  const roomTypeSelectOptions = useMemo(
    () => roomTypeOptions.map((o) => ({ value: o.value, label: o.label })),
    [roomTypeOptions],
  );

  return (
    <section className="rounded-2xl bg-surface-container-lowest p-8 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
      <div className="mb-6 flex items-center gap-3 border-b border-surface-container-low pb-4">
        <span className="material-symbols-outlined text-primary">info</span>
        <h2 className="font-headline text-lg font-bold text-primary">
          {t("adminRooms.upsert.core.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormField
          label={t("adminRooms.upsert.core.roomName")}
          required
          error={errors.roomName?.message as string | undefined}
        >
          <Input
            {...register("roomName")}
            placeholder="e.g. Athena-204"
            isError={!!errors.roomName}
            disabled={disabled}
          />
        </FormField>

        <FormField
          label={t("adminRooms.upsert.core.building")}
          required
          error={errors.buildingId?.message as string | undefined}
        >
          <input type="hidden" {...register("buildingId", { valueAsNumber: true })} />
          <CustomSelect
            value={buildingId}
            options={buildingSelectOptions}
            onChange={(val) =>
              setValue("buildingId", Number(val), { shouldValidate: true })
            }
            className="w-full"
            dataField="buildingId"
            isError={!!errors.buildingId}
            disabled={disabled}
          />
        </FormField>

        <FormField
          label={t("adminRooms.upsert.core.capacity")}
          required
          error={errors.capacity?.message as string | undefined}
        >
          <Input
            type="number"
            {...register("capacity", { valueAsNumber: true })}
            isError={!!errors.capacity}
            disabled={disabled}
          />
        </FormField>

        <FormField
          label={t("adminRooms.upsert.core.roomType")}
          required
          error={errors.roomTypeId?.message as string | undefined}
        >
          <input type="hidden" {...register("roomTypeId", { valueAsNumber: true })} />
          <CustomSelect
            value={roomTypeId}
            options={roomTypeSelectOptions}
            onChange={(val) =>
              setValue("roomTypeId", Number(val), { shouldValidate: true })
            }
            className="w-full"
            dataField="roomTypeId"
            isError={!!errors.roomTypeId}
            disabled={disabled}
          />
        </FormField>
      </div>
    </section>
  );
}

