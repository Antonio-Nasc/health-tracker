/**
 * Shared/FSD: modal genérico para fluxos de criação/edição sem acoplamento de domínio.
 */
import type { PropsWithChildren } from "react";

import { Button } from "@/shared/ui/Button";

interface ModalProps extends PropsWithChildren {
  open: boolean;
  title: string;
  onClose: () => void;
}

export const Modal = ({ open, title, onClose, children }: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
          <Button variant="ghost" onClick={onClose}>
            Fechar
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
};
