import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';
import { deleteCode } from '../../businessLogic/codes';

const logger = createLogger("deleteCode");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const codeId = event.pathParameters.codeId;
    const userId = getUserId(event);

    //In case we fail to delete the item, we return 400
    try {
        await deleteCode(codeId, userId);
        logger.info(`Deleted todo item for userId=${userId}, codeId=${codeId}`);

        return {
            statusCode: 200,
            body: "",
            headers: {
                'Access-Control-Allow-Origin': "*",
            },
        }
    }
    catch (e) {
        return {
            statusCode: 400,
            body: e,
            headers: {
                'Access-Control-Allow-Origin': "*",
            },
        }
    }
}
