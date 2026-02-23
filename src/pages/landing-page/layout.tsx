import { ReactNode } from "react";
import LandingPageSideBar from "./components/side-bar";

export default function LandingPageLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-primary-gray/100 p-2 md:p-4 px-0 md:pl-0">
      <div className="hidden lg:block fixed h-[calc(100vh-1rem)] z-50">
        <LandingPageSideBar />
      </div>
      <div className=" h-[calc(100vh-2rem)] flex-1 bg-white rounded-3xl  relative flex flex-col  lg:ml-20">
        {children}
      </div>
    </div>
  );
}
