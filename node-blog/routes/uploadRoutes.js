const AWS = require("aws-sdk");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const uuid = require("uuid/v1");
const keys = require("../config/keys");
const requireLogin = require("../middlewares/requireLogin");

module.exports = (app) => {
	app.get("/api/upload", requireLogin, async (req, res) => {
		const key = `${req.user.id}/${uuid()}.jpeg`;
		const client = new S3Client({
			credentials: {
				accessKeyId: keys.accessKeyId,
				secretAccessKey: keys.secretAccessKey,
			},
			region: "us-east-1",
		});
		const command = new PutObjectCommand({
			Bucket: "advanced-node-blog-bucket",
			ContentType: "image/jpeg",
			Key: key,
		});

		const url = await getSignedUrl(client, command, { expiresIn: 3600 });

		res.send({ key, url });
	});
};
