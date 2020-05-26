import React, { useContext } from "react";
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { AuthContext } from "../context/auth-context";
import { useHistory } from "react-router-dom";

const TheHeaderDropdown = () => {
  const authContext = useContext(AuthContext);

  const history = useHistory();

  return (
    <CDropdown inNav className="c-header-nav-items mx-2" direction="down">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
          className="c-avatar"
        >
          <div>
            <CIcon name="cil-user" />
          </div>
          <h5 className="ml-1" style={{ margin: "0", padding: "0" }}>
            {authContext.userRole}
          </h5>
        </div>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownItem
          onClick={() => {
            authContext.logout();
            history.push("/login");
          }}
        >
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default TheHeaderDropdown;
