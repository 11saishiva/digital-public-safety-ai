import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, ShieldHalf } from "lucide-react";

const LINKS = [
  { to: "/", label: "Home" },
  { to: "/counterfeit", label: "Counterfeit Detection" },
  { to: "/scam", label: "Scam Detection" },
  { to: "/reports", label: "Reports" },
  { to: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy text-teal">
            <ShieldHalf className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-[15px] font-semibold leading-tight text-ink">
            Digital Public Safety AI
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? "bg-navy text-white" : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-md text-ink-muted hover:bg-surface-sunken md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-surface px-4 py-2 md:hidden">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded-md px-3.5 py-2.5 text-sm font-medium ${
                  isActive ? "bg-navy text-white" : "text-ink-muted hover:bg-surface-sunken hover:text-ink"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
