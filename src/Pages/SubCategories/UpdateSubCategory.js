import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row, Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import Select from "react-select";

const UpdateSubCategory = ({
  showSubCategories,
  handleCloseSubCategories,
  tableRowData,
  setUpdatedSubCategoriesTable,
}) => {
  console.log("tableRowData =>", tableRowData)
  const fileInputRef = useRef(null);

  const [categoryId, setCategoryId] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null)

  const [loading, setLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    if (tableRowData) {
      setSubCategoryName(tableRowData.name || "");
      setDescription(tableRowData.description || "");
      setCategoryId(tableRowData.category_id);
      setPosition(String(tableRowData.position));
      setStatus(String(tableRowData.status));
    }
  }, [tableRowData]);

  useEffect(() => {
    if (!tableRowData?.id) return;

    const fetchImage = async () => {
      try {
        const res = await axiosInstance.get(
          `getSubCategoryImageById/${tableRowData.id}`,
          {
            responseType: "blob",
            validateStatus: (s) => s === 200 || s === 404,
          }
        );

        if (res.status === 200) {
          const url = URL.createObjectURL(res.data);
          setImage(url); // string URL
        } else {
          setImage(null);
        }
      } catch {
        setImage(null);
      }
    };

    fetchImage();
  }, [tableRowData]);

  // Update Sub Category
  const handleUpdateSubCategory = async (e) => {
    e.preventDefault();

    if (
      !categoryId ||
      !subCategoryName ||
      !description ||
      !position ||
      !status
    ) return;

    const subCategoryBody = {
      category_id: categoryId,
      name: subCategoryName,
      description: description,
      position: parseInt(position),
      status: parseInt(status),
    };
    console.log("sub category body =>", subCategoryBody);

    try {
      setLoading(true);

      const res = await axiosInstance.put(`updateSubCategoriesById/${tableRowData.id}`, subCategoryBody);

      // if (res.data.status === 1) {
      //   console.log("Res ==> ", res.data);
      //   handleCloseSubCategories();

      //   Swal.fire({
      //     title: res.data.message,
      //     icon: "success",
      //     timer: 1200,
      //     showConfirmButton: false
      //   });

      //   setUpdatedSubCategoriesTable(res.data.data);

      //   // reset
      //   setSubCategoryName("");
      //   setDescription("");
      //   setPosition("");
      //   setStatus("");
      //   setCategoryId("");
      // } else {
      //   Swal.fire({
      //     title: "An error occurred",
      //     icon: "error",
      //   });
      // }

      if (res.data.status === 1) {

        const subCategoryId = tableRowData.id;

        // 🔹 IMAGE UPLOAD (agar new image select ki hai)
        if (image instanceof File) {
          const formData = new FormData();
          formData.append("image", image);

          await axiosInstance.post(
            `saveSubCategoryImageById/${subCategoryId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        handleCloseSubCategories();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedSubCategoriesTable(res.data.data);

        // reset
        setSubCategoryName("");
        setDescription("");
        setPosition("");
        setStatus("");
        setCategoryId("");
        setImage(null);
      }
    } catch (error) {
      console.log("Update Category Error:", error);
      // Swal.fire({
      //   title: error?.message || "An error occurred",
      //   icon: "error",
      //   text: error?.response?.data?.message || "",
      // });
    } finally {
      setLoading(false);
    }
  };

  // Handle image delete
  // const handleRemoveImage = async () => {
  //   const result = await Swal.fire({
  //     title: "Remove image?",
  //     text: "This image will be removed.",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Yes, remove",
  //   });

  //   if (result.isConfirmed) {
  //     setImage(null);
  //   }
  // };

  const handleRemoveImage = async () => {
    const result = await Swal.fire({
      title: "Remove image?",
      text: "This image will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (result.isConfirmed) {
      const subCategoryId = tableRowData.id;

      try {
        await axiosInstance.delete(
          `deleteSubCategoryImageById/${subCategoryId}`
        );

        setImage(null);

        Swal.fire({
          title: "Image removed",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });

      } catch (error) {
        console.log("Delete SubCategory Image Error:", error);
      }
    }
  };

  // Click to open file input
  const handleClickUpload = () => {
    fileInputRef.current.click();
  };

  // Handle uploaded image
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 150 * 1024) {
      Swal.fire("Error", "Image must be less than 150KB", "error");
      return;
    }

    setImage(file);
  };

  // Get Active Categories
  const getActiveCategories = async () => {
    try {
      const res = await axiosInstance.get("getActiveCategories");
      setCategoryList(res.data.data);
    } catch (e) {
      console.log("e =>", e)
    }
  };
  // Options for Categories
  const categoryOptions = categoryList ? categoryList.map(c => ({
    value: c.id,
    label: c.name
  })) : [];
  // Categories useEffect
  useEffect(() => {
    getActiveCategories();
  }, [])

  // Option For Status
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  return (
    <Modal
      show={showSubCategories}
      onHide={handleCloseSubCategories}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Edit Sub Category</h5>
          {/* <p className="modal-subtitle">Dashboard • Sub Category • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleUpdateSubCategory}>
        <Modal.Body className="modal-body-custom">
          {/* ===== DETAILS ===== */}
          <div className="form-card">

            <div className="card-header">
              {/* <h6>Details</h6> */}
              {/* <p>Title, description...</p> */}
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Sub Category Name</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={subCategoryName}
                    onChange={(e) => setSubCategoryName(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === categoryId)}
                    onChange={(selected) => setCategoryId(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(opt => opt.value === status)}
                    onChange={(selected) => setStatus(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={position}
                    onChange={(e) =>
                      setPosition(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* ===== IMAGE SECTION ===== */}
          <div className="form-card">

            <div className="card-header">
              <h6>Images</h6>
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleFileChange}
            />

            {/* Upload UI */}
            <div className="upload-box" onClick={handleClickUpload}>

              {image ? (
                <div className="preview-container">

                  {/* ❌ Remove Button */}
                  <div className="remove-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}>
                    ✕
                  </div>

                  {/* <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="preview-img"
                  /> */}

                  <img
                    src={
                      image instanceof File
                        ? URL.createObjectURL(image)
                        : image
                    }
                    alt="preview"
                    className="preview-img"
                  />
                  <p className="file-name">{image.name}</p>
                </div>
              ) : (
                <div className="upload-content">
                  <span className="upload-icon">📦</span>
                  <p>Drop or select files</p>
                  <small>Max size: 150KB</small>
                </div>
              )}

            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-outline" onClick={handleCloseSubCategories}>
            Cancel
          </Button>

          <Button className="primary-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" /> Saving...
              </>
            ) : (
              "Save"
            )
            }
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default UpdateSubCategory;
