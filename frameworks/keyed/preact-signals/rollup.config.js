import babel from "@rollup/plugin-babel"
import resolve from "@rollup/plugin-node-resolve"

const plugins = [
    babel({
        babelHelpers: "bundled",
        exclude: "node_modules/**",
        plugins: [
            [
                "@babel/plugin-transform-react-jsx",
                {
                    runtime: "automatic",
                    importSource: "preact",
                },
            ],
        ],
    }),
    resolve({ extensions: [".js", ".jsx"] }),
]

if (process.env.production) {
    plugins.push(terser({ output: { comments: false } }))
}

export default {
    input: "src/main.jsx",
    output: {
        file: "dist/main.js",
        format: "iife",
        sourcemap: true,
    },
    plugins,
}
