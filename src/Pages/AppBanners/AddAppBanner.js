import React, { useRef, useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import Select from "react-select";

const AddAppBanner = ({
  showAppBanner,
  handleCloseAppBanner,
  setUpdatedAppBannerTable,
}) => {
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");
  const [image, setImage] = useState(null)

  const [loading, setLoading] = useState(false);

  const handleAddAppBanner = async (e) => {
    e.preventDefault();

    if (
      !title ||
      !description ||
      !position ||
      !status
    ) return;

    const appBannerBody = {
      title: title,
      description: description,
      position: parseInt(position),
      status: parseInt(status),
    }
    // console.log("app banner body =>", appBannerBody);

    try {
      setLoading(true);

      const res = await axiosInstance.post("addAppBanners", appBannerBody);

      if (res.data.status === 1) {
        const bannerId = res.data.data;

        if (image) {
          const formData = new FormData();
          formData.append("image", image);

          try {
            await axiosInstance.post(
              `saveAppBannerImageById/${bannerId}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data"
                }
              }
            )
          } catch (imgErr) {
            console.log("Image upload error:", imgErr);
            Swal.fire("Warning", "Banner saved but image upload failed", "warning");
          }
        }

        handleCloseAppBanner();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedAppBannerTable(res.data.data);

        // reset
        setTitle("");
        setDescription("");
        setPosition("");
        setStatus("");
      } else {
        Swal.fire({
          title: "An error occurred",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Add app banner Error:", error);
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

    if (file.size > 150 * 1024) {
      Swal.fire("Error", "Image must be less than 150KB", "error");
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
    handleCloseAppBanner();

    // reset everything
    setTitle("");
    setDescription("");
    setPosition("");
    setStatus("");
    setImage(null);
  };

  return (
    <Modal
      show={showAppBanner}
      onHide={handleClose}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Add app banner</h5>
          {/* <p className="modal-subtitle">Dashboard • App Banner • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleAddAppBanner}>
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
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    className="input-field"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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

              <Col md={6}>
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
                  <small>Max size: 150KB</small>
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

export default AddAppBanner;
