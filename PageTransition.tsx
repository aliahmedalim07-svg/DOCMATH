import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const BASE = "https://drzeyadmohamedmath.com";

export function CanonicalUrl() {
  const { pathname } = useLocation();

  useEffect(() => {
    const clean = pathname.replace(/\/+$/, "") || "/";
    const url = `${BASE}${clean}`;
    let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [pathname]);

  return null;
}
