'use client'
import {Inter} from 'next/font/google'
import './globals.css'
import {useEffect, useState} from "react";
import {WebviewWindow} from "@tauri-apps/api/window";
import Link from "next/link";
import MenuItem from "@/components/nav/MenuItem";

const inter = Inter({subsets: ['latin']})

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const [appWindow, setAppWindow] = useState<WebviewWindow>();

    useEffect(() => {
        const fetchAppWindow = async () => {
            // check if window object is defined i.e., we are on client side
            if (typeof window !== 'undefined') {
                try {
                    // Dynamic import
                    // It returns a promise, so you have to use await syntax or then-catch.
                    const Tauri = await import('@tauri-apps/api/window');

                    // Set the state.
                    setAppWindow(Tauri.appWindow);
                } catch (error) {
                    console.error("Failed to import @tauri-apps/api/window", error);
                }
            }
        };

        fetchAppWindow();
    }, []);

    const onMinimize = () => {
        appWindow && appWindow.minimize();
    };

    const onMaximize = () => {
        appWindow && appWindow.maximize();
    };

    const onClose = () => {
        appWindow && appWindow.close();
    }


    return (
        <html lang="en">
        <body className={"w-[100vw] h-[100vh] flex flex-col bg-black"}>
        <div className=" bg-bitsanddroids-blue mt-7 flex flex-row align-middle justify-start h-fit">
            <nav className={"text-white ml-4 bg-bitsanddroids-blue h-8"}>
                <MenuItem text={"Settings"} href={"/options/settings"}/>
                <MenuItem text={"Outputs"} href={"/options/outputs"}/>
            </nav>

        </div>
        <div data-tauri-drag-region className="titlebar bg-bitsanddroids-blue">
            <div className="titlebar-button" id="titlebar-minimize" onClick={onMinimize}>
                <img
                    src="https://api.iconify.design/mdi:window-minimize.svg"
                    className={"fill-amber-50"}
                    alt="minimize"
                />
            </div>
            <div className="titlebar-button fill-amber-50" id="titlebar-maximize" onClick={onMaximize}>
                <img
                    src="https://api.iconify.design/mdi:window-maximize.svg"
                    className={"fill-amber-50"}
                    alt="maximize"
                />
            </div>
            <div className="titlebar-button" id="titlebar-close" onClick={onClose}>
                <img src="https://api.iconify.design/mdi:close.svg" alt="close" className={"fill-amber-50"}/>
            </div>
        </div>
        {children}
        </body>
        </html>
    )
}
