import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import 'source-map-support/register';
import { createItem } from '../../businessLogic/codes';
import { CreateCodeItemRequest } from '../../requests/CreateCodeItemRequest';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger("createCode");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newCode: CreateCodeItemRequest = JSON.parse(event.body);
    const userId = getUserId(event);

    const item = await createItem(newCode, userId);
    logger.info(`Created code item for userId=${userId}, item=${JSON.stringify(item)}`);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify(item)
    }
}
