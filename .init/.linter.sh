#!/bin/bash
cd /tmp/kavia/workspace/code-generation/qa-interactive-viewer-3191-3200/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

