import * as core from "@actions/core";

import {
  getRepoToken,
  addLabels,
  newClient,
  removeLabels,
  shouldNotAddLabels,
} from "./helpers";

export async function run(): Promise<void> {
  try {
    const repoToken = getRepoToken();
    const client = newClient(repoToken);

    await removeLabels(client);

    if (shouldNotAddLabels()) return;
    await addLabels(client);
  } catch (error) {
    console.log(error);
    if (error instanceof Error) core.setFailed(error.message);
  }
}
