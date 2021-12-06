import React, { createRef, FC, ReactElement, useRef, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    IconButton,
    CircularProgress,
    CircularProgressProps,
    Stack,
} from '@mui/material';
import { SxProps } from '@mui/system';
import { Theme } from '@mui/material';
import {
    UploadFile,
    FileUpload,
    Clear,
} from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';

type FileUploaderProps = {
    fileUploadEndpoint: string;
    fileMimeType: string;
    acceptType: string;
    promptText?: string;
    sx?: SxProps<Theme>;
    onFileAdded?: (file: File) => void;
    onCancel?: () => void;
    onFileUploaded?: () => void;
};

// https://mui.com/components/progress/#circular-with-label
const CircularProgressWithLabel = (props: CircularProgressProps & { value: number }) => {
    return (
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress variant="determinate" {...props} />
            <Box
                sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                }}
            >
                <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                >{`${Math.round(props.value)}%`}</Typography>
            </Box>
        </Box>
    );
};

const FileUploader: FC<FileUploaderProps> = (props: FileUploaderProps): ReactElement => {

    const [currentFile, setCurrentFile] = useState<File>();
    const [currentlyUploading, setCurrentlyUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState(0);

    const ref = useRef<HTMLInputElement>();

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if(!files) return;

        setCurrentFile(files[0]);
        if(props.onFileAdded) props.onFileAdded(files[0]);
    };

    const handleFileUpload = async () => {
        if(!currentFile) return;

        setProgress(0);
        setCurrentlyUploading(true);

        try {
            let formData = new FormData();
            formData.append("files", currentFile, currentFile.name);

            await axios.post(props.fileUploadEndpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                cancelToken: source.token,
                onUploadProgress: handleUploadProgressChange,
            });

            setCurrentFile(undefined);
            if(ref.current) ref.current.value = "";

            toast.success('Uploaded file successfully', {
                position: 'top-center',
                autoClose: 6000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
                progress: 0,
            });

            if(props.onFileUploaded) props.onFileUploaded();
            
        } catch(err) {
    
        } finally {
            setCurrentlyUploading(false);
            setProgress(0);
        }
    };

    const handleUploadProgressChange = (progressEvent: ProgressEvent) => {
        setProgress((progressEvent.loaded / progressEvent.total) * 100);
    };

    const handleUploadCancel = () => {
        source.cancel('File upload canceled');
        if(props.onCancel) props.onCancel();
    };

    const handleFileClear = () => {
        setCurrentFile(undefined);
        if(ref.current) ref.current.value = "";
        if(props.onCancel) props.onCancel();
    };

    return (
        <Stack sx={props.sx} alignItems="center" direction="row" justifyContent="center" spacing={2}>
            { !Boolean(currentFile) && !currentlyUploading && (
                <label htmlFor="uploadFile" style={{ marginBottom: 0 }}>
                    <input 
                    accept={props.acceptType} 
                    style={{ display: 'none' }} 
                    id="uploadFile" 
                    type="file"
                    onChange={handleFileChange}
                    // @ts-ignore
                    ref={ref}
                    />
                    <Button variant="contained" component="span" color="secondary" endIcon={<UploadFile />}>
                        { props.promptText ? props.promptText : "Select file to upload" }
                    </Button>
                </label>
            )}
            { Boolean(currentFile) && !currentlyUploading && (
                <>
                <Typography variant="body1" component="div">
                    {currentFile?.name}
                </Typography>
                <Button 
                variant="contained" 
                color="primary" 
                endIcon={<FileUpload />}
                onClick={() => handleFileUpload()}
                >
                    Upload
                </Button>
                <IconButton onClick={() => handleFileClear()} color="secondary">
                    <Clear />
                </IconButton>
                </>
            )}
            { Boolean(currentFile) && currentlyUploading && (
                <>
                <Typography variant="body1" component="div">
                    Uploading {currentFile?.name}...
                </Typography>
                <CircularProgressWithLabel value={progress} />
                <Button 
                variant="outlined" 
                color="secondary" 
                endIcon={<Clear />}
                onClick={() => handleUploadCancel()}
                >
                    Cancel
                </Button>
                </>
            )}
        </Stack>
    );

};

export default FileUploader;
