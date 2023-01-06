import { parseArgs } from 'util';
import { convertGS8 } from './internal';
import  { genCode } from './parser';
import * as fs from 'fs';

const parsed = parseArgs({
  args: process.argv.slice(2),
  options: {
    src: {
      type: "string"
    },
    rawjs: {
      type: "boolean",
      short: "j",
    },
    replace: {
      type: "boolean",
      short: "r"
    }
  }
});

const tenjijssrc = fs.readFileSync(parsed.values.src ?? '', {encoding: 'utf8'})

if(parsed.values.replace){
  console.log(convertGS8(tenjijssrc));
} else {
  const altersrc = genCode(tenjijssrc, true);
  if(parsed.values.rawjs){
    console.log(altersrc)
  } else {
    Function(altersrc)();
  }
}


