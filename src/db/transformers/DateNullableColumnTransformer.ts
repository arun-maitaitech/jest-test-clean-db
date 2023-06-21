// import { convertDateStringToUtcDate as D } from '@habankaim/lms_engine';

/// DateNullableColumnTransformer
export class DateNullableColumnTransformer {
  to(data: Date | null): Date | null {
    return data;
  }
  from(data: string): Date | null {
    return data ? new Date(data) : null;
  }
}
