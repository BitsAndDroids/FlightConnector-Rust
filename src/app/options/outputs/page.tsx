'use client';
import {invoke} from "@tauri-apps/api/tauri";
import {useEffect, useState} from "react";

const OutputMenu = () => {
    const [outputs, setOutputs] = useState<any>(null);

    useEffect(() => {
        setOutputs(getOutputs());
        console.log(outputs)
    }, []);
    async function getOutputs() {
        return invoke("get_outputs").then((r) => {
                console.log(r);
                return r as any;
            }
        )
    }

    // Retrieve outputs from tauri
    return (
        <div>
            <h1>Outputs</h1>
        </div>
    )
}

export default OutputMenu;