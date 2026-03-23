import type { ReactNode } from "react";
import { useI18n } from "@shared/i18n/useI18n";
import { AuthHeader } from "./AuthHeader";
import { AuthFooter } from "./AuthFooter";

interface AuthLayoutProps {
  children: ReactNode;
  showLeftPanel?: boolean;
}

export const AuthLayout = ({
  children,
  showLeftPanel = true,
}: AuthLayoutProps) => {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <AuthHeader />

      {/* Main Content */}
      <main className="flex items-stretch flex-1 pt-16 pb-32">
        {/* Left Panel - Image (Hidden on mobile) */}
        {showLeftPanel && (
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary">
            <img
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
              alt="Modern glass library interior"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3j9b_Gu3Ic9i8nNdFMtVIbQSsfALrv1x8MPrOo_TGIeoDdzUIRhC6GlTnpmxFIslLaxD2Fx1jTgnPGAcMpt9A2cv6X4FKci65_b_x33O3mg86-xXpiZvJYyLcG_1dZxRkzhzrMHcc7EtEEbGOa2JYX5YwFrHRg0rfmVJ0UGjzNE0RyMkTE2Fttenf_ovlkbi11qwGGGKiPEbjICcfMAp79VWHJNCaRPJzOva6zy1vB7NrzP272vsXphRZ_duxbf9euhI4N4Sat4A"
            />
            <div className="relative z-10 flex flex-col justify-end p-16 text-white max-w-xl">
              <h2 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight font-headline">
                {t("common.layout.leftPanel.title")}
              </h2>
              <p className="text-lg text-white/80 font-light leading-relaxed">
                {t("common.layout.leftPanel.description")}
              </p>
            </div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
          </div>
        )}

        {/* Right Panel - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-surface-container-low">
          <div className="w-full max-w-md space-y-8">{children}</div>
        </div>
      </main>

      {/* Footer */}
      <AuthFooter />
    </div>
  );
};
