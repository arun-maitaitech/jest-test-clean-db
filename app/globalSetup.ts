import { getMainDataSource } from './mainDataSource_singleton';

// Initialize the DB
export const globalSetup = getMainDataSource().createTemplateDB();
export default async () => {
  await globalSetup;
};
