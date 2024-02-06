import { Bundle } from "@/model/Bundle";

interface OutputListProps {
  bundle: Bundle;
}

const OutputList = ({ bundle }: OutputListProps) => {
  return (
    <div>
      <h1>{bundle.name}</h1>
      <div className="flex flex-col">
        {bundle.outputs.map((output) => {
          return (
            <p key={output.id} className="font-bold">
              {output.output_name}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default OutputList;
