import { useEffect } from "react";
import { useUser } from "../../user-context";

export default function LoginPage() {
  const { logoutUser } = useUser();
  useEffect(() => {
    logoutUser();
  }, []);
  return "logging out...";
}
