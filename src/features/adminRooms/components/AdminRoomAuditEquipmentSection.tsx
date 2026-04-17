export function AdminRoomAuditEquipmentSection(props: {
  equipments: Array<{ id: number; name: string }>;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const { equipments, t } = props;

  return (
    <section className="rounded-2xl border border-white/15 bg-white/10 p-8 shadow-[0_12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="flex items-center gap-3 font-headline text-xl font-bold text-on-surface">
          <span className="material-symbols-outlined text-primary">
            inventory_2
          </span>
          {t("adminRooms.audit.equipmentInventory.title")}
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {equipments.map((it) => (
          <div
            key={it.id}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-5 text-center backdrop-blur-md transition-shadow hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-primary-container/20">
              <span className="material-symbols-outlined text-2xl text-primary">
                precision_manufacturing
              </span>
            </div>
            <div>
              <p className="font-bold text-on-surface">{it.name}</p>
              <p className="text-xs font-medium text-on-surface-variant">
                {t("adminRooms.audit.equipmentInventory.quantity", {
                  value: "—",
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

