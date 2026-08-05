import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getUser, signOut } from "@/lib/auth";

export function useAuth() {
  const navigate = useNavigate();
  const [user, setUser] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const u = getUser();
    setUser(u);
    setChecked(true);
    if (!u) navigate({ to: "/login", replace: true });
  }, [navigate]);

  return {
    user,
    ready: checked && user !== null,
    logout: () => {
      signOut();
      navigate({ to: "/login", replace: true });
    },
  };
}
