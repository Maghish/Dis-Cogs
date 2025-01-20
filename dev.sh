#!/bin/bash

rm -rf dist && echo "[CLEAR] Clear build cache" && npx tsc && echo "[BUILD] Application build complete" && echo "[START] Starting the application" && node dist/main.js
