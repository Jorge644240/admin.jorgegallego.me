const AWSClientS3 = require("aws-client-s3");

module.exports = new AWSClientS3({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
	},
	region: process.env.AWS_S3_BUCKETS_REGION
});