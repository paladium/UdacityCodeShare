import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import { likeCode } from '../../businessLogic/codes'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger("likeCode");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const codeId = event.pathParameters.codeId
    const userId = getUserId(event);

    const codeItem = await likeCode(codeId);
    logger.info(`Liked code item for userId=${userId}, codeId=${codeId}`);

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
        body: JSON.stringify(codeItem)
    }
}
