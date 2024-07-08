#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const ora = require("ora");

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

const createProjectStructure = (projectName, outputDir) => {
  const spinner = ora("Creating project structure...").start();

  try {
    const projectDir = path.join(outputDir, projectName);
    const skeletonDir = path.join(__dirname, "..", "src", "skeleton");

    fs.ensureDirSync(projectDir);
    fs.copySync(skeletonDir, projectDir);

    const configContent = `Project Name: ${options.name}\nUpstream AI: ${options.upstream}\nInitialization: ${options.init}`;
    const envContent = `OPENAI_API_KEY: ###\n`;
    fs.writeFileSync(path.join(projectDir, "README.md"), configContent);
    fs.writeFileSync(path.join(projectDir, ".default-env"), envContent);

    spinner.succeed("Project structure created successfully.");
  } catch (error) {
    spinner.fail("Error creating project structure.");
    console.error(chalk.red(error));
  }
};

const runSetup = () => {
  console.log(chalk.blue("Starting setup..."));
  createProjectStructure(options.name, options.output);
};

runSetup();
