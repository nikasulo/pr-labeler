"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DONT_ADD_LABELS = exports.LABELS_TO_REMOVE = exports.LABELS = void 0;
exports.LABELS = {
    READY_FOR_REVIEW_LABELS: ["ready-for-review"],
    APPROVED_LABELS: ["ready-for-merge"],
};
exports.LABELS_TO_REMOVE = {
    READY_FOR_REVIEW_LABELS: ["ready-for-merge"],
    APPROVED_LABELS: ["ready-for-review"],
    CONVERTED_TO_DRAFT_LABELS: ["ready-for-review", "ready-for-merge"],
};
exports.DONT_ADD_LABELS = ["CONVERTED_TO_DRAFT"];
