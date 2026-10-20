import { FullScreenLoader } from "@shared/components/FullScreenLoader";

// Presentational only: loading must never change the current route.
export const LoadingScreen = () => <FullScreenLoader />;

export default LoadingScreen;
