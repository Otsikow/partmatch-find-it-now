import { Home, Search, Plus, User, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const MobileBottomTabs = () => {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const tabs = [
    {
      icon: Home,
      labelKey: "home",
      path: "/",
    },
    {
      icon: Search,
      labelKey: "browse",
      path: "/search-parts",
    },
    {
      icon: Plus,
      labelKey: "request",
      path: "/request-part",
      isSpecial: true,
    },
    {
      icon: Package,
      labelKey: "sell",
      path: "/post-part",
    },
    {
      icon: User,
      labelKey: "profile",
      path: "/auth",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/98 backdrop-blur-md border-t border-border shadow-lg z-50 safe-area-pb">
      <div className="flex items-center justify-around py-1 px-2 max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          const isSpecial = tab.isSpecial;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              state={tab.path === "/" ? { explicitHomeNavigation: true } : undefined}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 relative touch-manipulation transition-all duration-300 rounded-xl group",
                "hover:bg-secondary/10 active:scale-95",
                "min-h-[64px] max-w-[70px]",
                active && "text-primary bg-primary/5",
                !active && "text-muted-foreground hover:text-secondary",
                isSpecial && !active && "text-primary/90"
              )}
              aria-label={t(tab.labelKey)}
            >
              <div
                className={cn(
                  "relative mb-1 transition-all duration-300",
                  active && "scale-110",
                  isSpecial && "p-1.5 bg-primary/15 rounded-full shadow-sm"
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-300",
                    isSpecial ? "w-5 h-5" : "w-5 h-5",
                    active && "text-primary",
                    !active && isSpecial && "text-primary/90",
                    !active &&
                      !isSpecial &&
                      "text-muted-foreground group-hover:text-secondary"
                  )}
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full animate-scale-in shadow-sm" />
                )}
              </div>

              <span
                className={cn(
                  "text-xs font-medium leading-tight text-center transition-all duration-300",
                  "line-clamp-2 max-w-full font-roboto",
                  active && "text-primary font-semibold",
                  !active && isSpecial && "text-primary/90",
                  !active &&
                    !isSpecial &&
                    "text-muted-foreground group-hover:text-secondary"
                )}
                style={{
                  fontSize: "0.7rem",
                  lineHeight: "0.9rem",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {t(tab.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomTabs;
