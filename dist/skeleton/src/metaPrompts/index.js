"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicStoryWritingPrompt = exports.enhancedStoryArcPrompt = exports.characterCreationPrompt = void 0;
const MetaPrompt_1 = require("../../../modules/MetaPrompt");
exports.characterCreationPrompt = (0, MetaPrompt_1.createMetaPrompt)({
    content: (params) => `${params.characterName} is a ${params.characterDescription}.`,
    params: { characterName: "", characterDescription: "" },
});
exports.enhancedStoryArcPrompt = (0, MetaPrompt_1.createMetaPrompt)({
    content: (params) => `Develop a detailed outline for a ${params.genre} story with ${params.characterCount} main characters.`,
    params: { genre: "", characterCount: 0 },
});
exports.dynamicStoryWritingPrompt = (0, MetaPrompt_1.createMetaPrompt)({
    content: (params) => `
You are writing a story, here is the information for the story:
Story outline: ${params.Outline}
Story characters: ${params.Characters}
Total length: ${params.totalLength}
Current page: ${params.currentPage}
${params.currentPage !== 0 ? "Previous page content:" : "Start story:"}
${params.previousPageContent}
${params.currentPage === params.totalPageLength - 1 ? "You are now writing the last page" : ""}`,
    params: {
        Outline: "",
        Characters: "",
        genre: "",
        characterCount: 0,
        totalLength: 0,
        currentPage: 0,
        previousPageContent: "",
        totalPageLength: 0,
    },
});
exports.default = {
    characterCreationPrompt: exports.characterCreationPrompt,
    enhancedStoryArcPrompt: exports.enhancedStoryArcPrompt,
    dynamicStoryWritingPrompt: exports.dynamicStoryWritingPrompt,
};
