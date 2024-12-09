import { getMainDataSource, getMainDataSource_ofExistingTemplateDB } from './mainDataSource_singleton';
import { dumpSharedGlobalData } from './sharedGlobalData';
import { consoleDebug } from './utils';


export default async () => {
  let  mainDataSource = getMainDataSource();
  mainDataSource.createOrConnectToExistingTemplateDB();
  if(mainDataSource.wasEverInitialized()) {
    await mainDataSource.closeAndDelete_templateDb();
  }

  // consoleDebug(`globalTeardown - wasEverInitialized: ${mainDataSource.wasEverInitialized()}`);
  // if(mainDataSource.wasEverInitialized()) {
  //   await mainDataSource.closeAndDelete_templateDb();
  // } else {
  //   mainDataSource = await getMainDataSource_ofExistingTemplateDB();
  //   await mainDataSource.closeAndDelete_templateDb();
  // }
  return dumpSharedGlobalData();
};
