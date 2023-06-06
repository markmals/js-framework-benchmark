import { defineConfig } from "vite"

import preact from "@preact/preset-vite"
// import prefresh from "@prefresh/vite"

export default defineConfig({
    plugins: [
        preact(),
        // prefresh()
    ],
})
