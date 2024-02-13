import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
} from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state/authSlice.js";

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "AdminPassword123!";

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("invalid email")
    .required("required")
    .test("is-admin-email", "Invalid email", (value) => value === ADMIN_EMAIL),
  password: yup
    .string()
    .required("required")
    .test(
      "is-admin-password",
      "Invalid password",
      (value) => value === ADMIN_PASSWORD
    ),
});

const initialValuesLogin = {
  email: "",
  password: "",
};

const AdminLoginForm = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");

  const login = async (values, onSubmitProps) => {
    onSubmitProps.resetForm();

    // Dispatch a login action and navigate to the admin dashboard
    dispatch(
      setLogin({
        user: { id: 1, email: ADMIN_EMAIL, role: "admin" },
        token: "dummy_token",
      })
    );

    // Navigate to the admin dashboard
    navigate("/admin-dashboard");
  };

  return (
    <Formik
      onSubmit={login}
      initialValues={initialValuesLogin}
      validationSchema={loginSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        resetForm,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Password"
              type="password"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: "span 4" }}
            />
          </Box>

          {/* BUTTONS */}
          <Box>
            <Button
              fullWidth
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              LOGIN
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default AdminLoginForm;
