import React, { useState } from 'react'
import axios from 'axios'
import { basePath } from '../utils'
import { NotionInterface } from '../models/Todo'
import { toast } from 'react-toastify'
import { useNotion } from '../context/notionContext'
import { useAuth } from '../context/AuthContext'


interface props {
    taskId: string
    isNewTodo: boolean
    setIsNewTodo: React.Dispatch<React.SetStateAction<boolean>>
}

const NewTodo: React.FC<props> = ({ taskId, isNewTodo, setIsNewTodo }) => {

    const { user } = useAuth()
    const [todoName, setTodoName] = useState<string>('')
    const { notion, setNotion } = useNotion()


    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAdd()
        }
    }

    const handleAdd = async () => {
        if (todoName.trim() === '') return
        try {
            const response = await axios.post(`${basePath}/todo/createTodo`,
                {
                    task: taskId,
                    title: todoName,
                    description: ''
                },
                { headers: { Authorization: user?.accessToken } }

            )
            setTodoName('')
            setIsNewTodo(false)
            setNotion((prevNotion) => ({ ...prevNotion, [taskId]: [...notion[taskId], response.data] }))
            toast.success(`${todoName} added successfully`)

        } catch (error) {
            toast.error('something went wrong')
            console.error('error in adding new todo : ', error)
        }
    }


    return (
        <div>
            {isNewTodo ?
                <div className='flex flex-col'>
                    <input
                        type="text"
                        placeholder='Enter todo name'
                        className='h-10 rounded px-2 mb-1'
                        value={todoName}
                        onChange={e => setTodoName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className='flex gap-2 mb-1'>
                        <div className='bg-blue-500 text-white rounded p-1 px-3 m-1 cursor-pointer' onClick={handleAdd}>Add Todo</div>
                        <div className='bg-gray-500 text-white rounded p-1 px-3 m-1 cursor-pointer' onClick={() => setIsNewTodo(false)}>Cancel</div>
                    </div>
                </div>
                : <div
                    className='bg-slate-300 rounded p-2 cursor-pointer'
                    onClick={() => setIsNewTodo(true)}
                >+ Add a todo</div>}
        </div>
    )
}

export default NewTodo
