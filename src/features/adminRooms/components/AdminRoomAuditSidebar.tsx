export function AdminRoomAuditSidebar(props: {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  formatIsoDateTime: (iso: string) => string;
  t: (key: string) => string;
}) {
  const { createdAt, createdBy, updatedAt, updatedBy, formatIsoDateTime, t } =
    props;

  return (
    <aside className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      <section className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-[0_12px_36px_rgba(0,0,0,0.10)] backdrop-blur-xl">
        <div className="border-b border-white/10 bg-white/10 p-6">
          <h2 className="font-headline text-lg font-bold text-on-surface">
            {t("adminRooms.audit.sidebar.auditAndMetadata")}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t("adminRooms.audit.sidebar.createdAt")}
              </p>
              <p className="text-xs font-semibold">
                {formatIsoDateTime(createdAt)}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t("adminRooms.audit.sidebar.createdBy")}
              </p>
              <p className="text-xs font-semibold">{createdBy}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t("adminRooms.audit.sidebar.lastUpdate")}
              </p>
              <p className="text-xs font-semibold">
                {formatIsoDateTime(updatedAt)}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {t("adminRooms.audit.sidebar.updatedBy")}
              </p>
              <p className="text-xs font-semibold">{updatedBy}</p>
            </div>
          </div>
        </div>
      </section>
    </aside>
  );
}

