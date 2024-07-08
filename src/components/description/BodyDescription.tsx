import React from 'react'
import { LuAlignLeft } from "react-icons/lu";

interface props {
    isEdit: boolean
    description: string
    setDescription: React.Dispatch<React.SetStateAction<string>>
}

const BodyDescription: React.FC<props> = ({ isEdit, description, setDescription }) => {

    return (
        <>
            <LuAlignLeft
                size={18} className='mt-1.5'
            />
            <div className='w-full flex flex-col gap-1'>
                <div className='font-semibold text-[18px]'>Description</div>
                {
                    isEdit ?
                        <div className='w-full flex flex-col gap-2'>
                            <textarea
                                className='p-2 rounded-md w-full border-2'
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div> :
                        <div className='w-full bg-slate-200 h-[110px] rounded-md p-2 overflow-auto'>
                            <p className='break-words'>
                                {description}
                            </p>
                        </div>
                }
            </div>
        </>
    )
}

export default BodyDescription