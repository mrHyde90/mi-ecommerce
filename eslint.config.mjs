import nx from "@nx/eslint-plugin";

export default [
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    {
      "ignores": [
        "**/dist",
        "**/out-tsc",
        "**/vite.config.*.timestamp*",
        "**/vitest.config.*.timestamp*"
      ]
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.js",
            "**/*.jsx"
        ],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: [
                        "^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"
                    ],
                    depConstraints: [
                        // -- Layer (type:*) --
                        {
                            sourceTag: 'type:app',
                            onlyDependOnLibsWithTags: ['type:feature', 'type:data', 'scope:shared'],
                        },
                        {
                            sourceTag: 'type:feature',
                            onlyDependOnLibsWithTags: ['type:data', 'type:ui', 'scope:shared'],
                        },
                        {
                            sourceTag: 'type:data',
                            onlyDependOnLibsWithTags: ['scope:shared'],
                            bannedExternalImports: ['react-router-dom']
                        },
                        {
                            sourceTag: 'type:ui',
                            onlyDependOnLibsWithTags: ['type:ui', 'scope:shared'],
                        },
                        // -- Owner (scope:*) --
                        { sourceTag: "scope:app",      onlyDependOnLibsWithTags: ["scope:shared", "scope:checkout", "scope:catalog", "scope:customer"] },
                        { sourceTag: "scope:checkout", onlyDependOnLibsWithTags: ["scope:shared", "scope:checkout"] },
                        { sourceTag: "scope:catalog",  onlyDependOnLibsWithTags: ["scope:shared", "scope:catalog"] },
                        { sourceTag: "scope:customer", onlyDependOnLibsWithTags: ["scope:shared", "scope:customer"] },
                        { sourceTag: "scope:shared",   onlyDependOnLibsWithTags: ["scope:shared"] },
                    ]
                }
            ]
        }
    },
    {
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs"
        ],
        // Override or add rules here
        rules: {}
    }
];
