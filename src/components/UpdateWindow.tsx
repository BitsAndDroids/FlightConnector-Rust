import { Header } from "./elements/header";

interface UpdateWindowProps {
  closeWindow: () => void;
}
interface Update {
  version: string;
  releaseDate: string;
  releaseNotes: string;
}

const UpdateWindow = (props: UpdateWindowProps) => {
  const updates: Update[] = [];
  return (
    <div className="hidden group-hover:visible group-hover:flex flex-col justify-center items-center absolute z-50 top-[-45px] right-[-320px] p-4 rounded-md bg-white drop-shadow w-80">
      <Header level={1} title="Latest release notes" />
      {updates.length > 0 &&
        updates.map((update, index) => {
          return (
            <div key={index} className="w-full py-2">
              <Header level={2} title={update.version} />
              <p className="text-sm">{update.releaseDate}</p>
              <p className="text-sm">{update.releaseNotes}</p>
            </div>
          );
        })}
    </div>
  );
};
