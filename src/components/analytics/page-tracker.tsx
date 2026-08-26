"use client";

import { useEffect } from "react";

const VISITOR_KEY = "fx_visitor_id";

function getVisitorId(): string {
  try {
    let id = localStorage.getItem(VISITOR_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(VISITOR_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

/**
 * Fires a real page_view analytics event on mount. The visitor id (stored
 * client-side only for de-duplication) lets the backend compute unique visitors.
 */
export function PageTracker({
  workspaceId,
  pageId,
}: {
  workspaceId: string;
  pageId: string;
}) {
  useEffect(() => {
    const visitorId = getVisitorId();
    const params = new URLSearchParams(window.location.search);
    const utm = {
      source: params.get("utm_source"),
      medium: params.get("utm_medium"),
      campaign: params.get("utm_campaign"),
    };
    void fetch("/api/public/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        workspaceId,
        pageId,
        type: "page_view",
        visitorId,
        referrer: document.referrer || null,
        utm,
      }),
    }).catch(() => {});
  }, [workspaceId, pageId]);

  return null;
}
