@echo off
setlocal
set "PATH=%~dp0;%PATH%"
set "pnpm_config_verify_deps_before_run=false"
"C:\Users\PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" "C:\Users\PC\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs" %*
