import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk');

/**
 * The class is used to access the likes table in dynamodb
 */
export class LikesAccess {
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private readonly doClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly likesTable = process.env.LIKES_TABLE,
    ) {

    }
    async likeCode(codeId: string, userId: string){
        await this.doClient.put({
            Item: {
                codeId,
                userId,
            },
            TableName: this.likesTable,
        }).promise();
    }

    async findLike(codeId: string, userId: string): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
        const result = await this.doClient.query({
            TableName: this.likesTable,
            KeyConditionExpression: 'codeId = :codeId and userId = :userId',
            ExpressionAttributeValues: {
                ":codeId": codeId,
                ":userId": userId,
            },
        }).promise();
        return result;
    }

    async unlikeCode(codeId: string, userId: string) {
        await this.doClient.delete({
            TableName: this.likesTable,
            Key: {
                "codeId": codeId,
                "userId": userId,
            }
        }).promise();
    }
}