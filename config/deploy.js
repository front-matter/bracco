module.exports = function(deployTarget) {
  var ENV = {};

  ENV.s3 = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    bucket: process.env.AWS_BUCKET,
    region: process.env.AWS_REGION
  };

  return ENV;
};
