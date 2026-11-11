@echo off
setlocal
set "PATH=%~dp0;%PATH%"
set "NPX_BIN_DIR=%~dp0"
"C:\Users\PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" -e "const{spawnSync}=require('child_process'),fs=require('fs'),path=require('path'),args=process.argv.slice(1),cmd=args[0];if(!cmd)process.exit(1);const bin=path.resolve(process.env.NPX_BIN_DIR,'..','node_modules','.bin',cmd+'.cmd');const q=s=>/[\s\"\u0026\u007c\u003c\u003e\u005e]/.test(s)?'\"'+s.replace(/\"/g,'\\\"')+'\"':s;if(fs.existsSync(bin)){const r=spawnSync([q(bin),...args.slice(1).map(q)].join(' '),{stdio:'inherit',shell:true});process.exit(r.status??1);}const r=spawnSync(process.execPath,['C:\\Users\\PC\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\node\\node_modules\\pnpm\\bin\\pnpm.cjs','dlx',...args],{stdio:'inherit'});process.exit(r.status??1);" -- %*
