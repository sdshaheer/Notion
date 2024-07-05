export interface Todo {
    id: number
    title: string
}

export interface Task {
    id: number
    label: string
    value: string
    color?: string
}


export const taskTypes: Task[] = [
    { id: 1, label: 'To Do', value: 'todo', color: 'bg-orange-500' },
    { id: 2, label: 'In Progress', value: "inProgress", color: 'bg-yellow-300' },
    { id: 3, label: 'Completed', value: 'completed', color: 'bg-green-400' }
];