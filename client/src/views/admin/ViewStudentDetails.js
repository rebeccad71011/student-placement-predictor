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
  CFormGroup,
} from "@coreui/react";
import { AuthContext } from "src/context/auth-context";
import { Formik, Form, Field } from "formik";

const ViewStudentDetails = () => {
  const auth = useContext(AuthContext);
  const [db_values, setDBValues] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/admin/studentdetails",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + auth.token,
            },
          }
        );

        let responseData;
        if (response.ok) {
          responseData = await response.json();
        }

        if (responseData) {
          setDBValues(responseData);
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
    // { key: "_id", _style: { width: "20%" } },

    { key: "name", _style: { width: "40%" } },
    { key: "userId", _style: { width: "20%" } },
    { key: "placement_status", _style: { width: "20%" } },
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
    <CDataTable
      items={db_values.studentdetails}
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
            <CBadge color={getBadge(item.placement_status)}>
              {item.placement_status}
            </CBadge>
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
          // console.log(item);
          return (
            <CCollapse show={details.includes(index)}>
              <CCardBody>
                <Formik
                  initialValues={{
                    name: item.name,
                    gender: item.gender,
                    placement_status: item.placement_status,
                    yearOfGrad: item.yearOfGrad,
                    xBoard: item.xBoard,
                    xPercentage: item.xPercentage,
                    xiiPercentage: item.xiiPercentage,
                    xiiBoard: item.xiiBoard,
                    hscStream: item.hscStream,
                    etestP: item.etestP,
                    degreeT: item.degreeT,
                    degreePercentage: item.degreePercentage,
                    specialisation: item.specialisation,
                    mbaP: item.mbaP,
                    workex: item.workex,
                  }}
                  onSubmit={async (values) => {
                    try {
                      const response = await fetch(
                        "http://localhost:5000/api/admin/studentdetails/update/" +
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
                        alert("Updated successfully!");
                      }
                      // window.location.reload();
                    } catch (err) {}
                  }}
                >
                  <Form>
                    <CFormGroup row>
                      <CCol xl="4">
                        <CLabel htmlFor="name">Name</CLabel>
                        <Field name="name" as={CInput}></Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="gender">Gender</CLabel>
                        <Field name="gender" as={CSelect}>
                          {/* <option value="">Select a role</option> */}
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="placement_status">
                          Placement Status
                        </CLabel>
                        <Field name="placement_status" as={CSelect}>
                          <option value="placed">Placed</option>
                          <option value="unplaced">Unplaced</option>
                        </Field>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xl="4">
                        <CLabel htmlFor="yearOfGrad">Graduation Year</CLabel>
                        <Field name="yearOfGrad" as={CSelect}>
                          {/* <option value="">Select a year</option> */}
                          <option value="2020">2020</option>
                          <option value="2021">2021</option>
                          <option value="2022">2022</option>
                          <option value="2022">2023</option>
                          <option value="2023">2024</option>
                          <option value="2024">2025</option>
                          <option value="2025">2026</option>
                        </Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="xBoard">Xth Board</CLabel>
                        <Field name="xBoard" as={CSelect}>
                          <option value="">Select an option</option>
                          <option value="Central">Central</option>
                          <option value="Others">Others</option>
                        </Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="xPercentage">Xth Percentage</CLabel>
                        <Field name="xPercentage" as={CInput}></Field>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xl="4">
                        <CLabel htmlFor="xiiBoard">XIIth Board</CLabel>
                        <Field name="xiiBoard" as={CSelect}>
                          {/* <option value="">Select an option</option> */}
                          <option value="Central">Central</option>
                          <option value="Others">Others</option>
                        </Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="xiiPercentage">
                          XIIth Percentage
                        </CLabel>
                        <Field name="xiiPercentage" as={CInput}></Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="hscStream">XIIth Stream</CLabel>
                        <Field name="hscStream" as={CSelect}>
                          {/* <option value="">Select an option</option> */}
                          <option value="Science">Science</option>
                          <option value="Commerce">Commerce</option>
                          <option value="Arts">Arts</option>
                        </Field>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xl="4">
                        <CLabel htmlFor="degreeT">DegreeT</CLabel>
                        <Field name="degreeT" as={CSelect}>
                          {/* <option value="">Select an option</option> */}
                          <option value="Science & Technology">
                            Science & Technology
                          </option>
                          <option value="Commerce & Mgmt">
                            Commerce & Mgmt
                          </option>
                          <option value="Others">Others</option>
                        </Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="etestP">EtestP</CLabel>
                        <Field name="etestP" as={CInput}></Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="degreePercentage">
                          Degree Percentage
                        </CLabel>
                        <Field name="degreePercentage" as={CInput}></Field>
                      </CCol>
                    </CFormGroup>
                    <CFormGroup row>
                      <CCol xl="4">
                        <CLabel htmlFor="specialisation">
                          MBA specialisation
                        </CLabel>
                        <Field name="specialisation" as={CSelect}>
                          <option value="Mkt&HR">Mkt&HR</option>
                          <option value="Mkt&Fin">Mkt&Fin</option>
                          <option value="Others">Others</option>
                        </Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="mbaP">MBA Percentage</CLabel>
                        <Field name="mbaP" as={CInput}></Field>
                      </CCol>
                      <CCol xl="4">
                        <CLabel htmlFor="workex">Work Experience</CLabel>
                        <Field name="workex" as={CSelect}>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
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
                            "Are you sure you want to delete the student details?"
                          )
                        ) {
                          try {
                            const response = await fetch(
                              "http://localhost:5000/api/admin/studentdetails/delete/" +
                                item._id,
                              {
                                method: "DELETE",
                                headers: {
                                  "Content-Type": "application/json",
                                  Authorization: "Bearer " + auth.token,
                                },
                              }
                            );

                            let responseData;
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
  );
};

export default ViewStudentDetails;
