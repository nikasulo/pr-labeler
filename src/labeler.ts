import * as core from "@actions/core";
import * as github from "@actions/github";

type ClientType = ReturnType<typeof github.getOctokit>;

export async function run(): Promise<void> {
  try {
    const repoToken = getRepoToken();
    const client = newClient(repoToken);

    await addLabels(client);
  } catch (error) {
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

const getLabels = (): string[] => {
  const actionType = getActionType();
  return JSON.parse(core.getInput(`${actionType}-labels`));
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
