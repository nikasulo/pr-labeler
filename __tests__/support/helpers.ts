import * as core from "@actions/core";

export const mockGetInput = (callback: (name: string) => string) => {
  beforeEach(() => {
    jest.spyOn(core, "getInput").mockImplementation((name: string): string => {
      const result = callback(name);

      if (result !== undefined) return result;

      return "";
    });
  });
};
