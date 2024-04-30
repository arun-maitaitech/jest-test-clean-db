import { deleteDb } from './dbRelatedFunctions';
import { getMainDataSource } from './mainDataSource_singleton';
import { getTemplateDbName } from './templateDbNameGenerator_singleton';

export default async () => {
  console.log(`111`);
  const templateDbName = getTemplateDbName();
  const mainDataSource = await getMainDataSource();
  console.log(`Deleting the template database with the name "${templateDbName}"...`);
  await deleteDb(mainDataSource, templateDbName);
  return;
};
