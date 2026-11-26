import { useEffect, useRef, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import Select from "react-select";
import SimpleImageCell from "../../Components/SimpleImageCell";
import { FaXmark } from "react-icons/fa6";

const UpdateAppBanner = ({
  showAppBanner,
  handleCloseAppBanner,
  tableRowData,
  setUpdatedAppBannerTable,
}) => {
  console.log("tableRowData =>", tableRowData)
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("");

  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);

  useEffect(() => {
    if (tableRowData) {
      setTitle(tableRowData.title || "");
      setDescription(tableRowData.description || "");
      setPosition(String(tableRowData.position));
      setStatus(String(tableRowData.status));

      if (tableRowData.url) {
        setExistingImage({
          id: tableRowData.id,
          url: tableRowData.url,
        });
      }
    }
  }, [tableRowData]);

  const handleClose = () => {
    handleCloseAppBanner();

    // reset everything
    setTitle("");
    setDescription("");
    setPosition("");
    setStatus("");
    setImage(null);
    setExistingImage(null);
  };

  const handleUpdateAppBanner = async (e) => {
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

      const res = await axiosInstance.put(`updateAppBannersById/${tableRowData.id}`, appBannerBody);

      if (res.data.status === 1) {
        console.log("Res ==> ", res.data);

        if (image) {
          handleUploadImage(res.data.data.id);
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

  const handleUploadImage = async (id) => {
    if (!id) return;

    const formData = new FormData();
    formData.append("image", image);

    try {
      const res = await axiosInstance.post(
        `saveAppBannerImageById/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setImage(null);
      setExistingImage(null);

      setUpdatedAppBannerTable(res.data);
    } catch (error) {
      console.log("Image upload error:", error);
      Swal.fire("Warning", "Banner saved but image upload failed", "warning");
    }
  }

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
      try {
        setRemoveLoading(true);

        const res = await axiosInstance.delete(`deleteAppBannerImageById/${tableRowData.id}`);

        setImage(null);
        setExistingImage(null);

        setUpdatedAppBannerTable(res.data);

        Swal.fire({
          title: "Image Removed",
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });
      } catch (error) {
        console.log(error);
        Swal.fire("Error", "Failed to remove image", "error");
      } finally {
        setRemoveLoading(false);
      }
    }
  };

  // Click to check & open file input
  const handleClickUpload = () => {
    if (existingImage) {
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
          <h5 className="modal-title-custom">Edit app banner</h5>
          {/* <p className="modal-subtitle">Dashboard • App Banner • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleUpdateAppBanner}>
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
                <div className={`preview-container ${removeLoading ? "removing" : ""}`}>

                  <div className="remove-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}>
                    {removeLoading ? <Spinner size="sm" /> : <FaXmark />}
                  </div>

                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                    className="preview-img"
                  />

                  <p className="file-name">{image.name}</p>
                </div>
              ) : existingImage ? (
                <div className={`preview-container ${removeLoading ? "removing" : ""}`}>

                  <div className="remove-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveImage();
                  }}>
                    {removeLoading ? <Spinner size="sm" /> : <FaXmark />}
                  </div>

                  <div onClick={(e) => e.stopPropagation()}>
                    <SimpleImageCell endpoint={"getAppBannerImageById"} id={existingImage.id} />
                  </div>

                  <p className="file-name">{existingImage?.url.split("/").pop()}</p>
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

export default UpdateAppBanner;
