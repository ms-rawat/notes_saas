import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link, useNavigate } from "react-router";
import * as Yup from "yup";
import Password from "antd/es/input/Password";
import UseApi from "../../Hooks/UseApi";
import { notification } from "antd";
import usePageTitle from "../../Hooks/usePageTitle";

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

  // Setup the mutation using your hook
  const registerMutation = UseApi({
    url: "tenants/register",
    method: "POST",
  });
  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true)
    registerMutation.mutate(values, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        notification.success({ message: "Tenant Registered Successfully", placement: "bottomRight" })
        navigate("/dashboard");
      },
      onError: (error) => {
        setErrors({ slug: error.message || "Company already exists" });
        notification.error({ message: error.message || "Something weng wrong!", placement: "bottomRight" })

      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-primary">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">

        <span className="flex flex-col items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 ">
            Register Tenant
          </h2>
          <b>or</b>
          <h4 className="text-center comfortaa-font">Ask your Organisation to send you an invitation to this plateform.</h4>
        </span>
        <Formik
          initialValues={{ tenantname: "", username: "", adminEmail: "", adminPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  User Name
                </label>
                <Field
                  type="text"
                  name="username"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                             shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Workspace Name
                </label>
                <Field
                  type="text"
                  name="tenantname"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                             shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
                <ErrorMessage
                  name="tenantname"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Admin Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Email
                </label>
                <Field
                  type="email"
                  name="adminEmail"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                             shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
                <ErrorMessage
                  name="adminEmail"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Admin Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Password
                </label>
                <Field
                  as={Password}
                  name="adminPassword"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                             shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
                <ErrorMessage
                  name="adminPassword"
                  component="div"
                  className="text-sm text-red-500 mt-1"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
                           text-white font-semibold rounded-md shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {registerMutation.isPending ? "Registering..." : "Register Tenant"}
              </button>

              <p className="text-center mt-6 text-gray-600 dark:text-gray-300 text-sm">
                Already have an account?{" "}
                <Link to='/login' className="text-blue-600 hover:underline font-medium">
                  login
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
