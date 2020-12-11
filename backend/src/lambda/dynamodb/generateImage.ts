import { DynamoDBStreamEvent, DynamoDBStreamHandler } from 'aws-lambda'
import 'source-map-support/register'
import { getCodeContent, uploadImage } from '../../businessLogic/codes';
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
        //Get the file from s3 bucket based on the name from the record
        const newItem = record.dynamodb.NewImage
        const codeId = newItem.codeId.S;
        const codeTextUrl = newItem.codeTextUrl.S;
        //Get the object from s3
        const codeContent = await getCodeContent(codeTextUrl);
        const url = getCarbonURL(codeContent, <Options>{
            language: "auto"
        });
        //Generate the image
        const imageBuffer = await getScreenshot({ url });
        logger.info("Generated image for", {
            codeId: codeId,
        });
        //Upload the image to s3
        await uploadImage(imageBuffer, codeId);
        logger.info("Uploaded image for", {
            codeId: codeId,
        });
    }
}
