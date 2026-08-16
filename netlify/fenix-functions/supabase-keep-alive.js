/**
 * Netlify scheduled function: ping up to two Supabase projects once per day
 * so Free-tier projects are not paused for inactivity.
 *
 * Secrets are read from Netlify site environment variables only.
 * Never import this module from frontend/client code.
 */

const PROJECTS = [
  {
    name: "Project 1",
    urlEnv: "SUPABASE_PROJECT_1_URL",
    keyEnv: "SUPABASE_PROJECT_1_SERVICE_ROLE_KEY",
    required: true,
  },
  {
    name: "Project 2",
    urlEnv: "SUPABASE_PROJECT_2_URL",
    keyEnv: "SUPABASE_PROJECT_2_SERVICE_ROLE_KEY",
    required: false,
  },
];

function hostOf(url) {
  try {
    return new URL(url).host;
  } catch {
    return "(invalid url)";
  }
}

async function pingProject({ name, urlEnv, keyEnv, required }) {
  const rawUrl = process.env[urlEnv];
  const key = process.env[keyEnv];
  const url = typeof rawUrl === "string" ? rawUrl.replace(/\/$/, "") : "";

  if (!url || !key) {
    if (required) {
      console.error(
        `[keep-alive] ${name}: error — missing ${urlEnv} and/or ${keyEnv}`
      );
      return { name, status: "error", reason: "missing_env" };
    }

    console.log(`[keep-alive] ${name}: skipped (env vars not set)`);
    return { name, status: "skipped" };
  }

  const endpoint = `${url}/rest/v1/keep_alive?select=id&id=eq.1&limit=1`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const body = (await response.text()).slice(0, 300);
      console.error(
        `[keep-alive] ${name}: error — HTTP ${response.status} ${response.statusText} (${hostOf(url)}) ${body}`
      );
      return { name, status: "error", reason: `http_${response.status}` };
    }

    const data = await response.json();
    const rows = Array.isArray(data) ? data.length : 0;
    console.log(
      `[keep-alive] ${name}: success — read ${rows} row(s) from keep_alive (${hostOf(url)})`
    );
    return { name, status: "success", rows };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[keep-alive] ${name}: error — request failed (${hostOf(url)}) ${message}`);
    return { name, status: "error", reason: "request_failed" };
  }
}

export default async (request) => {
  let nextRun = null;

  try {
    const payload = await request.json();
    nextRun = payload?.next_run ?? null;
  } catch {
    // Manual invokes may not include a scheduled-function body.
  }

  console.log("[keep-alive] starting", {
    nextRun,
    at: new Date().toISOString(),
  });

  const results = await Promise.all(
    PROJECTS.map((project) => pingProject(project))
  );

  const failed = results.filter((result) => result.status === "error");
  console.log("[keep-alive] finished", { results });

  return new Response(JSON.stringify({ ok: failed.length === 0, results, nextRun }), {
    status: failed.length === 0 ? 200 : 207,
    headers: { "Content-Type": "application/json" },
  });
};

export const config = {
  schedule: "@daily",
};
