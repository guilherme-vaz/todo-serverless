import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoItem } from "src/models";

export default class TodoRepository {
  constructor(
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly todoTable = process.env.TODOS_TABLE
  ) {}

  // Index function - get all todos to show 
  async getAllTodos(): Promise<TodoItem[]> {
      const result = await this.docClient.scan({
          TableName: this.todoTable
      }).promise()

      return result.Items as TodoItem[]
  }

  // Create todo 
  async createTodo(todo: TodoItem): Promise<TodoItem>{
      await this.docClient.put({
          TableName: this.todoTable,
          Item: todo
      }).promise()

      return todo
  }

  // Update todo
  async updateTodo(partialTodo: Partial<TodoItem>): Promise<TodoItem> {
      const updated = await this.docClient.update({
          TableName: this.todoTable,
          // Key to know which todo we want to update
          Key: { 'id': partialTodo.id },
          // Attributes we want to update and their values
          UpdateExpression: 'set #name = :name, done = :done',
          ExpressionAttributeNames: {
              '#name': 'name'
          },
          ExpressionAttributeValues: {
              ':name': partialTodo.name,
              ':done': partialTodo.done
          },
          ReturnValues: 'UPDATED_NEW'
      }).promise()

      return updated.Attributes as TodoItem
  }

  // Delete todo
  async deleteTodoById(id: string){
      return this.docClient.delete({
          TableName: this.todoTable,
          Key: { 'id': id }
      }).promise()
  }
}
