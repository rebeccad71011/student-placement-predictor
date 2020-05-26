import React from "react";

const ViewStatus = React.lazy(() => import("./views/student/ViewStatus"));

const ViewDashboard = React.lazy(() => import("./views/tpo/ViewDashboard"));
const ViewStudents = React.lazy(() => import("./views/tpo/ViewStudents"));

const ViewUsers = React.lazy(() => import("./views/admin/ViewUsers"));
const ViewStudentDetails = React.lazy(() =>
  import("./views/admin/ViewStudentDetails")
);

const routes = [
  { path: "/", exact: true, name: "Home" },
  { path: "/student", name: "Student", component: ViewStatus, exact: true },
  { path: "/student/view-status", name: "View Status", component: ViewStatus },
  {
    path: "/tpo",
    component: ViewDashboard,
    exact: true,
  },
  {
    path: "/tpo/view-dashboard",
    name: "View Dashboard",
    component: ViewDashboard,
  },
  {
    path: "/tpo/view-students",
    name: "View Students",
    component: ViewStudents,
  },
  {
    path: "/admin",
    component: ViewUsers,
    exact: true,
  },
  {
    path: "/admin/view-users",
    name: "View Users",
    component: ViewUsers,
  },
  {
    path: "/admin/view-student-details",
    name: "View Student Details",
    component: ViewStudentDetails,
  },
];

export default routes;
