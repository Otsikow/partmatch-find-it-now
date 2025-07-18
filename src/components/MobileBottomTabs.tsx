import { Home, Search, Plus, User, Package } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

const MobileBottomTabs = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  const tabs = [
    {
      icon: Home,
      label: t("home"),
      path: "/",
    },
    {
      icon: Search,
      label: t("browse"),
      path: "/search-parts",
    },
    {
      icon: Plus,
      label: t("request"),
      path: "/request-part",
      isSpecial: true, // Mark as special for different styling
    },
    {
      icon: Package,
      label: t("sellCarParts"),
      path: "/seller-dashboard",
    },
    {
      icon: User,
      label: user ? t("profile") : t("signIn"),
      path: user ? "/buyer-dashboard" : "/auth",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around py-1 px-2 max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          const isSpecial = tab.isSpecial;

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={cn(
                "flex flex-col items-center justify-center min-w-0 flex-1 py-2 px-1 relative touch-manipulation transition-all duration-200 rounded-xl group",
                "hover:bg-muted/50 active:scale-95",
                "min-h-[64px] max-w-[80px]",
                active && "text-primary",
                !active && "text-muted-foreground hover:text-foreground",
                isSpecial && !active && "text-primary/80"
              )}
              aria-label={tab.label}
            >
              {/* Icon container with better sizing and effects */}
              <div className={cn(
                "relative mb-1 transition-all duration-200",
                active && "scale-110",
                isSpecial && "p-1.5 bg-primary/10 rounded-full"
              )}>
                <Icon
                  className={cn(
                    "transition-all duration-200",
                    isSpecial ? "w-5 h-5" : "w-6 h-6",
                    active && "text-primary",
                    !active && isSpecial && "text-primary/80",
                    !active && !isSpecial && "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {/* Active indicator */}
                {active && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full animate-scale-in" />
                )}
              </div>
              
              {/* Label with better typography */}
              <span
                className={cn(
                  "text-xs font-medium leading-tight text-center transition-all duration-200",
                  "line-clamp-2 max-w-full",
                  active && "text-primary font-semibold",
                  !active && isSpecial && "text-primary/80",
                  !active && !isSpecial && "text-muted-foreground group-hover:text-foreground"
                )}
                style={{
                  fontSize: "0.65rem",
                  lineHeight: "0.85rem",
                  maxWidth: "100%",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomTabs;
