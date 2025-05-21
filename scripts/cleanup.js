const { execSync } = require('child_process');
const os = require('os');

// Function to kill processes based on platform
function killNextProcesses() {
  try {
    if (os.platform() === 'win32') {
      // Windows command
      console.log('Killing Next.js processes on Windows...');
      execSync('taskkill /F /IM node.exe /FI "WINDOWTITLE eq next*"', { stdio: 'inherit' });
    } else {
      // Unix/Linux/Mac command
      console.log('Killing Next.js processes on Unix-like system...');
      execSync("pkill -f 'node.*next'", { stdio: 'inherit' });
    }
    console.log('Next.js processes killed successfully');
  } catch (error) {
    console.log('No matching processes found or unable to kill processes');
  }
}

// Run the cleanup
killNextProcesses(); 