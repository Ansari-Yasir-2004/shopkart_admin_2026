import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import UpdateProduct from "./UpdateProduct";
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
import { Modal } from "react-bootstrap";

const ProductDataTable = ({ products, loading, setUpdatedProductsTable }) => {
  const columns = [
    { field: "id", header: "ID" },
    {
      header: "Images",
      body: (rowData) => {
        const images = rowData.images || [];

        return (
          <div
            className="position-relative"
          >
            {images.length > 0 ? (
              <>
                <SimpleImageCell
                  id={images[0]?.image_id}
                  endpoint={"getProductImageById"}
                  refreshImage={images[0]?.url}
                />

                {images.length > 1 && (
                  <div
                    className="image-overlay"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenImages(rowData);
                    }}
                  >
                    +{images.length - 1}
                  </div>
                )}
              </>
            ) : (
              <SimpleImageCell
                id={images[0]?.image_id}
                endpoint={"getProductImageById"}
                refreshImage={images[0]?.url}
              />
            )}
          </div>
        );
      },
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
      body: (rowData) => (
        <div
          dangerouslySetInnerHTML={{ __html: rowData.description }}
        >
          {/* {rowData.description} */}
        </div>
      ),
    },
    { field: "brand_name", header: "Brand" },
    { field: "category_name", header: "Category" },
    { field: "sub_category_name", header: "Sub Category" },
    { field: "slug", header: "Slug" },
    { field: "original_price", header: "Original Price" },
    { field: "discount_price", header: "Discount Price" },
    {
      field: "out_of_stock",
      header: "Out Of Stock",
      body: (rowData) => (
        <StatusToggle
          rowData={rowData}
          idField="id"
          statusField="out_of_stock"
          endpoint={"updateProductsOutOfStockById"}
          setUpdatedTable={setUpdatedProductsTable}
        />
      ),
    },
    {
      field: "is_featured",
      header: "is Featured",
      body: (rowData) => (
        <span className={`status-badge ${rowData.is_featured === 1 ? "active" : "in-active"}`}>
          {rowData.is_featured === 1 ? "Yes" : "No"}
        </span>
      )
    },
    {
      field: "is_new_arrival",
      header: "is New Arrival",
      body: (rowData) => (
        <span className={`status-badge ${rowData.is_new_arrival === 1 ? "active" : "in-active"}`}>
          {rowData.is_new_arrival === 1 ? "Yes" : "No"}
        </span>
      )
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
          endpoint={"updateProductsStatusById"}
          setUpdatedTable={setUpdatedProductsTable}
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

  // -------------------- Update Image Modal States ------------------
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleOpenImages = (row) => {
    setSelectedImages(row.images || []);
    setShowImagesModal(true);
  };

  // -------------------- Update Modal States ------------------
  const [showProducts, setShowProducts] = useState(false);

  const handleCloseProducts = () => setShowProducts(false);
  const handleShowProducts = () => setShowProducts(true);

  const handleEdit = (row) => {
    console.log("Edit", row);
    handleShowProducts();
    setTableRowData(row);
  };

  const handleDelete = async (row) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1f4f4f",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosInstance.delete(`deleteProductsById/${row.id}`);

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });
          setUpdatedProductsTable(row.id);
        }
      } catch (error) {
        Swal.fire("Error", "Something went wrong", "error");
      }
    }
  };

  return (
    <>
      <DynamicTable data={products} columns={columns} loading={loading} />

      <UpdateProduct
        showProducts={showProducts}
        handleCloseProducts={handleCloseProducts}
        handleShowProducts={handleCloseProducts}
        setUpdatedProductsTable={setUpdatedProductsTable}
        tableRowData={tableRowData}
      />

      <Modal
        show={showImagesModal}
        onHide={() => setShowImagesModal(false)}
        centered
        size="lg"
        dialogClassName="modal-container"
      >
        <Modal.Header className="modal-header-custom" closeButton>
          <div>
            <h5 className="modal-title-custom">Product Images</h5>
          </div>
        </Modal.Header>

        <Modal.Body>
          <div className="image-grid">
            {selectedImages.map((img) => (
              <SimpleImageCell
                key={img.image_id}
                id={img.image_id}
                endpoint={"getProductImageById"}
                refreshImage={img.url}
              />
            ))}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ProductDataTable;
