import { vi, describe, it, expect } from 'vitest'
import { genCode } from './parser'

describe("Literal", () => {
  describe("Null Literal", () => {
    it("null", () => {
      expect(genCode("⠝")).toBe("null;");
    });
  });
  describe("Boolean Literal", () => {
    it("boolean", () => {
      expect(genCode("⠞")).toBe("true;");
      expect(genCode("⠋")).toBe("false;");
    });
  });
  describe("Numeric Literal", () => {
    it("GS8 integer", () => {
      expect(genCode("⠡⠣⠩⠹⠱⠫⠻⠳⠪⠬")).toBe("1234567890;");
      expect(genCode("⠡⠣⠂⠩⠹⠱")).toBe("12345;");
      expect(genCode("⠬")).toBe("0;");
    });
    it("GS8 decimal", () => {
      expect(genCode("⠬⠲⠣⠱")).toBe("0.25;");
      expect(genCode("⠩⠲⠡⠹")).toBe("3.14;");
    });
  });
  describe("String Literal", () => {
    it("Normal String", () => {
      expect(genCode("⣄⠮⠐⠫⠐⠫⠄")).toBe("'\\u282E\\u2810\\u282B\\u2810\\u282B';");
      expect(genCode("⣄⢂⢂⢂⠄⠄")).toBe("'\\u2882\\u2804';");
    });
    it("Japanese Braille String", () => {
      expect(genCode("⡚⣄⣔⠠⢖⠠⢖⠄")).toBe("'ほげげ';");
      expect(genCode("⡚⣄⣒⠠⢂⢂⠠⢂⢂⠄")).toBe("'ふがが';");
      expect(genCode("⡚⣄⢂⢂⢂⠄⡢⠤⠄")).toBe("'かったー';");
    });
    it("GS8 Braille String", () => {
      expect(genCode("⡛⣄⡁⡃⡉⡙⡑⡋⡛⡓⡊⡚⡅⡇⡍⡝⡕⡏⡟⡗⡎⡞⡥⡧⡺⡭⡽⡵⠄")).toBe("'ABCDEFGHIJKLMNOPQRSTUVWXYZ';");
    });
   });
});

  /*
  it("integer", () => {
    expect(genCode("⣰⠂⠆⠒⠲⠢⠖⠶⠦⠔⠴")).toBe("1234567890");
    expect(genCode("⣰⠂⠆⡀⠒⠲⠢")).toBe("12345");
    expect(genCode("⣰⠴")).toBe("0");
  });
  it("decimal", () => {
    expect(genCode("⣰⠴⠄⢐⠢")).toBe("0.25");
    expect(genCode("⣰⠂⠆⠄⠲")).toBe("12.4");
  });
  */

describe("Expression", () => {
  it("UnaryExpression", () => {
    expect(genCode("⡒⠡⠣⠲⠹")).toBe("+12.4;")
    expect(genCode("⠤⠡⠣⠲⠹")).toBe("-12.4;")
  });
  it("BinaryExpression", () => {
    expect(genCode("⠡⠣⠩⡒⠡⠣⠲⠹")).toBe("123 + 12.4;")
    expect(genCode("⠡⠣⠩⠤⠡⠣⠲⠹")).toBe("123 - 12.4;")
    expect(genCode("⠡⠣⠩⢜⠡⠣⠲⠹")).toBe("123 * 12.4;")
    expect(genCode("⠡⠣⠩⣌⠡⠣⠲⠹")).toBe("123 / 12.4;")
    expect(genCode("⠡⠣⠩⠞⠡⠣⠲⠹")).toBe("123 % 12.4;")
    expect(genCode("⠡⠣⠩⢔⠡⠣⠲⠹")).toBe("123 < 12.4;")
    expect(genCode("⠡⠣⠩⢔⣶⠡⠣⠲⠹")).toBe("123 <= 12.4;")
    expect(genCode("⠡⠣⠩⡢⠡⠣⠲⠹")).toBe("123 > 12.4;")
    expect(genCode("⠡⠣⠩⡢⣶⠡⠣⠲⠹")).toBe("123 >= 12.4;")
    expect(genCode("⠞⠯⠞")).toBe("true & true;")
    expect(genCode("⠞⢳⠞")).toBe("true | true;")
    expect(genCode("⠞⡐⠞")).toBe("true ^ true;")
    expect(genCode("⠞⠯⠯⠞")).toBe("true && true;")
    expect(genCode("⠞⢳⢳⠞")).toBe("true || true;")
    expect(genCode("⠡⠣⠩⢜⢆⠹⠱⠫⠻⡒⠳⠪⠬⡘")).toBe("123 * (4567 + 890);")
   });
  it("ConditionalExpression", () => {
    expect(genCode("⠞⠶⠡⠣⠩⠒⠹⠱⠫")).toBe("true ? 123 : 456;")
  });
  it("CallExpression", () => {
    expect(genCode("⡄⠓⠕⠛⠑⡀⢆⡄⠋⠥⠛⠁⡀⠂⡄⠏⠊⠽⠕⡀⡘")).toBe("b13151b11(b0b251b01, b0f0a3d15);");
  });
});

describe("Statement", () => {
  describe("VariableStatement", () => {
    it("let", () => {
      expect(genCode("⠍⡄⠓⠕⠛⠑⡀⣶⠡⠣⠩")).toBe("let b13151b11 = 123;")
    });
    it("const", () => {
      expect(genCode("⠉⡄⠓⠕⠛⠑⡀⣶⠡⠣⠩")).toBe("const b13151b11 = 123;")
    });
  });
  describe("IfStatement", () => {
    it("if", () => {
      expect(genCode("⠊⢆⠞⡘⣷⠋⣾")).toBe("if (true) {\n    false;\n}")
      expect(genCode("⠊⢆⠞⡘⣷⠋⣾⠑⣷⠋⣾")).toBe("if (true) {\n    false;\n} else {\n    false;\n}")
      expect(genCode("⠊⢆⠞⡘⣷⠋⣾⠑⠊⢆⠞⡘⣷⠋⣾")).toBe("if (true) {\n    false;\n} else if (true) {\n    false;\n}")
    });
  });
  describe("IterationStatement", () => {
    it("while", () => {
      expect(genCode("⠺⢆⠞⡘⣷⠋⣾")).toBe("while (true) {\n    false;\n}")
    });
    it("continue", () => {
      expect(genCode("⠗⠑")).toBe("continue;")
    });
    it("break", () => {
      expect(genCode("⠃")).toBe("break;")
    });
  });
  describe("Function", () => {
    it("function", () => {
      expect(genCode("⠉⡄⠓⠕⠛⠑⡀⣶⠋⠝⢆⡘⣷⠋⣾")).toBe("const b13151b11 = function () {\n    false;\n};")
      expect(genCode("⠋⠝⡄⠓⠕⠛⠑⡀⢆⡄⠋⠥⠛⠁⡀⠂⡄⠏⠊⠽⠕⡀⡘⣷⠋⣾")).toBe("function b13151b11(b0b251b01, b0f0a3d15) {\n    false;\n}")
    });
  });
  describe("Block", () => {
    it("Block", () => {
      expect(genCode("⠋⠆⠋")).toBe("false;\nfalse;");
      expect(genCode("⣷⠋⠆⠋⣾")).toBe("{\n    false;\n    false;\n}");
    });
  });
});

it("ignore other char", () => {
  expect(genCode("ほげ⠋ふんが⠆じゃー⠋ぜ")).toBe("false;\nfalse;");
});

describe("exec javascript", () => {
  it("calculate", () => {
    const x = genCode("⠡⠣⠩⢜⢆⠹⠱⠫⠻⡒⠳⠪⠬⡘", true);
    expect(eval(x)).toBe(123*(4567+890))
  }); 
  it("execute", () => {
    const x = genCode("⡄⠏⡀⢆⡚⣄⣔⠠⢖⠠⢖⠄⡘", true)
    const spyConsoleLog = vi.spyOn(global.console, 'log').mockReturnValue(undefined);
    Function(x)();
    expect(spyConsoleLog).toHaveBeenCalledTimes(1);
    expect(spyConsoleLog.mock.calls[0][0]).toBe('ほげげ');
  });
});

