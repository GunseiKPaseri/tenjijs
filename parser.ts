import { generate } from 'escodegen'
import { parse } from './tenjijs'

const overhead = `function b0f(x) {console.log(x);}
` // ⠏ p print script

export const genCode = (script: string, addOverhead?: boolean) => {
  return (addOverhead ? overhead : "") + generate(parse(script.replace(/[^\u2800-\u28ff]/g, "")));
}

