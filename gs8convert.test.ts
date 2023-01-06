import { describe, it, expect } from 'vitest';
import { convertGS8 } from './gs8convert';

describe("convertGS8", () => {
  it("convertGS8", () => {
    expect(convertGS8("⡁⡃⡉⡙⡑⡋⡛⡓⡊⡚⡅⡇⡍⡝⡕⡏⡟⡗⡎⡞⡥⡧⡺⡭⡽⡵")).toBe("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
    expect(convertGS8("⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵").replace("%","t")).toBe("abcdefghijklmnopqrstuvwxyz")
  });
});
