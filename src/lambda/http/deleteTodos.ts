import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import TodoService from 'src/services/TodoService'



export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    //Get the id from url parameters
    const id = event.pathParameters.id

    // Instance of TodoService
    const todoService = new TodoService()

    await todoService.deleteTodoById(id)

    return {
        statusCode: 200,
        body: 'Deleted'
    }
}

