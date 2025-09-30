import { Alert, Snackbar, Typography } from '@mui/material';
import { createRoot } from 'react-dom/client';

type ToastProps = {
  message: string;
  severity?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
};

const showToast = ({ message, severity = 'info', duration = 2000 }: ToastProps) => {
  const toastRoot = document.createElement('div');
  document.body.appendChild(toastRoot);
  const root = createRoot(toastRoot);

  const handleClose = () => {
    root.unmount();
    document.body.removeChild(toastRoot);
  };

  root.render(
    <Snackbar
      open
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert severity={severity} onClose={handleClose}>
        {message}
      </Alert>
    </Snackbar>,
  );
};

// Export các phương thức giống Antd Toast
export const toast = {
  success: (message: string, duration?: number) => showToast({ message, severity: 'success', duration }),
  error: (message: string, duration?: number) => showToast({ message, severity: 'error', duration }),
  warning: (message: string, duration?: number) => showToast({ message, severity: 'warning', duration }),
  info: (message: string, duration?: number) => showToast({ message, severity: 'info', duration }),
};
