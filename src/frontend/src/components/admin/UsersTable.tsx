import type { UserSummary } from "@/backend";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, User } from "lucide-react";
import { useState } from "react";

interface UsersTableProps {
  users: UserSummary[];
  isLoading: boolean;
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts / 1_000_000n)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function UserLoadingSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows
        <TableRow key={i}>
          {Array.from({ length: 4 }).map((__, j) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton cols
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function UserCard({ user, index }: { user: UserSummary; index: number }) {
  return (
    <div
      data-ocid={`admin.users.item.${index + 1}`}
      className="glass rounded-xl p-4 space-y-3"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User size={16} className="text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.name || "Unnamed"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0 text-xs">
          {String(user.documentCount)} docs
        </Badge>
      </div>
      <div className="text-xs text-muted-foreground">
        Joined {formatDate(user.createdAt)}
      </div>
    </div>
  );
}

export function UsersTable({ users, isLoading }: UsersTableProps) {
  const [search, setSearch] = useState("");

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-5" data-ocid="admin.users.section">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          data-ocid="admin.users.search_input"
        />
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: loading
              <div key={i} className="glass rounded-xl p-4 space-y-3">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : filtered.map((user, i) => (
              <UserCard key={user.userId.toString()} user={user} index={i} />
            ))}
        {!isLoading && filtered.length === 0 && (
          <div
            data-ocid="admin.users.empty_state"
            className="text-center py-10 text-muted-foreground"
          >
            No users found.
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-card hover:bg-card">
              <TableHead className="font-semibold text-foreground">
                Name
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Email
              </TableHead>
              <TableHead className="font-semibold text-foreground text-right">
                Documents
              </TableHead>
              <TableHead className="font-semibold text-foreground">
                Account Created
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <UserLoadingSkeleton />
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-muted-foreground"
                  data-ocid="admin.users.empty_state"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user, i) => (
                <TableRow
                  key={user.userId.toString()}
                  data-ocid={`admin.users.item.${i + 1}`}
                  className="hover:bg-card/50"
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User size={13} className="text-primary" />
                      </div>
                      <span className="truncate max-w-[140px]">
                        {user.name || "Unnamed"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    <span className="truncate max-w-[200px] block">
                      {user.email}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">
                      {String(user.documentCount)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(user.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
