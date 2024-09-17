import { WASMEvent } from "../../model/WASMEvent";
import { test, expect, describe } from "vitest";
import {
  generateCase,
  generateGetter,
  generateVariable,
  insertGetters,
  insertSwitchCases,
  insertVariables,
} from "./CustomWasmGenerator";

const wasm_output_integer: WASMEvent = {
  id: 1,
  action: "action",
  action_text: "action_text",
  action_type: "output",
  output_format: "integer",
  update_every: 1,
  min: 1,
  max: 1,
  value: 1,
  offset: 1,
  plane_or_category: "plane_or_category",
};
const wasm_output_float: WASMEvent = {
  id: 2,
  action: "action",
  action_text: "action_text",
  action_type: "output",
  output_format: "float",
  update_every: 1,
  min: 1,
  max: 1,
  value: 1,
  offset: 1,
  plane_or_category: "plane_or_category",
};

describe("library generation strings single lines", () => {
  test("should generate a c++ switch case for wasm_output_integer", () => {
    const expected_result = `  case ${wasm_output_integer.id}: {\n    output${wasm_output_integer.id} = cutValue.toInt();\n    break;\n  } \n`;
    const result = generateCase(wasm_output_integer);
    expect(result).toBe(expected_result);
  });
  test("should generate a c++ switch case for wasm_output_float", () => {
    const expected_result = `  case ${wasm_output_float.id}: {\n    output${wasm_output_float.id} = cutValue.toFloat();\n    break;\n  } \n`;
    const result = generateCase(wasm_output_float);
    expect(result).toBe(expected_result);
  });
  test("should generate a c++ getter for wasm_output_integer", () => {
    const expected_result = `  int getOutput${wasm_output_integer.id}() { return output${wasm_output_integer.id}; }\n`;
    const result = generateGetter(wasm_output_integer);
    expect(result).toBe(expected_result);
  });
  test("should generate a c++ getter for wasm_output_float", () => {
    const expected_result = `  float getOutput${wasm_output_float.id}() { return output${wasm_output_float.id}; }\n`;
    const result = generateGetter(wasm_output_float);
    //test
    expect(result).toBe(expected_result);
  });
  test("should generate a c++ variable for wasm_output_integer", () => {
    const expected_result = `  int output${wasm_output_integer.id};\n`;
    const result = generateVariable(wasm_output_integer);
    expect(result).toBe(expected_result);
  });
  test("should generate a c++ variable for wasm_output_float", () => {
    const expected_result = `  float output${wasm_output_float.id};\n`;
    const result = generateVariable(wasm_output_float);
    expect(result).toBe(expected_result);
  });
});

describe("Library generation insert strings in templates", () => {
  test("should insert variables in template", () => {
    const template = `test\n  // START VAR TEMPLATE\n  // END VAR TEMPLATE`;
    const varString = "  int output1;\n  float output2;\n";
    const result = insertVariables(varString, template);
    const expected_result = `test\n  // START VAR TEMPLATE\n  int output1;\n  float output2;\n  // END VAR TEMPLATE`;
    expect(result).toBe(expected_result);
  });

  test("should insert getters in template", () => {
    const template = `test\n  // START GETTER TEMPLATE\n  // END GETTER TEMPLATE`;
    const getterString =
      "  int getOutput1(){ return output1; }\n  float getOutput2(){ return output2; }\n";
    const result = insertGetters(getterString, template);
    const expected_result = `test\n  // START GETTER TEMPLATE\n  int getOutput1(){ return output1; }\n  float getOutput2(){ return output2; }\n  // END GETTER TEMPLATE`;
    expect(result).toBe(expected_result);
  });

  test("should insert cases in template", () => {
    const template = `test\n  // START CASE TEMPLATE\n  // END CASE TEMPLATE`;
    const caseString =
      "  case 1: { output1 = cutValue.toInt();\nbreak;\n  }\n  case 2: { output2 = cutValue.toFloat();\nbreak;\n  }\n";
    const result = insertSwitchCases(caseString, template);
    const expected_result = `test\n  // START CASE TEMPLATE\n  case 1: { output1 = cutValue.toInt();\nbreak;\n  }\n  case 2: { output2 = cutValue.toFloat();\nbreak;\n  }\n  // END CASE TEMPLATE`;
    expect(result).toBe(expected_result);
  });
});
