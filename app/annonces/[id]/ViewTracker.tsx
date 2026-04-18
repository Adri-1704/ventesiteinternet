"use client";
import { useEffect } from "react";

export function ViewTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    const key = `vsi-view-${listingId}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    const timer = setTimeout(() => {
      fetch("/api/track-view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      }).catch(() => {});
    }, 2000);

    return () => clearTimeout(timer);
  }, [listingId]);

  return null;
}
