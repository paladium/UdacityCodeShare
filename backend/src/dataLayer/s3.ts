import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

export class S3Access {
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private bucketName = process.env.IMAGES_S3_BUCKET,
        private readonly s3Client: AWS.S3 = new XAWS.S3({
            signatureVersion: 'v4',
            region: process.env.region,
        }),
        private readonly signedUrlExpireSeconds = 60 * 10
    ) {

    }

    /**
     * Uploads the image to the s3
     * @param file 
     * @param name 
     */
    async uploadImage(file: Buffer, name: string){
        await this.s3Client.upload({
            Bucket: this.bucketName,
            Key: name,
            Body: file,
            ContentType: "image",
        }).promise();
    }
    /**
     * Gets a new signed link to access the image
     * @param attachment 
     */
    getAttachmentUrl(attachment: string): string{
        return this.s3Client.getSignedUrl("getObject", {
            Bucket: this.bucketName,
            Key: attachment,
            Expires: this.signedUrlExpireSeconds
        });
    }

    /**
     * Returns a presigned upload link
     * @param filename 
     * @param bucket 
     */
    getPresignedUrl(filename: string, bucket: string): string {
        return this.s3Client.getSignedUrl("putObject", {
            Bucket: bucket,
            Key: filename,
            Expires: this.signedUrlExpireSeconds
        });
    }

    /**
     * Gets the file from s3 bucket and returns it as string
     * @param filename 
     * @param bucket 
     */
    async getObject(filename: string, bucket: string): Promise<string>{
        const object = await this.s3Client.getObject({
            Bucket: bucket,
            Key: filename
        }).promise();
        return object.Body!.toString("utf-8");
    }
}