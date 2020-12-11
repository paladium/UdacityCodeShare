import * as AWS from 'aws-sdk';
import { CodeItem } from '../models/CodeItem';
const AWSXRay = require('aws-xray-sdk');

export class CodesAccess {
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private readonly doClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly codesTable = process.env.CODES_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX,
    ) {

    }
    async getAllCodes(): Promise<CodeItem[]> {
        const result = await this.doClient.scan({
            TableName: this.codesTable,
        }).promise();
        const items = result.Items as CodeItem[];
        return items;
    }

    async getUserCodes(userId: string): Promise<CodeItem[]> {
        const result = await this.doClient.query({
            TableName: this.codesTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":userId": userId,
            },
        }).promise();
        const items = result.Items as CodeItem[];
        return items;
    }
    async createCode(item: CodeItem): Promise<CodeItem> {
        await this.doClient.put({
            Item: item,
            TableName: this.codesTable,
        }).promise();
        return item;
    }

    async getItemById(id: string): Promise<AWS.DynamoDB.DocumentClient.QueryOutput> {
        const result = await this.doClient.query({
            TableName: this.codesTable,
            KeyConditionExpression: 'codeId = :codeId',
            ExpressionAttributeValues: {
                ':codeId': id,
            },
        }).promise();
        return result;
    }

    async updateCodeUrl(codeId: string, codeUrl: string) {
        await this.doClient.update({
            TableName: this.codesTable,
            Key: {
                "codeId": codeId,
            },
            UpdateExpression: "set codeUrl = :codeUrl",
            ExpressionAttributeValues: {
                ":codeUrl": codeUrl
            }
        }).promise();
    }

    async likeCode(id: string) {
        await this.doClient.update({
            TableName: this.codesTable,
            Key: {
                "codeId": id,
            },
            UpdateExpression: "set likes = likes + :val",
            ExpressionAttributeValues: {
                ":val": 1
            },
        }).promise();
    }

    async unlikeCode(id: string) {
        await this.doClient.update({
            TableName: this.codesTable,
            Key: {
                "codeId": id,
            },
            UpdateExpression: "set likes = likes - :val",
            ExpressionAttributeValues: {
                ":val": 1
            },
        }).promise();
    }

    async deleteCodeById(id: string) {
        await this.doClient.delete({
            TableName: this.codesTable,
            Key: {
                "codeId": id,
            }
        }).promise();
    }
}