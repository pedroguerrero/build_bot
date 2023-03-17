export const isStringNumber = (input: string): boolean => {
  return !!input.match(/^\d+$/);
};
