import * as Parser from './tenjijs';
const Tracer = require('pegjs-backtrace');

const text = `
⠍⡄⠓⠕⠛⠑⡀⣶⠡⠆
⠺⢆⡄⠓⠕⠛⠑⡀⢔⠡⠱⡘⣷
  ⠊⢆⡄⠓⠕⠛⠑⡀⠞⠡⠱⣶⣶⠬⡘⡄⠏⡀⢆⡚⣄⢠⠖⠔⣢⣢⠆⣂⣢⣢⠄⡘⠆
  ⠑⠊⢆⡄⠓⠕⠛⠑⡀⠞⠩⣶⣶⠬⡘⡄⠏⡀⢆⡚⣄⢠⠖⠔⣢⣢⠄⡘⠆
  ⠑⠊⢆⡄⠓⠕⠛⠑⡀⠞⠱⣶⣶⠬⡘⡄⠏⡀⢆⡚⣄⢠⠆⣂⣢⣢⠄⡘⠆
  ⠑⡄⠏⡀⡄⠓⠕⠛⠑⡀⡘
⣾
`
const tracer = new Tracer(text.replace(/[\s\r\n]/g,""));

try {
  Parser.parse(text, { tracer: tracer });
}catch (e){
  console.error(tracer.getBacktraceString());
}

