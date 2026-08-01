import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { UserMenu } from "./UserMenu";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-6 pb-24 md:pb-6 pt-6">
        <div className="max-w-[1400px] mx-auto">
          <div className="md:hidden mb-4 rounded-3xl border border-line bg-white/95 px-4 py-3 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sidebar-purple/80">RoomBook mobile</p>
                <p className="text-sm font-semibold text-ink-900 truncate">Fast access to rooms, calendar, and bookings</p>
              </div>
              <UserMenu />
            </div>
          </div>
          {children}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
