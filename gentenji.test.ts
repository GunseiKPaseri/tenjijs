import { describe, it, expect } from 'vitest'
import { numToBrailleLetter, brailleLetterToNum } from './gentenji'
describe("generate tenji", () => {
  it("from number to braille letter", () => {
    expect(numToBrailleLetter(0b00000001)).toBe("⠁");
    expect(numToBrailleLetter(0b00000010)).toBe("⠂");
    expect(numToBrailleLetter(0b00000100)).toBe("⠄");
    expect(numToBrailleLetter(0b00001000)).toBe("⡀");
    expect(numToBrailleLetter(0b00010000)).toBe("⠈");
    expect(numToBrailleLetter(0b00100000)).toBe("⠐");
    expect(numToBrailleLetter(0b01000000)).toBe("⠠");
    expect(numToBrailleLetter(0b10000000)).toBe("⢀");
    expect(numToBrailleLetter(0b00000000)).toBe("⠀");
  });
  it("from braille letter to number", () => {
    expect(brailleLetterToNum("⠁")).toBe(0b00000001);
    expect(brailleLetterToNum("⠂")).toBe(0b00000010);
    expect(brailleLetterToNum("⠄")).toBe(0b00000100);
    expect(brailleLetterToNum("⡀")).toBe(0b00001000);
    expect(brailleLetterToNum("⠈")).toBe(0b00010000);
    expect(brailleLetterToNum("⠐")).toBe(0b00100000);
    expect(brailleLetterToNum("⠠")).toBe(0b01000000);
    expect(brailleLetterToNum("⢀")).toBe(0b10000000);
    expect(brailleLetterToNum("⠀")).toBe(0b00000000);
  });
});

