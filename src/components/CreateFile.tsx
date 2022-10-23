
import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import Divider from '@mui/material/Divider';

interface Props {
  callback: (name: string, content: string) => void;
}

export default function FormDialog({ callback }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const handleClickOpen = () => {
    setName("");
    setContent("")
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreate = () => {
    callback(name, content);
    setOpen(false);
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen} style={{textTransform: 'none'}}>
        Create new file
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle sx={{pb: 1}}>New File</DialogTitle>
        <DialogContent sx={{minWidth: 500, minHeight: 150}}>
          <Divider  sx={{mb: 2, borderColor: "black"}}/>
          <TextField
            autoFocus
            size="small"
            id="name"
            placeholder='Name...'
            fullWidth
            sx={{mb: 2}}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            id="content"
            multiline
            fullWidth
            rows={3}
            placeholder='File content goes here...'
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{mr: 2}}>
          <Button variant="outlined" onClick={handleClose} style={{textTransform: 'none'}}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} style={{textTransform: 'none'}}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
