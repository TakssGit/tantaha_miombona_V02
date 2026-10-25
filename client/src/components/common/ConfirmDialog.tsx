import Modal from "../ui/Modal";
import Button from "../ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title = "Confirmation",
  message,
  onConfirm,
  onCancel
}: ConfirmDialogProps) => {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onCancel}
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>
            Annuler
          </Button>

          <Button variant="danger" onClick={onConfirm}>
            Confirmer
          </Button>
        </>
      }
    >
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
        {message}
      </p>
    </Modal>
  );
};

export default ConfirmDialog;
