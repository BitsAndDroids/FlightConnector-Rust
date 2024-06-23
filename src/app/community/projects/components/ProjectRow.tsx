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
            Made by: {project.maker.displayName}
          </p>
        </div>
        <div className="ml-4 flex flex-col justify-items-center justify-center items-end grow">
          <button
            className="bg-blue-500 text-white p-2 w-fit rounded"
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
        {project.githubURL && (
          <div className="mb-2">
            <p>Project repo:</p>
            <a href={project.githubURL}>{project.githubURL}</a>
          </div>
        )}
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

        <button className="bg-blue-500 text-white p-2 w-fit rounded ">
          Add project to connector
        </button>
      </div>
    </div>
  );
};
