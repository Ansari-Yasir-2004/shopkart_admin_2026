import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import UpdateAdmin from "./UpdateAdmin";
import { FaEdit, FaTrash } from "react-icons/fa";
import { ImBlocked } from "react-icons/im";

const AdminDataTable = ({ admins, loading, setUpdatedAdminsTable }) => {
  const columns = [
    { field: "id", header: "ID" },
    {
      field: "name",
      header: "Name",
      body: (rowData) => (
        <div className="name-cell">{rowData.name}</div>
      ),
    },
    { field: "email", header: "Email" },
    { field: "number", header: "Number" },
    {
      field: "address",
      header: "Address",
      body: (rowData) => (
        <div
          style={!rowData.address ? { textAlign: "center" } : { textAlign: "left" }}
        >
          {rowData.address ? rowData.address : "-"}
        </div>
      )
    },
    {
      field: "block",
      header: "Block",
      body: (rowData) => (
        <span className={`status-badge ${rowData.block === 1 ? "active" : "in-active"}`}>
          {rowData.block === 1 ? "Yes" : "No"}
        </span>
      ),
    },
    {
      field: "block_reason",
      header: "Block Reason",
      body: (rowData) => (
        <div
          style={!rowData.block_reason ? { textAlign: "center" } : { textAlign: "left" }}
        >
          {rowData.block_reason ? rowData.block_reason : "-"}
        </div>
      )
    },
    { field: "created_at", header: "Created At" },
    { field: "updated_at", header: "Updated At" },
    {
      header: "Actions",
      body: (rowData) => (
        <div className="action-group">
          {/* <button
                className="action-btn"
                onClick={() => console.log("view", rowData)}
              >
                <FaEye />
                <span>View</span>
              </button> */}

          <button
            className="action-btn warning"
            onClick={() => handleEdit(rowData)}
          >
            <FaEdit />
            {/* <span>Edit</span> */}
          </button>

          <button
            className="action-btn"
            onClick={() => handleBlockedUpdate(rowData)}
          >
            <ImBlocked />
            {/* <span>View</span> */}
          </button>

          <button
            className="action-btn danger"
            onClick={() => handleDelete(rowData)}
          >
            <FaTrash />
            {/* <span>Delete</span> */}
          </button>

        </div>
      ),
    },
  ];

  const [tableRowData, setTableRowData] = useState([]);

  // -------------------- Update Modal States ------------------
  const [showAdmins, setShowAdmins] = useState(false);

  const handleCloseAdmins = () => setShowAdmins(false);
  const handleShowAdmins = () => setShowAdmins(true);

  // handle admin block status
  const handleBlockedUpdate = async (row) => {
    const isBlocked = row.block === 1;

    const result = await Swal.fire({
      title: isBlocked ? "Unblock Admin" : "Block Admin",
      text: "Please provide a reason",
      icon: "warning",
      input: "textarea",
      inputPlaceholder: isBlocked
        ? "Enter reason for unblocking..."
        : "Enter reason for blocking...",
      showCancelButton: true,
      confirmButtonText: isBlocked ? "Unblock" : "Block",
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",

      inputValidator: (value) => {
        if (!value) {
          return "Reason is required!";
        }
      },
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.put(
          `updateAdminsBlockStatusById/${row.id}/${!isBlocked}`,
          {
            block_reason: result.value,
          }
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedAdminsTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Block Admin Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  };

  const handleEdit = (row) => {
    console.log("Edit", row);
    handleShowAdmins();
    setTableRowData(row);
  };

  const handleDelete = async (row) => {
    console.log("DELETE ", row);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This admin will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`deleteAdmins/${row.id}`);

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedAdminsTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Delete Admin Error:", error);
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
      <DynamicTable data={admins} columns={columns} loading={loading} />
      <UpdateAdmin
        showAdmins={showAdmins}
        handleCloseAdmins={handleCloseAdmins}
        handleShowAdmins={handleCloseAdmins}
        setUpdatedAdminsTable={setUpdatedAdminsTable}
        tableRowData={tableRowData}
      />
    </>
  );
};

export default AdminDataTable;
