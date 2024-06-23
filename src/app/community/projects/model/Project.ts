import { Component } from "./Component";
import { Maker } from "./Maker";
import { ProjectEvents } from "./ProjectEvents";
import { Version } from "./Version";

export interface Project {
  maker: Maker;
  projectName: string;
  shopURL?: string;
  projectImageURL?: string;
  openSource: boolean;
  description: string;
  githubURL?: string;
  projectURL?: string;
  projectEvents?: ProjectEvents;
  version: Version;
  versionHistory?: Array<Project>;
  componentList: Array<Component>;
}
