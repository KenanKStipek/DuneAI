![DuneAI Logo](./public/DuneAIGithub.png)

# DuneAI

## Introduction

DuneAI is a Dynamic Meta Prompting Microservice Framework designed to empower developers to construct and manage complex AI interactions within a microservice architecture. Central to DuneAI are **Dynamics** and **MetaPrompts**, innovative features that enable the creation of complex, dynamic AI prompt chains and decision trees. This framework simplifies the integration of diverse AI capabilities into applications, making them accessible via command line, message queue triggers, or REST endpoints.

You can read more about the motivation for DuneAI [here](https://www.stipek.org/).

## Features

- **Rapid Development and Deployment**: Features opinionated scaffolds and generators that accelerate the development and deployment of new AI-driven services, significantly reducing the time and complexity involved in starting new projects.
- **Complex Dynamics Handling**: Supports three types of Dynamics—**Recursive**, **Chain of Thought**, and **Tree of Thought**. Each type is tailored to manage specific complex AI prompting scenarios, enabling sophisticated interaction patterns and decision-making workflows.
- **Dynamic Meta Prompting**: Utilizes **MetaPrompts**, encapsulated in `.tsp` (TypeScript Prompt) files, to dynamically generate and manage AI-driven content based on TypeScript-supported string interpolation, enhancing the adaptability and responsiveness of services.
- **Retrieval-Augmented Generation (RAG)**: Implements before and after hooks in Dynamics to allow for data injection from AI-prompted data requests or from defined data stores such as files or databases, enriching the dynamic content generation with real-time, contextual data.
- **Extensive AI Provider Integration**: Compatible with a variety of AI providers including Claude, OpenAI, etc., allowing seamless integration to harness diverse AI functionalities.
- **Integrated Request Bottleneck Management**: Incorporates the Bottleneck library to intelligently manage and throttle requests, ensuring that interactions with upstream AI providers adhere to their service constraints and optimizing overall system performance.
- **Normalized AI Service Library**: Provides a standardized interface for interacting across different AI services, simplifying the development process and reducing the learning curve for new developers.
- **Adaptable Runtime Compatibility**: Operates efficiently across multiple JavaScript runtimes such as Node.js, Bun, Cloudflare Workers, and WinterJS, ensuring broad deployment flexibility and scalability.

TODO:

- [ ] Core MetaPrompt
  - [x] TSP file definition
  - [ ] TSP file parsing
- [x] Core Dynamics
  - [x] Prime Dynamic
  - [x] Recursive
  - [x] ToT
  - [x] CoT
- [x] New instance build script
- [ ] Bottleneck
  - [ ] Retrieve and set upstream limitations
  - [ ] Allow for clustering
- [x] Upstream Providers
  - [x] OpenAI
  - [x] GPT4ALL
  - [x] Standard Diffusion
  - [ ] OpenELM
  - [ ] Gemini
- [x] Normalized AI Service Library
- [ ] API Options
  - [ ] CLI
  - [ ] REST
  - [ ] MQ
- [ ] Generators
  - [ ] Generators for Meta Prompts
  - [ ] Generators for Dynamics
- [x] Side Effects and Hooks
- [ ] Support .env files for secrets
- [ ] Update Readme
- [ ] Adaptable Runtime Compatibility
  - [x] Node.js
  - [ ] Bun
  - [ ] Cloudflare Workers
  - [ ] WinterJS
- [ ] Porting
  - [ ] Port to Python
  - [ ] Port to Java
