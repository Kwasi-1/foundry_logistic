import { cn } from "@/lib/utils";
import { onLogout } from "@/store/auth/auth.slice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useAuth0 } from "@auth0/auth0-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function TopBar() {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { userInfo, organization } = useAppSelector((s) => s.auth);
  const { logout } = useAuth0();
  const dispatch = useAppDispatch();

  async function handleLogout() {
    await logout({ logoutParams: { returnTo: window.location.origin } });
    dispatch(onLogout());
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowUserDropdown(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showUserDropdown]);

  return (
    <motion.div className="bg-white px-3 md:px-6 py-4 flex items-center justify-end rounded-t-3xl">
      <div className="relative " ref={dropdownRef}>
        <motion.button
          onClick={() => setShowUserDropdown(!showUserDropdown)}
          className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 px-2 -my-2 mr-2 -mt-2 transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden flex-shrink-0">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userInfo?.name)}&background=4B5563&color=fff&size=40`}
              alt="User Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:flex flex-col items-start hidden">
            <span className="text-[12px] font-semibold text-primay-dark">
              {userInfo?.name}
            </span>
            <span className="text-xs text-ash-text">{organization?.name}</span>
          </div>

          {/* Dropdown Arrow */}
          <img
            src="/icons/down.svg"
            className={cn(
              "hidden md:block w-5 h-5 transition-transform",
              showUserDropdown ? "rotate-180" : "",
            )}
          />
        </motion.button>

        <AnimatePresence>
          {showUserDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white hover:bg-red-50 rounded-[12px] shadow-lg z-50 cursor-pointer"
            >
              <button
                onClick={() => {
                  handleLogout();
                }}
                className="w-full p-4 text-left text-red-600 flex items-center space-x-2 transition-colors"
              >
                {/*<img src="/icons/logout.svg" className="w-5 h-5" />*/}
                <p className="text-[0.86rem]">Sign Out</p>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
