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
    const [dialogBody, setDialogBody] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');

    const handleClickOpen = async () => {
        await execute();
        setOpen(true);
      };
      const handleClose = () => {
        setOpen(false);
      };
    const execute = () => {
        return fetch(`http://localhost:3000/workflows/${id}/execute`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if(data.status){
                  setDialogTitle(data.status)
                  setDialogBody(data.stages)
                }else{
                  setDialogTitle('Error' + data.statusCode)
                  setDialogBody(data.message)
                }
            })
            .catch(error => {
                console.error(error);
                setDialogBody('Error executing workflow')
            });
    }

    return (
        <>
        <button onClick={handleClickOpen}>Exec workflow</button>
        <BootstrapDialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ m: 1, p: 1 , pr: 5}} id="customized-dialog-title">
                Agent response: {dialogTitle}
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
        > <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            {dialogBody}
          </Typography>
        </DialogContent>
        </BootstrapDialog>
        </>
    );
}

export default WorkflowExecutor;
