import { HttpRequest } from "@aws-sdk/protocol-http";
import { S3RequestPresigner, getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { parseUrl } from "@aws-sdk/url-parser";
import { Hash } from "@aws-sdk/hash-node";
import { formatUrl } from "@aws-sdk/util-format-url";
import AWS from 'aws-sdk';
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3ObjectUrl = parseUrl(`https://sharing-uploads.s3.amazonaws.com/footer.png`);
const credentials = new AWS.Credentials('accessKeyId', 'secretAccessKey');
const presigner = new S3RequestPresigner({
  credentials: credentials,
  region: 'us-east-1',
  sha256: Hash.bind(null, "sha256")
});

const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
console.log("PRESIGNED URL: ", formatUrl(url));

const fileId = uuidv4();
export const bucketParams = {
  Bucket: `sharing-uploads`,
  Key: `${fileId}.pdf`,
};

const command = new PutObjectCommand(bucketParams);
let client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'accessKeyId',
    secretAccessKey: 'secretAccessKey'
  }
});

const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
console.log("PRESIGNED URL: ", signedUrl);
