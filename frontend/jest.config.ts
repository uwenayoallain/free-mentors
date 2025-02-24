import type { Config } from "jest";

const config: Config = {
  verbose: true,
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.ts"],
  extensionsToTreatAsEsm: [".ts", ".tsx"],
  transform: {
    "^.+\\.(t|j)sx?$": "@swc/jest",
  },
};

export default config;
