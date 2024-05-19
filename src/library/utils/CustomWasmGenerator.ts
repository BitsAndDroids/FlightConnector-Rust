import { WASMEvent } from "@/model/WASMEvent";

const generateVariables = (variables: WASMEvent[]): string => {
  if (!variables.length) {
    return "";
  }
  return variables.map(generateVariable).join("\n");
};

const generateHeaderFile = (variables: WASMEvent[]): string => {
  const variablesString = generateVariables(variables);
  const gettersString = generateGetters(variables);
  return "";
};

const insertSwitchCases = (caseString: string, templateString: string) => {
  const templateStartMarker = "  // START CASE TEMPLATE";
  const templateEndMarker = "  // END CASE TEMPLATE";
  const templateStartIndex = templateString.indexOf(templateStartMarker);
  const templateStart = templateString.slice(
    0,
    templateStartIndex + templateStartMarker.length,
  );
  const templateEndIndex = templateString.indexOf(templateEndMarker);
  const templateEnd = templateString.slice(templateEndIndex);
  return `${templateStart}\n${caseString}${templateEnd}`;
};

const insertGetters = (getterString: string, templateString: string) => {
  const templateStartMarker = "  // START GETTER TEMPLATE";
  const templateEndMarker = "  // END GETTER TEMPLATE";
  const templateStartIndex = templateString.indexOf(templateStartMarker);
  const templateStart = templateString.slice(
    0,
    templateStartIndex + templateStartMarker.length,
  );
  const templateEndIndex = templateString.indexOf(templateEndMarker);
  const templateEnd = templateString.slice(templateEndIndex);
  return `${templateStart}\n${getterString}${templateEnd}`;
};

const insertVariables = (variableString: string, templateString: string) => {
  const templateStartMarker = "  // START VAR TEMPLATE";
  const templateEndMarker = "  // END VAR TEMPLATE";
  const templateStartIndex = templateString.indexOf(templateStartMarker);
  const templateStart = templateString.slice(
    0,
    templateStartIndex + templateStartMarker.length,
  );
  const templateEndIndex = templateString.indexOf(templateEndMarker);
  const templateEnd = templateString.slice(templateEndIndex);
  return `${templateStart}\n${variableString}${templateEnd}`;
};

const generateGetters = (variables: WASMEvent[]): string => {
  if (!variables.length) {
    return "";
  }
  return variables.map(generateGetter).join("\n");
};

const generateCases = (variables: WASMEvent[]): string => {
  if (!variables.length) {
    return "";
  }
  return variables.map(generateCase).join("\n");
};

const mapOutputTypeParser = (type: string): string => {
  switch (type) {
    case "integer": {
      return ".toInt()";
    }
    case "float": {
      return ".toFloat()";
    }
    default:
      return "";
  }
};

const mapOutputType = (type: string): string => {
  switch (type) {
    case "integer": {
      return "int";
    }
    case "float": {
      return "float";
    }
    default:
      return "";
  }
};

const generateCase = (variable: WASMEvent): string => {
  return `case ${variable.id}: \{ output${variable.id} = cutValue${mapOutputTypeParser(variable.output_format)};\nbreak;\n  \} \n`;
};

const generateGetter = (variable: WASMEvent): string => {
  return `${mapOutputType(variable.output_format)} getOutput${variable.id}()\{ return output${variable.id}; \}\n`;
};

const generateVariable = (variable: WASMEvent): string => {
  return `${mapOutputType(variable.output_format)} output${variable.id};\n`;
};

export {
  generateVariables,
  generateGetters,
  generateCases,
  generateCase,
  generateGetter,
  generateVariable,
  insertVariables,
  insertGetters,
  insertSwitchCases,
};
