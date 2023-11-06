import React, { useState } from 'react';
import {
    Card,
    CardMedia,
    Typography,
    Button,
    Dialog,
    Box,
    CardContent,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Props {
    name: string,
    furigana: string,
    heading: string,
    description: string,
    croppedImg: string,
}

const SpecialMoveCard: React.FC<Props> = ({ name, furigana, heading, description, croppedImg }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Box flexDirection="column" alignItems="start" sx={{ width: '100%' }}>
            <Card
                sx={{
                    mb: 2,
                    boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    transition: '0.3s',
                    '&:hover': {
                        boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
                        transform: 'translateY(-2px)',
                    },
                }}
            >
                <Box display="flex" flexDirection="row" alignItems="center">
                    <CardMedia
                        component="img"
                        sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            borderRadius: '8px',
                            mr: 1.5
                        }}
                        image={croppedImg}
                        alt={name}
                    />

                    <CardContent sx={{ flexGrow: 1, p: 1, minWidth: 0 }}>
                        <Typography gutterBottom variant="caption" display="block" textAlign="center">
                            {furigana}
                        </Typography>
                        <Typography gutterBottom variant="h5" component="div" textAlign="center">
                            {name}
                        </Typography>
                        <Box mt={1.5} display="flex" flexDirection="column">
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleOpen}
                                sx={{ mb: 1, borderRadius: '20px' }}
                            >
                                詳細
                            </Button>
                        </Box>
                    </CardContent>
                </Box>
                <Typography textAlign={"center"} variant="h6" component="div" sx={{ ml: 1.5, mr: 1.5 }}>
                    {heading}
                </Typography>
            </Card >
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
                sx={{
                    '& .MuiDialog-container': {
                        display: 'flex',
                        justifyContent: 'center',
                    },
                    '& .MuiPaper-root': {
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: 2,
                        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                        margin: '16px',
                        width: 'auto',
                        maxWidth: 'none',
                        height: 'calc(100% - 32px)',
                    },
                }}
            >
                <IconButton
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'theme.palette.grey[500]',
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: '50%',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <Box
                    sx={{
                        p: 3,
                        overflowY: 'auto',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <CardMedia
                        component="img"
                        sx={{
                            width: '100%',
                            objectFit: 'cover',
                            borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                        }}
                        image={croppedImg}
                        alt={name}
                    />
                    <Typography textAlign={"center"} variant="caption" display="block" sx={{ mt: 2 }}>
                        {furigana}
                    </Typography>
                    <Typography textAlign={"center"} variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography textAlign={"center"} variant="subtitle1" component="div" >
                        {heading}
                    </Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }} sx={{ mt: 2 }}>
                        {description}
                    </Typography>
                </Box>
            </Dialog>
        </Box >
    );
};


export default SpecialMoveCard;