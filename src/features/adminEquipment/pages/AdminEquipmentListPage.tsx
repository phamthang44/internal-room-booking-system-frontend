import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";

export const AdminEquipmentListPage = () => {
  const { t } = useI18n();

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 md:py-8 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            {t("adminEquipment.list.title")}
          </h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              {t("adminEquipment.list.subtitle")}
            </p>
          </div>

          <button
            type="button"
            className={cn(
              "inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-on-primary",
              "shadow-lg hover:shadow-xl active:scale-[0.99] transition-all",
            )}
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            {t("adminEquipment.list.addType")}
          </button>
        </div>

        {/* Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { labelKey: "adminEquipment.list.metrics.totalItems", value: "1,428", badge: "+12%" },
            { labelKey: "adminEquipment.list.metrics.deploymentRate", value: "84.2%", badge: null },
            { labelKey: "adminEquipment.list.metrics.inMaintenance", value: "24", badge: null },
            { labelKey: "adminEquipment.list.metrics.activeRequests", value: "09", badge: null },
          ].map((m) => (
            <div
              key={m.labelKey}
              className="flex h-32 flex-col justify-between rounded-2xl bg-surface-container-lowest p-6 shadow-[0_2px_12px_rgba(24,28,30,0.06)]"
            >
              <span className="text-sm font-medium text-on-surface-variant">
                {t(m.labelKey as any)}
              </span>
              <div className="flex items-end justify-between">
                <span className="font-headline text-3xl font-extrabold text-on-surface">
                  {m.value}
                </span>
                {m.badge ? (
                  <span className="rounded-full bg-tertiary-container px-2 py-1 text-xs font-bold text-tertiary-fixed-dim">
                    {m.badge}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        {/* Table + tabs */}
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/30 p-6">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: t("adminEquipment.list.tabs.all") },
                { key: "av", label: t("adminEquipment.list.tabs.av") },
                { key: "furniture", label: t("adminEquipment.list.tabs.furniture") },
                { key: "computing", label: t("adminEquipment.list.tabs.computing") },
              ].map((tab, idx) => (
                <button
                  key={tab.key}
                  type="button"
                  className={cn(
                    "rounded-xl px-4 py-2 text-sm font-medium transition-colors",
                    idx === 0
                      ? "bg-white text-primary shadow-sm font-bold"
                      : "text-on-surface-variant hover:bg-white/50",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">
                filter_list
              </span>
              {t("adminEquipment.list.advancedFilters")}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="bg-surface-container-low text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  <th className="px-6 py-4">{t("adminEquipment.list.table.name")}</th>
                  <th className="px-6 py-4">{t("adminEquipment.list.table.category")}</th>
                  <th className="px-6 py-4">{t("adminEquipment.list.table.stock")}</th>
                  <th className="px-6 py-4">{t("adminEquipment.list.table.assignedTo")}</th>
                  <th className="px-6 py-4">{t("adminEquipment.list.table.health")}</th>
                  <th className="px-6 py-4 text-right">{t("adminEquipment.list.table.actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/10">
                {[
                  {
                    icon: "tv",
                    name: 'Sony Bravia 4K 75"',
                    asset: "AV-75-004",
                    category: "AV",
                    stock: "42 Units",
                    assigned: "38 Rooms (90%)",
                    health: { dot: "bg-tertiary-fixed-dim", label: "Optimal" },
                  },
                  {
                    icon: "chair",
                    name: "Herman Miller Aeron",
                    asset: "FR-HM-991",
                    category: "Furniture",
                    stock: "112 Units",
                    assigned: "12 Rooms (10%)",
                    health: { dot: "bg-tertiary-fixed-dim", label: "Optimal" },
                  },
                  {
                    icon: "laptop_chromebook",
                    name: "Mac Studio M2 Ultra",
                    asset: "CP-MS-002",
                    category: "Computing",
                    stock: "18 Units",
                    assigned: "3 Rooms (16%)",
                    health: { dot: "bg-amber-400", label: "Checking" },
                  },
                  {
                    icon: "settings_input_hdmi",
                    name: "Crestron NVX E30",
                    asset: "AV-CR-110",
                    category: "AV",
                    stock: "65 Units",
                    assigned: "62 Rooms (95%)",
                    health: { dot: "bg-error", label: "Critical", tone: "text-error" },
                  },
                ].map((row) => (
                  <tr key={row.asset} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-container-low">
                          <span className="material-symbols-outlined text-on-surface-variant">
                            {row.icon}
                          </span>
                        </div>
                        <div>
                          <p className="font-bold text-on-surface">{row.name}</p>
                          <p className="text-xs text-on-surface-variant">
                            Asset-ID: {row.asset}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                        {row.category}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-headline font-bold text-on-surface">
                      {row.stock}
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant">
                      {row.assigned}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full", row.health.dot)} />
                        <span className={cn("text-sm font-medium", row.health.tone)}>
                          {row.health.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="rounded-full p-2 text-slate-400 hover:bg-surface-container-high transition-colors">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant/10 bg-surface-container-low/30 px-6 py-4">
            <p className="text-xs font-medium text-on-surface-variant">
              {t("adminEquipment.list.pagination.showing", { from: 1, to: 10, total: 42 })}
            </p>
            <div className="flex items-center gap-2">
              <button className="rounded-xl border border-outline-variant/20 p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>
              <button className="rounded-xl bg-primary px-3 py-1 text-xs font-bold text-on-primary">
                1
              </button>
              <button className="rounded-xl px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                2
              </button>
              <button className="rounded-xl px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high transition-colors">
                3
              </button>
              <button className="rounded-xl border border-outline-variant/20 p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom area */}
        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="mb-3 font-headline text-lg font-bold">
              {t("adminEquipment.list.recent.title")}
            </h2>
            <div className="space-y-1 rounded-2xl bg-surface-container-lowest p-2 shadow-[0_2px_12px_rgba(24,28,30,0.06)]">
              {[
                {
                  iconWrap: "bg-secondary-container",
                  icon: "move_up",
                  title: "5x Sony Bravia assigned to West Wing",
                  meta: "Requested by Dr. Aris | 2 hours ago",
                  cta: "View Ticket",
                },
                {
                  iconWrap: "bg-error-container",
                  icon: "report",
                  title: "Mac Studio #4 reported faulty",
                  meta: "Lab 302 | 5 hours ago",
                  cta: "Dispatch Tech",
                },
              ].map((it) => (
                <div
                  key={it.title}
                  className="group flex items-center justify-between gap-4 rounded-xl p-4 hover:bg-surface-container-low transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn("flex h-8 w-8 items-center justify-center rounded-full", it.iconWrap)}>
                      <span className="material-symbols-outlined text-[16px] text-primary">
                        {it.icon}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{it.title}</p>
                      <p className="text-xs text-on-surface-variant">{it.meta}</p>
                    </div>
                  </div>
                  <button className="text-xs font-bold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                    {it.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-headline text-lg font-bold">
              {t("adminEquipment.list.quickStats.title")}
            </h2>
            <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-xl shadow-primary/20">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary-fixed-dim">
                {t("adminEquipment.list.quickStats.healthLabel")}
              </p>
              <p className="mb-4 font-headline text-4xl font-extrabold">98.2%</p>
              <p className="mb-6 text-sm opacity-80">
                {t("adminEquipment.list.quickStats.healthHint")}
              </p>
              <button className="w-full rounded-xl bg-white/10 py-3 text-sm font-bold backdrop-blur transition-colors hover:bg-white/20">
                {t("adminEquipment.list.quickStats.runAudit")}
              </button>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-on-primary-container/10 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

