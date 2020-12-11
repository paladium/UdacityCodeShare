import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { likeUnlikeCode } from '../../businessLogic/codes';
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger("likeCode");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const codeId = event.pathParameters.codeId
    const userId = getUserId(event);

    const codeItem = await likeUnlikeCode(codeId, userId);
    logger.info(`Liked/unliked code item for userId=${userId}, codeId=${codeId}`);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify(codeItem)
    }
}
