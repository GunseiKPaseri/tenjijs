import { generate } from 'escodegen'
import * as fs from 'fs';
import { parse } from './tenjijs'

const gs8src = fs.readFileSync("./gs8convert.js", {encoding: 'utf8'}).replace(/\nexports\..*?;/g,"");

const gs8uri = "data:text/javascript;base64," + btoa(gs8src);

const overhead = 
`${gs8src}
function b0f(x) {console.log(reverseGS8(x.toString()));}
function b0f0f(x) {console.log(x);}
` // ⠏ p print (as gs8)
// ⠏⠏ pp print (as char)
export const genCode = (script: string, addOverhead?: boolean) => {
  return (addOverhead ? overhead : "") + generate(parse(script.replace(/[^\u2800-\u28ff]/g, "")));
}

