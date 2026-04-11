import nextPlugin from "eslint-config-next";

const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "build/**",
      ".turbo/**",
    ],
  },
  ...nextPlugin,
  {
    rules: {
      "@next/next/no-page-custom-font": "off",
    },
  },
];

export default config;
