import { getMainDataSource } from './mainDataSource_singleton';
import { getTemplateDbName } from './templateDbNameGenerator_singleton';

export default async () => {
// module.exports = async function () {
  const templateDbName = getTemplateDbName();
  const mainDataSource = getMainDataSource();
  if (mainDataSource.wasEverInitialized() && templateDbName) {
    await mainDataSource.useMainDataSource_toDeleteDb(templateDbName);
  }
  return;
};
