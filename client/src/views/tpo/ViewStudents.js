import React, { useState, useContext, useEffect } from "react";
import {
  CDataTable,
  CBadge,
  CButton,
  CCollapse,
  CCardBody,
  CRow,
  CCol,
} from "@coreui/react";
import { AuthContext } from "src/context/auth-context";

const ViewStudents = () => {
  const auth = useContext(AuthContext);
  const [db_values, setDBValues] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tpo/view-students",
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
    { key: "name", _style: { width: "40%" } },
    "mbaP",
    { key: "specialisation", _style: { width: "20%" } },
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
      items={db_values.students}
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
                {details.includes(index) ? "Hide" : "Show"}
              </CButton>
            </td>
          );
        },
        details: (item, index) => {
          return (
            <CCollapse show={details.includes(index)}>
              <CCardBody>
                <CRow>
                  <CCol xl="4">
                    <p>
                      <span style={{ fontWeight: "bold" }}>Gender: </span>
                      {item.gender}
                    </p>
                  </CCol>
                  <CCol xl="4">
                    <p>
                      <span style={{ fontWeight: "bold" }}>Passing Year: </span>
                      {item.yearOfGrad}
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl="4">
                    <p>
                      <span style={{ fontWeight: "bold" }}>Xth Board: </span>
                      {item.xBoard}
                    </p>
                  </CCol>
                  <CCol xl="4">
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        Xth Percentage:{" "}
                      </span>
                      {item.xPercentage}
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>XIIth Board: </span>
                      {item.xiiBoard}
                    </p>
                  </CCol>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>XIIth Stream: </span>
                      {item.hscStream}
                    </p>
                  </CCol>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        XIIth Percentage:{" "}
                      </span>
                      {item.xiiPercentage}
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>Degree T: </span>
                      {item.degreeT}
                    </p>
                  </CCol>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        ETest Percentage:{" "}
                      </span>
                      {item.etestP}
                    </p>
                  </CCol>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        Degree Percentage:{" "}
                      </span>
                      {item.degreePercentage}
                    </p>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        MBA Specialisation:{" "}
                      </span>
                      {item.specialisation}
                    </p>
                  </CCol>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        MBA Percentage:{" "}
                      </span>
                      {item.mbaP}
                    </p>
                  </CCol>
                  <CCol>
                    <p>
                      <span style={{ fontWeight: "bold" }}>
                        Work Experience:{" "}
                      </span>
                      {item.workex}
                    </p>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCollapse>
          );
        },
      }}
    />
  );
};

export default ViewStudents;
