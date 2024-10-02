import { PrimaryCard } from "@/components/card/PrimaryCard";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import { ReactNode } from "react";
import { WasmEventFilterParams } from "../models/WasmEventFilter";

interface WasmEventFilterProps {
  filter: WasmEventFilterParams;
  setFilter: (filter: WasmEventFilterParams) => void;
}

export const WasmEventFilter = (props: WasmEventFilterProps) => {
  const onChangeQuery = (value: string | boolean) => {
    props.setFilter({ ...props.filter, query: value as string });
  };

  const onChangeCategory = (value: string | boolean) => {
    props.setFilter({ ...props.filter, category: value as string });
  };

  const onChangeType = (value: string) => {
    if (value !== "All" && value !== "Input" && value !== "Output") {
      return;
    }
    props.setFilter({ ...props.filter, type: value });
  };

  const filterContent: ReactNode = (
    <div>
      <Input label="Search" onLight={false} onChange={onChangeQuery} />
      <Input label="Category" onLight={false} onChange={onChangeCategory} />
      <Select
        label="Type"
        onLight={false}
        options={["All", "Input", "Output"]}
        values={["All", "Input", "Output"]}
        value={props.filter.type}
        onChange={onChangeType}
      />
    </div>
  );
  return <PrimaryCard>{filterContent}</PrimaryCard>;
};
