export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const getObjectType = (object) =>
  object ? (Array.isArray(object) ? "array" : typeof object) : null;
