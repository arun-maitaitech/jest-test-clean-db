import {getTemplateDbName} from './templateDbNameGenerator_singleton';

export default async () => {
  const templateDbName = getTemplateDbName();
  console.log(templateDbName)
  return;
};
