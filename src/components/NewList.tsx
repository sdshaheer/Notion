import React, { useState } from 'react'
import axios from 'axios'
import { basePath } from '../utils'
import { NotionInterface } from '../models/Todo'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import { IoMdAdd } from "react-icons/io";


interface props {
    getAllTasks: () => void
    setNotion: React.Dispatch<React.SetStateAction<NotionInterface>>
}

const NewList: React.FC<props> = ({ setNotion }) => {

    const { user } = useAuth()
    const [isNewList, setIsNewList] = useState<boolean>(false)
    const [taskName, setTaskName] = useState<string>('')

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAdd()
        }
    }

    const handleAdd = async () => {
        if (taskName.trim() === '') return
        try {
            const response = await axios.post(`${basePath}/task/createTask`,
                { taskName: taskName },
                { headers: { Authorization: user?.accessToken } }

            )
            setIsNewList(false)
            setTaskName('')
            setNotion((prevNotion) => ({ ...prevNotion, [response.data._id]: [] }))
            toast.success(`${taskName} created successfully`)
        } catch (error) {
            toast.error('something went wrong')
            console.error('error in adding new List : ', error)
        }
    }


    return (
        <div>
            {isNewList ?
                <div className='flex flex-col  bg-slate-200 rounded'>
                    <input
                        type="text"
                        placeholder='Enter task name'
                        className='h-10 rounded px-2 m-1'
                        value={taskName}
                        onChange={e => setTaskName(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className='flex gap-2 mb-1'>
                        <div className='bg-blue-500 text-white rounded p-1 px-3 m-1 cursor-pointer' onClick={handleAdd}>Add List</div>
                        <div className='bg-gray-500 text-white rounded p-1 px-3 m-1 cursor-pointer' onClick={() => setIsNewList(false)}>Cancel</div>
                    </div>
                </div>
                : <div
                    className='bg-slate-200 rounded p-2 '
                    onClick={() => setIsNewList(true)}
                >
                    <div className='bg-slate-300 flex items-center p-2 rounded gap-2 cursor-pointer'>
                        <IoMdAdd />
                        <div className=''>Add New Task</div>
                    </div>
                </div>
            }
        </div >
    )
}

export default NewList
