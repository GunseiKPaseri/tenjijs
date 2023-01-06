import { describe, it, expect } from 'vitest';
import * as internal from './internal';

describe("internal", () => {
  it("alterIdentify", () => {
    expect(internal.alterIdentify("⠓⠕⠛⠑")).toBe("b13151b11");
  });
});

