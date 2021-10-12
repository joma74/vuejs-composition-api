module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  // Run these files after jest has been
  // installed in the environment
  setupFilesAfterEnv: ["<rootDir>/tests/unit/jest.setup.ts"],
}
