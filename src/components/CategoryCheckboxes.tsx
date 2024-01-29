import { Category } from "@/model/Category";
import { Output } from "@/model/Output";

interface CategoryCheckboxesProps {
  category: Category;
  dialogOpen: boolean;
  toggleOutput: (output: Output, categoryName: string) => void;
}

const CategoryCheckboxes = ({
  category,
  dialogOpen,
  toggleOutput,
}: CategoryCheckboxesProps) => {
  return (
    <div className="flex flex-col flex-wrap h-full w-full relative">
      {category.outputs.map((output) => {
        return (
          <div key={output.output_name} className="flex flex-row items-center">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => toggleOutput(output, category.name)}
              checked={output.selected}
              tabIndex={dialogOpen ? -1 : 1}
            />
            <label>{output.output_name.toLowerCase()}</label>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCheckboxes;
