import { defineConfig } from "tsup"
import { validateManifest } from "./src/build/validate-manifest"

validateManifest()

const SINGLETON_EXTERNALS = [
  "preact",
  "preact/hooks",
  "preact/jsx-runtime",
  "preact/compat",
  "@jackyzha0/quartz",
  "@jackyzha0/quartz/*",
  "vfile",
  "vfile/*",
  "unified",
]

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "components/index": "src/components/index.ts",
  },
  format: ["esm"],
  dts: true,
  tsconfig: "tsconfig.build.json",
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: "es2022",
  splitting: false,
  outDir: "dist",
  platform: "node",
  noExternal: ["@quartz-community/utils", "@quartz-community/types"],
  external: SINGLETON_EXTERNALS,
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);',
  },
  esbuildOptions(options) {
    options.jsx = "automatic"
    options.jsxImportSource = "preact"
  },
})
