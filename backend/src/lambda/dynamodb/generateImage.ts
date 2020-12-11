import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { uploadImage } from '../../businessLogic/codes';
import { getScreenshot } from '../../dataLayer/carbon/screenshot'
import { getCarbonURL, Options } from '../../dataLayer/carbon/url'
import { createLogger } from '../../utils/logger';

const logger = createLogger("generateImage");

export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent) => {
    logger.info('Processing events batch from DynamoDB', JSON.stringify(event))
    for (const record of event.Records) {
        logger.info('Processing record', JSON.stringify(record))
        if (record.eventName !== 'INSERT') {
            continue
        }
        const newItem = record.dynamodb.NewImage
        const codeId = newItem.codeId.S;
        const code = newItem.code.S;
        const url = getCarbonURL(code, <Options>{
            language: "auto"
        });
        const imageBuffer = await getScreenshot({ url });
        logger.info("Generated image for", {
            codeId: codeId,
        });
        await uploadImage(imageBuffer, codeId);
        logger.info("Uploaded image for", {
            codeId: codeId,
        });
    }
}
