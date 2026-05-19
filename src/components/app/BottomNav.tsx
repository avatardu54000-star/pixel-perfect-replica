import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Calendar, MessageCircle, ShoppingCart, User } from "lucide-react";

const ITEMS = [
  { to: "/", label: "Accueil", Icon: Home },
  { to: "/semaines", label: "Semaines", Icon: Calendar },
  { to: "/coach", label: "Coach", Icon: MessageCircle },
  { to: "/courses", label: "Courses", Icon: ShoppingCart },
  { to: "/profil", label: "Profil", Icon: User },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {ITEMS.map(({ to, label, Icon }) => {
          const active = to === "/" ? pathname === "/" : pathname.startsWith(to);
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={`flex flex-col items-center gap-1 py-2.5 text-xs transition-colors ${
                  active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`size-5 ${active ? "stroke-[2.5]" : ""}`} />
                <span className="font-medium">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}