import { Header } from "@/components/elements/header";
import { Project } from "../model/Project";
import { useState } from "react";
import { Button } from "@/components/elements/Button";
import Markdown from "react-markdown";

interface ProjectRowProps {
  project: Project;
}

export const ProjectRow = ({ project }: ProjectRowProps) => {
  const renderers = {
    h1: (props: any) => <Header level={1} title={props.children} />,
    h2: (props: any) => (
      <Header level={2} title={props.children} addToClassName="text-white" />
    ),
    h3: (props: any) => (
      <Header level={3} title={props.children} addToClassName="text-white" />
    ),
    li: (props: any) => <li className="list-disc">{props.children}</li>,
    ul: (props: any) => <ul className="list-inside mb-4">{props.children}</ul>,
  };
  const [showDetails, setShowDetails] = useState<boolean>(false);
  return (
    <div className="bg-white rounded w-full p-2 ease-in-out h-fit transition">
      <div className="flex flex-row w-full justify-start content-stretch">
        {project.projectImageURL && (
          <img
            src={project.projectImageURL}
            className="h-[150px] rounded mr-4"
          />
        )}
        <div className="flex flex-col justify-center">
          <Header
            title={project.projectName}
            level={2}
            addToClassName="-mt-2"
          />
          <p className="-mt-4 text-gray-600 text-sm">
            Maker: {project.maker.displayName}
          </p>
          <div className="flex flex-row mt-1">
            {project.openSource && (
              <p className="bg-green-700 text-white text-xs rounded p-1">
                OPEN SOURCE
              </p>
            )}
            {project.shopURL && (
              <p className="ml-1 bg-orange-700 text-white text-xs rounded p-1">
                PURCHASABLE
              </p>
            )}
          </div>
        </div>
        <div className="ml-4 flex flex-col justify-items-center justify-center items-end grow">
          <button
            className="bg-gray-800 text-white p-2 w-fit rounded"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "Show more details"}
          </button>
        </div>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out mt-2 mb-4 ${
          showDetails ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <Markdown children={project.description} components={renderers} />
        {project.projectURL && (
          <div className="mb-2">
            <p>Project blog:</p>
            <a href={project.projectURL}>{project.projectURL}</a>
          </div>
        )}
        {project.shopURL && (
          <div className="mb-2">
            <p>Buy at:</p>
            <a href={project.shopURL}>{project.shopURL}</a>
          </div>
        )}

        <div className="flex flex-row">
          <button className="bg-gray-800 text-white p-2 w-fit rounded font-bold">
            Add to connector
          </button>
          {project.githubURL && (
            <a
              className="bg-gray-800 h-fit ml-2 w-fit rounded"
              href={project.githubURL}
            >
              <img
                src="https://api.iconify.design/mdi:github.svg?color=%23f0f0f0"
                className={"fill-gray-800 h-10"}
                alt="minimize"
              />
            </a>
          )}
          {project.shopURL && (
            <a
              className="bg-gray-800 h-fit ml-2 w-fit rounded"
              href={project.shopURL}
            >
              <img
                src="https://api.iconify.design/icon-park-outline:shopping.svg?color=%23f0f0f0"
                className={"fill-gray-800 h-8 m-1"}
                alt="minimize"
              />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
