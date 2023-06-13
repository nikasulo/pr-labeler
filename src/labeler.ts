import * as core from "@actions/core";
import * as github from "@actions/github";

type ClientType = ReturnType<typeof github.getOctokit>;

const LABELS: {[key: string]: string[]} = {
  READY_FOR_REVIEW_LABELS: ['ready-for-review'],
  APPROVED: ['ready-for-merge']
}


export async function run(): Promise<void> {
  try {
    const repoToken = getRepoToken();
    const client = newClient(repoToken);

    await addLabels(client);
  } catch (error: any) {
    core.error(error)
    if (error instanceof Error) core.setFailed(error.message);
  }
}

const getRepoToken = (): string => {
  return core.getInput("repo-token");
};


const newClient = (token: string): ClientType => {
  return github.getOctokit(token);
};

const getPrNumber = (): number => {
  return parseInt(core.getInput("pr-number"));
};

const labelName = (actionType: string): string => {
  return `${actionType}_LABELS`
}

const getLabels = (): string[] => {
  const actionType = getActionType();

  const labels = LABELS[labelName(actionType)]

  if (labels) {
    return labels
  } else {
    throw new Error("Unhandled Action Type")
  }
};

const getActionType = (): string => {
  return core.getInput("action-type");
};

const addLabels = async (client: ClientType) => {
  await client.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: getPrNumber(),
    labels: getLabels(),
  });
};
