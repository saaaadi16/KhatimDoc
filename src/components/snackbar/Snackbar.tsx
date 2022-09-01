import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Slide, { SlideProps } from '@mui/material/Slide';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

type TransitionProps = Omit<SlideProps, 'direction'>;

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TransitionLeft(props: TransitionProps) {
    return <Slide {...props} direction="left" />;
}

export default function DirectionSnackbar(props: any) {

    const handleClose = () => {
        props.setOpen(false);
    };

    return (
        <div>
            <Snackbar
                open={props.open}
                onClose={handleClose}
                TransitionComponent={TransitionLeft}
                anchorOrigin={{vertical: 'top', horizontal: 'right'} }
                autoHideDuration={10000}
            >
                <Alert severity={props.alert}>{props.message}</Alert>
            </Snackbar>
        </div>
    );
}