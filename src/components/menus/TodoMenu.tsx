import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { MdOutlineModeEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";


interface props {
    anchorEl: SVGElement | null
    handleMenuClose: () => void
    handleEdit: () => void
    handleDelete: () => void
}

const TodoMenu: React.FC<props> = ({
    anchorEl,
    handleMenuClose,
    handleEdit,
    handleDelete
}) => {


    return (
        <div>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={handleEdit}>
                    <div className='flex items-center justify-start gap-2'>
                        <MdOutlineModeEdit />
                        <span>Edit</span>
                    </div>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <div className='flex items-center justify-start gap-2'>
                        <MdOutlineDeleteOutline />
                        <span>Delete</span>
                    </div>
                </MenuItem>
            </Menu>
        </div>
    );
}

export default TodoMenu