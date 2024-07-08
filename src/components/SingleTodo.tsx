import React, { useState } from 'react'
import { Todo } from '../models/Todo'
import { Draggable } from 'react-beautiful-dnd'
import Description from './description/Description'
import { useNotion } from '../context/notionContext'

interface props {
    index: number
    todo: Todo
}


const SingleTodo: React.FC<props> = ({ index, todo }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { setSelectedTodo } = useNotion()

    const handleClose = () => {
        setIsOpen(false)
        setSelectedTodo(null)
    }

    const handleOpenModal = () => {
        setIsOpen(true)
        setSelectedTodo(todo)
    }

    return (
        <div>
            <Draggable draggableId={todo?._id} index={index}>
                {
                    (provided) => (
                        <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className='bg-white rounded p-2 cursor-pointer'
                            onClick={handleOpenModal}
                        >
                            <span className=''>{todo?.title}</span>
                        </div>
                    )
                }
            </Draggable >

            {isOpen &&
                <Description
                    isOpen={isOpen}
                    handleClose={handleClose}
                />
            }

        </div>
    )
}

export default SingleTodo
