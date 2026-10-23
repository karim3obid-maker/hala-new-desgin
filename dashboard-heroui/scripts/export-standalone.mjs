import {spawnSync} from 'node:child_process';
import {copyFileSync,readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';

const project=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const result=spawnSync(process.execPath,[resolve(project,'node_modules/vite/bin/vite.js'),'build','--mode','standalone'],{cwd:project,stdio:'inherit'});
if(result.status!==0)process.exit(result.status??1);
if(process.argv.includes('--home')){
  const html=readFileSync(resolve(project,'dist-standalone/index.html'),'utf8').replace('<head>','<head><script>if(!location.hash)location.hash="/home";</script>');
  writeFileSync(resolve(project,'..','hala-home.html'),html);
  console.log('Homepage HTML exported. Dashboard exports and saved releases are unchanged.');
  process.exit(0);
}
for(const name of ['hala-dashboard.html','hala-dashboard-heroui.html']){
  copyFileSync(resolve(project,'dist-standalone/index.html'),resolve(project,'..',name));
}
console.log('Standalone HTML exported. Saved approved releases are unchanged.');
