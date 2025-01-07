import {useState} from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(1),
    },
  }));

interface WorkflowExecutorProps {
    id: string;
}

function WorkflowExecutor({ id }: WorkflowExecutorProps) {

    const [open, setOpen] = useState(false);
    const [response, setResponse] = useState('');

    const handleClickOpen = () => {
        execute();
      };
      const handleClose = () => {
        setOpen(false);
      };
    const execute = () => {
        return fetch(`http://localhost:3000/workflows/${id}/execute`)
            .then(response => console.log(response.json()))
            .then(response=> setResponse(JSON.stringify(response, null, 2)))
            .then(() => setOpen(true))
            .catch(error => {
                console.error(error);
                setResponse('Error executing workflow')
            });
    }

    return (
        <>
        <button onClick={handleClickOpen}>Exec workflow</button>
        <BootstrapDialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                Agent response
            </DialogTitle>
            <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            {response}
          </Typography>
        </DialogContent>
        </BootstrapDialog>
        </>
    );
}

export default WorkflowExecutor;
