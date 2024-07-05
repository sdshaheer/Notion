import React from 'react'
import { Todo } from '../models/Todo'
import { Draggable } from 'react-beautiful-dnd'

interface props {
    index: number
    todo: Todo
}


const SingleTodo: React.FC<props> = ({ index, todo }) => {
    return (
        <Draggable draggableId={todo.id.toString()} index={index}>
            {
                (provided) => (
                    <div
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        className='bg-white rounded p-2 cursor-pointer'
                    >
                        <span className=''>{todo?.title}</span>
                    </div>
                )
            }
        </Draggable >

    )
}

export default SingleTodo
