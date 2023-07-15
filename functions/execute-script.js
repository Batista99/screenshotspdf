const path = require('path');
const { spawn } = require('child_process');

exports.handler = function(event, context, callback) {
  try {
    console.log('Starting captureScreenshotsPDF-urlsPRDPreviewOrLiveL0L1v2.js script execution');
    const scriptPath = path.join(process.cwd(), 'captureScreenshotsPDF-urlsPRDPreviewOrLiveL0L1v2.js');
    const scriptProcess = spawn('node', [scriptPath]);

    scriptProcess.stdout.on('data', (data) => {
      console.log(`Script output: ${data}`);
    });

    scriptProcess.stderr.on('data', (data) => {
      console.error(`Script error: ${data}`);
    });

    scriptProcess.on('close', (code) => {
      console.log(`Script process exited with code ${code}`);
      callback(null, {
        statusCode: 200,
        body: 'Script execution completed',
      });
    });
  } catch (error) {
    console.error('Error executing script:', error);
    callback(null, {
      statusCode: 500,
      body: 'Error executing script',
    });
  }
};