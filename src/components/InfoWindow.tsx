import { WebviewWindow } from "@tauri-apps/api/webviewWindow";
export interface InfoWindowProps {
  message: string;
  docs_url?: string;
  createWebviewWindow?: (name: string, options: any) => WebviewWindow;
}
const InfoWindow = ({
  message,
  docs_url,
  createWebviewWindow = (name, options) => new WebviewWindow(name, options),
}: InfoWindowProps) => {
  const openDocs = () => {
    createWebviewWindow("docs", {
      url: docs_url,
      title: "docs",
    });
  };

  return (
    <div className="group relative mr-2">
      <div className="">
        <img
          data-testid="icon_info"
          src={"/icon_info.svg"}
          alt="info"
          className="h-[30px] max-h-[30px] min-h-[30px] min-w-[30px]"
        />
      </div>
      <div className="hidden group-hover:visible group-hover:flex flex-col justify-center items-center absolute z-50 top-[-45px] right-[-320px] p-4 rounded-md bg-white drop-shadow w-80">
        <label className="rounded-md mx-2 text-center">{message}</label>
        {docs_url && (
          <p
            onClick={() => openDocs()}
            className="text-blue-500 font-bold cursor-pointer"
            data-testid="open_docs"
          >
            Open docs
          </p>
        )}
      </div>
    </div>
  );
};
export default InfoWindow;
