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
        <Box flexDirection="column" alignItems="start">
            <Card sx={{ maxWidth: '100vw', mb: 2 }}>
                <Box display="flex" flexDirection="row" alignItems="center">
                    <CardMedia
                        component="img"
                        sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover'
                        }}
                        image={croppedImg}
                        alt={name}
                    />

                    <CardContent>
                        <Typography variant="caption" display="block">
                            {furigana}
                        </Typography>
                        <Typography variant="h5" component="div">
                            {name}
                        </Typography>
                        <Button variant="outlined" sx={{ mt: 2 }} onClick={handleOpen}>
                            詳細
                        </Button>
                    </CardContent>
                </Box>
                <Typography textAlign={"center"} variant="h6" component="div" sx={{ ml: 2 }}>
                    {heading}
                </Typography>
            </Card>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen
            >
                <IconButton
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: 'white',
                    }}
                    onClick={handleClose}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ p: 2, overflowY: 'auto' }}>
                    <CardMedia
                        component="img"
                        sx={{ width: '100%', objectFit: 'cover' }}
                        image={croppedImg}
                        alt={name}
                    />
                    <Typography textAlign={"center"} variant="caption" display="block" sx={{ mt: 2 }}>
                        {furigana}
                    </Typography>
                    <Typography textAlign={"center"} variant="h5" component="div" sx={{ mt: 1 }}>
                        {name}
                    </Typography>
                    <Typography textAlign={"center"} variant="h6" component="div" sx={{ mt: 2 }}>
                        {heading}
                    </Typography>
                    <Typography variant="body1" style={{ whiteSpace: 'pre-line' }} sx={{ mt: 2 }}>
                        {description}
                    </Typography>
                </Box>
            </Dialog>
        </Box>
    );
};


export default SpecialMoveCard;