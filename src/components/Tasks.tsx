import React from 'react'
import { Todo } from '../models/Todo'
import SingleTodo from './SingleTodo'
import { Task } from '../models/Todo'
import { Droppable } from 'react-beautiful-dnd'

interface props {
    todos: Todo[],
    task: Task
}

const Tasks: React.FC<props> = ({ todos, task }) => {
    return (
        <Droppable droppableId={task.value}>
            {
                (provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        // className={`w-full flex flex-col gap-2 p-3 rounded ${task.id == 1 ? 'bg-red-400' : 'bg-green-600'}`}
                        className={`w-full flex flex-col gap-2 p-3 rounded ${task.color}`}
                        style={{ backgroundColor: task.color }}
                    >
                        <span className='font-semibold text-[16px]'>{task?.label}</span>
                        <div className='flex flex-col gap-3'>
                            {todos.map((todo, index) =>
                                <SingleTodo
                                    key={todo.id}
                                    index={index}
                                    todo={todo}
                                />
                            )}
                        </div>
                        {provided.placeholder}
                    </div>
                )
            }
        </Droppable>

    )
}

export default Tasks
