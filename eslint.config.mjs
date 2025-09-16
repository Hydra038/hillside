export default [
  {
    extends: ["next/core-web-vitals"],
    rules: {
      "react/no-unescaped-entities": "off"
    },
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**"
    ]
  }
];
