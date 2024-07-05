import React, { useState } from 'react'
import InputBox from './components/InputBox'
import Tasks from './components/Tasks'
import { Todo } from './models/Todo'
import { taskTypes } from './models/Todo'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'

interface Notion {
  todo: Todo[],
  inProgress: Todo[],
  completed: Todo[],

}

const initialNotionState: Notion = {
  todo: [],
  inProgress: [],
  completed: [],
};

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("")
  // const [todos, setTodos] = useState<Todo[]>([])
  // const [completedTodos, setCompletedTodos] = useState<Todo[]>([])

  const [notion, setNotion] = useState<Notion>(initialNotionState)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {

      const newTodo: Todo = {
        id: Date.now(),
        title: todo
      }

      // setTodos((prevTodos) => [newTodo, ...prevTodos])
      setNotion((prevNotion) => ({
        ...prevNotion,
        todo: [newTodo, ...prevNotion.todo]
      }))
      setTodo("")
    }
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return

    // let add: Todo,
    //   active: Todo[] = todos,
    //   completed: Todo[] = completedTodos

    // if (source.droppableId === 'inProgress') {
    //   add = active[source.index]
    //   active.splice(source.index, 1)

    // } else {
    //   add = completed[source.index]
    //   completed.splice(source.index, 1)

    // }

    // if (destination.droppableId === 'inProgress') {
    //   active.splice(destination.index, 0, add)
    // } else {
    //   completed.splice(destination.index, 0, add)
    // }

    // setTodos([...active])
    // setCompletedTodos([...completed])

    let add: Todo,
      tempNotion: Notion = notion

    // remove specific todo from source
    add = tempNotion[source.droppableId as keyof Notion][source.index]
    tempNotion[source.droppableId as keyof Notion].splice(source.index, 1)

    // add todo to destination task
    tempNotion[destination.droppableId as keyof Notion].splice(destination.index, 0, add)
    setNotion({ ...tempNotion })


  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='flex flex-col w-screen h-screen bg-slate-400 gap-10'>
        <div className='w-full mt-10'>
          <InputBox
            todo={todo}
            setTodo={setTodo}
            handleKeyDown={handleKeyDown}
          />
        </div>
        <div className='w-full flex flex-col md:flex-row md:justify-between'>
          {/* {taskTypes.map((task) => {
            if (task.id === 1) {
              return (
                <div className='w-full m-3' key={task.id}>
                  <Tasks
                    todos={todos}
                    task={task}
                  />
                </div>
              )

            } else if (task.id === 2) {
              return (
                <div className='w-full m-3' key={task.id}>
                  <Tasks
                    todos={completedTodos}
                    task={task}
                  />
                </div>
              )
            }
          })} */}
          {
            taskTypes.map((task) => {
              return (
                <div className='w-auto md:w-full m-3' key={task.id}>
                  <Tasks
                    todos={notion[task.value as keyof Notion]}
                    task={task}
                  />
                </div>
              )
            })
          }
        </div>
      </div>
    </DragDropContext>

  )
}

export default App
