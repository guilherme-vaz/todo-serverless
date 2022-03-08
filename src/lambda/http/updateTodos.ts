import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import TodoService from 'src/services/TodoService'
import { TodoItem } from 'src/models'


export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    //Get the id from url parameters
    const id = event.pathParameters.id

    // Instance of TodoService
    const todoService = new TodoService()

    // ... Spread operator separates the arguments.
    // We're looking for the same id from the URL on the event.body
    const todo: Partial<TodoItem> = { ...JSON.parse(event.body), id }

    const todoUpdated = await todoService.updateTodo(todo)

    return {
        statusCode: 200,
        body: JSON.stringify({
            item: todoUpdated
        })
    }
}

