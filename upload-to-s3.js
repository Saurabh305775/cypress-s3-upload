const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const folderPath = path.join(__dirname, 'screenshots');
const bucketName = process.env.S3_BUCKET_NAME;

fs.readdir(folderPath, (err, files) => {
  if (err) return console.error('Error reading screenshots folder:', err);
  
  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    const fileContent = fs.readFileSync(filePath);

    const params = {
      Bucket: bucketName,
      Key: `screenshots/${file}`, // Optional: add timestamp or branch info here
      Body: fileContent,
    };

    s3.upload(params, (err, data) => {
      if (err) return console.error('Upload failed:', err);
      console.log(`Successfully uploaded ${file} to ${data.Location}`);
    });
  });
});
