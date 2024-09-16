import { PrimaryCard } from "@/components/card/PrimaryCard";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import { ReactNode, useState } from "react";

export const WasmEventFilter = () => {
  const [filter, setFilter] = useState({
    query: "",
    categories: "All",
    type: "All",
  });

  const onChangeQuery = (value: string | boolean) => {
    setFilter({ ...filter, query: value as string });
  };

  const filterContent: ReactNode = (
    <div>
      <Input label="Search" onLight={false} onChange={onChangeQuery} />
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
