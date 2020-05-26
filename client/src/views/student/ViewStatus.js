import React, { useContext, useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import {
  CAlert,
  CCol,
  CSelect,
  CCardFooter,
  CButton,
  CCardHeader,
  CCardBody,
  CCard,
  CFormGroup,
  CLabel,
  CInput,
  CInvalidFeedback,
  CSpinner,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import "./ViewStatus.css";
import { AuthContext } from "src/context/auth-context";


const axios = require('axios');

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Required"),
  gender: Yup.string().required("Required"),
  xPercentage: Yup.number("Must be a number")
    .lessThan(100, "Please enter valid percentage!")
    .required("Required"),
  xiiPercentage: Yup.number("Must be a number")
    .lessThan(100, "Please enter valid percentage!")
    .required("Required"),
  degreePercentage: Yup.number("Must be a number")
    .required("Required")
    .lessThan(100, "Please enter valid percentage!"),
  etestP: Yup.number("Must be a number")
    .lessThan(100, "Please enter valid percentage")
    .required("Required"),
  mbaP: Yup.number("Must be a number")
    .lessThan(100, "Please enter valid percentage")
    .required("Required"),
  xiiBoard: Yup.string("Must be string").required("Required"),
  xBoard: Yup.string("Must be string").required("Required"),
  hscStream: Yup.string("Must be string").required("Required"),
  degreeT: Yup.string("Must be string").required("Required"),
  workex: Yup.string("Must be string").required("Required"),
  specialisation: Yup.string("Must be string").required("Required"),
  yearOfGrad: Yup.number("Must be a valid year").required("Required"),
});

const ViewStatus = () => {
  const auth = useContext(AuthContext);

  const [isLoading, setLoading] = useState(false);

  const [studentDetails, setStudentDetails] = useState({
    name: "",
    gender: "",
    xPercentage: "",
    xiiPercentage: "",
    degreePercentage: "",
    etestP: "",
    mbaP: "",
    xiiBoard: "",
    xBoard: "",
    specialisation: "",
    workex: "",
    hscStream: "",
    degreeT: "",
    yearOfGrad: "",
    placement_status: "",
  });

  const [errorOccured, setErrorOccured] = useState(false);

  useEffect(() => {
    (async () => {
      setErrorOccured(false);
      setLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/student/", {
          method: "GET",
          headers: {
            Authorization: "Bearer " + auth.token,
          },
        });

        let responseData;

        if (response.ok) {
          setLoading(false);
          responseData = await response.json();
          if (!!responseData.student) {
            setStudentDetails(responseData.student);
          }
        }
      } catch (err) {
        setLoading(false);
        setErrorOccured(true);
      }
    })();
  }, []);

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={studentDetails}
        validationSchema={SignupSchema}
        onSubmit={async (values, actions) => {
          // same shape as initial values
          setLoading(true);
          try {
            var data = JSON.stringify({"gender":values.gender,"xPercentage":values.xPercentage,"xiiPercentage":values.xiiPercentage,"degreePercentage":values.degreePercentage,"workex":values.workex,"etestP":values.etestP,"specialisation":values.specialisation,"mbaP":values.mbaP});

            var config = {
              method: 'post',
              url: 'http://localhost:7000/predict',
              headers: { 
                'Content-Type': 'application/json', 
                'Authorization': 'Basic Og=='
              },
              data : data
            };

            axios(config)
            .then(async function (res) {
              const placement_data = res.data;
              const response = await fetch("http://localhost:5000/api/student/", {
                method: "POST",
                body: JSON.stringify({
                  name: values.name,
                  gender: values.gender,
                  xPercentage: values.xPercentage,
                  xiiPercentage: values.xiiPercentage,
                  degreePercentage: values.degreePercentage,
                  etestP: values.etestP,
                  mbaP: values.mbaP,
                  xiiBoard: values.xiiBoard,
                  xBoard: values.xBoard,
                  specialisation: values.specialisation,
                  workex: values.workex,
                  hscStream: values.hscStream,
                  degreeT: values.degreeT,
                  yearOfGrad: values.yearOfGrad,
                  placement_status: placement_data
                }),
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + auth.token,
                },
              });
              
              if (response.ok) {
                setLoading(false);
                window.location.reload();
              }
            })
            .catch(function (error) {
              setLoading(false);
              console.log(error);
            });
            
          } catch (err) {
            actions.setSubmitting(false);
            setLoading(false);
            setErrorOccured(true);
          }
        }}
      >
        {({ errors, values, touched }) => (
          <div>
            {errorOccured && (
                <CAlert color="warning" closeButton>
                  Some error occurred, please try again!
                </CAlert>
              )}
            <CCard className="card-container">
              <CCardHeader style={{ fontWeight: "bold" }}>
                Check Placement Status
                {/* <small> validation feedback</small> */}
              </CCardHeader>
              <Form>
                <CCardBody>
                  {!!studentDetails.name &&
                    studentDetails.placement_status === "placed" && (
                      <CAlert name="status" color="success">
                        Placed
                      </CAlert>
                    )}
                  {!!studentDetails.name &&
                    studentDetails.placement_status === "unplaced" && (
                      <CAlert name="status" color="warning">
                        Unplaced
                      </CAlert>
                    )}
                  <CFormGroup row>
                    <CCol xs="12" xl="4">
                      <CLabel htmlFor="name">Name</CLabel>
                      <Field
                        name="name"
                        invalid={!!errors.name}
                        as={CInput}
                        value={values.name}
                        placeholder="John Doe"
                        disabled={!!studentDetails.name}
                      />
                      <CInvalidFeedback>
                        {!!errors.name && !!touched.name ? (
                          <div>{errors.name}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xs="12" xl="4">
                      <CLabel htmlFor="gender">Gender</CLabel>
                      <Field
                        id="select"
                        invalid={!!errors.gender && !!touched.gender}
                        name="gender"
                        as={CSelect}
                        disabled={!!studentDetails.gender}
                      >
                        <option value="">Select an option</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        {/* <option value="Others">Others</option> */}
                      </Field>
                      <CInvalidFeedback>
                        {errors.gender && touched.gender ? (
                          <div>{errors.gender}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xl="4">
                      <CLabel htmlFor="yearOfGrad">Graduation Year</CLabel>
                      <Field
                        id="select"
                        invalid={!!errors.yearOfGrad && !!touched.yearOfGrad}
                        name="yearOfGrad"
                        as={CSelect}
                        disabled={!!studentDetails.yearOfGrad}
                      >
                        <option value="">Select a year</option>
                        <option value="2020">2020</option>
                        <option value="2021">2021</option>
                        <option value="2022">2022</option>
                        <option value="2022">2023</option>
                        <option value="2023">2024</option>
                        <option value="2024">2025</option>
                        <option value="2025">2026</option>
                      </Field>
                      <CInvalidFeedback>
                        {errors.yearOfGrad && touched.yearOfGrad ? (
                          <div>{errors.yearOfGrad}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xl="6">
                      <CLabel htmlFor="xPercentage">Xth Percentage</CLabel>
                      <Field
                        name="xPercentage"
                        invalid={!!errors.xPercentage && !!touched.xPercentage}
                        as={CInput}
                        value={values.xPercentage}
                        placeholder="0-100"
                        disabled={!!studentDetails.xPercentage}
                      />
                      <CInvalidFeedback>
                        {errors.xPercentage && touched.xPercentage ? (
                          <div>{errors.xPercentage}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>

                    <CCol xl="6">
                      <CLabel htmlFor="xBoard">Xth Board</CLabel>
                      <Field
                        invalid={!!errors.xBoard && !!touched.xBoard}
                        name="xBoard"
                        as={CSelect}
                        disabled={!!studentDetails.xBoard}
                      >
                        <option value="">Select an option</option>
                        <option value="Central">Central</option>
                        <option value="Others">Others</option>
                      </Field>
                      <CInvalidFeedback>
                        {errors.xBoard && touched.xBoard ? (
                          <div>{errors.xBoard}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xl="4">
                      <CLabel htmlFor="xiiPercentage">XIIth Percentage</CLabel>
                      <Field
                        name="xiiPercentage"
                        invalid={
                          !!touched.xiiPercentage && !!errors.xiiPercentage
                        }
                        as={CInput}
                        value={values.xiiPercentage}
                        placeholder="0-100"
                        disabled={!!studentDetails.xiiPercentage}
                      />
                      <CInvalidFeedback>
                        {errors.xiiPercentage && touched.xiiPercentage ? (
                          <div>{errors.xiiPercentage}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xl="4">
                      <CLabel htmlFor="xiiBoard">XIIth Board</CLabel>
                      <Field
                        invalid={!!errors.xiiBoard && !!touched.xiiBoard}
                        name="xiiBoard"
                        as={CSelect}
                        disabled={!!studentDetails.xiiBoard}
                      >
                        <option value="">Select an option</option>
                        <option value="Central">Central</option>
                        <option value="Others">Others</option>
                      </Field>
                      <CInvalidFeedback>
                        {errors.xiiBoard && touched.xiiBoard ? (
                          <div>{errors.xiiBoard}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xl="4">
                      <CLabel htmlFor="hscStream">XIIth Stream</CLabel>
                      <Field
                        invalid={!!errors.hscStream && !!touched.hscStream}
                        name="hscStream"
                        as={CSelect}
                        disabled={!!studentDetails.hscStream}
                      >
                        <option value="">Select an option</option>
                        <option value="Science">Science</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                      </Field>
                      <CInvalidFeedback>
                        {errors.hscStream && touched.hscStream ? (
                          <div>{errors.hscStream}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xl="6">
                      <CLabel htmlFor="degreePercentage">
                        Enter Degree Percentage
                      </CLabel>
                      <Field
                        name="degreePercentage"
                        as={CInput}
                        invalid={
                          !!touched.degreePercentage &&
                          !!errors.degreePercentage
                        }
                        value={values.degreePercentage}
                        placeholder="0-100"
                        disabled={!!studentDetails.degreePercentage}
                      />
                      <CInvalidFeedback>
                        {errors.degreePercentage && touched.degreePercentage ? (
                          <div>{errors.degreePercentage}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xl="6">
                      <CLabel htmlFor="degreeT">Degree T</CLabel>
                      <Field
                        invalid={!!errors.degreeT && !!touched.degreeT}
                        name="degreeT"
                        as={CSelect}
                        disabled={!!studentDetails.degreeT}
                      >
                        <option value="">Select an option</option>
                        <option value="Science & Technology">
                          Science & Technology
                        </option>
                        <option value="Commerce & Mgmt">Commerce & Mgmt</option>
                        <option value="Others">Others</option>
                      </Field>
                      <CInvalidFeedback>
                        {errors.degreeT && touched.degreeT ? (
                          <div>{errors.degreeT}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xl="6">
                      <CLabel htmlFor="workex">Work Experience</CLabel>
                      <Field
                        invalid={!!errors.workex && !!touched.workex}
                        name="workex"
                        as={CSelect}
                        disabled={!!studentDetails.workex}
                      >
                        <option value="">Select an option</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </Field>
                      <CInvalidFeedback>
                        {errors.workex && touched.workex ? (
                          <div>{errors.workex}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xl="6">
                      <CLabel htmlFor="etestP">Enter ETest Percentage</CLabel>
                      <Field
                        name="etestP"
                        invalid={!!touched.etestP && !!errors.etestP}
                        as={CInput}
                        value={values.etestP}
                        placeholder="0-100"
                        disabled={!!studentDetails.etestP}
                      />
                      <CInvalidFeedback>
                        {errors.etestP && touched.etestP ? (
                          <div>{errors.etestP}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol xl="6">
                      <CLabel htmlFor="specialisation">Specialisation</CLabel>
                      <Field
                        invalid={
                          !!errors.specialisation && !!touched.specialisation
                        }
                        name="specialisation"
                        as={CSelect}
                        disabled={!!studentDetails.specialisation}
                      >
                        <option value="">Select an option</option>
                        <option value="Mkt&HR">Mkt&HR</option>
                        <option value="Mkt&Fin">Mkt&Fin</option>
                        <option value="Others">Others</option>
                      </Field>
                      <CInvalidFeedback>
                        {errors.specialisation && touched.specialisation ? (
                          <div>{errors.specialisation}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                    <CCol xl="6">
                      <CLabel htmlFor="mbaP">Enter MBA Percentage</CLabel>
                      <Field
                        name="mbaP"
                        invalid={!!touched.mbaP && !!errors.mbaP}
                        as={CInput}
                        value={values.mbaP}
                        placeholder="0-100"
                        disabled={!!studentDetails.mbaP}
                      />
                      <CInvalidFeedback>
                        {errors.mbaP && touched.mbaP ? (
                          <div>{errors.mbaP}</div>
                        ) : null}
                      </CInvalidFeedback>
                    </CCol>
                  </CFormGroup>
                </CCardBody>
                {!studentDetails.name && (
                  <CCardFooter>
                    {!isLoading && (
                      <CButton type="submit" size="sm" color="success">
                        <CIcon name="cil-scrubber" /> Submit
                      </CButton>
                    )}
                    {!isLoading && (
                      <CButton
                        type="reset"
                        size="sm"
                        color="danger"
                        className="ml-1"
                      >
                        <CIcon name="cil-ban" /> Reset
                      </CButton>
                    )}
                    {isLoading && <CSpinner color="info" />}
                  </CCardFooter>
                )}
              </Form>
            </CCard>
          </div>
        )}
      </Formik>
      <br />
      <br />
    </div>
  );
};

export default ViewStatus;
