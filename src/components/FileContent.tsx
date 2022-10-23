import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import Stack from '@mui/material/Stack';
import { TreeItem } from '../models/treeItem';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface Props {
    file: TreeItem
}

export default function CustomizedDialogs({ file }: Props) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
        <Stack  alignItems="center" justifyContent="center" style={{width: 100, height: 100}}>
            <Box 
                onDoubleClick={handleClickOpen}
                sx={{ textAlign: "center", pt: 1, width: "80%", fontSize: 50, borderRadius: 1, "&:hover": {backgroundColor: 'lightblue', cursor: 'pointer'}}}>
                <DescriptionOutlinedIcon sx={{ fontSize: 50 }}/>
            </Box>
            <Typography variant="subtitle2">{file.name}</Typography>
        </Stack>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
          {file.name}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom sx={{width: 400, height: 200}}>
            {file.content}
          </Typography>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}
