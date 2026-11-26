import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import AdminDataTable from "./AdminDataTable";
import AddAdmin from "./AddAdmin";
import { FaPlus } from "react-icons/fa";

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [updatedAdminsTable, setUpdatedAdminsTable] = useState("");

  const handleShowAdmins = () => setShowAdmins(true);
  const handleCloseAdmins = () => setShowAdmins(false);

  const getAdmins = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllAdmins");
      if (res.data.data && Array.isArray(res.data.data)) {
        setAdmins(res.data.data);
      } else {
        setAdmins([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAdmins();
  }, [updatedAdminsTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Admins</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • Admin • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowAdmins}>
          <FaPlus /> Add Admin
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
        <AdminDataTable
          admins={admins}
          loading={loading}
          setUpdatedAdminsTable={setUpdatedAdminsTable}
        />

      </div>
      <AddAdmin
        showAdmins={showAdmins}
        handleShowAdmins={handleCloseAdmins}
        handleCloseAdmins={handleCloseAdmins}
        setUpdatedAdminsTable={setUpdatedAdminsTable}
      />

    </div>
  );
};

export default Admins;
