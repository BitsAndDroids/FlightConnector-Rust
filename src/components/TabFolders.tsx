"use client";
import { Category } from "@/model/Category";
import { useEffect, useState } from "react";
import { OutputSelectRow } from "./OutputSelectRow";
import { Output } from "@/model/Output";
import { Select } from "./elements/Select";
import { Input } from "./elements/Input";
import { Header } from "./elements/header";

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
  let filtersDefault = {
    category: "All",
    selected: "All",
    query: "",
  };
  const [filters, setFilters] = useState(filtersDefault);
  useEffect(() => {
    //
    let filtered = outputs.filter((output) => {
      let categoryMatch =
        filters.category === "All" ||
        output.category.toLowerCase() === filters.category.toLowerCase();
      let selectedMatch =
        filters.selected === "All" ||
        (filters.selected === "Selected" && output.selected) ||
        (filters.selected === "Not selected" && !output.selected);
      let queryMatch =
        output.cb_text.toLowerCase().includes(filters.query.toLowerCase()) ||
        output.simvar.toLowerCase().includes(filters.query.toLowerCase());
      return categoryMatch && selectedMatch && queryMatch;
    });
    setFilteredOutputs(filtered);
  }, [filters, outputs]);

  const [filteredOutputs, setFilteredOutputs] = useState<Output[]>(outputs);

  return (
    <div className="m-2 relative">
      <div className="flex flex-row h-[550px] rounded-b-lg rounded-tr-lg max-h-[550px] z-40 relative p-2">
        <div className="mr-4 shadow-lg box-shadow p-4 bg-gradient-to-b from-[#305d7b] to-[#596d96] bg-opacity-20 rounded-md">
          <Header title="Filters" level={2} onLight={false} />
          <Input
            onLight={false}
            label="Search"
            placeholder="Search"
            value={filters.query}
            onChange={(value) =>
              setFilters({ ...filters, query: value as string })
            }
          />
          <Select
            onLight={false}
            label="Category"
            options={["All", ...categories.keys()]}
            values={["All", ...categories.keys()]}
            onChange={(value) =>
              setFilters({ ...filters, category: value as string })
            }
          />
          <Select
            onLight={false}
            options={["All", "Selected", "Not selected"]}
            values={["All", "Selected", "Not selected"]}
            label="Selected"
            onChange={(value) =>
              setFilters({ ...filters, selected: value as string })
            }
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
