"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.run = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const constants_1 = require("./constants");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const repoToken = getRepoToken();
            const client = newClient(repoToken);
            yield removeLabels(client, getLabelsToRemove());
            yield addLabels(client);
        }
        catch (error) {
            if (error instanceof Error)
                core.setFailed(error.message);
        }
    });
}
exports.run = run;
const getLabelsToRemove = () => {
    const actionName = getActionType();
    const labelNameForAction = getLabelNameForAction(actionName);
    const labelsToRemove = constants_1.LABELS_TO_REMOVE[labelNameForAction];
    return labelsToRemove;
};
const getRepoToken = () => {
    return core.getInput("repo-token");
};
const newClient = (token) => {
    return github.getOctokit(token);
};
const getPrNumber = () => {
    return parseInt(core.getInput("pr-number"));
};
const getLabelNameForAction = (actionType) => {
    return `${actionType}_LABELS`;
};
const getLabels = () => {
    const actionType = getActionType();
    const labels = constants_1.LABELS[getLabelNameForAction(actionType)];
    if (labels) {
        return labels;
    }
    else {
        throw new Error("Unhandled Action Type");
    }
};
const getActionType = () => {
    return core.getInput("action-type");
};
const removeLabels = (client, labels) => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all(labels.map((label) => {
        removeLabel(client, label);
    }));
});
const removeLabel = (client, name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client.rest.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: getPrNumber(),
        name,
    });
});
const addLabels = (client) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.rest.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: getPrNumber(),
        labels: getLabels(),
    });
});
