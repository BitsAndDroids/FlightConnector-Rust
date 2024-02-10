import { Inter } from "next/font/google";
import "./globals.css";
import MenuItem from "@/components/nav/MenuItem";
import { Titlebar } from "@/components/nav/titlebar";
import { Suspense } from "react";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bits and Droids flight connector",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={
          "w-screen h-screen min-h-screen flex flex-col bg-bitsanddroids-blue overflow-x-hidden overflow-hidden"
        }
      >
        <div className=" bg-bitsanddroids-blue mt-7 flex flex-row align-middle justify-start h-fit">
          <nav className={"text-white ml-4 bg-bitsanddroids-blue h-8"}>
            <MenuItem text={"Settings"} href={"/options/settings"} />
            <MenuItem text={"Outputs"} href={"/options/outputs"} />
          </nav>
        </div>
        <Titlebar />
        <div className="overflow-y-auto">{children}</div>
      </body>
    </html>
  );
}
