import { toast, ToastOptions } from 'react-toastify';

// Default toast style that matches the site's dark theme with green accents
export const defaultToastStyle: ToastOptions = {
  style: {
    borderRadius: '8px',
    background: '#1b1d22', // Match site's background
    color: '#fbfcff',
    fontFamily: 'monospace', // Match site's font
    border: '1px solid #282b33', // Match site's border
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    padding: '12px 16px',
    fontSize: '14px',
    borderLeft: '4px solid #97ef83', // Match site's green accent
  },
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// Success toast with custom styling
export const successToast = (message: string) => {
  return toast.success(message, {
    ...defaultToastStyle,
    icon: '✓',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #10b981',
    },
  });
};

// Info toast with pending styling
export const pendingToast = (message: string) => {
  return toast.info(message, {
    ...defaultToastStyle,
    icon: '⏳',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #3b82f6',
    },
  });
};

// Info toast for already following
export const alreadyFollowingToast = (message: string) => {
  return toast.info(message, {
    ...defaultToastStyle,
    icon: '👤',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #8b5cf6',
    },
  });
};

// Warning toast
export const warningToast = (message: string) => {
  return toast.warning(message, {
    ...defaultToastStyle,
    icon: '⚠️',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #f59e0b',
    },
  });
};

// Error toast
export const errorToast = (message: string) => {
  return toast.error(message, {
    ...defaultToastStyle,
    icon: '✕',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #ef4444',
    },
  });
};

// Success toast for accept action
export const acceptToast = (message: string) => {
  return toast.success(message, {
    ...defaultToastStyle,
    icon: '✓',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #10b981',
    },
  });
};

// Success toast for cancel action
export const cancelToast = (message: string) => {
  return toast.success(message, {
    ...defaultToastStyle,
    icon: '✕',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #6b7280',
    },
  });
};

// Success toast for decline action
export const declineToast = (message: string) => {
  return toast.success(message, {
    ...defaultToastStyle,
    icon: '👎',
    style: {
      ...defaultToastStyle.style,
      borderLeft: '4px solid #f97316',
    },
  });
};
