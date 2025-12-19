import { Modal, Form, Input, Select, Button, notification } from "antd";
import UseApi from "../../Hooks/UseApi";

const InviteUserModal = ({ visible, onClose, onInviteSuccess }) => {
  const { mutate: sendInvite, isPending } = UseApi({
    url: "auth/invite-user",
    method: "POST",
  });

  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    sendInvite(values, {
      onSuccess: (data) => {
        notification.success({ message: data.message || "Invitation sent!" });
        onInviteSuccess?.();
        form.resetFields();
        onClose();
      },
      onError: (error) => {
        notification.error({ message: error.message || "Failed to send invite" });
      },
    });
  };

  return (
    <Modal
      open={visible}
      title="Invite New User"
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical" form={form} onFinish={handleSubmit}>
        <Form.Item
          label="Employee Email"
          name="email"
          rules={[{ required: true, type: "email", message: "Enter valid email" }]}
        >
          <Input placeholder="user@company.com" />
        </Form.Item>

        <Form.Item label="Role" name="role_id" initialValue={2}>
          <Select
            options={[
              { label: "User", value: 2 },
              { label: "Manager", value: 3 },
            ]}
          />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={isPending}>
          Send Invitation
        </Button>
      </Form>
    </Modal>
  );
};

export default InviteUserModal;
