#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Running vote tests...\n');

// Run the test script
const testProcess = spawn('node', ['test-multiple-votes.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

testProcess.on('close', (code) => {
  if (code === 0) {
    console.log('\n✨ Tests completed successfully!');
  } else {
    console.error('\n❌ Tests failed with code:', code);
    process.exit(1);
  }
});