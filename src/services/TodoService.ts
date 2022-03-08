import TodoRepository from 'src/repositories/TodoRepository'
import * as uuid from 'uuid'
import { TodoItem } from 'src/models'

export default class TodoService {
    todoRepository: TodoRepository

    // Creating a instance of TodoRepository
    constructor(todoRepository: TodoRepository = new TodoRepository()){
        this.todoRepository = todoRepository
    }

    async getAllTodos(): Promise<TodoItem[]> {
        return this.todoRepository.getAllTodos()
    }

    // We get this name parameter from the front-end
    async createTodo(name: string): Promise<TodoItem>{
        const id = uuid.v4()

        return await this.todoRepository.createTodo({
            id, 
            name,
            done: false,
            createdAt: new Date().toISOString()
        })
    }

    async updateTodo(partialTodo: Partial<TodoItem>){
        return await this.todoRepository.updateTodo(partialTodo)
    }

    async deleteTodoById(id: string) {
        return await this.todoRepository.deleteTodoById(id)
    }
}