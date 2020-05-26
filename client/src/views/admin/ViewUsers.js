import React, { useState, useContext, useEffect } from "react";
import {
  CLabel,
  CCol,
  CSelect,
  CInput,
  CDataTable,
  CBadge,
  CButton,
  CCollapse,
  CCardBody,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CForm,
  CFormGroup,
  CTooltip,
} from "@coreui/react";

import { CIcon } from "@coreui/icons-react";

import { AuthContext } from "src/context/auth-context";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const ViewUsers = () => {
  //Add modal
  const [modal, setModal] = useState(false);
  const toggle = () => {
    setModal(!modal);
  };

  const auth = useContext(AuthContext);
  const [db_values, setDBValues] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth.token,
          },
        });

        let responseData;
        if (response.ok) {
          responseData = await response.json();
        }

        if (responseData) {
          setDBValues(responseData.users);
        }
      } catch (err) {}
    })();
  }, []);

  const [details, setDetails] = useState([]);
  // const [items, setItems] = useState(usersData)

  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  const fields = [
    { key: "username", _style: { width: "40%" } },
    { key: "password", _style: { width: "20%" } },
    { key: "role", _style: { width: "20%" } },
    {
      key: "show_details",
      label: "",
      _style: { width: "1%" },
      sorter: false,
      filter: false,
    },
  ];

  const getBadge = (placement_status) => {
    switch (placement_status) {
      case "placed":
        return "success";
      case "unplaced":
        return "danger";
      default:
        return "primary";
    }
  };

  return (
    <>
      <CButton
        className="float-right ml-4"
        shape="pill"
        color="info"
        onClick={toggle}
      >
        Add User
      </CButton>
      <CModal show={modal} onClose={toggle}>
        <Formik
          initialValues={{ username: "", password: "", role: "" }}
          onSubmit={async (values) => {
            try {
              const response = await fetch(
                "http://localhost:5000/api/admin/users/new",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + auth.token,
                  },
                  body: JSON.stringify(values),
                }
              );

              let responseData;
              if (response.ok) {
                alert("User Added Successfully!");
              }
              window.location.reload();
            } catch (err) {}
          }}
        >
          <Form>
            <CModalHeader closeButton>Enter details of new user</CModalHeader>

            <CModalBody>
              <CFormGroup>
                <Field
                  as={CInput}
                  type="string"
                  placeholder="Username"
                  name="username"
                />
                <br />
                <Field
                  as={CInput}
                  type="password"
                  placeholder="Password"
                  name="password"
                />
                <br />
                <Field
                  as={CSelect}
                  type="string"
                  placeholder="Role"
                  name="role"
                >
                  <option value="">Select a role</option>
                  <option value="student">Student</option>
                  <option value="tpo">TPO</option>
                  <option value="admin">Admin</option>
                </Field>
              </CFormGroup>
            </CModalBody>
            <CModalFooter>
              <CButton color="primary" type="submit">
                Add
              </CButton>{" "}
              <CButton color="secondary" onClick={toggle}>
                Cancel
              </CButton>
            </CModalFooter>
          </Form>
        </Formik>
      </CModal>
      <CDataTable
        items={db_values}
        fields={fields}
        columnFilter
        tableFilter
        footer
        itemsPerPageSelect
        itemsPerPage={5}
        hover
        sorter
        pagination
        scopedSlots={{
          status: (item) => (
            <td>
              <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
            </td>
          ),
          show_details: (item, index) => {
            return (
              <td className="py-2">
                <CButton
                  color="primary"
                  variant="outline"
                  shape="square"
                  size="sm"
                  onClick={() => {
                    toggleDetails(index);
                  }}
                >
                  {details.includes(index) ? "Cancel" : "Show"}
                </CButton>
              </td>
            );
          },
          details: (item, index) => {
            return (
              <CCollapse show={details.includes(index)}>
                <CCardBody>
                  <Formik
                    enableReinitialize={true}
                    initialValues={{
                      username: item.username,
                      password: "",
                      role: item.role,
                    }}
                    onSubmit={async (values) => {
                      try {
                        const response = await fetch(
                          "http://localhost:5000/api/admin/users/update/" +
                            item._id,
                          {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                              Authorization: "Bearer " + auth.token,
                            },
                            body: JSON.stringify(values),
                          }
                        );

                        let responseData;
                        if (response.ok) {
                          alert("User Updated Successfully!");
                        }
                        window.location.reload();
                      } catch (err) {}
                    }}
                  >
                    <Form>
                      <CFormGroup row>
                        <CCol xs="12" xl="6">
                          <CLabel htmlFor="username">Username</CLabel>
                          <Field name="username" as={CInput} key={item._id +'_username'}></Field>
                        </CCol>
                        <CCol xs="12" xl="6">
                          <CLabel htmlFor="password">
                            Password{" "}
                            <CTooltip content="Only enter text, if you want to update password. Else, please leave blank.">
                              <CIcon name={"cilLightbulb"} />
                            </CTooltip>
                          </CLabel>
                          <Field name="password" as={CInput}  key={item._id +'_password'}></Field>
                        </CCol>
                      </CFormGroup>
                      <CFormGroup row>
                        <CCol xs="12" xl="6">
                          <CLabel htmlFor="role">Role</CLabel>
                          <Field
                            as={CSelect}
                            type="string"
                            placeholder="Role"
                            name="role"
                            key={item._id+'_role'}
                          >
                            <option value="">Select a role</option>
                            <option value="student">Student</option>
                            <option value="tpo">TPO</option>
                            <option value="admin">Admin</option>
                          </Field>
                        </CCol>
                      </CFormGroup>

                      <CButton type="submit" size="sm" color="info">
                        Update
                      </CButton>
                      <CButton
                        size="sm"
                        color="danger"
                        className="ml-1"
                        onClick={async () => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this user?"
                            )
                          ) {
                            try {
                              const response = await fetch(
                                "http://localhost:5000/api/admin/users/delete/" +
                                  item._id,
                                {
                                  method: "DELETE",
                                  headers: {
                                    "Content-Type": "application/json",
                                    Authorization: "Bearer " + auth.token,
                                  },
                                }
                              );

                              if (response.ok) {
                                alert("Delete successful!");
                              }
                              window.location.reload();
                            } catch (err) {}
                          }
                        }}
                      >
                        Delete
                      </CButton>
                    </Form>
                  </Formik>
                </CCardBody>
              </CCollapse>
            );
          },
        }}
      />
    </>
  );
};

export default ViewUsers;
