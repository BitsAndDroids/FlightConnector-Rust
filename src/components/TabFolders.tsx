"use client";
import { Category } from "@/model/Category";
import { useState } from "react";
import { OutputSelectRow } from "./OutputSelectRow";
import { Output } from "@/model/Output";
import { Select } from "./elements/Select";
import { Input } from "./elements/Input";

interface TabFoldersProps {
  outputs: Output[];
  dialogOpen: boolean;
  toggleOutput: (output: Output) => void;
}

const TabFolders = ({ outputs, dialogOpen, toggleOutput }: TabFoldersProps) => {
  let categories = new Map<string, Category>();
  for (let output of outputs) {
    if (categories.has(output.category)) {
      categories.get(output.category)?.outputs.push(output);
    } else {
      categories.set(output.category, {
        name: output.category,
        outputs: [output],
      });
    }
  }

  let filters = {
    category: "All",
    selected: "All",
    query: "",
  };

  const [filteredOutputs, setFilteredOutputs] = useState<Output[]>(outputs);

  return (
    <div className="m-2 relative">
      <div className="flex flex-row h-[550px] rounded-b-lg rounded-tr-lg max-h-[550px] z-40 relative p-2">
        <div className="mr-4">
          <Input
            onLight={false}
            label="Search"
            placeholder="Search"
            value={filters.query}
          />
          <Select
            onLight={false}
            label="Category"
            options={["All", ...categories.keys()]}
            values={["All", ...categories.keys()]}
          />
          <Select
            onLight={false}
            options={["All", "Selected", "Not selected"]}
            values={["All", "Selected", "Not selected"]}
            label="Selected"
          />
        </div>
        <OutputSelectRow
          outputs={filteredOutputs}
          dialogOpen={dialogOpen}
          toggleOutput={toggleOutput}
        />
      </div>
    </div>
  );
};

export default TabFolders;
