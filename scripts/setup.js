#!/usr/bin/env node

const { Command } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

// Function to install dependencies
const installDependencies = async (projectDir, adapters, providers) => {
  const ora = (await import("ora")).default;
  const dependencies = [];

  if (adapters.includes("GPT4ALL")) {
    dependencies.push("gpt4all");
  }
  if (adapters.includes("AI")) {
    dependencies.push("@ai-sdk/vercelai");
  }
  if (adapters.includes("SD")) {
    dependencies.push("@ai-sdk/standard-diffusion");
  }

  const providerDependencies = {
    OpenAI: "@ai-sdk/openai",
    AzureOpenAI: "@ai-sdk/azure",
    Anthropic: "@ai-sdk/anthropic",
    AmazonBedrock: "@ai-sdk/amazon-bedrock",
    GoogleGenerativeAI: "@ai-sdk/google",
    GoogleVertex: "@ai-sdk/google-vertex",
    Mistral: "@ai-sdk/mistral",
    Cohere: "@ai-sdk/cohere",
    Groq: "@ai-sdk/openai",
    Perplexity: "@ai-sdk/openai",
    Fireworks: "@ai-sdk/openai",
    LLamaCpp: "nnance/llamacpp-ai-provider",
    Ollama: "sgomez/ollama-ai-provider",
    ChromeAI: "jeasonstudio/chrome-ai",
  };

  providers !== "." &&
    providers.forEach((provider) => {
      if (providerDependencies[provider]) {
        dependencies.push(providerDependencies[provider]);
      }
    });

  if (dependencies.length > 0) {
    const spinner = ora("Installing dependencies...").start();
    try {
      execSync(`npm install ${dependencies.join(" ")}`, {
        cwd: projectDir,
        stdio: "inherit",
      });
      spinner.succeed("Dependencies installed successfully.");
    } catch (error) {
      spinner.fail("Error installing dependencies.");
      console.error(chalk.red(error));
    }
  }
};

// Function to convert string to camel case
const toCamelCase = (str) => {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase(),
    )
    .replace(/\s+/g, "");
};

// Function to capitalize the first letter of each word
const capitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

// Function to create package.json file
const createPackageJson = (projectDir, { typescript, projectName }) => {
  const packageJsonContent = {
    name: projectName,
    version: "0.1.0",
    main: typescript ? "src/index.ts" : "src/index.js",
    scripts: {
      start: typescript ? "ts src/index.ts" : "node src/index.js",
    },
    dependencies: {
      duneai: "github:KenanKStipek/duneai",
    },
  };

  fs.writeFileSync(
    path.join(projectDir, "package.json"),
    JSON.stringify(packageJsonContent, null, 2),
  );
};

// Function to install selected factories
const installFactories = async (factories, projectDir) => {
  const ora = (await import("ora")).default;
  factories.forEach((factory) => {
    const factoryUrl = `https://github.com/DuneAIOrg/Factories/${factory}/archive/refs/heads/main.zip`;
    const factoryDir = path.join(projectDir, "factories", factory);
    fs.ensureDirSync(factoryDir);
    const spinner = ora(`Downloading ${factory}...`).start();
    try {
      const zipPath = path.join(factoryDir, `${factory}.zip`);
      const file = fs.createWriteStream(zipPath);
      const request = https
        .get(factoryUrl, (response) => {
          response.pipe(file);
          file.on("finish", () => {
            file.close();
            execSync(`unzip ${zipPath} -d ${factoryDir}`);
            fs.removeSync(zipPath);
            spinner.succeed(
              `Downloaded and extracted ${factory} successfully.`,
            );
          });
        })
        .on("error", (err) => {
          fs.unlinkSync(zipPath);
          spinner.fail(`Error downloading ${factory}.`);
          console.error(chalk.red(err));
        });
    } catch (error) {
      spinner.fail(`Error downloading ${factory}.`);
      console.error(chalk.red(error));
    }
  });
};

// Dynamically import chalk, ora, inquirer, and chalk-animation
async function setup() {
  const chalk = (await import("chalk")).default;
  const ora = (await import("ora")).default;
  const inquirer = (await import("inquirer")).default;
  const inquirerSearchCheckbox = (await import("inquirer-search-checkbox"))
    .default;
  const chalkAnimation = (await import("chalk-animation")).default;

  // Register inquirer-search-checkbox prompt
  inquirer.registerPrompt("search-checkbox", inquirerSearchCheckbox);

  const program = new Command();

  program
    .name("setup")
    .description("Setup script for initializing DuneAI projects")
    .option("-n, --name <projectName>", "Project name")
    .option("-f, --factory true|false", "Creating a factory?", false)
    .option("-o, --output <outputDir>", "Output directory")
    .option("-w, --worm, --vvorm", "Include VVORM", false)
    .option("-a, --adapters <adapters>", "Include adapters", ".")
    .option("--factories <factories>", "Install Factories", ".")
    .option("-p, --providers <providers>", "Include providers", ".")
    .option(
      "-e, --example",
      "Include default example 'Hello World' skeleton",
      true,
    )
    .option("-h, --help", "Display help for command");

  program.on("--help", () => {
    console.log("");
    console.log("Detailed Help:");
    console.log("");
    console.log("Options:");
    console.log("  -n, --name <projectName>          Project name (required)");
    console.log(
      "                                    Example: --name myProject",
    );
    console.log("");
    console.log(
      "  -o, --output <outputDir>          Output directory for the project",
    );
    console.log(
      "                                    Default: Camel case version of the project name",
    );
    console.log(
      "                                    Example: --output ./myProjectDir",
    );
    console.log("");
    console.log(
      "  -w, --worm --vvorm                Include VVORM in the project",
    );
    console.log("                                    Default: false");
    console.log("                                    Example: --worm");
    console.log("");
    console.log(
      "  -a, --adapters <adapters>         Include specified adapters in the project",
    );
    console.log(
      "                                    Example: --adapters GPT4ALL,AI,SD",
    );
    console.log("");
    console.log(
      "  -f, --factories <factories>       Install specified factories in the project",
    );
    console.log(
      "                                    Example: --factories Factory1,Factory2",
    );
    console.log("");
    console.log(
      "  -p, --providers <providers>       Include specified providers in the project",
    );
    console.log(
      "                                    Example: --providers OpenAI,Anthropic",
    );
    console.log("");
    console.log(
      "  -e, --example                     Include default example 'Hello World' skeleton",
    );
    console.log("                                    Default: true");
    console.log("                                    Example: --example");
    console.log("");
    console.log("  -h, --help                        Display help for command");
    console.log("");
    console.log("Examples:");
    console.log("  $ setup --name myProject --output ./myProject --worm");
    console.log(
      "  $ setup --name myProject --adapters GPT4ALL,AI --factories Factory1,Factory2",
    );
    console.log("  $ setup --help");
    console.log("");
    console.log(
      "For more information, visit https://github.com/KenanKStipek/DuneAI",
    );
  });

  program.parse(process.argv);

  const options = program.opts();
  const https = require("https");
  const availableFactories = await new Promise((resolve, reject) => {
    https
      .get(
        "https://raw.githubusercontent.com/DuneAIOrg/Factories/main/index.json",
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve(JSON.parse(data).map((factory) => factory.name));
          });
        },
      )
      .on("error", (err) => {
        reject(err);
      });
  });

  const availableProviders = [
    "OpenAI",
    "AzureOpenAI",
    "Anthropic",
    "AmazonBedrock",
    "GoogleGenerativeAI",
    "GoogleVertex",
    "Mistral",
    "Cohere",
    "Groq",
    "Perplexity",
    "Fireworks",
    "LLamaCpp",
    "Ollama",
    "ChromeAI",
  ];

  const askQuestions = async () => {
    const questions = [];

    if (!options.name) {
      questions.push({
        type: "input",
        name: "projectName",
        message: "What is the name of your project?",
      });
    }

    if (!options.factory) {
      questions.push({
        type: "confirm",
        name: "factory",
        message: "Are you creating a Factory?",
        default: false,
      });
    }

    if (!options.output) {
      questions.push({
        type: "input",
        name: "output",
        message: "What is the output directory?",
        default: (answers) =>
          answers.factory
            ? capitalize(toCamelCase(answers.projectName || options.name))
            : toCamelCase(answers.projectName || options.name),
      });
    }

    questions.push({
      type: "confirm",
      name: "typescript",
      message: "Would you like to use TypeScript?",
      default: true,
    });

    questions.push({
      type: "confirm",
      name: "worm",
      message: "Would you like to include VVORM?",
      default: false,
      when: (answers) => !answers.factory,
    });

    questions.push({
      type: "confirm",
      name: "example",
      message:
        "Would you like to include the default example 'Hello World' skeleton?",
      default: false,
      when: (answers) => !answers.factory,
    });

    questions.push({
      type: "checkbox",
      name: "adapters",
      message: "Select adapters to include:",
      choices: [
        { name: "GPT4ALL", checked: true, value: "GPT4ALL" },
        { name: "Vercel AI", checked: true, value: "Vercel AI" },
        { name: "Standard Diffusion", value: "Standard Diffusion" },
      ],
      when: (answers) => !answers.factory && options.adapters === ".",
    });

    questions.push({
      type: "checkbox",
      name: "providers",
      message: "Select providers to include:",
      choices: availableProviders.map((provider) => ({
        name: provider,
        value: provider,
        checked: provider === "OpenAI" || provider === "Anthropic",
      })),
      pageSize: 10,
      when: (answers) => {
        const selectedAdapters =
          options.adapters === "."
            ? answers.adapters
            : options.adapters.split(",");
        return !answers.factory && selectedAdapters.includes("Vercel AI");
      },
    });

    questions.push({
      type: "search-checkbox",
      name: "factories",
      message: "Select factories to install:",
      choices: availableFactories,
      pageSize: 10,
      when: (answers) => !answers.factory && options.factories === ".",
    });

    const answers = await inquirer.prompt(questions);

    return {
      ...options,
      ...answers,
    };
  };

  const createProjectStructure = (
    projectName,
    outputDir,
    adapters,
    factories,
    providers,
    typescript,
    worm,
    example,
    factory,
  ) => {
    try {
      const spinner = ora("Creating project structure...").start();

      try {
        const projectDir = path.resolve(outputDir);
        fs.ensureDirSync(projectDir);

        if (!factory && factories && factories.length > 0) {
          installFactories(factories, projectDir);
        }

        if (!factory) {
          createPackageJson(projectDir, {
            projectName,
            providers,
            typescript,
            worm,
          });

          const configContent = `Project Name: ${projectName}\nAdapters: ${adapters}\nFactories: ${factories}\nProviders: ${providers}\nInclude VVORM: ${worm}\nInclude Example: ${example}`;
          fs.writeFileSync(path.join(projectDir, "README.md"), configContent);

          // Create .env file with API key placeholders
          let envContent = ``;
          providers?.forEach((provider) => {
            envContent += `${provider.toUpperCase().replace(/\s+/g, "_")}_API_KEY=###\n`;
          });
          fs.writeFileSync(path.join(projectDir, ".env"), envContent);
        }

        if (!example) {
          fs.ensureDirSync(path.resolve(outputDir, "src"));

          const promptsContent = `# Example
ExamplePrompt: "This is an example prompt."
      `;
          fs.writeFileSync(
            path.join(projectDir, "src", "Prompts.prompt"),
            promptsContent,
          );

          const indexContent = `
const DuneAI = require('duneai');
const prompts = DuneAI.Prompt.importPrompts('./Prompts.prompt');

// Example usage of imported prompts
console.log(prompts);
        `;
          fs.writeFileSync(
            path.join(projectDir, "src", "index.ts"),
            indexContent,
          );
        } else {
          const exampleDir = path.join(__dirname, "..", "src", "skeleton");
          fs.copySync(exampleDir, projectDir);
        }

        // Install dependencies based on selections
        installDependencies(projectDir, adapters, providers);

        spinner.succeed("Project structure created successfully.");
      } catch (error) {
        spinner.fail("Error creating project structure.");
        console.error(chalk.red(error));
      }
    } catch (error) {
      spinner.fail("Error creating project structure.");
      console.error(chalk.red(error));
    }
  };

  const runSetup = async () => {
    const bannerText = `
      ............................................................
      ░.......░░░..░░░░..░░...░░░..░░........░░░......░░░........░
      ▒..▒▒▒▒..▒▒..▒▒▒▒..▒▒....▒▒..▒▒..▒▒▒▒▒▒▒▒..▒▒▒▒..▒▒▒▒▒..▒▒▒▒
      ▓..▓▓▓▓..▓▓..▓▓▓▓..▓▓..▓..▓..▓▓......▓▓▓▓..▓▓▓▓..▓▓▓▓▓..▓▓▓▓
      █..████..██..████..██..██....██..████████........█████..████
      █.......████......███..███...██........██..████..██........█
      ............................................................
      `;

    const animation = chalkAnimation.karaoke(bannerText, 9);
    setTimeout(async () => {
      animation.stop();
      console.log(chalk.bgYellow(chalk.black("Starting setup...")));
      const answers = await askQuestions();
      createProjectStructure(
        answers.projectName,
        answers.output,
        answers.adapters,
        answers.factories,
        answers.providers,
        answers.typescript,
        answers.worm,
        answers.example,
        answers.factory,
      );
    }, 450);
  };

  runSetup();
}

setup();
