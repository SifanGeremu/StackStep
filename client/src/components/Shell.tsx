import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "@/formic/components/AppShell";
import Button from "@/formic/components/Button";
import type { AppSidebarSection } from "@/formic/components/AppSidebar";
import { iconFor } from "@/formic/components/primitives";
import type { AuthState } from "@/hooks/useAuth";

export const NAV_SECTIONS: AppSidebarSection[] = [
  {
    title: "Roadmaps",
    items: [
      { key: "dashboard", label: "Projects", icon: "dashboard" },
      { key: "generate", label: "Generate", icon: "sparkles" },
    ],
  },
];

const ROUTES: Record<string, string> = {
  dashboard: "/dashboard",
  generate: "/generate",
};

type Auth = AuthState & { logout: () => void };

export function AuthedShell({
  auth,
  active,
  title,
  caption,
  actions,
  children,
}: {
  auth: Auth;
  active: string | null;
  title: string;
  caption?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    window.location.href = "/";
  };

  return (
    <AppShell
      sections={NAV_SECTIONS}
      active={active}
      onSelect={(key) => {
        const path = ROUTES[key];
        if (path) navigate(path);
      }}
      workspace={{ name: "StackStep", monogram: "S" }}
      user={{ name: auth.userEmail ?? "Account" }}
      title={title}
      caption={caption}
      actions={
        <>
          {actions}
          <Button variant="ghost" icon={iconFor("Sign out")} onClick={handleLogout}>
            Sign out
          </Button>
        </>
      }
    >
      {children}
    </AppShell>
  );
}
