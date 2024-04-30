let templateDbName: string = '';

export function getTemplateDbName() {
  if (!templateDbName) {
    templateDbName = new Date()
      .toISOString()
      .substring(0, 23)
      .replace(/[-T:\.]/g, '');
  }
  return templateDbName;
}