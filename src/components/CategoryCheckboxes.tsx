import { Category } from "@/model/Category";
import { Output } from "@/model/Output";

interface CategoryCheckboxesProps {
  category: Category;
  dialogOpen: boolean;
  toggleOutput: (output: Output) => void;
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
          <div key={output.simvar} className="flex flex-row items-center">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => {
                toggleOutput(output);
              }}
              tabIndex={dialogOpen ? -1 : 1}
              checked={output.selected}
            />
            <label>{output.simvar.toLowerCase()}</label>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryCheckboxes;
