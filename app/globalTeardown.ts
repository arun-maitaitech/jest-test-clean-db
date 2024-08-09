import { getMainDataSource } from './mainDataSource_singleton';
import { consoleDebug } from './utils';

export default async () => {
  const mainDataSource = getMainDataSource();
  consoleDebug(`jest-test-clean-db.globalTeardown - wasEverInitialized: ${mainDataSource.wasEverInitialized()}`);
  await mainDataSource.closeAndDelete_templateDb();
  return;
};
