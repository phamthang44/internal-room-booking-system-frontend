import { useRef, useState } from "react";
import type { FieldError, UseFormSetValue } from "react-hook-form";
import type { AxiosError } from "axios";
import { apiClient } from "@core/api";
import { FormField } from "@shared/components/FormField";
import { Input } from "@shared/components/Input";
import { Button } from "@shared/components/Button";
import type { ApiResult } from "../types/adminRooms.api.types";

interface Props {
  t: (key: string) => string;
  imageUrls: readonly string[];
  setValue: UseFormSetValue<{ imageUrls: string[] }>;
  disabled: boolean;
  isSaving: boolean;
  loadPending: boolean;
  loadError: boolean;
  imageUrlsError?: FieldError;
  onCancel: () => void;
}

export function RoomMediaSection({
  t,
  imageUrls,
  setValue,
  disabled,
  isSaving,
  loadPending,
  loadError,
  imageUrlsError,
  onCancel,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const addImageUrl = (url: string) => {
    const trimmed = url.trim();
    if (!trimmed) return;
    setValue("imageUrls", [...imageUrls, trimmed].slice(0, 5), {
      shouldValidate: true,
    });
  };

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadError(null);

    const remaining = Math.max(0, 5 - imageUrls.length);
    if (remaining <= 0) {
      setUploadError(t("adminRooms.upsert.media.upload.maxReached"));
      return;
    }

    const picked = Array.from(files).slice(0, remaining);
    const form = new FormData();
    for (const f of picked) form.append("files", f);

    setIsUploading(true);
    try {
      const res = await apiClient.post<ApiResult<string[]>>(
        "/files/upload-multiple",
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      const urls = res.data?.data ?? [];
      setValue("imageUrls", [...imageUrls, ...urls].slice(0, 5), {
        shouldValidate: true,
      });
    } catch (e) {
      const err = e as AxiosError<{ message?: string }>;
      setUploadError(
        err.response?.data?.message ??
          err.message ??
          t("adminRooms.upsert.media.upload.failed"),
      );
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImageAt = (idx: number) => {
    setValue(
      "imageUrls",
      imageUrls.filter((_, i) => i !== idx),
      { shouldValidate: true },
    );
  };

  return (
    <section
      data-field="imageUrls"
      className={
        "flex h-full flex-col rounded-2xl bg-surface-container-lowest p-8 shadow-[0_2px_12px_rgba(24,28,30,0.06)]" +
        (imageUrlsError?.message ? " ring-2 ring-error/30" : "")
      }
    >
      <div className="mb-6 flex items-center gap-3 border-b border-surface-container-low pb-4">
        <span className="material-symbols-outlined text-primary">
          photo_camera
        </span>
        <h2 className="font-headline text-lg font-bold text-primary">
          {t("adminRooms.upsert.media.title")}
        </h2>
      </div>

      <div className="flex-1 space-y-6">
        <FormField
          label={t("adminRooms.upsert.media.upload.label")}
          error={uploadError ?? undefined}
        >
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              disabled={disabled || isUploading}
              onChange={(e) => void uploadImages(e.target.files)}
              className="block w-full text-sm text-on-surface-variant file:mr-3 file:rounded-xl file:border-0 file:bg-surface-container-low file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-surface hover:file:bg-surface-container"
            />
            <div className="text-xs text-on-surface-variant">
              {t("adminRooms.upsert.media.upload.hint")}
            </div>
          </div>
        </FormField>

        <FormField label={t("adminRooms.upsert.media.addUrl")} error={imageUrlsError?.message as string | undefined}>
          <div className="flex gap-2">
            <Input
              placeholder="https://..."
              disabled={disabled}
              isError={!!imageUrlsError}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addImageUrl((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>
        </FormField>

        <div className="grid grid-cols-2 gap-3">
          {imageUrls.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="group relative aspect-square overflow-hidden rounded-xl bg-surface-container-low"
            >
              <img
                src={url}
                alt={t("adminRooms.upsert.media.previewAlt")}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-primary/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  className="rounded-full bg-white/90 p-2 text-error"
                  disabled={disabled}
                  onClick={() => removeImageAt(idx)}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    delete
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-3 border-t border-surface-container-low pt-6">
          <Button
            type="submit"
            isLoading={isSaving || isUploading}
            disabled={loadPending || loadError || isUploading}
            className="w-full bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-lg shadow-primary/10 hover:shadow-primary/20"
          >
            <span className="material-symbols-outlined text-[20px]">save</span>
            {t("adminRooms.upsert.actions.save")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={onCancel}
          >
            {t("adminRooms.upsert.actions.cancel")}
          </Button>
        </div>
      </div>
    </section>
  );
}

