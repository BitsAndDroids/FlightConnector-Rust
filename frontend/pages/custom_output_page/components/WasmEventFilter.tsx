import { PrimaryCard } from "@/components/card/PrimaryCard";
import { Input } from "@/components/elements/inputs/Input";
import { Select } from "@/components/elements/Select";
import { ReactNode } from "react";
import { WasmEventFilterParams } from "../model/WasmEventFilter";

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

  const onChangeMadeBy = (value: string) => {
    if (value !== "All" && value !== "Me" && value !== "BitsAndDroids") {
      return;
    }
    props.setFilter({ ...props.filter, madeBy: value });
  };

  const filterContent: ReactNode = (
    <div>
      <Input label="Search" onLight={false} onChange={onChangeQuery} />
      <Input label="Category" onLight={false} onChange={onChangeCategory} />
      <Select
        label="Type"
        onLight={false}
        options={[{ value: "All" }, { value: "Input" }, { value: "Output" }]}
        value={props.filter.type}
        onChange={onChangeType}
      />
      <Select
        label="Made by"
        onLight={false}
        options={[
          { value: "All" },
          { value: "Me" },
          { value: "BitsAndDroids" },
        ]}
        value={props.filter.madeBy}
        onChange={onChangeMadeBy}
      />
    </div>
  );
  return <PrimaryCard>{filterContent}</PrimaryCard>;
};
