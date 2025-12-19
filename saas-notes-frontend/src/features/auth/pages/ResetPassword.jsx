import { useState } from "react";
import { Lock, ShieldCheck } from "lucide-react";
import { Form, Input, Button, message, Card, notification } from "antd";
import { useNavigate, useSearchParams } from "react-router";
import UseApi from "../../../Hooks/UseApi";
import usePageTitle from "../../../Hooks/usePageTitle";

const ResetPassword = () => {
  usePageTitle("Reset Password");
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // from email link
  const { mutate: handleResetPassword, isPending } = UseApi({ url: 'auth/reset-password', method: 'POST', credentials: 'include' })
  const onFinish = async (values) => {
    if (!token) {
      return notification.error({ message: "Passwords do not match." });
    }
    if (values.password !== values.confirmPassword) {
      return notification.error({ message: "Passwords do not match." });
    }

    setLoading(true);
    try {
      console.log(values)
      handleResetPassword({ token, ...values }, {
        onSuccess: (data) => {
          notification.success({ message: data?.message || "Password reset successful!" });
          navigate("/login");
        },
        onError: (error) => {
          throw error;
        },
      })
    } catch (error) {
      notification.error({ message: "Something went wrong. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2 bg-bg transition-all duration-300">
      {/* Left side (Brand Info) */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center space-y-3 text-white">
          <h1 className="text-4xl font-bold tracking-tight">NotesVerse</h1>
          <p className="text-sm opacity-80">Reset your password securely and get back to your notes.</p>
        </div>
      </div>

      {/* Right side (Form) */}
      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md bg-surface shadow-2xl border border-border/20 rounded-2xl backdrop-blur-md">
          <div className="flex flex-col items-center mb-6">
            <ShieldCheck className="text-accent w-10 h-10 mb-2" />
            <h2 className="text-2xl font-semibold text-text">Reset Password</h2>
            <p className="text-sm text-text/60 mt-1 text-center">
              Enter your new password below to regain access.
            </p>
          </div>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="password"
              label={<span className="text-text">New Password</span>}
              rules={[{ required: true, message: "Please enter your new password!" }]}
            >
              <Input.Password
                prefix={<Lock className="w-4 h-4 mr-2 text-text/70" />}
                placeholder="New password"
                className="rounded-lg py-2"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label={<span className="text-text">Confirm Password</span>}
              rules={[{ required: true, message: "Please confirm your password!" }]}
            >
              <Input.Password
                prefix={<Lock className="w-4 h-4 mr-2 text-text/70" />}
                placeholder="Confirm password"
                className="rounded-lg py-2"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="bg-accent hover:opacity-90 text-black font-semibold py-2 rounded-lg"
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
