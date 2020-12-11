import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { likeCode, unlikeCode } from '../../businessLogic/codes';
import { createLogger } from '../../utils/logger';

const logger = createLogger("generateImage");

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB', JSON.stringify(event))
    for (const record of event.Records) {
        logger.info('Processing record', JSON.stringify(record))
        const newItem = record.dynamodb.NewImage
        const codeId = newItem.codeId.S;    
        if (record.eventName !== 'INSERT') {
            //If inserted, we should increment the like count by one
            await likeCode(codeId);
        }
        if(record.eventName == "REMOVE"){
            //Otherwise decrement by one
            await unlikeCode(codeId);
        }
    }
}
