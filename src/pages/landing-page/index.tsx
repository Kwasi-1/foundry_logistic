import { Divider } from "@/components/ui/divider";
import PinnedApps from "./components/pinned-apps";
import TopBar from "./components/top-bar";
import LandingPageLayout from "./layout";

export default function LandingPage() {
  return (
    <LandingPageLayout>
      <div className="h-[calc(100vh-2rem)] relative flex flex-col ">
        <TopBar />
        <div className="relative mx-4 sm:mx-6 lg:mx-8 mb-4 p-3 rounded-3xl border  flex flex-col flex-grow overflow-y-auto scrollbar-hide scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          <div
            className="absolute inset-x-3 h-64 bg-[url('/images/foundry_ai_gradient.png')] bg-cover bg-center rounded-3xl z-0"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, black 70%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, black 70%, transparent 100%)",
            }}
          />
          <div
            className="absolute inset-0 bg-[url('/images/bg-grid.png')] w-[50%] mx-auto bg-center rounded-3xl opacity30 pointer-events-none scale-75"
            style={{
              top: "5%",
              height: "30%",
              opacity: "2%",
            }}
          />
          <div className=" flex flex-col flex-grow scale-80">
            {/* Scrollable area (Hero + Apps) */}
            <div className="relative z-10 flex flex-col flex-grow justify-center items-center max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-4 pt-4 relative">
                <h1
                  className="text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-[0%] font-medium text-black/[0.16] bg-clip-text transition-opacity duration-300 max-w-3xl"
                  style={{
                    backgroundImage: "url('/images/text-gradient.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  Turn everyday business activities into game-changing impact
                  with Foundry
                </h1>

                <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4 sm:px-0">
                  Empower your business with the tools needed for growth.
                </p>
              </div>

              <PinnedApps />

              <div className="flex-grow" />
            </div>

            <footer className="relative z-10 w-full py-6 text-center mt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-3">
                  <a
                    href="#"
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Get it on Google Play"
                  >
                    <img
                      src="/images/google-play-line.svg"
                      alt="Get it on Google Play"
                      className="h-10 w-auto"
                    />
                  </a>
                  <a
                    href="#"
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Download on the App Store"
                  >
                    <img
                      src="/images/app-store-line.svg"
                      alt="Download on the App Store"
                      className="h-10 w-auto"
                    />
                  </a>
                </div>
                <div className="flex space-x-4 text-gray-400">
                  <a
                    href="#"
                    className="text-base hover:text-gray-600 transition cursor-pointer"
                  >
                    Instagram
                  </a>
                  <Divider orientation="vertical" className="h-5" />
                  <a
                    href="#"
                    className="text-base hover:text-gray-600 transition cursor-pointer"
                  >
                    LinkedIn
                  </a>
                  <Divider orientation="vertical" className="h-5" />

                  <a
                    href="#"
                    className="text-base hover:text-gray-600 transition cursor-pointer"
                  >
                    Facebook
                  </a>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </LandingPageLayout>
  );
}
