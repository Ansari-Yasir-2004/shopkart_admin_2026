import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import AddAppBanner from "./AddAppBanner";
import AppBannerDataTable from "./AppBannerDataTable";
import { FaPlus } from "react-icons/fa";

const AppBanner = () => {
  const [appBanner, setAppBanner] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAppBanner, setShowAppBanner] = useState(false);
  const [updatedAppBannerTable, setUpdatedAppBannerTable] = useState("");

  const handleShowAppBanner = () => setShowAppBanner(true);
  const handleCloseAppBanner = () => setShowAppBanner(false);

  const getAppBanner = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllAppBanners");
      if (res.data.data && Array.isArray(res.data.data)) {
        setAppBanner(res.data.data);
      } else {
        setAppBanner([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAppBanner();
  }, [updatedAppBannerTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">App Banners</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • AppBanner • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowAppBanner}>
          <FaPlus /> Add app banner
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
        <AppBannerDataTable
          appBanner={appBanner}
          loading={loading}
          setUpdatedAppBannerTable={setUpdatedAppBannerTable}
        />

      </div>
      <AddAppBanner
        showAppBanner={showAppBanner}
        handleShowAppBanner={handleCloseAppBanner}
        handleCloseAppBanner={handleCloseAppBanner}
        setUpdatedAppBannerTable={setUpdatedAppBannerTable}
      />

    </div>
  );
};

export default AppBanner;
