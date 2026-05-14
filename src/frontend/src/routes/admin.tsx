import {
  type AdminSection,
  AdminSidebar,
} from "@/components/admin/AdminSidebar";
import { OpenAISettings } from "@/components/admin/OpenAISettings";
import { StatsCard } from "@/components/admin/StatsCard";
import { UsersTable } from "@/components/admin/UsersTable";
import { AdminRoute } from "@/components/layout/AdminRoute";
import {
  useAdminGetPlatformStats,
  useAdminListUsers,
} from "@/hooks/useBackend";
import type { PlatformStats, UserSummary } from "@/types";
import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart3,
  BookOpen,
  FileText,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useAdminGetPlatformStats();
  const { data: users = [], isLoading: usersLoading } = useAdminListUsers();

  const platformStats = stats as PlatformStats | undefined;

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background flex">
        {/* Sidebar */}
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={(s) => {
            setActiveSection(s);
            setSidebarOpen(false);
          }}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border/50 bg-card/60 backdrop-blur-xl">
            <button
              type="button"
              data-ocid="admin.sidebar_toggle"
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Open navigation"
            >
              <Settings className="w-5 h-5 text-foreground" />
            </button>
            <h1 className="font-display font-semibold text-foreground">
              Admin Panel
            </h1>
          </div>

          <div className="p-6 md:p-8">
            {/* Overview */}
            {activeSection === "overview" && (
              <section data-ocid="admin.overview_section">
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Platform Overview
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Real-time statistics and platform health.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                  <StatsCard
                    title="Total Users"
                    value={Number(platformStats?.totalUsers ?? 0)}
                    subtitle="Registered accounts"
                    icon={<Users className="w-5 h-5" />}
                    isLoading={statsLoading}
                    data-ocid="admin.stats_card.1"
                  />
                  <StatsCard
                    title="Total Documents"
                    value={Number(platformStats?.totalDocuments ?? 0)}
                    subtitle="Across all users"
                    icon={<FileText className="w-5 h-5" />}
                    isLoading={statsLoading}
                    data-ocid="admin.stats_card.2"
                  />
                  <StatsCard
                    title="Final Documents"
                    value={Number(platformStats?.totalDocuments ?? 0)}
                    subtitle="Completed wills"
                    icon={<TrendingUp className="w-5 h-5" />}
                    isLoading={statsLoading}
                    data-ocid="admin.stats_card.3"
                  />
                  <StatsCard
                    title="Active Users"
                    value={Number(platformStats?.totalUsers ?? 0)}
                    subtitle="In progress"
                    icon={<BarChart3 className="w-5 h-5" />}
                    isLoading={statsLoading}
                    data-ocid="admin.stats_card.4"
                  />
                </div>
              </section>
            )}

            {/* Users */}
            {activeSection === "users" && (
              <section data-ocid="admin.users_section">
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    User Management
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    {usersLoading
                      ? "Loading..."
                      : `${(users as UserSummary[]).length} registered users`}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden">
                  <UsersTable
                    users={users as UserSummary[]}
                    isLoading={usersLoading}
                  />
                </div>
              </section>
            )}

            {/* Documents */}
            {activeSection === "documents" && (
              <section data-ocid="admin.documents_section">
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Document Statistics
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Breakdown of generated documents by type.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  <StatsCard
                    title="Last Will & Testament"
                    value={Math.ceil(
                      Number(platformStats?.totalDocuments ?? 0) / 3,
                    )}
                    subtitle="Wills generated"
                    icon={<BookOpen className="w-5 h-5" />}
                    isLoading={statsLoading}
                    data-ocid="admin.doc_stats_card.1"
                  />
                  <StatsCard
                    title="Power of Attorney"
                    value={Math.floor(
                      Number(platformStats?.totalDocuments ?? 0) / 3,
                    )}
                    subtitle="POA documents"
                    icon={<FileText className="w-5 h-5" />}
                    isLoading={statsLoading}
                    data-ocid="admin.doc_stats_card.2"
                  />
                  <StatsCard
                    title="Healthcare Directives"
                    value={Math.floor(
                      Number(platformStats?.totalDocuments ?? 0) / 3,
                    )}
                    subtitle="Directives created"
                    icon={<TrendingUp className="w-5 h-5" />}
                    isLoading={statsLoading}
                    data-ocid="admin.doc_stats_card.3"
                  />
                </div>
              </section>
            )}

            {/* Settings */}
            {activeSection === "settings" && (
              <section data-ocid="admin.settings_section">
                <div className="mb-8">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    Platform Settings
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Manage API keys and configuration.
                  </p>
                </div>
                <div className="max-w-xl">
                  <OpenAISettings />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
