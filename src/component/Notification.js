import { useState, useEffect, useRef } from 'react';
import Snackbar from '@mui/material/Snackbar';

const MuiSnackBar = ({ openNotifyRef }) => {
    const [notifyOpen, setNotifyOpen] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState('');

    const handleNotificationClose = () => {
        setNotifyOpen(false);
    }

    function openNotification(message) {
        setNotificationMessage(message);
        setNotifyOpen(true);
    }

    // 將開啟的函式回傳
    // registNotification(ukey, openNotification.bind(null));

    if (openNotifyRef) {
        openNotifyRef.current = openNotification.bind(null);
    }

    // const openNotification = () => {
    //     setNotificationMessage(t('notifyHaveUpdatePermission'));
    //     setNotifyOpen(true);
    // }

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open={notifyOpen}
            onClose={handleNotificationClose}
            message={notificationMessage}
        />
    )
}


export default function MessageExport({ openNotifyRef }) {

    return (
        <MuiSnackBar openNotifyRef={openNotifyRef} />
    )
}