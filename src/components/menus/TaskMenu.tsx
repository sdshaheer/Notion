import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface props {
    anchorEl: SVGElement | null
    handleMenuClose: () => void
    handleAddTodo: () => void
    handleRename: () => void
    handleDelete: () => void
}

const TaskMenu: React.FC<props> = ({
    anchorEl,
    handleMenuClose,
    handleAddTodo,
    handleRename,
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
                <MenuItem onClick={handleAddTodo}>Add Todo</MenuItem>
                <MenuItem onClick={handleRename}>Rename</MenuItem>
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
            </Menu>
        </div>
    );
}

export default TaskMenu