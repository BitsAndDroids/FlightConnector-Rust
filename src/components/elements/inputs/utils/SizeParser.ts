export const getInputSize = (size: string) => {
  switch (size) {
    case "sm":
      return "w-1/4 min-w-[100px]";
    case "md":
      return "w-1/2 min-w-[200px]";
    case "lg":
      return "w-3/4 min-w-[400px]";
    case "full":
      return "w-full min-w-full";
  }
};

export type InputSize = "sm" | "md" | "lg" | "full";
