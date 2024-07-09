import React, { useState, useEffect } from 'react'
import { Todo } from '../models/Todo'
import SingleTodo from './SingleTodo'
import { Droppable } from 'react-beautiful-dnd'
import axios from 'axios'
import { basePath } from '../utils'
import { BiDotsHorizontalRounded } from "react-icons/bi";
import TaskMenu from './menus/TaskMenu'
import NewTodo from './NewTodo'
import { toast } from 'react-toastify'
import { IoIosClose } from "react-icons/io";
import { useNotion } from '../context/notionContext'
import Spinner from './Spinner'
import { useAuth } from '../context/AuthContext'

interface props {
    taskId: string
    todos: Todo[],
}

const Tasks: React.FC<props> = ({ taskId, todos }) => {

    const { notion, setNotion } = useNotion()
    const { user } = useAuth()
    const [taskName, setTaskName] = useState<string>()
    const [anchorEl, setAnchorEl] = useState<null | SVGElement>(null);
    const [isNewTodo, setIsNewTodo] = useState<boolean>(false)
    const [isRename, setIsRename] = useState<boolean>(false)
    const [renamedTask, setRenamedTask] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)


    useEffect(() => {
        getTaskDetails()
    }, [taskId])

    const getTaskDetails = async () => {
        try {
            const response = await axios.get(`${basePath}/task/taskDetails`,
                {
                    params: { taskId },
                    headers: { Authorization: user?.accessToken }
                }
            )
            setTaskName(response.data?.taskName)
        } catch (error) {
            console.log('error in fetching task Details : ', error)
        }
    }

    const handleTaskRename = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            try {
                await axios.put(`${basePath}/task/updateTask`,
                    {
                        taskId: taskId,
                        taskName: renamedTask
                    },
                    { headers: { Authorization: user?.accessToken } }

                )
                toast.success(`task name changed to ${taskName}`)
                setTaskName(renamedTask)
                setIsRename(false)
            } catch (error) {
                toast.error('something went wrong')
                console.log('error in fetching task Details : ', error)
            }
        }

    }

    const handleMenuClick = (event: React.MouseEvent<SVGElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAddTodo = () => {
        setIsNewTodo(true)
        handleMenuClose();
    };

    const handleRename = () => {
        setIsRename(true)
        setRenamedTask(taskName)
        handleMenuClose();
    };

    const handleDelete = async () => {
        handleMenuClose();

        try {
            setIsLoading(true)
            await axios.delete(`${basePath}/task/deleteTask`,
                {
                    headers: { Authorization: user?.accessToken },
                    data: {
                        taskId,
                    }
                },
            )
            const { [taskId]: removedKey, ...rest } = notion
            setNotion({ ...rest })
            toast.success(`${taskName} removed successfully`)
        } catch (error) {
            toast.error('something went wrong')
            console.log('error in deleting task : ', error)
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <Droppable droppableId={taskId}>
            {
                (provided) => (
                    <>
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className='w-full flex flex-col gap-2 p-3 rounded bg-slate-200'
                        >
                            {isLoading && <Spinner />}
                            <div className='flex justify-between'>
                                {!isRename ?
                                    <div className='w-full font-semibold text-[16px] overflow-auto'>
                                        <p className='break-words'>
                                            {taskName}
                                        </p>
                                    </div> :
                                    <div className='flex relative'>
                                        <input
                                            type="text"
                                            className='h-8 w-full rounded px-2 mb-1 border border-black'
                                            value={renamedTask}
                                            onChange={e => setRenamedTask(e.target.value)}
                                            onKeyDown={handleTaskRename}
                                            autoFocus
                                        />
                                        <IoIosClose
                                            size={20}
                                            className='cursor-pointer'
                                            onClick={() => {
                                                setIsRename(false)
                                                setRenamedTask('')
                                            }} />
                                    </div>
                                }
                                <BiDotsHorizontalRounded
                                    className='cursor-pointer'
                                    onClick={handleMenuClick}
                                />
                            </div>

                            <div className='flex flex-col gap-2'>
                                {todos.map((todo, index) =>
                                    <SingleTodo
                                        key={todo._id}
                                        index={index}
                                        todo={todo}
                                    />
                                )}
                            </div>
                            {provided.placeholder}
                            <NewTodo
                                taskId={taskId}
                                isNewTodo={isNewTodo}
                                setIsNewTodo={setIsNewTodo}
                            />
                        </div>

                        <TaskMenu
                            anchorEl={anchorEl}
                            handleMenuClose={handleMenuClose}
                            handleAddTodo={handleAddTodo}
                            handleRename={handleRename}
                            handleDelete={handleDelete}
                        />
                    </>
                )
            }
        </Droppable >

    )
}

export default Tasks
