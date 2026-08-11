"use client";

import { useEffect, useState, type ReactNode } from "react";
import { initialiseAnalytics, trackEvent } from "@/lib/analytics";
import { ConsentBanner } from "@/components/ConsentBanner";

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/public-config?experiment=tai-academia", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((config: { analyticsEnabled?: boolean } | null) => {
        if (!active || config?.analyticsEnabled !== true) return;
        setEnabled(true);
        initialiseAnalytics();
      })
      .catch(() => undefined);

    const handleTrackedClick = (event: MouseEvent) => {
      const target = event.target instanceof Element
        ? event.target.closest<HTMLElement>("[data-analytics-event]")
        : null;
      if (!target) return;
      trackEvent(target.dataset.analyticsEvent || "cta_click", {
        placement: target.dataset.analyticsPlacement || "unknown",
      });
    };

    document.addEventListener("click", handleTrackedClick);
    return () => {
      active = false;
      document.removeEventListener("click", handleTrackedClick);
    };
  }, []);

  return (
    <>
      {children}
      {enabled ? <ConsentBanner /> : null}
    </>
  );
}
