import { useState } from "react";
import { AppLayout } from "@shared/components/AppLayout";
import { useI18n } from "@shared/i18n/useI18n";
import { cn } from "@shared/utils/cn";
import { ProfileSection } from "../components/ProfileSection";
import { SecuritySection } from "../components/SecuritySection";
import { AppearanceSection } from "../components/AppearanceSection";

type Tab = "profile" | "security" | "appearance";

interface TabDef {
  id: Tab;
  icon: string;
  labelKey: string;
}

const TABS: TabDef[] = [
  { id: "profile", icon: "person", labelKey: "settings.tabs.profile" },
  { id: "security", icon: "lock", labelKey: "settings.tabs.security" },
  { id: "appearance", icon: "palette", labelKey: "settings.tabs.appearance" },
];

const SECTION_TITLES: Record<Tab, string> = {
  profile: "settings.profile.sectionTitle",
  security: "settings.security.sectionTitle",
  appearance: "settings.appearance.sectionTitle",
};

const SECTION_DESCRIPTIONS: Record<Tab, string> = {
  profile: "settings.profile.sectionDescription",
  security: "settings.security.sectionDescription",
  appearance: "settings.appearance.sectionDescription",
};

export const SettingsPage = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            {t("settings.title")}
          </h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            {t("settings.subtitle")}
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Left nav — desktop sidebar, top pills on mobile */}
          <nav className="flex shrink-0 flex-row gap-1 overflow-x-auto lg:w-48 lg:flex-col lg:overflow-x-visible">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                  activeTab === tab.id
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
                )}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {t(tab.labelKey as Parameters<typeof t>[0])}
              </button>
            ))}
          </nav>

          {/* Content panel */}
          <div className="min-w-0 flex-1">
            {/* Section header */}
            <div className="mb-6">
              <h2 className="font-headline text-xl font-bold text-on-surface">
                {t(SECTION_TITLES[activeTab] as Parameters<typeof t>[0])}
              </h2>
              <p className="mt-0.5 text-sm text-on-surface-variant">
                {t(SECTION_DESCRIPTIONS[activeTab] as Parameters<typeof t>[0])}
              </p>
            </div>

            {activeTab === "profile" && <ProfileSection />}
            {activeTab === "security" && <SecuritySection />}
            {activeTab === "appearance" && <AppearanceSection />}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
