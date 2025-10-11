import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { UseApi } from "../Hooks/UseApi";
import FreeSoloDropdown from "../components/FreeSoloDropdown";
import { useState, useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();
  const [OrgList, setOrgList] = useState([]);

  // 🔹 Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Required"),
    tenant: Yup.object().nullable().required("Select an organisation"),
  });

  // 🔹 Mutation for login
  const { mutate: handleLogin, isPending } = UseApi({
    url: "auth/login",
    method: "POST",
    credentials: "include"
  });

  const onLoginSubmit = (values, { setSubmitting, setErrors }) => {
    handleLogin(values, {
      onSuccess: (data) => {
        // Store token here if API returns one
        // localStorage.setItem("token", data.token);
        navigate("/dashboard");
      },
      onError: (error) => {
        setErrors({
          email: error.message || "Invalid credentials or server error",
        });
      },
      onSettled: () => {
        setSubmitting(false);
      },
    });
  };

  const [keyword, setKeyword] = useState("");

// 🔹 Query for fetching tenants
const {
  data: tenantData,
  isPending: isTenantLoading,
  error: tenantError,
  refetch: fetchTenant,
} = UseApi({
  url: "tenants/SearchTenants",
  method: "GET",
  queryKey: ["SearchKeyword",keyword], // will expand with params
  params: { SearchKeyword: keyword },
  enabled: false, // don't run automatically
});
console.log(tenantData);
// Keep org list updated
useEffect(() => {
  if (tenantData) {
    setOrgList(tenantData);
  }
}, [tenantData]);
                            

// 🔹 Search handler
const handleTenantSearch = (keyword) => {
  console.log(keyword)
  setKeyword(keyword);
  fetchTenant(); // will refetch with new keyword from state
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

        <Formik
          initialValues={{ tenant: null, email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onLoginSubmit}
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-4">
              {/* Tenant Search */}
              <div>
                <FreeSoloDropdown
                  placeholder="Search Your Organisation"
                  value={values.tenant}
                  options={OrgList}
                  onInputChange={(val)=>handleTenantSearch(val)}
                  onChange={(value) =>setFieldValue("tenant", value)}
                />
                <ErrorMessage
                  name="tenant"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <Field
                  as="input"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <Field
                  as="input"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full border rounded p-2"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
                disabled={isPending}
              >
                {isPending ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>

        {/* Debug/Error */}
        {isTenantLoading && <p>Loading tenants...</p>}
        {tenantError && (
          <p className="text-red-500">{tenantError.message}</p>
        )}
      </div>
    </div>
  );
}
