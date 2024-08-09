const shouldLogDebug = Boolean(process.env.JEST_TEST_CLEAN_DB_DEBUG);

export const consoleDebug = (...args: unknown[]) => {
  if (shouldLogDebug) {
    console.debug(...args);
  }
}