require('dotenv').config();
console.log("Loaded bucket name from .env:", process.env.AWS_BUCKET);

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const dayjs = require('dayjs');

const screenshotsDir = 'cypress/screenshots';
const zipFilename = `results_${dayjs().format('YYYYMMDD-HHmmss')}.zip`;
const zipPath = path.join(__dirname, zipFilename);

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const BUCKET_NAME = process.env.AWS_BUCKET;

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
    Bucket: BUCKET_NAME,
    Key: zipFilename,
    Body: fileContent,
  };

  console.log("Uploading to bucket:", BUCKET_NAME);
  return s3.upload(params).promise();
}

(async () => {
  try {
    await zipScreenshots();
    console.log('Zipped screenshots as ${zipFilename}');
    await uploadToS3();
    console.log(`Uploaded to S3 as ${zipFilename}`);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
