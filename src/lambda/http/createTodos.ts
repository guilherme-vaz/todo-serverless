import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import TodoService from 'src/services/TodoService'


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // This name comes from the front-end form to create a Todo
    const { name } = JSON.parse(event.body)
    // Instance of TodoService
    const todoService = new TodoService()
    const todo = await todoService.createTodo(name)

    return {
        statusCode: 201,
        body: JSON.stringify({
            item: todo
        })
    }
}

