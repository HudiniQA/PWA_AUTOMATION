const fs = require('fs');
const path = require('path');

module.exports = async () => {
  const allureResultsPath = path.resolve(__dirname, 'allure-results');
  if (fs.existsSync(allureResultsPath)) {
    fs.rmSync(allureResultsPath, { recursive: true, force: true });
  }
};
