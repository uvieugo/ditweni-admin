import { useMemo } from 'react';
import { create } from 'zustand';

// ==============================|| API - SNACKBAR (Zustand) ||============================== //

const initialState = {
  action: false,
  open: false,
  message: 'Note archived',
  anchorOrigin: {
    vertical: 'bottom',
    horizontal: 'right'
  },
  variant: 'default',
  alert: {
    color: 'primary',
    variant: 'filled'
  },
  transition: 'Fade',
  close: false,
  actionButton: false,
  maxStack: 3,
  dense: false,
  iconVariant: 'usedefault'
};

export function useGetSnackbar() {
  const snackbar = useSnackbarStore((s) => s.snackbar);
  return useMemo(() => ({ snackbar }), [snackbar]);
}

export function openSnackbar(snackbar) {
  // mirror previous merge semantics (truthy fallback similar to SWR mutate implementation)
  const { action, open, message, anchorOrigin, variant, alert, transition, close, actionButton } = snackbar || {};
  useSnackbarStore.getState().setSnackbar((currentSnackbar) => ({
    ...currentSnackbar,
    action: action || initialState.action,
    open: open || initialState.open,
    message: message || initialState.message,
    anchorOrigin: anchorOrigin || initialState.anchorOrigin,
    variant: variant || initialState.variant,
    alert: {
      color: alert?.color || initialState.alert.color,
      variant: alert?.variant || initialState.alert.variant
    },
    transition: transition || initialState.transition,
    close: close || initialState.close,
    actionButton: actionButton || initialState.actionButton
  }));
}

export function closeSnackbar() {
  useSnackbarStore.getState().setSnackbar((currentSnackbar) => ({ ...currentSnackbar, open: false }));
}

// ------------------------------ Zustand Store ------------------------------ //

const useSnackbarStore = create((set) => ({
  snackbar: initialState,
  setSnackbar: (updater) =>
    set((state) => {
      const current = state.snackbar;
      const next = typeof updater === 'function' ? updater(current) : updater;
      return { snackbar: next };
    })
}));
