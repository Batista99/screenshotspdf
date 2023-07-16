const path = require('path');
const { spawn } = require('child_process');

exports.handler = async function (event, context) {
  try {
    const scriptPath = path.join(process.cwd(), 'captureScreenshotsPDF-urlsPRDPreviewOrLiveL0L1v2.js');
    const scriptProcess = spawn('node', [scriptPath]);

    scriptProcess.stdout.on('data', (data) => {
      console.log(`Script output: ${data}`);
    });

    scriptProcess.stderr.on('data', (data) => {
      console.error(`Script error: ${data}`);
    });

    return new Promise((resolve, reject) => {
      scriptProcess.on('close', (code) => {
        console.log(`Script process exited with code ${code}`);
        resolve({
          statusCode: 200,
          body: 'Script execution completed',
        });
      });

      scriptProcess.on('error', (error) => {
        console.error('Script process error:', error);
        reject({
          statusCode: 500,
          body: 'Error executing script',
        });
      });
    });
  } catch (error) {
    console.error('Error executing script:', error);
    return {
      statusCode: 500,
      body: 'Error executing script',
    };
  }
};
