import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import UpdateAppBanner from "./UpdateAppBanner";
import StatusToggle from "../../Components/StatusToggle";
import {
  FaEdit,
  // FaEye,
  FaTrash
}
  from "react-icons/fa";
import SimpleImageCell from "../../Components/SimpleImageCell";
import moment from "moment";

const AppBannerDataTable = ({
  appBanner,
  loading,
  setUpdatedAppBannerTable,
}) => {
  const columns = [
    { field: "id", header: "ID" },
    {
      field: "url",
      header: "Image",
      body: (rowData) => (
        <SimpleImageCell
          id={rowData.id}
          endpoint={"getAppBannerImageById"}
          refreshImage={rowData.url}
        />
      ),
    },
    { field: "title", header: "Title" },
    {
      field: "description",
      header: "Description",
      style: { minWidth: "150px", textWrap: "wrap" }
    },
    { field: "position", header: "Position" },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <StatusToggle
          rowData={rowData}
          idField="id"
          statusField="status"
          endpoint={"updateAppBannersStatusById"}
          setUpdatedTable={setUpdatedAppBannerTable}
        />
      ),
    },
    {
      field: "created_at", header: "Created at",
      body: (rowData) => (
        <div>
          {moment(rowData.created_at).format("DD MMM YYYY")}
          <br />
          <small>
            {moment(rowData.created_at).format("hh:mm A")}
          </small>
        </div>
      )
    },
    {
      field: "updated_at", header: "Updated at",
      body: (rowData) => (
        <div>
          {moment(rowData.updated_at).format("DD MMM YYYY")}
          <br />
          <small>
            {moment(rowData.updated_at).format("hh:mm A")}
          </small>
        </div>
      )
    },
    {
      header: "Actions",
      body: (rowData) => (
        <div className="action-group">

          {/* View */}
          {/* <button
                        className="action-btn"
                        onClick={() => console.log("view", rowData)}
                      >
                        <FaEye />
                        <span>View</span>
                      </button> */}

          {/* Edit */}
          <button
            className="action-btn warning"
            onClick={() => handleEdit(rowData)}
          >
            <FaEdit />
            {/* <span>Edit</span> */}
          </button>

          {/* Delete */}
          <button
            className="action-btn danger"
            onClick={() => handleDelete(rowData)}
          >
            <FaTrash />
            {/* <span>Delete</span> */}
          </button>

        </div>
      ),
    }
  ];

  const [tableRowData, setTableRowData] = useState([]);

  // -------------------- Update Modal States ------------------
  const [showAppBanner, setShowAppBanner] = useState(false);

  const handleCloseAppBanner = () => setShowAppBanner(false);
  const handleShowAppBanner = () => setShowAppBanner(true);

  const handleEdit = (row) => {
    console.log("Edit", row);
    handleShowAppBanner();
    setTableRowData(row);
  };

  const handleDelete = async (row) => {
    console.log("DELETE ", row);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This app banner will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `deleteAppBannersById/${row.id}`,
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedAppBannerTable(res?.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Delete App Banner Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  };

  return (
    <>
      <DynamicTable data={appBanner} columns={columns} loading={loading} />
      <UpdateAppBanner
        showAppBanner={showAppBanner}
        handleCloseAppBanner={handleCloseAppBanner}
        handleShowAppBanner={handleCloseAppBanner}
        setUpdatedAppBannerTable={setUpdatedAppBannerTable}
        tableRowData={tableRowData}
      />
    </>
  );
};

export default AppBannerDataTable;
