import type { ReactNode } from "react";
import { X } from "lucide-react";
import Button from "./Button";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
}

const Modal = ({
  open,
  title,
  children,
  onClose,
  footer
}: ModalProps) => {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div
        className="modal-box"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={17} />
          </Button>
        </div>

        <div className="modal-body">{children}</div>

        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
};

export default Modal;
