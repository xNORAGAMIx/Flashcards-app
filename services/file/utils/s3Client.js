import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_KEY,
  endpoint: process.env.S3_ENDPOINT,
  s3ForcePathStyle: true, // needed for MinIO
  signatureVersion: "v4",
});

export const uploadFile = (file, keyPrefix = "") => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${keyPrefix}${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read",
  };

  return s3.upload(params).promise();
};
