"use client";
import { RunComponent } from "../components/RunComponent";
import MenuLayout from "./MenuLayout";

export default function HomePage() {
  return (
    <div className="flex justify-center align-middle  h-full w-full flex-col ">
      <div className="flex flex-col justify-center align-middle items-center">
        <h1
          className={
            "mt-10 text-2xl font-bold tracking-tight text-white sm:text-4xl"
          }
        >
          FLIGHT CONNECTOR
        </h1>
      </div>
      <RunComponent />
    </div>
  );
}
