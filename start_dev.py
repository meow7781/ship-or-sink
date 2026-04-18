#!/usr/bin/env python
import subprocess
import os
import sys

os.chdir(r'c:\Users\LENOVO\Downloads\delluMeter')
# Use the .cmd wrapper on Windows
cmd = [r'C:\Program Files\nodejs\node.exe', r'node_modules\next\dist\bin\next.js', 'dev']
print('Starting Next.js dev server...')
print('Server will run on: http://localhost:3000')
print('Press Ctrl+C to stop')
try:
    subprocess.run(cmd)
except KeyboardInterrupt:
    print('\nServer stopped.')
    sys.exit(0)
