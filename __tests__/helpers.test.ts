import * as helpers from "../src/helpers";
import * as core from "@actions/core";
import * as github from "@actions/github";
import { mockGetInput } from "./support/helpers";

import { LABELS_TO_REMOVE, LABELS } from "../src/constants";

jest.mock("@actions/github");

afterEach(() => {
  jest.restoreAllMocks();
});

describe("getLabelsToRemoves", () => {
  describe("when the action is APPROVED", () => {
    const actionType = "APPROVED";

    beforeEach(() => {
      process.env.ACTION_TYPE = actionType;
    });

    const callback = (name: string) => {
      if (name === "action-type") return actionType;

      return "";
    };

    mockGetInput(callback);

    it("returns the correct labels", () => {
      expect(helpers.getLabelsToRemove()).toEqual(
        LABELS_TO_REMOVE[`${actionType}_LABELS`]
      );
    });
  });

  describe("when the action is READY_FOR_REVIEW", () => {
    const actionType = "READY_FOR_REVIEW";

    beforeEach(() => {
      process.env.ACTION_TYPE = actionType;
    });

    const callback = (name: string) => {
      if (name === "action-type") return actionType;

      return "";
    };

    mockGetInput(callback);

    it("returns the correct labels", () => {
      expect(helpers.getLabelsToRemove()).toEqual(
        LABELS_TO_REMOVE[`${actionType}_LABELS`]
      );
    });
  });
});

describe("getRepoToken", () => {
  const repoToken = "repoToken";

  const callback = (name: string) => {
    if (name === "repo-token") return repoToken;

    return "";
  };

  mockGetInput(callback);

  it("returns the repo token given as input", () => {
    expect(helpers.getRepoToken()).toEqual(repoToken);
  });
});

describe("newClient", () => {
  const token = "some-token";

  describe("creating an octokit client", () => {
    beforeEach(() => {
      const getOctokit = github.getOctokit as jest.MockedFunction<
        typeof github.getOctokit
      >;

      type ClientType = ReturnType<typeof github.getOctokit>;

      getOctokit.mockImplementationOnce(() => ({} as ClientType));
    });

    it("creates the octokit with the right parameters", () => {
      helpers.newClient(token);

      expect(github.getOctokit).toHaveBeenCalledWith(token);
    });
  });

  describe("return value", () => {
    const octokit = jest.fn(() => "some-client") as unknown;

    beforeEach(() => {
      const getOctokit = github.getOctokit as jest.MockedFunction<
        typeof github.getOctokit
      >;

      type ClientType = ReturnType<typeof github.getOctokit>;
      getOctokit.mockImplementationOnce(() => octokit as ClientType);
    });

    it("returns an octokit client", () => {
      const client = helpers.newClient(token);

      expect(client).toEqual(octokit);
    });
  });
});

describe("getPrNumber", () => {
  const prNumber = "7121996";

  const callback = (name: string) => {
    if (name === "pr-number") return prNumber;

    return "";
  };

  mockGetInput(callback);

  it("returns the PR Number provided as an argument", () => {
    expect(helpers.getPrNumber()).toEqual(parseInt(prNumber));
  });
});

describe("getLabelNameForAction", () => {
  it("generates the correct label names", () => {
    const actionType = "somme-weird-action";

    expect(helpers.getLabelNameForAction(actionType)).toEqual(
      `${actionType}_LABELS`
    );
  });
});

describe("getLabels", () => {
  describe("when the action type is APPROVED", () => {
    const actionType = "APPROVED";

    const callback = (name: string) => {
      if (name === "action-type") return actionType;

      return "";
    };

    mockGetInput(callback);

    it("returns the labels for approvals", () => {
      expect(helpers.getLabels()).toEqual(LABELS[`${actionType}_LABELS`]);
    });
  });

  describe("when the action type is READY_FOR_REVIEW", () => {
    const actionType = "READY_FOR_REVIEW";

    const callback = (name: string) => {
      if (name === "action-type") return actionType;

      return "";
    };

    mockGetInput(callback);

    it("returns the labels for ", () => {
      expect(helpers.getLabels()).toEqual(LABELS[`${actionType}_LABELS`]);
    });
  });
});

describe("getActionType", () => {
  const actionType = "READY_FOR_REVIEW";

  const callback = (name: string) => {
    if (name === "action-type") return actionType;

    return "";
  };

  mockGetInput(callback);

  it("calls the github.getInput function with the right parameter", () => {
    helpers.getActionType();
    expect(core.getInput).toHaveBeenCalledWith("action-type");
  });

  it("returns the action type provided as an argument", () => {
    expect(helpers.getActionType()).toEqual(actionType);
  });
});

describe("removeLabels", () => {
  describe("when the action type is APPROVED", () => {
    beforeEach(() => {
      const clientMock = {
        rest: {
          issues: {
            removeLabel: jest.fn(() => Promise.resolve(true)),
          },
        },
      };

      const getOctokit = github.getOctokit as jest.MockedFunction<
        typeof github.getOctokit
      >;

      jest.replaceProperty(github, "context", {
        repo: { owner: "Dami", repo: "magnumpii" },
      } as typeof github.context);

      getOctokit.mockImplementation(
        () => clientMock as unknown as ReturnType<typeof github.getOctokit>
      );
    });

    const actionType = "APPROVED";

    const callback = (name: string) => {
      if (name === "action-type") return actionType;
      if (name === "pr-number") return "12345";

      return "";
    };

    mockGetInput(callback);

    it("removes the right set of labels", async () => {
      const client = github.getOctokit("ok");
      const labelsToRemove = LABELS_TO_REMOVE[`${actionType}_LABELS`];

      await helpers.removeLabels(
        client as ReturnType<typeof github.getOctokit>
      );

      labelsToRemove.forEach((label) => {
        expect(client.rest.issues.removeLabel).toHaveBeenCalledWith({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: helpers.getPrNumber(),
          name: label,
        });
      });
    });
  });

  describe("when the action type is READY_FOR_REVIEW", () => {
    beforeEach(() => {
      const clientMock = {
        rest: {
          issues: {
            removeLabel: jest.fn(() => Promise.resolve(true)),
          },
        },
      };

      const getOctokit = github.getOctokit as jest.MockedFunction<
        typeof github.getOctokit
      >;

      jest.replaceProperty(github, "context", {
        repo: { owner: "Dami", repo: "magnumpii" },
      } as typeof github.context);

      getOctokit.mockImplementation(
        () => clientMock as unknown as ReturnType<typeof github.getOctokit>
      );
    });

    const actionType = "READY_FOR_REVIEW";

    const callback = (name: string) => {
      if (name === "action-type") return actionType;
      if (name === "pr-number") return "12345";

      return "";
    };

    mockGetInput(callback);

    it("removes the right set of labels", async () => {
      const client = github.getOctokit("ok");
      const labelsToRemove = LABELS_TO_REMOVE[`${actionType}_LABELS`];

      await helpers.removeLabels(
        client as ReturnType<typeof github.getOctokit>
      );

      labelsToRemove.forEach((label) => {
        expect(client.rest.issues.removeLabel).toHaveBeenCalledWith({
          owner: github.context.repo.owner,
          repo: github.context.repo.repo,
          issue_number: helpers.getPrNumber(),
          name: label,
        });
      });
    });
  });
});

describe("addLabels", () => {
  const owner = "some-owner";
  const repo = "some-repo";

  beforeEach(() => {
    const context = { repo: { owner, repo } };

    jest.replaceProperty(github, "context", context as typeof github.context);

    const mockClient = {
      rest: {
        issues: {
          addLabels: jest.fn(),
        },
      },
    };

    const getOctokit = github.getOctokit as jest.MockedFunction<
      typeof github.getOctokit
    >;

    getOctokit.mockImplementationOnce(
      () => mockClient as unknown as ReturnType<typeof getOctokit>
    );
  });

  const actionType = "READY_FOR_REVIEW";

  const callback = (name: string) => {
    if (name === "action-type") return actionType;
    if (name === "pr-number") return "12345";

    return "";
  };

  mockGetInput(callback);

  it("calls the correct method with the right parameters", () => {
    const client = github.getOctokit("token");

    helpers.addLabels(client);

    expect(client.rest.issues.addLabels).toHaveBeenCalledWith({
      owner,
      repo,
      issue_number: helpers.getPrNumber(),
      labels: helpers.getLabels(),
    });
  });
});
