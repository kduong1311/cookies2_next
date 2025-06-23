"use client";

import { createContext, useContext, useState, useCallback } from "react";
import ConfirmDialog from "@/components/ConfirmDialog";

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export function ConfirmProvider({ children }) {
  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    description: "",
    resolve: null,
  });

  const confirm = useCallback(({ title, description }) => {
    return new Promise((resolve) => {
      setConfirmState({
        open: true,
        title,
        description,
        resolve,
      });
    });
  }, []);

  const handleCancel = () => {
    if (confirmState.resolve) confirmState.resolve(false);
    setConfirmState((prev) => ({ ...prev, open: false }));
  };

  const handleConfirm = () => {
    if (confirmState.resolve) confirmState.resolve(true);
    setConfirmState((prev) => ({ ...prev, open: false }));
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmDialog
        open={confirmState.open}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        title={confirmState.title}
        description={confirmState.description}
      />
    </ConfirmContext.Provider>
  );
}
