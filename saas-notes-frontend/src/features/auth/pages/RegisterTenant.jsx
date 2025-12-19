import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import Password from "antd/es/input/Password";
import UseApi from "../../../Hooks/UseApi";
import { notification, Typography } from "antd";
import usePageTitle from "../../../Hooks/usePageTitle";
import { Bug, CheckCircle, Zap, Shield, Building2 } from "lucide-react";

const { Title, Text } = Typography;

export default function RegisterTenant() {
  usePageTitle("Register Tenant");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    tenantname: Yup.string().required("Company name is required"),
    adminEmail: Yup.string().email("Invalid email").required("Admin email is required"),
    adminPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const registerMutation = UseApi({
    url: "tenants/register",
    method: "POST",
  });

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true)
    registerMutation.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        notification.success({ message: "Workspace created successfully! Welcome aboard." })
        navigate("/dashboard");
      },
      onError: (error) => {
        setErrors({ slug: error.message || "Company already exists" });
        notification.error({ message: error.message || "Something went wrong!" })
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* ---------- Left Panel (Marketing) ---------- */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-12 relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-md space-y-8 z-10">
          <div className="flex items-center gap-3 mb-4 opacity-50">
            <Bug className="w-6 h-6" />
            <span className="text-xl font-bold tracking-tight">BugTracker</span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight text-white leading-tight">
            Start your 14-day free trial.
          </h2>

          <p className="text-slate-300 text-lg">
            Join over 4,000+ developer teams managing their projects with BugTracker.
          </p>

          <div className="space-y-4 pt-6">
            {[
              { icon: CheckCircle, text: "Unlimited Projects & Issues" },
              { icon: Zap, text: "Automated Workflows" },
              { icon: Shield, text: "Enterprise-grade Security" }
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <feature.icon className="text-green-400 w-6 h-6" />
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- Right Panel (Form) ---------- */}
      <div className="flex justify-center items-center p-8 sm:p-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Title level={2} className="!mb-2 !text-slate-900 dark:!text-white">Create your workspace</Title>
            <Text className="text-slate-500">Get started for free. No credit card required.</Text>
          </div>

          <Formik
            initialValues={{ tenantname: "", username: "", adminEmail: "", adminPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                    <Field
                      type="text"
                      name="username"
                      placeholder="John Doe"
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="username" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company</label>
                    <Field
                      type="text"
                      name="tenantname"
                      placeholder="Acme Inc."
                      className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <ErrorMessage name="tenantname" component="div" className="text-xs text-red-500 mt-1" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Work Email</label>
                  <Field
                    type="email"
                    name="adminEmail"
                    placeholder="name@company.com"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  <ErrorMessage name="adminEmail" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <Field
                    as={Password}
                    name="adminPassword"
                    placeholder="Create a password"
                    className="w-full rounded-lg border-gray-300 dark:border-gray-700 dark:bg-slate-900 px-4 py-2 text-sm focus:border-blue-500 focus:ring-blue-500 !bg-transparent"
                    style={{ padding: 0 }} // Antd Password wrapper fix if needed, but simplistic class usually works
                  />
                  <ErrorMessage name="adminPassword" component="div" className="text-xs text-red-500 mt-1" />
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5"
                >
                  {registerMutation.isPending ? "Creating Workspace..." : "Create Workspace"}
                </button>

                <p className="text-center text-slate-500 text-sm mt-6">
                  Already have an account?{" "}
                  <Link to='/login' className="text-blue-600 font-medium hover:underline">
                    Log in
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
