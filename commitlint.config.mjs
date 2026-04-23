/** @type {import("@commitlint/types").UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "refactor",
        "docs",
        "style",
        "test",
        "perf",
        "ci",
        "build",
        "revert",
      ],
    ],
    "subject-case": [0],
    "body-max-line-length": [1, "always", 120],
  },
};

export default config;
