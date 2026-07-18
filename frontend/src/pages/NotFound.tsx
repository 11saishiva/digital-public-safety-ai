import { NavLink } from "react-router-dom";
import { ShieldQuestion } from "lucide-react";
import { Button } from "../components/Button";

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <ShieldQuestion className="h-12 w-12 text-ink-muted" strokeWidth={1.5} />
      <h1 className="font-display text-xl font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <NavLink to="/">
        <Button>Back to home</Button>
      </NavLink>
    </div>
  );
}
