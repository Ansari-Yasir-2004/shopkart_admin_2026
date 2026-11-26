// import React, { useEffect, useState } from "react";
// import axiosInstance from "../../axios";
// import { Button } from "react-bootstrap";
// import AddUser from "./AddUser";
// import UserDataTable from "./UserDataTable";

// const Users = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [showUsers, setShowUsers] = useState(false);
//   const [updatedUsersTable, setUpdatedUsersTable] = useState("");

//   const handleShowUsers = () => setShowUsers(true);
//   const handleCloseUsers = () => setShowUsers(false);

//   const getUsers = async () => {
//     setLoading(true);
//     try {
//       const res = await axiosInstance.get("getAllUsers");
//       if (res.data.data && Array.isArray(res.data.data)) {
//         setUsers(res.data.data);
//       }
//       console.log(res.data.data);
//     } catch (error) {
//       console.log(error);
//     }
//     setLoading(false);
//   };
//   useEffect(() => {
//     getUsers();
//   }, [updatedUsersTable]);

//   return (
//     <div>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <h3 className="m-0">Users</h3>

//         <Button
//           label="Add Category"
//           icon="pi pi-plus"
//           className="p-button-sm User-add-btn"
//           onClick={handleShowUsers}
//         >
//           Add
//         </Button>
//       </div>
//       <UserDataTable
//         users={users}
//         loading={loading}
//         setUpdatedUsersTable={setUpdatedUsersTable}
//       />

//       <AddUser
//         showUsers={showUsers}
//         handleShowUsers={handleCloseUsers}
//         handleCloseUsers={handleCloseUsers}
//         setUpdatedUsersTable={setUpdatedUsersTable}
//       />
//     </div>
//   );
// };

// export default Users;


import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import UserDataTable from "./UserDataTable";
import AddUser from "./AddUser";
import { FaPlus } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [updatedUsersTable, setUpdatedUsersTable] = useState("");

  const handleShowUsers = () => setShowUsers(true);
  const handleCloseUsers = () => setShowUsers(false);

  const getUsers = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllUsers");
      if (res.data.data && Array.isArray(res.data.data)) {
        setUsers(res.data.data);
      } else {
        setUsers([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getUsers();
  }, [updatedUsersTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Users</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • User • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowUsers}>
          <FaPlus /> Add User
        </Button>
      </div>

      {/* Table Card */}
      <div className="table-card">

        {/* Toolbar */}
        {/* <div className="table-toolbar">

          <div className="toolbar-left">
            <select className="select-input">
              <option>Stock</option>
            </select>

            <select className="select-input">
              <option>Publish</option>
            </select>

            <div className="search-input">
              <i className="pi pi-search"></i>
              <input placeholder="Search..." />
            </div>
          </div>

          <div className="toolbar-right">
            <span>Columns</span>
            <span>Filters</span>
            <span>Export</span>
            <span>Settings</span>
          </div>

        </div> */}

        {/* Table */}
        <UserDataTable
          users={users}
          loading={loading}
          setUpdatedUsersTable={setUpdatedUsersTable}
        />

      </div>
      <AddUser
        showUsers={showUsers}
        handleShowUsers={handleCloseUsers}
        handleCloseUsers={handleCloseUsers}
        setUpdatedUsersTable={setUpdatedUsersTable}
      />

    </div>
  );
};

export default Users;
