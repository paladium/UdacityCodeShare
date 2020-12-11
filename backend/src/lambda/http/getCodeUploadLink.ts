import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId } from '../utils';
import { createLogger } from '../../utils/logger';
import { getCodeUploadSignedUrl } from '../../businessLogic/codes';
const logger = createLogger("generateUploadUrl");

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.codeId;

    const userId = getUserId(event);

    const uploadUrl = await getCodeUploadSignedUrl(id);

    logger.info(`Generated upload url for userId=${userId}`);

    return {
        statusCode: 200,
        body: JSON.stringify({ uploadUrl }),
        headers: {
            'Access-Control-Allow-Origin': "*",
        },
    }
}
