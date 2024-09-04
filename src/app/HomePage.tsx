import { Header } from "@/components/elements/header";
import { RunComponent } from "../components/RunComponent";
export default function HomePage() {
  return (
    <div className="flex justify-start align-middle  h-full w-full flex-col">
      <div className="flex flex-col justify-center align-middle items-center">
        <Header level={1} title="FLIGHT CONNECTOR" />
      </div>
      <RunComponent />
    </div>
  );
}
