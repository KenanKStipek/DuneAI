import { Command } from "commander";

import fs from "fs-extra";
import path from "path";

const program = new Command();

program
  .name("setup")
  .description("Setup script for initializing DuneAI projects")
  .requiredOption("-n, --name <projectName>", "Project name")
  .option("-u, --upstream <upstreamAI>", "Upstream AI provider", "openai")
  .option("-i, --init <initMethod>", "Initialization method (cli/mq)", "cli")
  .option("-o, --output <outputDir>", "Output directory", ".");

program.parse(process.argv);

const options = program.opts();

const createProjectStructure = (projectName: string, outputDir: string) => {
  const projectDir = path.join(outputDir, projectName);
  const skeletonDir = path.join(__dirname, "..", "src", "skeleton");

  // Ensure the output directory exists, or create it
  fs.ensureDirSync(projectDir);

  // Copy the skeleton directory to the new project directory
  fs.copySync(skeletonDir, projectDir);

  // Generate additional config files
  const configContent = `Project Name: ${options.name}\nUpstream AI: ${options.upstream}\nInitialization: ${options.init}`;
  const envContent = `OPENAI_API_KEY: ###\n`;
  fs.writeFileSync(path.join(projectDir, "README.md"), configContent);
  fs.writeFileSync(path.join(projectDir, ".default-env"), envContent);

  console.log(`Project ${options.name} has been initialized at ${projectDir}`);
};

createProjectStructure(options.name, options.output);
