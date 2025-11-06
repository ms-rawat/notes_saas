import React from "react";
import { Modal, Button, Typography } from "antd";
const { Text } = Typography;

const DeleteConfirmModal = ({ visible, onClose, onSubmit, noteTitle }) => {
  return (
    <Modal
      open={visible}
      title="Delete Note?"
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
    >
      <div className="flex flex-col items-center text-center space-y-4 py-4">
        <Text type="secondary">
          Are you sure you want to delete{" "}
          <Text strong>{noteTitle || "this note"}</Text>?<br />
          This action cannot be undone.
        </Text>

        <div className="flex justify-center gap-3 mt-4">
          <Button onClick={onClose}>Cancel</Button>
          <Button danger type="primary" onClick={onSubmit}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
