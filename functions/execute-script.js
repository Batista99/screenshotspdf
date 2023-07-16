const { exec } = require('child_process');

exports.handler = function(event, context, callback) {
  try {
    const scriptPath = 'captureScreenshotsPDF-urlsPRDPreviewOrLiveL0L1v2.js';
    const command = `node ${scriptPath}`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error('Script error:', error);
        callback(null, {
          statusCode: 500,
          body: 'Error executing script',
        });
        return;
      }

      console.log('Script output:', stdout);
      console.error('Script error:', stderr);

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
