import utils from '../../utils/utils';

/// RemoveTZFromDateTransformer
export class RemoveTZFromDateIfNotNullTransformer {
  to(data: Date): Date {
    return data;
  }
  from(data: Date| null): string | null {
    if(data) {
      const timestamp = data.getTime() - data.getTimezoneOffset() * 60000;
      return new Date(timestamp).toISOString().split('T')[0];
    } else return null
  }
}
