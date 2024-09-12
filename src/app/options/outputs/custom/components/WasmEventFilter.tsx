import { PrimaryCard } from "@/components/card/PrimaryCard";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import { ReactNode, useState } from "react";

export const WasmEventFilter = () => {
  const [filter, setFilter] = useState({
    categories: "All",
    type: "All",
  });
  const filterContent: ReactNode = (
    <div>
      <Input label="Filter" onLight={false} />
      <Select
        label="Type"
        onLight={false}
        options={["All", "Input", "Output"]}
        values={["All", "Input", "Output"]}
        value={filter.type}
      />
    </div>
  );
  return <PrimaryCard children={filterContent} />;
};
