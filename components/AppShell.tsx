import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex">
      <Sidebar />
      <main className="flex-1 min-w-0 px-4 md:px-6 pb-24 md:pb-6 pt-6">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
      <MobileNav />
    </div>
  );
}
