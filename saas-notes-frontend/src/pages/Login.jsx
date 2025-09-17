import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router"
import { UseApi } from "../Hooks/UseApi"

export default function Login() {
  const navigate = useNavigate()

  // 🔹 Validation schema
  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Must be at least 6 characters")
      .required("Required"),
  })

  const { mutate: handleLogin, isPending } = UseApi({
    url: "login",
    method: "POST",
  })

  const onLoginSubmit = (values, { setSubmitting, setErrors }) => {
    handleLogin(values, {
      onSuccess: () => {
        // You might want to handle storing the token here, e.g., in localStorage or Redux
        navigate("/dashboard")
      },
      onError: (error) => {
        setErrors({
          email: error.message || "Invalid credentials or server error",
        })
      },
      onSettled: () => {
        setSubmitting(false)
      },
    })
  }
  cosnt fetcTenant=()=>{
        const data = UseApi({
    url: "users",
    method: "GET",
    queryKey: ["users"],
  });
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-96 p-6 bg-card rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6 text-center">Login</h2>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={onLoginSubmit}
        >
          {() => (
            <Form className="space-y-4">
              {/* Email */}
              <div>
                <Field
                  as={"input"}
                  type="email"
                  name="email"
                  placeholder="Email"
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
                  as={"input"}
                  type="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button type="submit" className="w-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Login"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
