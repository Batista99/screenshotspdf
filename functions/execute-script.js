const path = require('path');
const { spawn } = require('child_process');

exports.handler = function(event, context, callback) {
  try {
    const scriptPath = path.resolve(__dirname, '..', '..', 'captureScreenshotsPDF-urlsPRDPreviewOrLiveL0L1v2.js');
    console.log('Script path:', scriptPath);

    const scriptProcess = spawn('node', [scriptPath], {
      cwd: '/var/task',
      shell: true,
    });

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

    scriptProcess.on('error', (error) => {
      console.error('Script process error:', error);
      callback(null, {
        statusCode: 500,
        body: 'Error executing script',
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
