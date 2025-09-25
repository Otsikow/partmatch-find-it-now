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
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border/50 shadow-xl z-50 safe-area-pb">
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
                "hover:bg-secondary/15 active:scale-95",
                "min-h-[64px] max-w-[70px]",
                active && "text-primary bg-primary/10 shadow-sm",
                !active && "text-foreground/70 hover:text-foreground",
                isSpecial && !active && "text-primary/95 hover:text-primary"
              )}
              aria-label={t(tab.labelKey)}
            >
              <div
                className={cn(
                  "relative mb-1 transition-all duration-300",
                  active && "scale-110",
                  isSpecial && "p-1.5 bg-primary/20 rounded-full shadow-md border border-primary/30"
                )}
              >
                <Icon
                  className={cn(
                    "transition-all duration-300 drop-shadow-sm",
                    isSpecial ? "w-5 h-5" : "w-5 h-5",
                    active && "text-primary font-bold",
                    !active && isSpecial && "text-primary/95",
                    !active &&
                      !isSpecial &&
                      "text-foreground/70 group-hover:text-foreground"
                  )}
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-scale-in shadow-md border border-primary/50" />
                )}
              </div>

              <span
                className={cn(
                  "text-xs font-medium leading-tight text-center transition-all duration-300 drop-shadow-sm",
                  "line-clamp-2 max-w-full font-roboto",
                  active && "text-primary font-bold",
                  !active && isSpecial && "text-primary/95 font-medium",
                  !active &&
                    !isSpecial &&
                    "text-foreground/70 group-hover:text-foreground"
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
