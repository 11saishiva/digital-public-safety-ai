import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-surface py-6 text-center text-xs text-ink-muted">
        Digital Public Safety AI Platform &middot; For fraud awareness and detection support only.
      </footer>
    </div>
  );
}
