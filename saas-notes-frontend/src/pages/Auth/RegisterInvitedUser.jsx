import { useSearchParams, useNavigate } from "react-router";
import { Form, Input, Button, Card, notification } from "antd";
import { useEffect, useState } from "react";
import UseApi from "../../Hooks/UseApi";
import usePageTitle from "../../Hooks/usePageTitle";

const RegisterInvitedUser = () => {
  usePageTitle("Register User");
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const { data: invite, isPending } = UseApi({
    url: "auth/verify-invite",
    method: "GET",
    params: { token },
    enabled: !!token,
  });

  const { mutate: registerUser, isPending: submitting } = UseApi({
    url: "auth/register-invited-user",
    method: "POST",
  });

  const onFinish = (values) => {
    registerUser({ token, ...values }, {
      onSuccess: () => {
        notification.success({ message: "Account created successfully!" });
        navigate("/login");
      },
      onError: (error) => {
        notification.error({ message: error.message || "Something went wrong" });
      },
    });
  };

  if (!invite && !isPending) return <p>Invalid or expired invite link.</p>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-bg">
      <Card className="max-w-md w-full bg-surface border border-border shadow-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Complete Your Registration</h2>
        <p className="mb-2 text-sm">Joining: {invite?.email}</p>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="password"
            label="Create Password"
            rules={[{ required: true, message: "Please set a password" }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            block
          >
            Create Account
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterInvitedUser;
