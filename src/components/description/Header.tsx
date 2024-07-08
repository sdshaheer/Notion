import React, { useState, useRef, useEffect } from 'react'
import { MdOutlineSubtitles } from "react-icons/md";
import { BiDotsVerticalRounded } from "react-icons/bi";
import TodoMenu from '../menus/TodoMenu';
import { useNotion } from '../../context/notionContext';
import { basePath } from '../../utils';
import axios from 'axios';
import { Todo } from '../../models/Todo';
import Spinner from '../Spinner'
import { toast } from 'react-toastify';


interface props {
    isEdit: boolean
    setIsEdit: React.Dispatch<React.SetStateAction<boolean>>
    title: string
    setTitle: React.Dispatch<React.SetStateAction<string>>
    handleClose: () => void

}

const Header: React.FC<props> = ({
    isEdit,
    setIsEdit,
    title,
    setTitle,
    handleClose
}) => {

    const { notion, setNotion, selectedTodo } = useNotion()
    const [taskName, setTaskName] = useState<string>()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [anchorEl, setAnchorEl] = useState<null | SVGElement>(null);

    useEffect(() => {
        if (selectedTodo) {
            fetchTodoDetails()
        }
    }, [])

    const fetchTodoDetails = async () => {
        try {
            const response = await axios.get(`${basePath}/todo/todoDetails`,
                { params: { todoId: selectedTodo?._id } }
            )
            setTaskName(response.data?.task?.taskName)
        } catch (error) {
            console.log('error in fetching todo details : ', error)
        }
    }



    const handleMenuClick = (event: React.MouseEvent<SVGElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        setIsEdit(true)
        handleMenuClose()
    }

    const handleDelete = async () => {
        handleMenuClose()
        if (!selectedTodo) return;

        try {
            setIsLoading(true)
            const response = await axios.delete(`${basePath}/todo/deleteTodo`,
                {
                    data: {
                        todoId: selectedTodo?._id,
                    }
                }
            )
            const otherTodosInTask = notion[selectedTodo?.task].filter((todo) => todo?._id !== selectedTodo?._id)
            setNotion((prevNotion) => ({ ...prevNotion, [selectedTodo.task]: [...otherTodosInTask] }))
            handleClose()
            toast.success(`${title} removed successfully`)
        } catch (error) {
            toast.error('something went wrong')
            console.log('error in editing todo : ', error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading && <Spinner />}
            <div className='w-full flex items-start justify-between'>
                <div className='w-full flex items-start gap-2'>
                    <MdOutlineSubtitles size={18} className='mt-1' />
                    <div className='w-full flex flex-col'>
                        {isEdit ? (
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="rounded-md font-semibold p-1 text-[18px] border"
                            />
                        ) : (
                            <div className="w-full rounded-md font-semibold text-[18px]">
                                {title ?? ''}
                            </div>
                        )}
                        <div className='text-[14px]'>in list <span style={{ textDecoration: 'underline' }}>{taskName ?? ''}</span></div>
                    </div>
                </div>
                <BiDotsVerticalRounded
                    onClick={handleMenuClick}
                    className='cursor-pointer'
                />
            </div>

            <TodoMenu
                anchorEl={anchorEl}
                handleMenuClose={handleMenuClose}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
            />

        </>
    )
}

export default Header