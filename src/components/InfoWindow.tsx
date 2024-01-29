import info_icon from "/public/icon_info.svg";
import Image from "next/image";
interface InfoWindowProps {
  message: string;
}
const InfoWindow = (props: InfoWindowProps) => {
  return (
    <div className="group relative">
      <div className="" tabIndex={0}>
        <Image src={info_icon} alt="info" height={30} />
      </div>
      <div className="hidden group-hover:flex flex-col justify-center items-center absolute z-50 top-[-45px] right-[-330px] p-4 rounded-md bg-white drop-shadow w-80">
        <label className="rounded-md mx-2 text-center">{props.message}</label>
      </div>
    </div>
  );
}
export default InfoWindow;
