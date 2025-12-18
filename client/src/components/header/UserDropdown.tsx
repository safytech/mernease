import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signoutSuccess } from "@/store/user/userSlice";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  const handleSignout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    console.log("Signout clicked");

    try {
      const apiBase = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiBase}/api/user/signout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response status:", res.status);

      if (!res.ok) throw new Error("Failed to sign out");

      dispatch(signoutSuccess());
      navigate("/auth/signin");
    } catch (err) {
      console.error("Signout error:", err);
    } finally {
      closeDropdown();
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isOpen &&
        !buttonRef.current?.contains(e.target as Node) &&
        !menuRef.current?.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, [isOpen]);

  const DropdownMenu = (
    <div
      ref={menuRef}
      style={{
        position: "fixed",
        top: `${menuPosition.top}px`,
        right: `${menuPosition.right}px`,
        zIndex: 9999,
      }}
      className="w-[260px] flex flex-col rounded-2xl border border-gray-200 bg-white p-3 
                 shadow-lg dark:border-gray-800 dark:bg-gray-900 
                 origin-top-right animate-dropdown"
    >
      <div>
        <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-300">
          {currentUser?.fullname}
        </span>
        <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {currentUser?.email}
        </span>
        <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
          {currentUser?.role?.rolename}
        </span>
      </div>

      <hr className="my-3 border-gray-200 dark:border-gray-700" />

      <button
        onClick={handleSignout}
        className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg 
                   group text-theme-sm hover:bg-gray-100 hover:text-gray-700 
                   dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
      >
        <svg
          className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
          />
        </svg>
        Sign out
      </button>
    </div>
  );

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-brand-50)] text-[var(--color-brand-500)] text-md font-semibold">
          {currentUser?.fullname
            ? currentUser.fullname
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .toUpperCase()
                .substring(0, 2)
            : "UN"}
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {currentUser?.fullname}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && createPortal(DropdownMenu, document.body)}

      <style>{`
        @keyframes dropdown-fade {
          0% { opacity: 0; transform: scale(0.95) translateY(-5px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-dropdown {
          animation: dropdown-fade 0.15s ease-out forwards;
        }
      `}</style>
    </>
  );
}
