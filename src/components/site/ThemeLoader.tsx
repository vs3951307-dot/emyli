import { useEffect } from "react";
import { useSiteSettings } from "@/lib/site-editor";

export function ThemeLoader() {
  const { data } = useSiteSettings();
  useEffect(() => {
    document.documentElement.dataset["siteTheme"] = data?.theme ?? "classic";
  }, [data?.theme]);
  return null;
}
