import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import UpdateBrand from "./UpdateBrand";
import StatusToggle from "../../Components/StatusToggle";
import {
  FaEdit,
  // FaEye,
  FaTrash
}
  from "react-icons/fa";
import SimpleImageCell from "../../Components/SimpleImageCell";

const BrandDataTable = ({
  brands,
  loading,
  setUpdatedBrandsTable,
}) => {
  const columns = [
    { field: "id", header: "ID" },
    {
      field: "url",
      header: "Image",
      body: (rowData) => (
        <SimpleImageCell src={rowData.url} />
      ),
    },
    {
      field: "name",
      header: "Name",
      body: (rowData) => (
        <div className="name-cell">{rowData.name}</div>
      ),
    },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <StatusToggle
          rowData={rowData}
          idField="id"
          statusField="status"
          endpoint={"updateBrandsStatusById"}
          setUpdatedTable={setUpdatedBrandsTable}
        />
      ),
    },
    { field: "created_at", header: "Created at" },
    { field: "updated_at", header: "Updated at" },
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
  const [showBrands, setShowBrands] = useState(false);

  const handleCloseBrands = () => setShowBrands(false);
  const handleShowBrands = () => setShowBrands(true);

  const handleEdit = (row) => {
    console.log("Edit", row);
    handleShowBrands();
    setTableRowData(row);
  };

  const handleDelete = async (row) => {
    console.log("DELETE ", row);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This brand will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `deleteBrandsById/${row.id}`,
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedBrandsTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Delete Brand Error:", error);
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
      <DynamicTable data={brands} columns={columns} loading={loading} />
      <UpdateBrand
        showBrands={showBrands}
        handleCloseBrands={handleCloseBrands}
        handleShowBrands={handleCloseBrands}
        setUpdatedBrandsTable={setUpdatedBrandsTable}
        tableRowData={tableRowData}
      />
    </>
  );
};

export default BrandDataTable;
