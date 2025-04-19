const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('after:spec', (spec, results) => {
        if (results && results.tests) {
          results.tests.forEach(test => {
            const testName = test.title.join(' - ').replace(/\s+/g, '_');
            test.attempts.forEach((attempt) => {
              const status = attempt.state === 'passed' ? 'Pass' : 'Fail';
              const screenshot = attempt.screenshots[0];
              if (screenshot) {
                const oldPath = screenshot.path;
                const newFilename = `${testName}_${status}.png`;
                const newPath = path.join(path.dirname(oldPath), newFilename);
                fs.renameSync(oldPath, newPath);
              }
            });
          });
        }
      });
    },
    screenshotOnRunFailure: true,
    screenshotsFolder: 'screenshots',
    video: false,
  },
});
