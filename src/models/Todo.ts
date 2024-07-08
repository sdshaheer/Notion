export interface Todo {
    _id: string
    title: string
    task: string
    description: string

}

export interface Task {
    _id: string
    user: string,
    taskName: string,
    todos: Todo[]
}

export interface Notion {
    [key: string]: Todo[]
}

