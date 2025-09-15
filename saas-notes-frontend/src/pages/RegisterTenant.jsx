import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router";
import * as Yup from "yup";
import { PasswordInput } from "../components/BasicComps";

export default function RegisterTenant() {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Company name is required"),
    adminEmail: Yup.string().email("Invalid email").required("Admin email is required"),
    adminPassword: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const handleRegister = async (values, { setSubmitting, setErrors }) => {
    try {
      const res = await fetch("http://localhost:4000/tenants/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        const errorData = await res.json();
        setErrors({ slug: errorData.message || "Company already exists" });
      }
    } catch (error) {
      setErrors({ name: "Server error. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
          Register Tenant
        </h2>

        <Formik
          initialValues={{ name: "", slug: "", adminEmail: "", adminPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <Field
                  type="text"
                  name="name"
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                             bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                             shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 p-2"
                />
                <ErrorMessage
                  name="name"
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
                  as={PasswordInput}
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
                disabled={isSubmitting}
                className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 
                           text-white font-semibold rounded-md shadow-md
                           disabled:opacity-50 disabled:cursor-not-allowed
                           focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {isSubmitting ? "Registering..." : "Register Tenant"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
