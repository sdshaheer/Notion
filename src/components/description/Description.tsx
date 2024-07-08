import React, { useState, useRef, useEffect } from 'react'
import ModalWrapper from '../../customComponents/ModalWrapper';
import Header from './Header';
import BodyDescription from './BodyDescription';
import { useNotion } from '../../context/notionContext';
import { basePath } from '../../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import Spinner from '../Spinner'
import { useAuth } from '../../context/AuthContext';

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

    useEffect(() => {
        if (selectedTodo) {
            const tempDescription = selectedTodo?.description ? selectedTodo?.description : 'Add a more detailed description ...'
            setTitle(selectedTodo?.title)
            setDescription(tempDescription)
        }

        return () => setIsEdit(false)
    }, [])

    const handleCancel = () => {
        if (selectedTodo) {
            setTitle(selectedTodo.title)
            setDescription(selectedTodo.description)
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
            <div className='m-3 flex flex-col gap-7'>
                <div className='w-full flex justify-between items-start'>
                    <Header
                        isEdit={isEdit}
                        setIsEdit={setIsEdit}
                        title={title}
                        setTitle={setTitle}
                        handleClose={handleClose}
                    />
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





