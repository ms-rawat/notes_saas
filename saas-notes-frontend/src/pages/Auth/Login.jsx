import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Input, Button, Typography, Checkbox, Select, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

import UseApi from "../../Hooks/UseApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [OrgList, setOrgList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string().min(6, "At least 6 characters").required("Required"),
    tenant: Yup.object().nullable().required("Select an organisation"),
  });

  const { mutate: handleLogin, isPending } = UseApi({
    url: "auth/login",
    method: "POST",
    credentials: "include",
  });

  const {
    data: tenantData,
    isPending: isTenantLoading,
    refetch: fetchTenant,
  } = UseApi({
    url: "tenants/SearchTenants",
    method: "GET",
    queryKey: ["SearchKeyword", keyword],
    params: { SearchKeyword: keyword },
    enabled: false,
  });

  useEffect(() => {
    if (tenantData) setOrgList(tenantData);
  }, [tenantData]);

  const handleTenantSearch = (value) => {
    setKeyword(value);
    if (value.trim().length >= 1) fetchTenant();
  };

  const formik = useFormik({
    initialValues: {
      tenant: null,
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit:async (values) => {
    handleLogin(values, {
        onSuccess: (r) =>{
          console.log(r)
          dispatch(loginSuccess(r))
          navigate("/dashboard");},
      });
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched } =
    formik;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ---------- Left Panel (App Info / Illustration) ---------- */}
<div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-700 via-purple-800 to-blue-700 text-white p-12 relative overflow-hidden">
  {/* Overlay Glow Effects */}
  <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/40 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600/30 rounded-full blur-3xl"></div>

  <div className="max-w-md space-y-8 z-10">
    <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
      Welcome to NotesVerse 🚀
    </h2>

    <p className="text-white/80 text-base">
      Your all-in-one productivity hub — create, organize, and collaborate in a dark-neon universe built for focus and creativity.
    </p>

    {/* 🌟 Features */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-cyan-300">✨ Core Features</h3>
      <ul className="space-y-2 text-white/90 list-disc list-inside">
        <li>🧠 Smart notes with tag-based organization</li>
        <li>🌙 Custom themes — dark, neon, pastel & more</li>
        <li>⚡ Fast & secure authentication</li>
        <li>📁 Cloud sync for seamless access anywhere</li>
        <li>👥 Multi-tenant workspace support</li>
      </ul>
    </div>

    {/* 💬 Testimonials */}
    <div>
      <h3 className="text-lg font-semibold mb-3 text-purple-300">💬 What users say</h3>
      <div className="space-y-4">
        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
          <p className="text-sm italic">“NotesVerse completely changed how I organize my work — it’s minimal yet powerful.”</p>
          <p className="text-xs text-right mt-1 text-white/60">— Aanya, Product Designer</p>
        </div>
        <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md">
          <p className="text-sm italic">“The dark-neon theme is 🔥! It makes writing feel futuristic.”</p>
          <p className="text-xs text-right mt-1 text-white/60">— Rohan, Developer</p>
        </div>
      </div>
    </div>

  </div>

  {/* Subtle Background Pattern */}
  <div className="absolute inset-0 opacity-10 bg-[url('/grid-pattern.svg')] bg-contain bg-center" />
</div>


      {/* ---------- Right Panel (Login Form) ---------- */}
      <div className="flex justify-center items-center p-8 sm:p-12 bg-white dark:bg-gray-800">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Title level={3} className="text-gray-900 dark:text-gray-100">
              Log in to your Account
            </Title>
            <Text className="text-gray-500">Welcome back! Please enter your details.</Text>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="mb-4">
            <Select
              showSearch
              allowClear
              placeholder="Search Organisation"
              suffixIcon={<ApartmentOutlined />}
              value={values.tenant?.id}
              onSearch={handleTenantSearch}
              className="mb-2"
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
              <Text type="danger" className="text-sm">{errors.tenant}</Text>
            )}
</div>
            <Input
              prefix={<MailOutlined />}
              name="email"
              placeholder="Email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.email && errors.email && (
              <Text type="danger" className="text-sm">{errors.email}</Text>
            )}

            <Input.Password
              prefix={<LockOutlined />}
              name="password"
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {touched.password && errors.password && (
              <Text type="danger" className="text-sm">{errors.password}</Text>
            )}

            <div className="flex justify-between items-center text-sm">
              <Checkbox>Remember me</Checkbox>
              <Link to="/forgot-password" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={isPending}
              className="h-11 text-base font-medium"
            >
              {isPending ? "Logging in..." : "Log in"}
            </Button>
          </form>

          <p className="text-center mt-6 text-gray-600 dark:text-gray-300 text-sm">
            Don’t have an account?{" "}
            <Link to='/register' className="text-blue-600 hover:underline font-medium">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
