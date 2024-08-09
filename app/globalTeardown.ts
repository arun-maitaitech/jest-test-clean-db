import { getMainDataSource } from './mainDataSource_singleton';
import { consoleDebug } from './utils';

const mainDataSource = getMainDataSource();
consoleDebug(`jest-test-clean-db.globalTeardown - wasEverInitialized: ${mainDataSource.wasEverInitialized()}`);
export const globalTeardown = mainDataSource.closeAndDelete_templateDb();
export default async () => {
  return await globalTeardown;
};
