import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotion } from '../context/notionContext';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BiDotsVerticalRounded } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';


const Header: React.FC = () => {
    const { user, logout } = useAuth()
    const { setNotion } = useNotion()
    const [anchorEl, setAnchorEl] = useState<null | SVGElement>(null);

    const navigate = useNavigate()

    const handleMenuClick = (event: React.MouseEvent<SVGElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogOut = () => {
        handleMenuClose()
        setNotion({})
        logout()
        navigate('/')
    }

    return (
        <div className='flex justify-between items-center'>
            <div className='text-[18px] font-semibold'>Task List</div>
            <div className='flex items-center justify-between gap-1'>
                <div>{user?.email}</div>
                <div>
                    <BiDotsVerticalRounded
                        onClick={handleMenuClick}
                        className='cursor-pointer'
                    />
                </div>
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
                        <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default Header
