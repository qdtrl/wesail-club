import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

const DialogComponent = ({handleCancel, open, setOpen, title, content }) => {
  return (
    <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Retour</Button>
          <Button variant='contained' color='error' onClick={handleCancel} autoFocus>
            {title.split(" ")[0]}
          </Button>
        </DialogActions>
      </Dialog>
  )
}

export default DialogComponent