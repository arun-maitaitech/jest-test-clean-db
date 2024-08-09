import { getMainDataSource } from './mainDataSource_singleton';

export default async () => {
  // module.exports = async function () {
  const mainDataSource = getMainDataSource();
  await mainDataSource.closeAndDelete_templateDb();
  return;
};
