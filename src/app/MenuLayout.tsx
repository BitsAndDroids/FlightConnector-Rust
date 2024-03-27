import MenuItem from "@/components/nav/MenuItem";
import "./globals.css";
import { Titlebar } from "@/components/nav/titlebar";
import { Outlet } from "react-router-dom";

export default function MenuLayout() {
  return (
    <div
      className={
        "w-screen h-screen min-h-screen flex flex-col bg-bitsanddroids-blue overflow-x-hidden overflow-hidden"
      }
    >
      <div className=" bg-bitsanddroids-blue mt-7 flex flex-row align-middle justify-start h-fit">
        <nav className={"text-white ml-4 bg-bitsanddroids-blue h-8"}>
          <MenuItem text={"Start"} href={"/"} />
          {/* <MenuItem text={"Settings"} href={"/options/settings"} /> */}
          <MenuItem text={"Outputs"} href={"/options/outputs"} />
        </nav>
      </div>
      <Titlebar />
      <div className="overflow-y-auto px-8">
        <Outlet />
      </div>
    </div>
  );
}
