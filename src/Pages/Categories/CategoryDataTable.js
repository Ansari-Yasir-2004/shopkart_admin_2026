import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import UpdateCategory from "./UpdateCategory";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import StatusToggle from "../../Components/StatusToggle";
import {
  FaEdit,
  // FaEye,
  FaTrash
}
  from "react-icons/fa";
import SimpleImageCell from "../../Components/SimpleImageCell";
import moment from "moment";

const CategoryDataTable = ({
  categories,
  loading,
  setUpdatedCategoriesTable,
}) => {
  const columns = [
    { field: "id", header: "ID" },
    {
      field: "url",
      header: "Image",
      body: (rowData) => (
        <SimpleImageCell
          id={rowData.id}
          endpoint={"getCategoryImageById"}
          refreshImage={rowData.url}
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
          endpoint={"updateCategoriesStatusById"}
          setUpdatedTable={setUpdatedCategoriesTable}
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
  const [showCategories, setShowCategories] = useState(false);

  const handleCloseCategories = () => setShowCategories(false);
  const handleShowCategories = () => setShowCategories(true);

  const handleEdit = (row) => {
    console.log("Edit", row);
    handleShowCategories();
    setTableRowData(row);
  };

  const handleDelete = async (row) => {
    console.log("DELETE ", row);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted.",
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

          setUpdatedCategoriesTable(res?.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Delete Category Error:", error);
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
      <DynamicTable data={categories} columns={columns} loading={loading} />
      <UpdateCategory
        showCategories={showCategories}
        handleCloseCategories={handleCloseCategories}
        handleShowCategories={handleCloseCategories}
        setUpdatedCategoriesTable={setUpdatedCategoriesTable}
        tableRowData={tableRowData}
      />
    </>
  );
};

export default CategoryDataTable;
