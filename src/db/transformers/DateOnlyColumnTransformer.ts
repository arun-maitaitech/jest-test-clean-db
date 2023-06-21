// import { convertDateStringToUtcDate as D } from '@habankaim/lms_engine';

/// DateOnlyColumnTransformer
export class DateOnlyColumnTransformer {
  to(data: Date): Date {
    return data;
  }
  from(data: string): Date | null {
    return data ? new Date(data) : null;
  }
}
