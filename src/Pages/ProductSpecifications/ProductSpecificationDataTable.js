import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import StatusToggle from "../../Components/StatusToggle";
import UpdateProductSpecification from "./UpdateProductSpecification";
import {
  FaEdit,
  // FaEye,
  FaTrash
}
  from "react-icons/fa";
import SimpleImageCell from "../../Components/SimpleImageCell";

const ProductSpecificationDataTable = ({
  productSpecification,
  loading,
  setUpdatedProductSpecificationTable,
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
      field: "product_name",
      header: "Product Name",
      body: (rowData) => (
        <div className="name-cell">{rowData.product_name}</div>
      ),
    },
    { field: "name", header: "Specification" },
    { field: "value", header: "Value" },
    { field: "position", header: "Position" },
    {
      field: "status",
      header: "Status",
      body: (rowData) => (
        <StatusToggle
          rowData={rowData}
          idField="id"
          statusField="status"
          endpoint={"updateProductSpecificationsStatusById"}
          setUpdatedTable={setUpdatedProductSpecificationTable}
        />
      ),
    },
    { field: "created_at", header: "Created At" },
    { field: "updated_at", header: "Updated At" },
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
  const [showProductSpecification, setShowProductSpecification] =
    useState(false);

  const handleCloseProductSpecification = () =>
    setShowProductSpecification(false);

  const handleShowProductSpecification = () =>
    setShowProductSpecification(true);

  const handleEdit = (row) => {
    setTableRowData(row);
    handleShowProductSpecification();
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product specification will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(
          `deleteProductSpecificationsById/${row.id}`
        );

        if (res.data.status === 1) {
          Swal.fire("Deleted!", res.data.message, "success");
          setUpdatedProductSpecificationTable(row.id);
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  return (
    <>
      <DynamicTable
        data={productSpecification}
        columns={columns}
        loading={loading}
      />

      <UpdateProductSpecification
        showProductSpecification={showProductSpecification}
        handleCloseProductSpecification={handleCloseProductSpecification}
        handleShowProductSpecification={handleShowProductSpecification} // ✅ fix
        setUpdatedProductSpecificationTable={setUpdatedProductSpecificationTable}
        tableRowData={tableRowData}
      />
    </>
  );
};

export default ProductSpecificationDataTable;