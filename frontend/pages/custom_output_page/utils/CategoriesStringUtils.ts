export const stringifyCategories = (categories: string[]) => {
  return categories.join(", ");
};

export const checkLastCharOfCategories = (categories: string) => {
  return categories.endsWith(",");
};

export const parseCategories = (categories: string) => {
  if (checkLastCharOfCategories(categories)) {
    categories = categories + " ";
  }
  return categories.split(",").map((c) => c.trimStart());
};
