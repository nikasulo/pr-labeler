import * as core from "@actions/core";

import { getRepoToken, addLabels, newClient, removeLabels } from "./helpers";

export async function run(): Promise<void> {
  try {
    const repoToken = getRepoToken();
    const client = newClient(repoToken);

    await removeLabels(client);
    await addLabels(client);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
