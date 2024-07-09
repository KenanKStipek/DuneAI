"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMetaPrompt = exports.defaultMetaPrompt = void 0;
const adapters_1 = require("../../adapters");
exports.defaultMetaPrompt = {
    content: "Default analysis",
    params: {},
    dynamics: [],
    model: "nous-hermes-llama2-13b.Q4_0.gguf",
    runMetaPrompt: function () {
        return __awaiter(this, arguments, void 0, function* (previousResult = {}) {
            if (this.beforeExecute)
                yield this.beforeExecute.call(this);
            const contentToProcess = typeof this.content === "function"
                ? this.content(this.params)
                : this.content;
            // Replace placeholders in content with actual data from previousResult and params
            const interpolatedContent = Object.keys(this.params).reduce((acc, key) => {
                return acc.replace(new RegExp(`{{${key}}}`, "g"), previousResult[key] || this.params[key]);
            }, contentToProcess);
            console.log(`Executing MetaPrompt: ${interpolatedContent}`);
            let aiResponse = yield (0, adapters_1.ask)(interpolatedContent, {
                model: this.model,
            }).catch((error) => {
                console.error("Error during AI interaction:", error);
                return "Error processing AI response";
            });
            console.log("AI Response:", aiResponse);
            if (this.afterExecute)
                yield this.afterExecute.call(this);
            return aiResponse;
        });
    },
    beforeExecute: () => console.log("Preparing meta-prompt..."),
    afterExecute: () => console.log("Meta-prompt completed."),
};
function createMetaPrompt({ content, params = {}, dynamics = [], model = "nous-hermes-llama2-13b.Q4_0.gguf", beforeExecute, afterExecute, }) {
    return Object.assign(Object.assign({}, exports.defaultMetaPrompt), { content,
        params,
        dynamics,
        model,
        beforeExecute,
        afterExecute });
}
exports.createMetaPrompt = createMetaPrompt;
