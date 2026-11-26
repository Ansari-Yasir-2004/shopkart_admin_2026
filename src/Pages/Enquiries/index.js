import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import AddEnquiry from "./AddEnquiry";
import EnquiryDataTable from "./EnquiryDataTable";
import { FaPlus } from "react-icons/fa";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEnquiries, setShowEnquiries] = useState(false);
  const [updatedEnquiriesTable, setUpdatedEnquiriesTable] = useState("");

  const handleShowEnquiries = () => setShowEnquiries(true);
  const handleCloseEnquiries = () => setShowEnquiries(false);

  const getEnquiries = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllEnquiries");
      if (res.data.data && Array.isArray(res.data.data)) {
        setEnquiries(res.data.data);
      } else {
        setEnquiries([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEnquiries();
  }, [updatedEnquiriesTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Enquiries</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • Enquiry • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowEnquiries}>
          <FaPlus /> Add enquiry
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
        <EnquiryDataTable
          enquiries={enquiries}
          loading={loading}
          setUpdatedEnquiriesTable={setUpdatedEnquiriesTable}
        />

      </div>
      <AddEnquiry
        showEnquiries={showEnquiries}
        handleShowEnquiries={handleCloseEnquiries}
        handleCloseEnquiries={handleCloseEnquiries}
        setUpdatedEnquiriesTable={setUpdatedEnquiriesTable}
      />

    </div>
  );
};

export default Enquiries;
