import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useAdminRoomUpsertSchema = () =>
  useMemo(
    () =>
      z.object({
        roomName: z.string().min(1).max(50),
        buildingId: z.number().int().positive(),
        capacity: z.number().int().min(10).max(200),
        roomTypeId: z.number().int().positive(),
        isActive: z.boolean(),
        equipments: z
          .array(
            z.object({
              id: z.number().int().positive(),
              quantity: z.preprocess(
                (v) => (v == null ? 1 : v),
                z.number().int().min(1).max(10),
              ),
            }),
          )
          .min(1),
        imageUrls: z.array(z.string().url()).min(1).max(5),
      }),
    [],
  );

export type AdminRoomUpsertFormValues = z.infer<
  ReturnType<typeof useAdminRoomUpsertSchema>
>;

export function useAdminRoomUpsertForm() {
  const schema = useAdminRoomUpsertSchema();

  const form = useForm<AdminRoomUpsertFormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      roomName: "",
      buildingId: 1,
      capacity: 45,
      roomTypeId: 1,
      isActive: true,
      equipments: [{ id: 1, quantity: 1 }],
      imageUrls: ["https://picsum.photos/seed/room/1200/800"],
    },
  });

  return { form };
}

