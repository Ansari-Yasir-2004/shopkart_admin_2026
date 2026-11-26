import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import AddContactUs from "./AddContactUs";
import ContactUsDataTable from "./ContactUsDataTable";
import { FaPlus } from "react-icons/fa";

const ContactUs = () => {
  const [contactUs, setContactUs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [updatedContactUsTable, setUpdatedContactUsTable] = useState("");

  const handleShowContactUs = () => setShowContactUs(true);
  const handleCloseContactUs = () => setShowContactUs(false);

  const getContactUs = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllContactUs");
      if (res.data.data && Array.isArray(res.data.data)) {
        setContactUs(res.data.data);
      } else {
        setContactUs([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getContactUs();
  }, [updatedContactUsTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Contact Us</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • Contact Us • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowContactUs}>
          <FaPlus /> Add contact us
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
        <ContactUsDataTable
          contactUs={contactUs}
          loading={loading}
          setUpdatedContactUsTable={setUpdatedContactUsTable}
        />

      </div>
      <AddContactUs
        showContactUs={showContactUs}
        handleShowContactUs={handleCloseContactUs}
        handleCloseContactUs={handleCloseContactUs}
        setUpdatedContactUsTable={setUpdatedContactUsTable}
      />

    </div>
  );
};

export default ContactUs;
