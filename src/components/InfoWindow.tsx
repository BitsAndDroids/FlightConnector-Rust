import React from "react";
interface InfoWindowProps {
  message: string;
}
const InfoWindow = (props: InfoWindowProps) => {
  return (
    <div className="group relative">
      <div className="">
        <img src={"/icon_info.svg"} alt="info" className="h-[30px]" />
      </div>
      <div className="hidden group-hover:flex flex-col justify-center items-center absolute z-50 top-[-45px] right-[-330px] p-4 rounded-md bg-white drop-shadow w-80">
        <label className="rounded-md mx-2 text-center">{props.message}</label>
      </div>
    </div>
  );
};
export default InfoWindow;
