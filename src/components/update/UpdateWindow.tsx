import { Header } from "../elements/header";

export const UpdateWindow = () => {
  return (
    <div className="w-[100%] h-[100%] min-h-[100%] min-w-[100%] -translate-y-1/2 -translate-x-1/2 fixed top-1/2 left-1/2 bg-opacity-50 z-50 flex flew-row align-middle justify-center items-center backdrop-blur-sm drop-shadow-lg">
      <Header level={1} title="Update" />
      <div></div>
      <div></div>
    </div>
  );
};
