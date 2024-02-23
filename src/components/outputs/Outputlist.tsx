import { Bundle } from "@/model/Bundle";

interface OutputListProps {
  bundle: Bundle;
}

const OutputList = ({ bundle }: OutputListProps) => {
  return (
    <div className="rounded-md bg-white p-4 mt-12">
      {bundle?.name && (
        <h1 className="mt-2 font-bold text-lg">{bundle.name}</h1>
      )}
      <div className="flex flex-col">
        {bundle.outputs.map((output) => {
          return (
            <p key={output.id} className="text-sm">
              {output.simvar}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default OutputList;
