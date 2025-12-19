import { useSearchParams, useNavigate } from "react-router";
import { Form, Input, Button, notification, Typography } from "antd";
import UseApi from "../../../Hooks/UseApi";
import usePageTitle from "../../../Hooks/usePageTitle";
import { Bug, CheckCircle } from "lucide-react";

const { Title, Text } = Typography;

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

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-500">
      Invalid Invite Link
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* ---------- Left Panel ---------- */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-slate-900 text-white p-12 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-800 to-slate-900"></div>
        <div className="z-10 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/10 rounded-full backdrop-blur-md">
              <Bug className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to the Team!</h2>
          <p className="text-slate-400 max-w-sm mx-auto">
            You've been invited to join a workspace on BugTracker. Set up your account to start collaborating.
          </p>
        </div>
      </div>

      {/* ---------- Right Panel ---------- */}
      <div className="flex justify-center items-center p-8 sm:p-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <Title level={3} className="!mb-2 dark:!text-white">Join Workspace</Title>
            {isPending ? (
              <Text>Verifying invite...</Text>
            ) : invite ? (
              <Text type="secondary">You are joining as <strong className="text-slate-800 dark:text-slate-200">{invite.email}</strong></Text>
            ) : (
              <Text type="danger">Invite invalid or expired.</Text>
            )}
          </div>

          {invite && (
            <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
              <Form.Item
                name="password"
                label={<span className="text-slate-700 dark:text-slate-300 font-medium">Create Password</span>}
                rules={[{ required: true, message: "Please set a password" }, { min: 6, message: "Min 6 characters" }]}
              >
                <Input.Password placeholder="Set your password" className="rounded-lg" />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                block
                className="h-12 bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg mt-2"
              >
                Create Account
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterInvitedUser;
