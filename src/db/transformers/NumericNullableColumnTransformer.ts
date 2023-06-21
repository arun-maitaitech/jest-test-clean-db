/// NumericNullableColumnTransformer
export class NumericNullableColumnTransformer {
  to(data: number | null): number | null {
    return data;
  }
  from(data: string | null): number | null {
    return typeof data === 'string' ? parseFloat(data) : data;
  }
}
