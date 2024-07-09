"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTSPFile = void 0;
// src/parser/tspParser.ts
const fs_1 = __importDefault(require("fs"));
const parseTSPFile = (filePath) => {
    const content = fs_1.default.readFileSync(filePath, "utf8");
    const regex = /\{\{([^}]+)\}\}/g; // Regex to find {{ ... }} blocks
    let match;
    let textContent = content;
    const params = {};
    while ((match = regex.exec(content)) !== null) {
        const key = match[1].trim();
        const parts = key.split(",").map((part) => part.trim());
        const paramName = parts.shift() || "";
        const dependencies = parts;
        textContent = textContent.replace(match[0], `\${${paramName}}`);
        params[paramName] = dependencies;
    }
    return {
        content: textContent,
        params,
    };
};
exports.parseTSPFile = parseTSPFile;
