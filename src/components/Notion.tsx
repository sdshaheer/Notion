import React, { useEffect, useMemo } from 'react'
import { Task, Todo, NotionInterface } from '../models/Todo'
import Tasks from '../components/Tasks'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import NewList from '../components/NewList'
import { basePath } from '../utils'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNotion } from '../context/notionContext'
import { useAuth } from '../context/AuthContext'
import Header from './Header'


const Notion: React.FC = () => {

    // const [notion, setNotion] = useState<Notion>({})
    const { user, logout } = useAuth()
    const { notion, setNotion } = useNotion()

    useEffect(() => {
        setNotion({})
        getAllTasks()
    }, [])

    const getAllTasks = async () => {
        try {
            const response = await axios.get(`${basePath}/task/allTasks`,
                { headers: { Authorization: user?.accessToken } }
            )

            const tempNotion: NotionInterface = {}
            response?.data?.forEach((task: Task) => {
                tempNotion[task._id] = [...task.todos]
            })
            setNotion({ ...tempNotion })
        } catch (error) {
            console.log('error in fetch tasks : ', error)
        }
    }

    const onDragEnd = async (result: DropResult) => {
        const { source, destination } = result
        let add: Todo
        let tempNotion: NotionInterface = notion

        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return

        // remove specific todo from source
        add = tempNotion[source.droppableId as keyof NotionInterface][source.index]
        tempNotion[source.droppableId as keyof NotionInterface].splice(source.index, 1)

        // add todo to destination task
        tempNotion[destination.droppableId as keyof NotionInterface].splice(destination.index, 0, add)
        setNotion({ ...tempNotion })

        try {
            const response = await axios.post(`${basePath}/todo/moveTodo`,
                {
                    source: source.droppableId,
                    destination: destination.droppableId,
                    destinationIndex: destination.index,
                    todo: add._id
                },
                { headers: { Authorization: user?.accessToken } }

            )

            toast.success(`item moved successfully to ${response.data?.taskName}`)
        } catch (error) {
            toast.success(`something went wrong`)
            getAllTasks()
            console.log('error in moving todo from source to destination')
        }

    }

    const taskComponents = useMemo(() => {
        return Object.entries(notion).map(([key, value]) => (
            <div className='w-72 m-3 ' key={key}>
                <Tasks taskId={key} todos={value} />
            </div>
        ));
    }, [notion]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='w-screen h-screen flex flex-col bg-blue-50 gap-5'>
                <div className='bg-blue-300 p-3'>
                    <Header />
                </div>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5'>
                    <div className='w-72 m-3'>
                        <NewList
                            getAllTasks={getAllTasks}
                            setNotion={setNotion}
                        />
                    </div>
                    {taskComponents}

                </div>
            </div>
        </DragDropContext>
    )
}

export default Notion
