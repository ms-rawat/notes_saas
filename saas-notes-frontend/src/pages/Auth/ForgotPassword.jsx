import { useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { Form, Input, Button, message, Card } from "antd";
import { useNavigate } from "react-router";
import UseApi from "../../Hooks/UseApi";

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {mutate : handleForgotPassword, isPending} = UseApi({url : 'auth/forgot-password', method : 'POST', credentials : 'include'})

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // 🔹 Replace with your API endpoint
      const response =await handleForgotPassword(values);
      console.log(response)

      const data = await response.json();

      if (response.ok) {
        message.success("Password reset link sent to your email!");
        navigate("/login");
      } else {
        message.error(data.message || "Something went wrong!");
      }
    } catch (error) {
      message.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2 bg-bg transition-all duration-300">
      {/* 🔹 Left Side (Illustration or Brand) */}
      <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="text-center space-y-3 text-white">
          <h1 className="text-4xl font-bold tracking-tight">NotesVerse</h1>
          <p className="text-sm opacity-80">Your thoughts. One place. Always secure.</p>
          <p className="text-sm opacity-80">This feature is not ready yet. Stay tuned!</p>
        </div>
      </div>

      {/* 🔹 Right Side (Form) */}
      <div className="flex items-center justify-center px-6 py-12">
        <Card className="w-full max-w-md bg-surface shadow-2xl border border-border/20 rounded-2xl backdrop-blur-md">
          <div className="flex flex-col items-center mb-6">
            <Mail className="text-accent w-10 h-10 mb-2" />
            <h2 className="text-2xl font-semibold text-text">Forgot Password?</h2>
            <p className="text-sm text-text/60 mt-1 text-center">
              Enter your registered email and we’ll send you a password reset link.
            </p>
          </div>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label={<span className="text-text">Email Address</span>}
              rules={[
                { required: true, message: "Please enter your email!" },
                { type: "email", message: "Enter a valid email address!" },
              ]}
            >
              <Input
                prefix={<Mail className="w-4 h-4 mr-2 text-text/70" />}
                placeholder="you@example.com"
                className="rounded-lg py-2 border-2 "
                style={{borderWidth:"4px" , }}
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
                Send Reset Link
              </Button>
            </Form.Item>
          </Form>

          <div className="flex justify-center mt-4">
            <Button
              type="link"
              icon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate("/login")}
              className="text-accent"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
