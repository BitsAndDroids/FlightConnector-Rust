import { Header } from "@/components/elements/header";
import { Project } from "./model/Project";
import { useState } from "react";
import { ProjectRow } from "./components/ProjectRow";

export const ProjectWindow = () => {
  const [projects, setProjects] = useState<Array<Project>>([
    {
      projectName: "FCU (Flight Companion Unit)",
      openSource: true,
      description: `The Bits and Droids FCU (Flight companion unit) is a touch based controller.

It has the following modes: 
- Radio (com 1, com2, nav 1, nav2)
- G1000/G530
- AP stats`,
      projectImageURL:
        "https://shop.bitsanddroids.com/cdn/shop/files/shop_overview-7.jpg?v=1718552597&width=713",
      version: {
        version: "0.1.0",
        releasedAt: new Date("23-06-2024"),
      },
      githubURL: "https://www.github.com/bitsanddroids/flightcompanion",
      shopURL:
        "https://shop.bitsanddroids.com/products/custom-primary-flight-display-for-microsoft-flight-simulator-2020",

      componentList: [],
      maker: {
        displayName: "Bits and Droids",
      },
    },
  ]);
  return (
    <div className="bg-bitsanddroids-blue w-full h-full min-h-screen min-w-screen overflow-x-hidden">
      <div className="px-8 py-2">
        <Header title="Projects" level={1} />
        {projects.map((project) => (
          <ProjectRow project={project} />
        ))}
      </div>
    </div>
  );
};
