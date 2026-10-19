// Đóng gói toàn bộ ứng dụng thành MỘT file HTML (standalone/4v2.html)
// mở trực tiếp bằng trình duyệt, không cần server hay build tool.
import { build } from 'esbuild';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const js = await build({
  entryPoints: ['src/main.ts'],
  bundle: true,
  format: 'iife',
  target: 'es2020',
  minify: true,
  write: false,
  legalComments: 'none',
});
const code = js.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const css = await readFile('src/styles.css', 'utf8');
let html = await readFile('index.html', 'utf8');

html = html
  .replace('<link rel="stylesheet" href="./src/styles.css" />', () => `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="./src/main.ts"></script>', () => `<script>\n${code}\n</script>`);

await mkdir('standalone', { recursive: true });
await writeFile('standalone/4v2.html', html);
console.log('Đã tạo standalone/4v2.html', (html.length / 1024).toFixed(1) + ' KB');
