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
exports.addLabels = exports.removeLabel = exports.removeLabels = exports.getActionType = exports.getLabels = exports.getLabelNameForAction = exports.getPrNumber = exports.newClient = exports.getRepoToken = exports.shouldNotAddLabels = exports.getLabelsToRemove = void 0;
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const constants_1 = require("./constants");
const getLabelsToRemove = () => {
    const actionName = (0, exports.getActionType)();
    const labelNameForAction = (0, exports.getLabelNameForAction)(actionName);
    const labelsToRemove = constants_1.LABELS_TO_REMOVE[labelNameForAction];
    return labelsToRemove;
};
exports.getLabelsToRemove = getLabelsToRemove;
const shouldNotAddLabels = () => {
    const actionType = (0, exports.getActionType)();
    return constants_1.DONT_ADD_LABELS.includes(actionType);
};
exports.shouldNotAddLabels = shouldNotAddLabels;
const getRepoToken = () => {
    return core.getInput("repo-token");
};
exports.getRepoToken = getRepoToken;
const newClient = (token) => {
    return github.getOctokit(token);
};
exports.newClient = newClient;
const getPrNumber = () => {
    return parseInt(core.getInput("pr-number"));
};
exports.getPrNumber = getPrNumber;
const getLabelNameForAction = (actionType) => {
    return `${actionType}_LABELS`;
};
exports.getLabelNameForAction = getLabelNameForAction;
const getLabels = () => {
    const actionType = (0, exports.getActionType)();
    const labels = constants_1.LABELS[(0, exports.getLabelNameForAction)(actionType)];
    if (labels) {
        return labels;
    }
    else {
        throw new Error("Unhandled Action Type");
    }
};
exports.getLabels = getLabels;
const getActionType = () => {
    return core.getInput("action-type");
};
exports.getActionType = getActionType;
const removeLabels = (client) => __awaiter(void 0, void 0, void 0, function* () {
    const labels = (0, exports.getLabelsToRemove)();
    yield Promise.all(labels.map((label) => {
        (0, exports.removeLabel)(client, label);
    }));
});
exports.removeLabels = removeLabels;
const removeLabel = (client, name) => __awaiter(void 0, void 0, void 0, function* () {
    return yield client.rest.issues.removeLabel({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: (0, exports.getPrNumber)(),
        name,
    });
});
exports.removeLabel = removeLabel;
const addLabels = (client) => __awaiter(void 0, void 0, void 0, function* () {
    yield client.rest.issues.addLabels({
        owner: github.context.repo.owner,
        repo: github.context.repo.repo,
        issue_number: (0, exports.getPrNumber)(),
        labels: (0, exports.getLabels)(),
    });
});
exports.addLabels = addLabels;
