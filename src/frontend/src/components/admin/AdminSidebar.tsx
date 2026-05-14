import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  FileBarChart2,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";

export type AdminSection = "overview" | "users" | "documents" | "settings";

const NAV_ITEMS: {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  {
    id: "overview",
    label: "Dashboard",
    icon: <LayoutDashboard size={18} />,
    description: "Platform analytics",
  },
  {
    id: "users",
    label: "Users",
    icon: <Users size={18} />,
    description: "Manage accounts",
  },
  {
    id: "documents",
    label: "Documents",
    icon: <FileBarChart2 size={18} />,
    description: "Stats & breakdown",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={18} />,
    description: "OpenAI & config",
  },
];

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSectionChange: (s: AdminSection) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({
  activeSection,
  onSectionChange,
  isOpen,
  onClose,
}: AdminSidebarProps) {
  const handleNav = (id: AdminSection) => {
    onSectionChange(id);
    onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Enter" && onClose()}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        data-ocid="admin.sidebar"
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 lg:z-auto lg:h-auto lg:min-h-[calc(100vh-4rem)]",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <ShieldCheck size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground font-display">
                Admin Panel
              </p>
              <p className="text-[10px] text-muted-foreground">
                Management console
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden h-7 w-7"
            aria-label="Close sidebar"
            data-ocid="admin.sidebar.close_button"
            type="button"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              data-ocid={`admin.sidebar.${item.id}_tab`}
              onClick={() => handleNav(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-smooth",
                activeSection === item.id
                  ? "bg-primary/15 text-primary border border-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <span
                className={cn(
                  "shrink-0",
                  activeSection === item.id
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {item.icon}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </nav>

        <Separator className="mx-3" />
        <div className="px-5 py-4">
          <p className="text-[10px] text-muted-foreground">
            Will Maker AI — Admin Console
          </p>
        </div>
      </aside>
    </>
  );
}
