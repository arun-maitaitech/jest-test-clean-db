import { deleteDb } from './dbRelatedFunctions';
import { getMainDataSource } from './mainDataSource_singleton';
import { getTemplateDbName } from './templateDbNameGenerator_singleton';

export default async () => {
  const templateDbName = getTemplateDbName();
  const mainDataSource = await getMainDataSource();
  await deleteDb(mainDataSource, templateDbName);
  return;
};
