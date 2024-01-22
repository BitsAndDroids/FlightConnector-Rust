'use client';
import TabFolders from "@/components/TabFolders";
import OutputCategory from "@/components/outputs/OutputCategory";
import { Category } from "@/model/Category";
import { Output } from "@/model/Output";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const OutputMenu = () => {
  const [categories, setCategories] = useState<Map<string, Category>>(new Map<string, Category>());
  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([]);
  const [bundle, setBundle] = useState<string>("Placeholder");

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

  function toggleOutput(output: Output, categoryName: string) {
    let outputName = output.output_name.toLowerCase();
    let newSelectedOutputs = [...selectedOutputs]; // copy the array
    if (newSelectedOutputs.includes(outputName)) {
      newSelectedOutputs = newSelectedOutputs.filter((output) => output !== outputName);
    } else {
      newSelectedOutputs.push(outputName);
    }
    let categoryChanged = categories.get(categoryName);
    categoryChanged!.outputs.find((output) => output.output_name.toLowerCase() === outputName)!.selected = !output.selected;
    setCategories(new Map(categories.set(categoryName, categoryChanged!)));
    setSelectedOutputs(newSelectedOutputs);
  }

  async function getCategories() {
    return invoke("get_outputs").then((r) => {
      return r as Category[];
    }
    )
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-row mt-12">
        <div className="flex flex-col h-60 w-60 bg-gray-800 rounded-md mr-2 p-4">
          <h2 className="text-white my-2 font-bold text-xl">Available sets</h2>
        </div>
      </div>
      <div className="w-[800px]">
        <h2 className="text-white text-4xl font-bold pl-2">Editing: {bundle}</h2>
        {categories.size > 0 &&
          <TabFolders categories={categories} toggleOutput={toggleOutput} />
        }
      </div>
    </div>
  )
}

export default OutputMenu;
