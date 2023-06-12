import * as core from "@actions/core";
import * as github from "@actions/github";

type ClientType = ReturnType<typeof github.getOctokit>;

const LABELS: {[key: string]: string[]} = {
  APPROVED_LABELS: ['ready-for-merge'],
  READY_FOR_REVIEW_LABELS: ['ready-for-review']
}


export async function run(): Promise<void> {
  try {
    const repoToken = getRepoToken();
    const client = newClient(repoToken);

    console.log(repoToken);
    console.log(client)
    console.log(`PR number: ${getPrNumber()}`)
    console.log(`labels: ${getLabels()}`)
    await addLabels(client);
  } catch (error) {
    console.log(error)
    if (error instanceof Error) core.setFailed(error);
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

const getLabels = (): string[] => {
  const actionType = getActionType();
  console.log(actionType)
  return LABELS[`${actionType}_LABELS`];
};

const getActionType = (): string => {
  return core.getInput("action-type");
};

const addLabels = async (client: ClientType) => {
  const result = await client.rest.issues.addLabels({
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: getPrNumber(),
    labels: getLabels(),
  });
};
