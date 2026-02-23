import { lazy, Suspense, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";


const LandingPage = lazy(() => import("./pages/landing-page"));

const MainDashboardLayout = lazy(
  () => import("./layouts/dashboard/main-layout"),
);


function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export const AppRouter = () => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen  overflow-hidden items-center justify-center bg-gray-50">
          <img
            src="/images/logo-dark.svg"
            alt="Loading"
            className="h-10 w-auto animate-pulse"
          />
        </div>
      }
    >
      <ScrollToTop />
      <Routes>
        <Route path="appointment" element={<LandingPage />}/>
      </Routes>
    </Suspense>
  );
};
