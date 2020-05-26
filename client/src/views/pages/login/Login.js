import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CSpinner
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import { AuthContext } from "../../../context/auth-context";

const validationSchema = Yup.object({
  username: Yup.string().required("Username Required!"),
  password: Yup.string().required("Password required!"),
});

const Login = () => {
  const authContext = useContext(AuthContext);

  const history = useHistory();

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (authContext.isLoggedIn) {
      if (authContext.userRole === "student") {
        history.push("/student/view-status");
      } else if (authContext.userRole === "tpo") {
        history.push("/tpo/view-dashboard");
      } else {
        history.push("/admin/view-users");
      }
    }
  }, []);

  const { handleSubmit, handleChange, values, errors, touched } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    async onSubmit(values, actions) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/login", {
          method: "POST",
          body: JSON.stringify({
            username: values.username,
            password: values.password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          authContext.login(
            responseData.userId,
            responseData.token,
            responseData.role,
            null
          );
          if (responseData.role === "student") {
            history.push("/student/view-status");
          } else if (responseData.role === "tpo") {
            history.push("/tpo/view-dashboard");
          } else {
            history.push("/admin/view-users");
          }
        } else {
          actions.setSubmitting(false);
          setLoading(false);
          actions.setErrors({ username: "Invalid username or password.", password: "Invalid username or password." });
        }
      } catch (err) {
        actions.setSubmitting(false);
        setLoading(false);
        actions.setErrors({ username: err.message, password: err.message });
      }
    },
  });

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="8">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit}>
                    <h1>Login</h1>
                    <p className="text-muted">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="username"
                        invalid={errors.username}
                        type="text"
                        placeholder="Username"
                        autoComplete="username"
                        value={values.username}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    {errors.username ? (
                      <p style={{ color: "red" }}>{errors.username}</p>
                    ) : null}
                    <CInputGroup className="mb-4">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-lock-locked" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput
                        name="password"
                        invalid={errors.password && touched.password}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={values.password}
                        onChange={handleChange}
                      />
                    </CInputGroup>
                    {errors.password && touched.password ? (
                      <p style={{ color: "red" }}>{errors.password}</p>
                    ) : null}
                    <CRow>
                      <CCol xs="6">
                        {!isLoading && <CButton color="primary" type="submit" className="px-4">
                          Login
                        </CButton>}
                        {isLoading && <CSpinner color="info" />}
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard
                className="text-white bg-primary py-5 d-md-down-none"
                style={{ width: "44%" }}
              >
                <CCardBody className="text-center">
                  <div>
                    <h2>Placement Predictor</h2>
                    <p>
                      Tracking the porbability of your placements made easier
                      than ever.
                    </p>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;
