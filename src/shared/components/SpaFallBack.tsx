export type SpaFallBackProps = {
  title?: string;
  subtitle?: string;
};

export const SpaFallBack = ({
  title = "Loading…",
  subtitle = "Preparing the application",
}: SpaFallBackProps) => {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div
        className="absolute bottom-0 left-0 w-96 h-96 bg-primary opacity-5 rounded-full blur-3xl -z-10 animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="text-center space-y-6 px-6 max-w-md animate-fadeIn">
        <div className="flex justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-outline-variant opacity-30" />
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
              style={{
                borderTopColor: "rgb(0, 32, 69)",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-on-surface">{title}</h2>
          <p className="text-sm text-on-surface-variant">{subtitle}</p>
        </div>

        <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-primary to-inverse-primary animate-pulse rounded-full" />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SpaFallBack;
