import * as tenji from 'tenji';

import { convertGS8 } from './gs8convert';
export { convertGS8 };

export const parseNumber = (text: string) => {
  return parseFloat(tenji.fromTenji(text.replace(/\u2840/g, ""), {kanji: true}));
}

export const parseGS8Number = (text: string) => {
  return parseFloat(convertGS8(text).replace(/,/, ""))
}

const alterChar = (c: string) =>
  ((c.codePointAt(0) ?? 0x2800) - 0x2800).toString(16).padStart(2, "0");

export const alterIdentify = (id: string) => {
  return "b" + id.split("").map(alterChar).join("")
};
export const buildBinaryExpression = (head: unknown, tail: [unknown,string,unknown,unknown][]) => {
  return tail.reduce((result, element) => {
    return {
      type: "BinaryExpression",
      operator: convertGS8(element[1]),
      left: result,
      right: element[3]
    }
  }, head)
}

export const TYPES_TO_PROPERTY_NAMES = {
  CallExpression: "callee",
  MemberExpression: "object",
}

export const optionalList = (value: unknown) => {
  return value === null ? [] : value
}

export const extractList = (list:unknown[][], index: number) => {
  return list.map((element) => element[index])
}
export const buildList = (head: unknown, tail: unknown[][], index: number) => {
  return [head].concat(extractList(tail, index))
}

export const extractOptional = (optional: unknown[], index: number) => {
  return optional ? optional[index] : null;
}

export const convertTenji = (str: string) => {
  return tenji.fromTenji(str, {kanji: true}); 
}
