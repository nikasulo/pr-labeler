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
  } catch (error: any) {
    if (
      error.name === "HttpError" &&
      error.message === "Label does not exist"
    ) {
      core.warning("Tried to remove a label that does not exist");
    } else if (error instanceof Error) {
      core.setFailed(error);
    }
  }
}
