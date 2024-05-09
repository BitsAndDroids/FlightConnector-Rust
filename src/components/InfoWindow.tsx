import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
export interface InfoWindowProps {
  message: string;
  docs_url?: string;
}
const InfoWindow = (props: InfoWindowProps) => {
  const openDocs = () => {
    new WebviewWindow("docs", { url: props.docs_url, title: "docs" });
  };

  return (
    <div className="group relative">
      <div className="">
        <img src={"/icon_info.svg"} alt="info" className="h-[30px]" />
      </div>
      <div className="hidden group-hover:visible group-hover:flex flex-col justify-center items-center absolute z-50 top-[-45px] right-[-320px] p-4 rounded-md bg-white drop-shadow w-80">
        <label className="rounded-md mx-2 text-center">{props.message}</label>
        {props.docs_url && (
          <p
            onClick={() => openDocs()}
            className="text-blue-500 font-bold cursor-pointer"
          >
            Open docs
          </p>
        )}
      </div>
    </div>
  );
};
export default InfoWindow;
