import { run } from "../src/labeler";
import * as helpers from "../src/helpers";
import * as github from "@actions/github";
import { mockGetInput } from "./support/helpers";

jest.mock("../src/helpers");

describe("run", () => {
  const token = "some token";
  const client = helpers.newClient("token");

  beforeEach(() => {
    const getRepoToken = helpers.getRepoToken as jest.MockedFunction<
      typeof helpers.getRepoToken
    >;

    getRepoToken.mockImplementationOnce(() => token);

    run();
  });

  it("creates a new client with the correct token", () => {
    expect(helpers.newClient).toHaveBeenCalledWith(token);
  });

  it("calls helpers.removeLabels", () => {
    expect(helpers.removeLabels).toHaveBeenCalledWith(client);
  });

  it("calls helpers.addLabels", () => {
    expect(helpers.addLabels).toHaveBeenCalledWith(client);
  });
});
