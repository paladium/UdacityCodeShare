import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getAllCodes, getUserCodes } from '../../businessLogic/codes';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
const logger = createLogger("getAllCodes");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    let items = await getUserCodes(userId);
    //TODO generate signed link
    // //Go for each item and generate a signed url link
    // for(let item of items){
    //     if(item.attachmentUrl)
    //         item.attachmentUrl = await getAttachmentUrl(item);
    // }
    logger.info(`Got items for user: userid=${userId} items=${JSON.stringify(items)}`);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify(items)
    };
}
