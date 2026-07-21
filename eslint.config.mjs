import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const config = [
  ...nextVitals,
  ...nextTypeScript,
  { ignores: [".next/**", ".netlify/**", "netlify/**", "node_modules/**", "admin-server.js", "build.js", "migrate-to-supabase.js"] },
];

export default config;
