const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');
const archiver = require('archiver');
const dayjs = require('dayjs');

const timestamp = dayjs().format('YYYYMMDD-HHmmss');
const zipFilename = `results_${timestamp}.zip`;
const screenshotsDir = path.join(__dirname, 'screenshots');
const zipPath = path.join(__dirname, zipFilename);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

function zipScreenshots() {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());
    archive.on('error', err => reject(err));

    archive.pipe(output);
    archive.directory(screenshotsDir, false);
    archive.finalize();
  });
}

function uploadToS3() {
  const fileContent = fs.readFileSync(zipPath);

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: zipFilename,
    Body: fileContent,
  };

  return s3.upload(params).promise();
}

(async () => {
  try {
    await zipScreenshots();
    console.log(`Zipped screenshots as ${zipFilename}`);
    await uploadToS3();
    console.log(`Uploaded to S3 as ${zipFilename}`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
