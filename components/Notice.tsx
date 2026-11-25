import { Alert, Snackbar } from '@mui/material'
import React, { SetStateAction } from 'react'

type Props = {
    open:boolean,
    setOpen:(value: SetStateAction<boolean>) => void
    message:string,
    status:"success" | "error" | "warning" | "info"
}

const Notice = ({open,setOpen,message,status}:Props) => {
  return (
            <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={() => setOpen(false)}
            anchorOrigin={{
              vertical:"bottom",
              horizontal:"right"
            }}
            >
              <Alert 
              severity={status}
              variant='filled'
              onClose={() => setOpen(false)}
              >
                {message}
              </Alert>
            </Snackbar>
  )
}

export default Notice