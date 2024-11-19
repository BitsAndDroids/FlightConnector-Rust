"use client";
import { Category } from "@/model/Category";
import { useEffect, useState } from "react";
import { Output } from "@/model/Output";
import { OutputSelectRows } from "./OutputSelectRows";
import { PrimaryCard } from "@/components/card/PrimaryCard";
import { Header } from "#components/elements/header.js";
import { Input } from "#components/elements/inputs/Input.js";
import { Select } from "#components/elements/Select.js";

interface BundleEditorProps {
  outputs: Output[];
  dialogOpen: boolean;
  toggleOutput: (output: Output) => void;
}

const BundleEditor = ({
  outputs,
  dialogOpen,
  toggleOutput,
}: BundleEditorProps) => {
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

  const getCategoryOptions = () => {
    const options = [{ value: "All" }];
    categories.forEach((category, index) => {
      options.push({ value: category.name });
    });
    return options;
  };

  const [filteredOutputs, setFilteredOutputs] = useState<Output[]>(outputs);

  return (
    <div className="m-2 relative">
      <div className="flex flex-row h-[550px] rounded-b-lg rounded-tr-lg max-h-[550px] z-40 relative p-2">
        <PrimaryCard>
          <>
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
              options={getCategoryOptions()}
              onChange={(value) =>
                setFilters({ ...filters, category: value as string })
              }
            />
            <Select
              onLight={false}
              options={[
                { value: "All" },
                { value: "Selected" },
                { value: "Not selected" },
              ]}
              label="Selected"
              onChange={(value) =>
                setFilters({ ...filters, selected: value as string })
              }
            />
          </>
        </PrimaryCard>
        <OutputSelectRows
          outputs={filteredOutputs}
          dialogOpen={dialogOpen}
          toggleOutput={toggleOutput}
        />
      </div>
    </div>
  );
};

export default BundleEditor;
