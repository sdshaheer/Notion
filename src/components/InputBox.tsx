import React from 'react'

interface props {
    todo: string;
    setTodo: React.Dispatch<React.SetStateAction<string>>;
    handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

const InputBox: React.FC<props> = ({ todo, setTodo, handleKeyDown }) => {
    return (
        // <div className='w-full flex justify-center'>
        //     <input
        //         type="text"
        //         placeholder='Enter todo name'
        //         className='w-3/4 h-12 rounded px-2'
        //         value={todo}
        //         onChange={e => setTodo(e.target.value)}
        //         onKeyDown={handleKeyDown}
        //     />
        // </div>
        <input
            type="text"
            placeholder='Enter todo name'
            className='w-full h-10 rounded px-2 outline-none'
            value={todo}
            onChange={e => setTodo(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    )
}

export default InputBox
