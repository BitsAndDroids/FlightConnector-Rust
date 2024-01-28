'use client';
import { Category } from "@/model/Category";
import TabHeader from "./TabHeader";
import { useState } from "react";
import CategoryCheckboxes from "./CategoryCheckboxes";
import { Output } from "@/model/Output";

interface TabFoldersProps {
  categories: Map<string, Category>;
  toggleOutput: (output: Output, categoryName: string) => void;
}

const TabFolders = ({ categories, toggleOutput }: TabFoldersProps) => {
  let index = categories.size;
  const [activeTab, setActiveTab] = useState<string>(categories.keys().next().value);
  function setTab(name: string) {
    setActiveTab(name);
  }

  return (
    <div className="m-2">
      <div className="flex flex-row justify-start mb-[-2px]">
        {
          categories &&
          [...categories?.keys()].map((key) => {
            index--;
            return <TabHeader key={key} name={key} first={index === categories.size - 1} index={index} collapsed={key === activeTab} toggleCollapsed={setTab} />
          })
        }
      </div>
      <div className="flex flex-col h-[550px] rounded-b-lg rounded-tr-lg flex-wrap max-h-[550px] bg-white z-40 relative p-2">
        <CategoryCheckboxes category={categories.get(activeTab)!} toggleOutput={toggleOutput} />
      </div>
    </div >);
}


export default TabFolders;
