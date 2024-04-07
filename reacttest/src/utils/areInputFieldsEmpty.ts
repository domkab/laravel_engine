export const areInputFieldsEmpty = <T>(
  data: T, requiredFields: Array<keyof T>): Record<string, string[]> => {
  const errors: Record<string, string[]> = {};

  requiredFields.forEach(field => {
    if (!data[field]) {
      errors[field as string] = [
        `${String(field).charAt(0).toUpperCase() + String(field).slice(1)} is required.`
      ];
    }
  });

  return errors;
};
