import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-plugin-tailwindcss is intentionally omitted: the installed build
// (4.0.0-alpha.1) cannot resolve a Tailwind v4 design system, so it reports a
// config error instead of linting classnames. Re-add once v4 support lands.
export default defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
