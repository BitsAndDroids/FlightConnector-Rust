import { WASMEvent } from "@/model/WASMEvent";

import { invoke } from "@tauri-apps/api/core";
const generateVariables = (variables: WASMEvent[]): string => {
  if (!variables.length) {
    return "";
  }
  return variables.map(generateVariable).join("\n");
};

const generateLibrary = async (path: string) => {
  const outputEvents: WASMEvent[] = (await invoke(
    "get_library_outputs",
  )) as WASMEvent[];
  let headerFile = await generateHeaderFile(outputEvents);
  let sourceFile = await generateSourceFile(outputEvents);
  invoke("generate_library", {
    path: path,
    headerString: headerFile,
    sourceString: sourceFile,
  });
};

const generateHeaderFile = async (variables: WASMEvent[]): Promise<string> => {
  let templateString = (await invoke("get_library_header_content")) as string;
  const variablesString = generateVariables(variables);
  const gettersString = generateGetters(variables);
  templateString = insertVariables(variablesString, templateString);
  templateString = insertGetters(gettersString, templateString);
  return templateString;
};

const generateSourceFile = async (variables: WASMEvent[]): Promise<string> => {
  let templateString = (await invoke("get_library_source_content")) as string;
  const casesString = generateCases(variables);
  templateString = insertSwitchCases(casesString, templateString);
  return templateString;
};

const insertSwitchCases = (caseString: string, templateString: string) => {
  const templateStartMarker = "  // START CASE TEMPLATE";
  const templateEndMarker = "  // END CASE TEMPLATE";
  const templateStartIndex = templateString.indexOf(templateStartMarker);
  if (templateStartIndex === -1) {
    console.log("Could not find switch start marker");
    // TODO: implement fallback
  }
  if (templateString.indexOf(templateEndMarker) === -1) {
    console.log("Could not find switch end marker");
    // TODO: implement fallback
  }
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
  if (templateStartIndex === -1) {
    console.log("Could not find getter start marker");
    // TODO: implement fallback
  }
  const templateStart = templateString.slice(
    0,
    templateStartIndex + templateStartMarker.length,
  );
  const templateEndIndex = templateString.indexOf(templateEndMarker);
  if (templateEndIndex === -1) {
    console.log("Could not find getter end marker");
    // TODO: implement fallback
  }
  const templateEnd = templateString.slice(templateEndIndex);
  return `${templateStart}\n${getterString}${templateEnd}`;
};

const insertVariables = (variableString: string, templateString: string) => {
  const templateStartMarker = "  // START VAR TEMPLATE";
  const templateEndMarker = "  // END VAR TEMPLATE";
  if (templateString.indexOf(templateStartMarker) === -1) {
    console.log("Could not find variable start marker");
    // TODO: implement fallback
  }
  const templateStartIndex = templateString.indexOf(templateStartMarker);
  const templateStart = templateString.slice(
    0,
    templateStartIndex + templateStartMarker.length,
  );
  const templateEndIndex = templateString.indexOf(templateEndMarker);
  if (templateEndIndex === -1) {
    console.log("Could not find variable end marker");
    // TODO: implement fallback
  }
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
    case "int": {
      return ".toInt()";
    }
    case "float": {
      return ".toFloat()";
    }
    default:
      return ".toInt()";
  }
};

const mapOutputType = (type: string): string => {
  switch (type) {
    case "int": {
      return "int";
    }
    case "float": {
      return "float";
    }
    default:
      return "int";
  }
};

const generateCase = (variable: WASMEvent): string => {
  return `  case ${variable.id}: {\n    output${variable.id} = cutValue${mapOutputTypeParser(variable.output_format)};\n    break;\n  } \n`;
};

const generateGetter = (variable: WASMEvent): string => {
  return `  ${mapOutputType(variable.output_format)} getOutput${variable.id}() { return output${variable.id}; }\n`;
};

const generateVariable = (variable: WASMEvent): string => {
  return `  ${mapOutputType(variable.output_format)} output${variable.id};\n`;
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
  generateLibrary,
};
