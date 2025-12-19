import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Input, Button, Typography, Checkbox, Select, message } from "antd";
import {
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";

import UseApi from "../../../Hooks/UseApi";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../../store/authSlice";
import { Building2, Bug, CheckCircle, Zap } from "lucide-react";
import CustomSelect from "../../../components/ui/Customselect";
import usePageTitle from "../../../Hooks/usePageTitle";

const { Title, Text } = Typography;

export default function Login() {
  usePageTitle("Login");
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

  const { mutate: fetchTenant, isPending: isTenantLoading, data: tenantData } = UseApi({
    url: "tenants/SearchTenants",
    method: "POST",
  });

  useEffect(() => {
    if (tenantData?.data) {
      setOrgList(tenantData.data);
    } else if (tenantData) {
      setOrgList(tenantData);
    } else {
      if (keyword.trim().length === 0) {
        setOrgList([]);
      }
    }
  }, [tenantData]);

  const handleTenantSearch = (value) => {
    setKeyword(value);
    if (value.trim().length >= 1) {
      fetchTenant({ SearchKeyword: value });
    } else {
      setOrgList([]);
    }
  };

  const formik = useFormik({
    initialValues: {
      tenant: null,
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      handleLogin(values, {
        onSuccess: (r) => {
          dispatch(loginSuccess(r))
          navigate("/issues");
        },
        onError: (e) => message.error(e.message || "Login failed")
      });
    },
  });

  const { values, handleChange, handleBlur, handleSubmit, setFieldValue, errors, touched } = formik;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen bg-gray-50 dark:bg-slate-950">
      {/* ---------- Left Panel (Branding) ---------- */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white p-12 relative overflow-hidden">
        {/* Abstract Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/20 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-md space-y-8 z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 backdrop-blur-sm">
              <Bug className="text-blue-400 w-8 h-8" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">BugTracker</span>
          </div>

          <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
            Build better software, together.
          </h2>

          <p className="text-slate-400 text-lg leading-relaxed">
            The issue tracking platform that gets out of your way. Organize projects, squash bugs, and ship features faster.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3 text-slate-300">
              <CheckCircle className="text-green-400 w-5 h-5" />
              <span>Agile Project Management</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Zap className="text-yellow-400 w-5 h-5" />
              <span>Real-time Kanban Boards</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Building2 className="text-purple-400 w-5 h-5" />
              <span>Enterprise Multi-tenancy</span>
            </div>
          </div>
        </div>
      </div>


      {/* ---------- Right Panel (Form) ---------- */}
      <div className="flex justify-center items-center p-8 sm:p-12 bg-white dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Title level={2} className="!mb-2 !text-slate-900 dark:!text-white">
              Welcome back
            </Title>
            <Text className="text-slate-500 dark:text-slate-400 text-base">
              Enter your details to access your workspace.
            </Text>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Workspace</label>
              <CustomSelect
                options={OrgList.map((org) => ({ label: org.name, value: org.id }))}
                value={values.tenant}
                onChange={(option) => setFieldValue("tenant", option)}
                onSearch={handleTenantSearch}
                isLoading={isTenantLoading}
                icon={Building2}
                placeholder="Search your organization..."
                allowClear={true}
              />
              {touched.tenant && errors.tenant && (
                <Text type="danger" className="text-xs mt-1 block">{errors.tenant}</Text>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <Input
                prefix={<MailOutlined className="text-slate-400" />}
                name="email"
                size="large"
                placeholder="name@company.com"
                className="rounded-lg py-2.5"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                status={touched.email && errors.email ? "error" : ""}
              />
              {touched.email && errors.email && (
                <Text type="danger" className="text-xs mt-1 block">{errors.email}</Text>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <Input.Password
                prefix={<LockOutlined className="text-slate-400" />}
                name="password"
                size="large"
                placeholder="••••••••"
                className="rounded-lg py-2.5"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                status={touched.password && errors.password ? "error" : ""}
              />
              {touched.password && errors.password && (
                <Text type="danger" className="text-xs mt-1 block">{errors.password}</Text>
              )}
            </div>

            <div className="flex justify-between items-center">
              <Checkbox className="text-slate-600 dark:text-slate-400">Remember me</Checkbox>
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                Forgot password?
              </Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isPending}
              className="h-12 text-base font-semibold rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-0 shadow-lg shadow-blue-500/20"
            >
              Log in
            </Button>
          </form>

          <p className="text-center text-slate-600 dark:text-slate-400">
            Don’t have an account?{" "}
            <Link to='/register' className="font-semibold text-blue-600 hover:text-blue-500 transition-colors">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
