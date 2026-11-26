import React, { useRef, useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import Select from "react-select";

const AddCategory = ({
  showCategories,
  handleCloseCategories,
  setUpdatedCategoriesTable,
}) => {
  const fileInputRef = useRef(null);

  const [categoryName, setCategoryName] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null)

  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (
      !categoryName ||
      !description ||
      !position ||
      !status
    ) return;

    const categoryBody = {
      name: categoryName,
      description: description,
      position: parseInt(position),
      status: parseInt(status)
    }
    // console.log("category body =>", categoryBody);

    try {
      setLoading(true);

      const res = await axiosInstance.post("addCategories", categoryBody);

      if (res.data.status === 1) {

        const categoryId = res.data.data.id;

        // IMAGE UPLOAD (Only If Image is selected)
        if (image) {
          const formData = new FormData();
          formData.append("image", image);

          await axiosInstance.post(
            `saveCategoryImageById/${categoryId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );
        }

        handleCloseCategories();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedCategoriesTable(res.data.data);

        setCategoryName("");
        setDescription("");
        setPosition("");
        setStatus("");
        setImage(null);
      }
    } catch (error) {
      console.log("Add Category Error:", error);
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
  const handleRemoveImage = async () => {
    const result = await Swal.fire({
      title: "Remove image?",
      text: "This image will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (result.isConfirmed) {
      setImage(null);
    }
  };

  // Click to check & open file input
  const handleClickUpload = () => {
    if (image) {
      Swal.fire({
        icon: "warning",
        title: "Remove existing image first",
        text: "Please remove the current image before selecting a new one.",
      });
      return;
    }

    fileInputRef.current.click();
  };

  // Handle uploaded image
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 120 * 1024) {
      Swal.fire("Error", "Image must be less than 120KB", "error");
      return;
    }

    setImage(file);
  };

  // Option For Status
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  const handleClose = () => {
    handleCloseCategories();

    // reset everything
    setCategoryName("");
    setDescription("");
    setPosition("");
    setStatus("");
    setImage(null);
  };

  return (
    <Modal
      show={showCategories}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Add Category</h5>
          {/* <p className="modal-subtitle">Dashboard • Product • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleAddCategory}>
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
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    required
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

                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="preview-img"
                  />

                  <p className="file-name">{image.name}</p>
                </div>
              ) : (
                <div className="upload-content">
                  <span className="upload-icon">📦</span>
                  <p>Drop or select files</p>
                  <small>Max size: 120KB</small>
                </div>
              )}

            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-outline" onClick={handleClose}>
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

export default AddCategory;
