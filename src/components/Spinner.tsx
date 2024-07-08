import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function CircularIndeterminate() {
    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center', // Center horizontally
            alignItems: 'center', // Center vertically
            position: 'fixed', // Fixed positioning to cover entire viewport
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
            zIndex: 9999, // Ensure the spinner is on top of other content
        }}>
            <CircularProgress />
        </Box>
    );
}