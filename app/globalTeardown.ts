import { getMainDataSource } from './mainDataSource_singleton';
import { dumpSharedGlobalData } from './sharedGlobalData';
import { consoleDebug } from './utils';


export default async () => {
  let  mainDataSource = getMainDataSource();
  mainDataSource.createOrConnectToExistingTemplateDB();
  if(mainDataSource.wasEverInitialized()) {
    await mainDataSource.closeAndDelete_templateDb();
  }

  return dumpSharedGlobalData();
};
