import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { UseApi } from "../Hooks/UseApi";
import { useState, useEffect } from "react";
import { Input, Button, Card, Typography, Spin, Select } from "antd";
import { MailOutlined, LockOutlined, ApartmentOutlined } from "@ant-design/icons";
import GalaxyBackground from "../components/GalaxyBackground";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [OrgList, setOrgList] = useState([]);
  const [keyword, setKeyword] = useState("");

  // ✅ Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "Must be at least 6 characters").required("Required"),
    tenant: Yup.object().nullable().required("Select an organisation"),
  });

  // ✅ Login API
  const { mutate: handleLogin, isPending } = UseApi({
    url: "auth/login",
    method: "POST",
    credentials: "include",
  });

  // ✅ Tenant API
  const {
    data: tenantData,
    isPending: isTenantLoading,
    error: tenantError,
    refetch: fetchTenant,
  } = UseApi({
    url: "tenants/SearchTenants",
    method: "GET",
    queryKey: ["SearchKeyword", keyword],
    params: { SearchKeyword: keyword },
    enabled: false, // fetch only on search
  });

  // ✅ Update org list when data changes
  useEffect(() => {
    if (tenantData) setOrgList(tenantData);
  }, [tenantData]);

  // ✅ Search handler for Select
  const handleTenantSearch = (value) => {
    console.log(value)
    setKeyword(value);
    if (value && value.trim().length > 1) {
      fetchTenant();
    }
  };

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      tenant: null,
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values, { setSubmitting, setErrors }) => {
      handleLogin(values, {
        onSuccess: () => navigate("/dashboard"),
        onError: (error) => {
          setErrors({
            email: error.message || "Invalid credentials or server error",
          });
        },
        onSettled: () => setSubmitting(false),
      });
    },
  });

  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    errors,
    touched,
  } = formik;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* 🌌 Animated Background */}
      <GalaxyBackground />

      {/* Login Card */}
      <Card className="relative z-10 w-full max-w-md rounded-lg shadow-lg bg-white/90 dark:bg-gray-800/80 backdrop-blur">
        <Title level={3} className="text-center text-gray-900 dark:text-gray-100 mb-6">
          Login
        </Title>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 🔹 Organisation Select (AntD) */}
          <div>
            <Select
              showSearch
              allowClear
              placeholder="Search Your Organisation"
              suffixIcon={<ApartmentOutlined />}
              value={values.tenant?.id}
              onSearch={handleTenantSearch}
              onChange={(value) => {
                const selected = OrgList.find((org) => org.id === value);
                setFieldValue("tenant", selected || null);
              }}
              filterOption={false}
              loading={isTenantLoading}
              style={{ width: "100%" }}
              options={OrgList.map((org) => ({
                label: org.name,
                value: org.id,
              }))}
            />
            {touched.tenant && errors.tenant && (
              <Text type="danger" className="text-sm">
                {errors.tenant}
              </Text>
            )}
          </div>

          {/* 🔹 Email */}
          <div>
            <Input
              prefix={<MailOutlined />}
              name="email"
              type="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <Text type="danger" className="text-sm">
                {errors.email}
              </Text>
            )}
          </div>

          {/* 🔹 Password */}
          <div>
            <Input.Password
              prefix={<LockOutlined />}
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <Text type="danger" className="text-sm">
                {errors.password}
              </Text>
            )}
          </div>

          {/* 🔹 Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* 🔹 Error States */}
        {tenantError && (
          <Text type="danger" className="block mt-2 text-center">
            {tenantError.message}
          </Text>
        )}
      </Card>
    </div>
  );
}
