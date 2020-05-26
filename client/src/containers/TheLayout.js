import React, { useContext } from "react";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";

import { AuthContext } from "../context/auth-context";


const TheLayout = () => {

  const auth = useContext(AuthContext);


  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
        <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default TheLayout;
