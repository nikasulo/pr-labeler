import * as core from "@actions/core";
import * as github from "@actions/github";

type ClientType = ReturnType<typeof github.getOctokit>;

import { LABELS_TO_REMOVE, LABELS } from "./constants";

export async function run(): Promise<void> {
  try {
    const repoToken = getRepoToken();
    const client = newClient(repoToken);

    await removeLabels(client, getLabelsToRemove());
    await addLabels(client);
  } catch (error: any) {
    core.error(error);
    if (error instanceof Error) core.setFailed(error.message);
  }
}

const getLabelsToRemove = (): string[] => {
  const actionName = getActionType();
  const labelNameForAction = getLabelNameForAction(actionName);
  const labelsToRemove = LABELS_TO_REMOVE[labelNameForAction];

  return labelsToRemove;
};

const getRepoToken = (): string => {
  return core.getInput("repo-token");
};

const newClient = (token: string): ClientType => {
  return github.getOctokit(token);
};

const getPrNumber = (): number => {
  return parseInt(core.getInput("pr-number"));
};

const getLabelNameForAction = (actionType: string): string => {
  return `${actionType}_LABELS`;
};

const getLabels = (): string[] => {
  const actionType = getActionType();

  const labels = LABELS[getLabelNameForAction(actionType)];

  if (labels) {
    return labels;
  } else {
    throw new Error("Unhandled Action Type");
  }
};

const getActionType = (): string => {
  return core.getInput("action-type");
};

const removeLabels = async (client: ClientType, labels: string[]) => {
  await Promise.all(
    labels.map((label) => {
      removeLabel(client, label);
    })
  );
};

const removeLabel = async (client: ClientType, name: string) => {
  return await client.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: getPrNumber(),
    name,
  });
};

const addLabels = async (client: ClientType) => {
  await client.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: getPrNumber(),
    labels: getLabels(),
  });
};
