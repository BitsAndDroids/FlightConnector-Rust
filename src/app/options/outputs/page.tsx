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
      <h2 className="text-white text-xl my-2">Selected Outputs</h2>
      {selectedOutputs.map((output) => {
        return <p key={output.toUpperCase()} className="text-white">{output}</p>
      })}
      <div className="flex flex-col flex-wrap max-h-[550px]">
        {/* {categories?.map((category) => { */}
        {/*   return OutputCategory({ category }); */}
        {/* }) */}
        {/* } */}
        {[...categories?.keys()].map((key) => {
          return <OutputCategory key={key} category={categories?.get(key) as Category} toggleOutput={toggleOutput} />
        })
        }
      </div>
    </div>
  )
}

export default OutputMenu;
