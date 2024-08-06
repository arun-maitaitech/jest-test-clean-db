import { deleteDb } from './dbRelatedFunctions';
import { getMainDataSource, wasEverInitialized } from './mainDataSource_singleton';
import { getTemplateDbName } from './templateDbNameGenerator_singleton';

export default async () => {
  const templateDbName = getTemplateDbName();
  if (wasEverInitialized() && templateDbName) {
    const mainDataSource = await getMainDataSource();
    await deleteDb(mainDataSource, templateDbName);

    console.log(222222222222222);
    console.log(222222222222222);
    console.log(222222222222222);
    console.log(222222222222222);
  }
  return;
};
