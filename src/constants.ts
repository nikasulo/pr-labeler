export const LABELS: { [key: string]: string[] } = {
  READY_FOR_REVIEW_LABELS: ["ready-for-review"],
  APPROVED_LABELS: ["ready-for-merge"],
};

export const LABELS_TO_REMOVE: { [key: string]: string[] } = {
  READY_FOR_REVIEW_LABELS: ["ready-for-merge"],
  APPROVED_LABELS: ["ready-for-review"],
  CONVERTED_TO_DRAFT_LABELS: ["ready-for-review", "ready-for-merge"],
};
