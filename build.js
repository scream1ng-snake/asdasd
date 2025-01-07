const { build } = require('esbuild');  

build({  
  entryPoints: ['src/index.ts'],
  bundle: true,  
  outdir: 'build',  
  platform: 'node',
  target: 'node16',
  tsconfig: './tsconfig.json',
}).catch(() => process.exit(1));