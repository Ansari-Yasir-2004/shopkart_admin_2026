import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import UpdateSubCategory from "./UpdateSubCategory";
import StatusToggle from "../../Components/StatusToggle";
import {
  FaEdit,
  // FaEye,
  FaTrash
}
  from "react-icons/fa";
import SimpleImageCell from "../../Components/SimpleImageCell";

const SubCategoryDataTable = ({
  subCategories,
  loading,
  setUpdatedSubCategoriesTable,
}) => {
  const columns = [
    { field: "id", header: "ID" },
    { field: "category_name", header: "Category Name" },
    {
      field: "url",
      header: "Image",
      body: (rowData) => (
        <SimpleImageCell 
          id={rowData.id} 
          endpoint="getSubCategoryImageById"
        />
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
          endpoint={"updateSubCategoriesStatusById"}
          setUpdatedTable={setUpdatedSubCategoriesTable}
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
  const [showSubCategories, setShowSubCategories] = useState(false);

  const handleCloseSubCategories = () => setShowSubCategories(false);
  const handleShowSubCategories = () => setShowSubCategories(true);

  const handleEdit = (row) => {
    console.log("Edit", row);
    handleShowSubCategories();
    setTableRowData(row);
  };

  const handleDelete = async (row) => {
    console.log("DELETE ", row);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This SubCategory will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `deleteCategoriesById/${row.id}`,
        );

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedSubCategoriesTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Delete SubCategory Error:", error);
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
      <DynamicTable data={subCategories} columns={columns} loading={loading} />
      <UpdateSubCategory
        showSubCategories={showSubCategories}
        handleCloseSubCategories={handleCloseSubCategories}
        handleShowSubCategories={handleCloseSubCategories}
        setUpdatedSubCategoriesTable={setUpdatedSubCategoriesTable}
        tableRowData={tableRowData}
      />
    </>
  );
};

export default SubCategoryDataTable;
