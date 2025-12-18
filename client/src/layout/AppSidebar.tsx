import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";


type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// --------------------------------------------------------
const navItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/ui-dashboard" },
  { icon: <CalenderIcon />, name: "Calendar", path: "/calendar" },
  { icon: <UserCircleIcon />, name: "User Profile", path: "/profile" },
  { name: "Form Elements", icon: <ListIcon />, path: "/form-elements" },
  { name: "Tables", icon: <TableIcon />, path: "/basic-tables" },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank" },
      { name: "404 Error", path: "/error-404" },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart" },
      { name: "Bar Chart", path: "/bar-chart" },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts" },
      { name: "Avatar", path: "/avatars" },
      { name: "Badge", path: "/badge" },
      { name: "Buttons", path: "/buttons" },
      { name: "Images", path: "/images" },
      { name: "Videos", path: "/videos" },
    ],
  },
];

const appsItems: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/dashboard" },
  { icon: <UserCircleIcon />, name: "User Management", path: "/users" },
];
// --------------------------------------------------------

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const activeItemRef = useRef<HTMLAnchorElement | null>(null);

  const isActive = useCallback(
    (path: string) => {
      if (!path) return false;
      const normalize = (p: string) => p.replace(/\/+$/, "") || "/";
      const current = normalize(location.pathname);
      const target = normalize(path);
      if (target === "/") return current === "/";
      return current === target || current.startsWith(target + "/");
    },
    [location.pathname]
  );

  useEffect(() => {
    const findParentMenu = (items: NavItem[]) => {
      for (const nav of items) {
        if (nav.subItems?.some((s) => isActive(s.path))) return nav.name;
        if (nav.path && isActive(nav.path)) return nav.name;
      }
      return null;
    };
    const parent = findParentMenu([...appsItems, ...navItems]);
    setOpenSubmenu(parent);
  }, [location.pathname, isActive]);

  useEffect(() => {
    if (activeItemRef.current && sidebarRef.current) {
      const sidebar = sidebarRef.current;
      const item = activeItemRef.current;
      const sidebarRect = sidebar.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      if (
        itemRect.top < sidebarRect.top + 80 ||
        itemRect.bottom > sidebarRect.bottom - 80
      ) {
        item.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [location.pathname, openSubmenu]);

  const handleSubmenuToggle = (name: string) => {
    setOpenSubmenu((prev) => (prev === name ? null : name));
  };

  const renderMenu = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav) => {
        // Submenus
        if (nav.subItems) {
          const isOpen = openSubmenu === nav.name;

          return (
            <li key={nav.name}>
              <button
                onClick={() => handleSubmenuToggle(nav.name)}
                className={`menu-item group ${
                  isOpen ? "menu-item-active" : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "lg:justify-start"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isOpen
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-brand-500" : ""
                    }`}
                  />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden ${
                  isOpen ? "max-h-96 mt-2" : "max-h-0"
                }`}
              >
                <ul className="space-y-1 ml-9">
                  {nav.subItems.map((subItem) => {
                    const active = isActive(subItem.path);
                    return (
                      <li key={subItem.name}>
                        <Link
                          to={subItem.path}
                          ref={active ? activeItemRef : null}
                          className={`menu-dropdown-item ${
                            active
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        }

        // Normal items
        const active = isActive(nav.path!);

        return (
          <li key={nav.name}>
            <Link
              to={nav.path!}
              ref={active ? activeItemRef : null}
              className={`menu-item group ${
                active ? "menu-item-active" : "menu-item-inactive"
              }`}
            >
              <span
                className={`menu-item-icon-size ${
                  active
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>

              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={sidebarRef}
    >
      <div
        className={`py-8 flex items-center gap-2 ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/" className="flex items-center gap-2">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/logo.png"
                alt="Logo"
                width={150}
                height={40}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/logo-dark.png"
                alt="Logo"
                width={150}
                height={40}
              />

              <span
                className={`ml-2 px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-600
                `}
              >
                FREE
              </span>
            </>
          ) : (
            <img
              src="/images/logo/logo-icon.png"
              alt="Logo"
              width={32}
              height={32}
            />
          )}
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div>
            <h2
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? "Apps" : <HorizontaLDots />}
            </h2>
            {renderMenu(appsItems)}

            <h2
              className={`mt-8 mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen
                ? "User Interface"
                : <HorizontaLDots />}
            </h2>
            {renderMenu(navItems)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
