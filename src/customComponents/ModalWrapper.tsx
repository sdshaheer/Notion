import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';


const style = {
    position: 'absolute' as 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: '10px',
    boxShadow: 24,

};

interface props {
    isOpen: boolean
    handleClose: () => void
    children: React.ReactNode;
}

const ModalWrapper: React.FC<props> = ({ isOpen, handleClose, children }) => {

    return (
        <div className=''>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={isOpen}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={isOpen}>
                    <Box sx={style}>
                        {children}
                    </Box>
                </Fade>
            </Modal>
        </div>
    );
}

export default ModalWrapper