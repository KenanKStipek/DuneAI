#!/usr/bin/env ts-node

import React, { useState, useEffect } from 'react';
import { render, Box, Text, Newline, useApp, useInput } from 'ink';
import { Spinner } from 'ink-spinner';
import { Command } from 'commander';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

program
  .name('setup')
  .description('Setup script for initializing DuneAI projects')
  .requiredOption('-n, --name <projectName>', 'Project name')
  .option('-u, --upstream <upstreamAI>', 'Upstream AI provider', 'openai')
  .option('-i, --init <initMethod>', 'Initialization method (cli/mq)', 'cli')
  .option('-o, --output <outputDir>', 'Output directory', '.');

program.parse(process.argv);

const options = program.opts();

const createProjectStructure = (projectName: string, outputDir: string) => {
  const projectDir = path.join(outputDir, projectName);
  const skeletonDir = path.join(__dirname, '..', 'src', 'skeleton');

  console.log('Creating project structure...');
  // Ensure the output directory exists, or create it
  fs.ensureDirSync(projectDir);

  // Copy the skeleton directory to the new project directory
  fs.copySync(skeletonDir, projectDir);

  // Generate additional config files
  const configContent = `Project Name: ${options.name}\nUpstream AI: ${options.upstream}\nInitialization: ${options.init}`;
  const envContent = `OPENAI_API_KEY: ###\n`;
  fs.writeFileSync(path.join(projectDir, 'README.md'), configContent);
  fs.writeFileSync(path.join(projectDir, '.default-env'), envContent);

  console.log('Project structure created successfully.');
};

const App = () => {
  const { exit } = useApp();
  const [status, setStatus] = useState('Initializing');

  useEffect(() => {
    console.log('Effect triggered.');
    try {
      setTimeout(() => {
        createProjectStructure(options.name, options.output);
        setStatus('Completed');
      }, 2000);
    } catch (error) {
      console.error('Error creating project structure:', error);
      setStatus('Error');
    }
  }, []);

  useInput((input, key) => {
    if (key.escape) {
      exit();
    }
  });

  return (
    <Box flexDirection= "column" >
    <Box>
    <Text>
    <Text color="green" > { status === 'Initializing' && <Spinner type="dots" />}</Text>
{ status === 'Initializing' && ' Setting up your project...' }
{
  status === 'Completed' && (
    <Text>
    Project < Text bold > { options.name } < /Text> has been initialized at <Text bold>{path.join(options.output, options.name)}</Text >
      </Text>
          )
}
{
  status === 'Error' && (
    <Text color="red" > An error occurred during setup.< /Text>
          )
}
</Text>
  < /Box>
{
  status === 'Completed' && (
    <Box>
    <Text>
    You can find the configuration files in the project directory.
            < Newline />
      Press ESC to exit.
          < /Text>
        < /Box>
      )
}
</Box>
  );
};

render(<App />);
