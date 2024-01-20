'use client';
import { Category } from "@/model/Category";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect, useState } from "react";

const OutputMenu = () => {
  const [categories, setCategories] = useState<Category[]>();

  useEffect(() => {
    getCategories().then((categories) => {
      setCategories(categories);
    }
    )
  }, []);

  async function getCategories() {
    return invoke("get_outputs").then((r) => {
      console.log(r);
      return r as Category[];
    }
    )
  }

  // Retrieve outputs from tauri
  return (
    <div>
      <h1>Outputs</h1>
      <div className="flex flex-row flex-wrap">
        {categories?.map((category) => {
          return (
            <div className="mb-4 min-w-[250px] m-4">
              <h2 className="text-white text-xl mb-2">{category.name}</h2>
              {category.outputs.map((output) => {
                return (
                  <div>
                    <input
                      className="text-white"
                      type="checkbox"
                      id={output.output_name}
                      name={output.output_name}
                      value={output.output_name} />
                    <label className="text-white ml-2" htmlFor={output.output_name}>{output.output_name.toLowerCase()}</label>
                  </div>
                )
              })}
            </div>
          )
        })
        }
      </div>
    </div>
  )
}

export default OutputMenu;
