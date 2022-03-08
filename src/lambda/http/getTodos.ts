import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import TodoService from 'src/services/TodoService'

// The _ in front of event (_event) explicitly states that there's only one argument and we don't care about it
export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoService = new TodoService()
    const todo = await todoService.getAllTodos()

    return {
        statusCode: 201,
        body: JSON.stringify({
            item: todo
        })
    }
}

