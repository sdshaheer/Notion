import React, { useState, useEffect } from 'react'
import ModalWrapper from '../../customComponents/ModalWrapper';
import Header from './Header';
import BodyDescription from './BodyDescription';
import { useNotion } from '../../context/notionContext';
import { basePath } from '../../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../Spinner'
import { useAuth } from '../../context/AuthContext';
import { TbClockHour8 } from "react-icons/tb";
import { Todo } from '../../models/Todo';

interface props {
    isOpen: boolean
    handleClose: () => void
}


const Description: React.FC<props> = ({ isOpen, handleClose }) => {

    const { notion, selectedTodo, setNotion } = useNotion()
    const { user } = useAuth()

    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false)
    console.log(selectedTodo)

    useEffect(() => {
        if (selectedTodo) {
            const tempDescription = selectedTodo?.description ? selectedTodo?.description : 'Add a more detailed description ...'
            setTitle(selectedTodo?.title)
            setDescription(tempDescription)
        }

        return () => setIsEdit(false)
    }, [])

    const getLocalDate = (dateTime: string): string => {
        const date = new Date(dateTime);
        const localDate = date.toLocaleDateString(); // Get local date
        return localDate
    }

    const getLocalTime = (dateTime: string): string => {
        const date = new Date(dateTime);
        const localTime = date.toLocaleTimeString(); // Get local date
        return localTime
    }

    const handleCancel = () => {
        if (selectedTodo) {
            setTitle(selectedTodo.title)
            const tempDescription = selectedTodo?.description ? selectedTodo?.description : 'Add a more detailed description ...'
            setDescription(tempDescription)
        }
        setIsEdit(false)
    }

    const handleEdit = async () => {
        if (!selectedTodo) return;

        try {
            setIsLoading(true)
            const response = await axios.put(`${basePath}/todo/updateTodo`,
                {
                    todoId: selectedTodo?._id,
                    title,
                    description
                },
                { headers: { Authorization: user?.accessToken } }

            )

            const todosInTask = notion[selectedTodo?.task].map(todo =>
                todo._id === selectedTodo?._id ? response.data : todo
            );
            setNotion(prevNotion => ({
                ...prevNotion,
                [selectedTodo.task]: todosInTask
            }));
            handleClose()
            toast.success('changes made successfully')
        } catch (error) {
            toast.error('something went wrong')
            console.log('error in editing todo : ', error)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <ModalWrapper isOpen={isOpen} handleClose={handleClose}>
            {isLoading && <Spinner />}
            <div className='m-3 flex flex-col gap-5'>
                <div className='w-full flex justify-between items-start'>
                    <Header
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        title={title}
                        setTitle={setTitle}
                        handleClose={handleClose}
                    />
                </div>
                <div className='flex items-start gap-2'>
                    <TbClockHour8 size={18} className='mt-1.5' />
                    <div className='flex flex-col'>
                        <div className='font-semibold text-[16px]'>Date Created</div>
                        <div className='flex gap-1'>
                            <span>{selectedTodo && getLocalDate(selectedTodo?.createdAt)}</span>
                            <span>{selectedTodo && getLocalTime(selectedTodo?.createdAt)}</span>
                        </div>
                    </div>
                </div>
                <div className='w-full flex gap-2'>
                    <BodyDescription
                        isEdit={isEdit}
                        description={description}
                        setDescription={setDescription}
                    />
                </div>
                {isEdit &&
                    <div className='flex gap-5 justify-end'>
                        <button className='bg-blue-500 text-white rounded p-1 px-4' onClick={handleEdit}>Save</button>
                        <button className='font-medium' onClick={handleCancel}>Cancel</button>
                    </div>
                }
            </div>

        </ModalWrapper >
    )
}

export default Description





