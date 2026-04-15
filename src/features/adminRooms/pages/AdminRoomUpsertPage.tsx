import { useEffect, useMemo } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { useAdminRoomUpsertForm } from "../hooks/useAdminRoomUpsertForm";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAdminRoomCreateMutation,
  useAdminRoomDetailQuery,
  useAdminRoomUpdateMutation,
} from "../hooks/useAdminRoomsQueries";
import { presentAppSuccess } from "@shared/errors/presentAppSuccess";
import { useAppToastStore } from "@shared/errors/appToastStore";
import { messageForAdminRoomsError } from "../utils/adminRoomsErrors";
import {
  RoomBasicInfoSection,
  type BasicOption,
} from "../components/RoomBasicInfoSection";
import {
  RoomEquipmentSection,
  type EquipmentCatalogItem,
  type SelectedEquipment,
} from "../components/RoomEquipmentSection";
import { RoomMediaSection } from "../components/RoomMediaSection";
import type { FieldErrors } from "react-hook-form";

const STATIC_EQUIPMENT_CATALOG = [
  { id: 1, name: "4K Projector", hint: "Ceiling Mounted" },
  { id: 2, name: "Smart Board", hint: 'Interactive 85"' },
  { id: 3, name: "Surround Audio", hint: "7.1 Channel" },
  { id: 4, name: "Video Conf.", hint: "Dual-Cam Array" },
  { id: 5, name: "Lectern PC", hint: "i9 High-End" },
  { id: 6, name: "Whiteboards", hint: "Magnetic Surface" },
] as const;

const STATIC_BUILDING_OPTIONS = [
  { value: 1, label: "adminRooms.reference.buildings.blockA" },
  { value: 2, label: "adminRooms.reference.buildings.blockB" },
] as const;

const STATIC_ROOM_TYPE_OPTIONS = [
  { value: 1, label: "adminRooms.reference.roomTypes.lectureHall" },
  { value: 2, label: "adminRooms.reference.roomTypes.seminarRoom" },
  { value: 3, label: "adminRooms.reference.roomTypes.computerLab" },
  { value: 4, label: "adminRooms.reference.roomTypes.workshop" },
] as const;

export const AdminRoomUpsertPage = () => {
  const { t } = useI18n();
  const { form } = useAdminRoomUpsertForm();
  const navigate = useNavigate();
  const { id: routeId } = useParams<{ id: string }>();

  const roomId = routeId ? Number.parseInt(routeId, 10) : NaN;
  const isEdit = Number.isFinite(roomId) && roomId > 0;

  const detailQuery = useAdminRoomDetailQuery(isEdit ? roomId : undefined);
  const createMutation = useAdminRoomCreateMutation();
  const updateMutation = useAdminRoomUpdateMutation();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = form;

  const isActive = watch("isActive");
  const buildingId = watch("buildingId");
  const roomTypeId = watch("roomTypeId");
  const equipments = watch("equipments");
  const imageUrls = watch("imageUrls");

  useEffect(() => {
    const d = detailQuery.data;
    if (!d || !isEdit) return;

    reset({
      roomName: d.roomName,
      buildingId: d.building.id,
      capacity: d.capacity,
      roomTypeId: d.roomType.id,
      isActive: d.status ? d.status === "AVAILABLE" : true,
      equipments: d.equipments.map((e) => ({
        id: e.id,
        quantity: e.quantity,
      })),
      imageUrls:
        d.imageUrls && d.imageUrls.length > 0
          ? d.imageUrls
          : ["https://picsum.photos/seed/room/1200/800"],
    });
  }, [detailQuery.data, isEdit, reset]);

  const equipmentCatalog = useMemo<readonly EquipmentCatalogItem[]>(() => {
    const d = detailQuery.data;
    const extra =
      d?.equipments
        .filter(
          (e) =>
            !STATIC_EQUIPMENT_CATALOG.some((s) => s.id === e.id),
        )
        .map((e) => ({
          id: e.id,
          name: e.name,
          hint: "",
        })) ?? [];
    return [...STATIC_EQUIPMENT_CATALOG, ...extra];
  }, [detailQuery.data]);

  const buildingOptions = useMemo<readonly BasicOption[]>(() => {
    const d = detailQuery.data;
    const fromDetail = d
      ? [{ value: d.building.id, label: d.building.name }]
      : [];
    const combined = [...fromDetail, ...STATIC_BUILDING_OPTIONS].filter(
      (o, idx, arr) => arr.findIndex((x) => x.value === o.value) === idx,
    );
    return combined;
  }, [detailQuery.data]);

  const roomTypeOptions = useMemo<readonly BasicOption[]>(() => {
    const d = detailQuery.data;
    const fromDetail = d
      ? [{ value: d.roomType.id, label: d.roomType.name }]
      : [];
    const combined = [...fromDetail, ...STATIC_ROOM_TYPE_OPTIONS].filter(
      (o, idx, arr) => arr.findIndex((x) => x.value === o.value) === idx,
    );
    return combined;
  }, [detailQuery.data]);

  const submit = handleSubmit(
    async (values) => {
    try {
      console.groupCollapsed("[AdminRoomUpsertPage] submit(valid)");
      console.log("isEdit:", isEdit, "routeId:", routeId, "roomId:", roomId);
      console.log("values:", values);
      console.log("detailQuery.data?.classroomId:", detailQuery.data?.classroomId);
      console.groupEnd();

      if (isEdit) {
        const cid = detailQuery.data?.classroomId ?? roomId;
        await updateMutation.mutateAsync({
          classroomId: cid,
          roomName: values.roomName,
          buildingId: values.buildingId,
          capacity: values.capacity,
          roomTypeId: values.roomTypeId,
          equipments: values.equipments.map((e) => ({
            id: e.id,
            quantity: e.quantity ?? 1,
          })),
          imageUrls: values.imageUrls,
          isActive: values.isActive,
        });
        presentAppSuccess(t("adminRooms.upsert.toasts.updated"));
        navigate(`/admin/rooms/${cid}/audit`);
        return;
      }

      const newId = await createMutation.mutateAsync({
        roomName: values.roomName,
        buildingId: values.buildingId,
        capacity: values.capacity,
        roomTypeId: values.roomTypeId,
        equipments: values.equipments.map((e) => ({
          id: e.id,
          quantity: e.quantity ?? 1,
        })),
        imageUrls: values.imageUrls,
        isActive: values.isActive,
      });
      presentAppSuccess(t("adminRooms.upsert.toasts.created"));
      navigate(newId ? `/admin/rooms/${newId}/audit` : "/admin/rooms");
    } catch (err) {
      console.groupCollapsed("[AdminRoomUpsertPage] submit(error)");
      console.log("isEdit:", isEdit, "routeId:", routeId, "roomId:", roomId);
      console.log("error:", err);
      console.groupEnd();

      useAppToastStore.getState().push({
        titleI18nKey: "common.errors.toast.genericTitle",
        message: messageForAdminRoomsError(err, t),
      });
    }
    },
    (invalid: FieldErrors) => {
      // If validation blocks submission, we still want a visible signal.
      // Focus the first invalid field when possible and show a toast.
      console.groupCollapsed(
        "[AdminRoomUpsertPage] submit(invalid) - client validation blocked",
      );
      console.log("invalid field errors:", invalid);
      console.log("current values:", watch());
      console.groupEnd();

      useAppToastStore.getState().push({
        titleI18nKey: "common.errors.toast.genericTitle",
        message: t("adminRooms.upsert.validationFix"),
      });

      const firstKey = Object.keys(invalid)[0];
      if (firstKey) {
        const byName = document.querySelector(
          `[name="${CSS.escape(firstKey)}"]`,
        ) as HTMLElement | null;

        const byDataFieldButton = document.querySelector(
          `[data-field="${CSS.escape(firstKey)}"] button`,
        ) as HTMLElement | null;
        const byDataFieldSection = document.querySelector(
          `[data-field="${CSS.escape(firstKey)}"]`,
        ) as HTMLElement | null;

        const el = byName ?? byDataFieldButton ?? byDataFieldSection;
        el?.scrollIntoView?.({ behavior: "smooth", block: "center" });
        (el as HTMLInputElement | null)?.focus?.();
      }
    },
  );

  const saving =
    isSubmitting ||
    createMutation.isPending ||
    updateMutation.isPending;
  // If the query errors but we already have cached data, keep the form usable.
  const loadError = isEdit && detailQuery.isError && !detailQuery.data;
  const loadPending = isEdit && detailQuery.isLoading;
  const disabled = saving || loadPending;

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            {t("adminRooms.upsert.title")}
          </h1>
            <p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
              {t("adminRooms.upsert.subtitle")}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-surface-container-low px-4 py-3">
            <span className="text-sm font-bold text-on-surface-variant">
              {t("adminRooms.upsert.status.label")}
            </span>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={isActive}
                disabled={saving || loadPending}
                onChange={(e) =>
                  setValue("isActive", e.target.checked, {
                    shouldValidate: true,
                  })
                }
              />
              <div className="h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all peer-checked:bg-tertiary-fixed-dim peer-checked:after:translate-x-full peer-checked:after:border-white" />
              <span className="ml-3 text-sm font-semibold text-on-tertiary-fixed-variant">
                {isActive
                  ? t("adminRooms.upsert.status.active")
                  : t("adminRooms.upsert.status.inactive")}
              </span>
            </label>
          </div>
        </div>

        {loadError ? (
          <div className="mb-6 rounded-2xl border border-error/30 bg-error-container/20 p-4 text-sm text-error">
            {t("adminRooms.upsert.loadError")}
          </div>
        ) : null}

        {loadPending ? (
          <div className="mb-6 rounded-2xl bg-surface-container-low p-6 text-sm text-on-surface-variant">
            {t("adminRooms.upsert.loading")}
          </div>
        ) : null}

        <form onSubmit={submit} className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left column */}
          <div className="space-y-8 lg:col-span-7">
            <RoomBasicInfoSection
              t={t}
              register={register as any}
              setValue={setValue as any}
              errors={errors as any}
              saving={saving}
              loadPending={loadPending}
              buildingId={buildingId}
              roomTypeId={roomTypeId}
              buildingOptions={buildingOptions}
              roomTypeOptions={roomTypeOptions}
            />

            <RoomEquipmentSection
              t={t}
              catalog={equipmentCatalog}
              selected={equipments as unknown as SelectedEquipment[]}
              setValue={setValue as any}
              disabled={disabled}
              error={errors.equipments as any}
            />
          </div>

          {/* Right column */}
          <div className="space-y-8 lg:col-span-5">
            <RoomMediaSection
              t={t}
              imageUrls={imageUrls}
              setValue={setValue as any}
              disabled={disabled}
              isSaving={saving}
              loadPending={loadPending}
              loadError={loadError}
              imageUrlsError={errors.imageUrls as any}
              onCancel={() => navigate("/admin/rooms")}
            />
          </div>
        </form>
      </div>
    </AppLayout>
  );
};
