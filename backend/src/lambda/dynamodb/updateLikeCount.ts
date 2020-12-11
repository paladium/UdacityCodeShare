import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { likeCode, unlikeCode } from '../../businessLogic/codes';
import { createLogger } from '../../utils/logger';

const logger = createLogger("updateLikeCount");

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB', JSON.stringify(event))
    for (const record of event.Records) {
        logger.info('Processing record', JSON.stringify(record))
        if (record.eventName == 'INSERT') {
            const newItem = record.dynamodb.NewImage
            const codeId = newItem.codeId.S;
            //If inserted, we should increment the like count by one
            await likeCode(codeId);
        }
        else if (record.eventName == "REMOVE") {
            const newItem = record.dynamodb.OldImage
            const codeId = newItem.codeId.S;
            //Otherwise decrement by one
            await unlikeCode(codeId);
        }
    }
}
