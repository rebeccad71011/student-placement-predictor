import React, { lazy, useContext, useEffect, useState } from "react";
import { CRow, CCol, CWidgetBrand, CCard, CCardHeader } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { CChartDoughnut } from "@coreui/react-chartjs";
import { CWidgetProgressIcon } from "@coreui/react";
import { AuthContext } from "src/context/auth-context";
const ViewDashboard = () => {
  const auth = useContext(AuthContext);

  const [db_values, setDBValues] = useState({
    total_placed: 0,
    total_unplaced: 0,
    m_placed: 0,
    m_unplaced: 0,
    hr_placed: 0,
    hr_unplaced: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/tpo/view-dashboard",
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
          setDBValues(responseData);
        }
      } catch (err) {}
    })();
  }, []);

  return (
    <>
      <CRow>
        <CCol sm="6" lg="6">
          <CWidgetProgressIcon
            header={db_values.total_placed}
            text="Total Placed Students"
            color="gradient-success"
            value="100"
            inverse
          >
            <CIcon name="cil-userFollow" height="36" />
          </CWidgetProgressIcon>
        </CCol>

        <CCol sm="6" lg="6">
          <CWidgetProgressIcon
            header={db_values.total_unplaced}
            text="Total Unplaced Students"
            color="gradient-warning"
            value="100"
            inverse
          >
            <CIcon name="cil-basket" height="36" />
          </CWidgetProgressIcon>
        </CCol>
      </CRow>
      <CRow>
        <CCol>
          <CCard>
            <CCardHeader>Marketing and Finance</CCardHeader>
            <CChartDoughnut
              datasets={[
                {
                  backgroundColor: ["#41B883", "#E46651"],
                  data: [db_values.m_placed, db_values.m_unplaced],
                },
              ]}
              labels={["Placed", "Unplaced"]}
              options={{
                tooltips: {
                  enabled: true,
                },
              }}
            />
            <br />
            <CWidgetBrand
              rightHeader={db_values.m_placed}
              rightFooter="PLACED"
              leftHeader={db_values.m_unplaced}
              leftFooter="UNPLACED"
            ></CWidgetBrand>
          </CCard>
        </CCol>
        <CCol>
          <CCard>
            <CCardHeader>Marketing and HR</CCardHeader>
            <CChartDoughnut
              datasets={[
                {
                  backgroundColor: ["#41B883", "#E46651"],
                  data: [db_values.hr_placed, db_values.hr_unplaced],
                },
              ]}
              labels={["Placed", "Unplaced"]}
              options={{
                tooltips: {
                  enabled: true,
                },
              }}
            />
            <br />
            <CWidgetBrand
              rightHeader={db_values.hr_placed}
              rightFooter="PLACED"
              leftHeader={db_values.hr_unplaced}
              leftFooter="UNPLACED"
            ></CWidgetBrand>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default ViewDashboard;
