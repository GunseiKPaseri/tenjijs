// 1 5
// 2 6
// 3 7
// 4 8
// 0b(87654321)
export const numToBrailleLetter = (n: number) => {
  const flags
    = ((n & 0b00001000) << 3)
    + ((n & 0b01110000) >> 1)
    + (n & 0b10000111);
  return String.fromCodePoint(flags + 0x2800);
}

export const brailleLetterToNum = (c: string) => {
  const u = c.codePointAt(0) - 0x2800;
  const flags
    = ((u & 0b01000000) >> 3)
    + ((u & 0b00111000) << 1)
    + (u & 0b10000111);
  return flags; 
}
