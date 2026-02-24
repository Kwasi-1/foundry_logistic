import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";

const MainDashboardLayout = lazy(
  () => import("@/layout/dashboard/main-layout"),
);

const NotFound = lazy(() => import("@/pages/not-found"));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const DashboardPage = lazy(() => import("@/pages/dashboard/index"));

export const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen overflow-hidden items-center justify-center bg-primary-gray/30">
          <img
            src="/icons/logo-dark.svg"
            alt="Loading"
            className="h-10 w-auto animate-pulse"
          />
        </div>
      }
    >
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        {/* <Route path="/" element={<DashboardPage />} /> */}

        <Route path="/dashboard" element={<MainDashboardLayout />}>
          <Route index element={<DashboardPage />} />
          {/* Logistics features will be added here */}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
