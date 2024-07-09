export interface Todo {
    _id: string
    title: string
    task: string
    description: string
    createdAt: string
}

export interface Task {
    _id: string
    user: string,
    taskName: string,
    todos: Todo[]
}

export interface NotionInterface {
    [key: string]: Todo[]
}

