'use client';
import OutputCategory from "@/components/outputs/OutputCategory";
import { Category } from "@/model/Category";
import { Output } from "@/model/Output";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const OutputMenu = () => {
  const [categories, setCategories] = useState<Map<string, Category>>(new Map<string, Category>())
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([])

  useEffect(() => {

    getCategories().then((categories) => {
      let categoryMap = new Map<string, Category>();
      for (let category of categories) {
        categoryMap.set(category.name, category);
      }
      setCategories(categoryMap)
    }
    )
  }, []);


  function toggleOutput(output: Output) {
    let outputName = output.output_name.toLowerCase();
    let newSelectedOutputs = [...selectedOutputs]; // copy the array
    if (newSelectedOutputs.includes(outputName)) {
      newSelectedOutputs = newSelectedOutputs.filter((output) => output !== outputName);
    } else {
      newSelectedOutputs.push(outputName);
    }
    console.log(newSelectedOutputs);
    setSelectedOutputs(newSelectedOutputs);
  }


  async function getCategories() {
    return invoke("get_outputs").then((r) => {
      console.log(r);
      return r as Category[];
    }
    )
  }

  return (
    <div>
      <h1 className="text-white">Outputs</h1>
      <div className="flex flex-row">
        <div className="flex flex-col h-60 w-60 bg-gray-800 rounded-md mr-2 p-4">
          <h2 className="text-white my-2 font-bold text-xl">Available sets</h2>
        </div>
        <div className="bg-gray-800 p-4 rounded-md">
          <h2 className="text-white text-xl my-2 font-bold">Selected Outputs</h2>
          <div className="h-60 max-h-60 mb-4 flex flex-col flex-wrap">
            {selectedOutputs.map((output) => {
              return <p key={output.toUpperCase()} className="text-white mr-4">{output}</p>
            })}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-wrap max-h-[550px]">
        {[...categories?.keys()].map((key) => {
          return <OutputCategory key={key} category={categories?.get(key) as Category} toggleOutput={toggleOutput} />
        })
        }
      </div>
    </div>
  )
}

export default OutputMenu;
