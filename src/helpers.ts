import * as core from "@actions/core";
import * as github from "@actions/github";

import { LABELS_TO_REMOVE, LABELS } from "./constants";

type ClientType = ReturnType<typeof github.getOctokit>;

export const getLabelsToRemove = (): string[] => {
  const actionName = getActionType();

  const labelNameForAction = getLabelNameForAction(actionName);
  const labelsToRemove = LABELS_TO_REMOVE[labelNameForAction];

  return labelsToRemove;
};

export const getRepoToken = (): string => {
  return core.getInput("repo-token");
};

export const newClient = (token: string): ClientType => {
  return github.getOctokit(token);
};

export const getPrNumber = (): number => {
  return parseInt(core.getInput("pr-number"));
};

export const getLabelNameForAction = (actionType: string): string => {
  return `${actionType}_LABELS`;
};

export const getLabels = (): string[] => {
  const actionType = getActionType();

  const labels = LABELS[getLabelNameForAction(actionType)];

  if (labels) {
    return labels;
  } else {
    throw new Error("Unhandled Action Type");
  }
};

export const getActionType = (): string => {
  return core.getInput("action-type");
};

export const removeLabels = async (client: ClientType) => {
  const labels = getLabelsToRemove();

  if (labels === undefined) {
    const actionType = getActionType();

    return core.warning(`No labels to remove for ${actionType}`);
  }

  await Promise.all(
    labels.map((label) => {
      removeLabel(client, label);
    })
  );
};

export const removeLabel = async (client: ClientType, name: string) => {
  try {
    return await client.rest.issues.removeLabel({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      issue_number: getPrNumber(),
      name,
    });
  } catch (error: any) {
    if (
      error.name === "HttpError" &&
      error.message === "Label does not exist"
    ) {
      core.warning(
        `Tried to remove a label that does not exist. Label: ${name}`
      );
    } else {
      core.setFailed(error);
    }
  }
};

export const addLabels = async (client: ClientType) => {
  const labels = getLabels();

  if (labels === undefined) {
    const actionType = getActionType();

    return core.warning(`No labels to remove for ${actionType}`);
  }

  await client.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: getPrNumber(),
    labels,
  });
};
