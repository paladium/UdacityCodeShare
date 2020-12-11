import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { getAllCodes } from '../../businessLogic/codes';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
const logger = createLogger("getAllCodes");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    let items = await getAllCodes(userId);
    logger.info(`Got items for user`, {
        userId,
        items
    });
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify(items)
    };
}
