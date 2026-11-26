import React, { useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Spinner, Row, Col } from "react-bootstrap";
import axiosInstance from "../../axios";
import Swal from "sweetalert2";
import Select from "react-select";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SimpleImageCell from "../../Components/SimpleImageCell";
import { FaXmark } from "react-icons/fa6";

const UpdateProduct = ({
  showProducts,
  handleCloseProducts,
  tableRowData,
  setUpdatedProductsTable,
}) => {
  console.log("tableRowData =>", tableRowData)
  const fileInputRef = useRef(null);

  // Product States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [brandId, setBrandId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [position, setPosition] = useState("");

  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");

  const [status, setStatus] = useState("");
  const [outOfStock, setOutOfStock] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [isNewArrival, setIsNewArrival] = useState("");

  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [removeLoadingId, setRemoveLoadingId] = useState(null);

  // Option States
  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [subCategoryList, setSubCategoryList] = useState([]);

  // Pre-filled Fields
  useEffect(() => {
    if (tableRowData) {
      setName(tableRowData.name || "");
      setDescription(tableRowData.description || "");
      setBrandId(tableRowData.brand_id || "");
      setCategoryId(tableRowData.category_id || "");
      setSubCategoryId(tableRowData.sub_category_id || "");
      setPosition(String(tableRowData.position));
      setOriginalPrice(String(tableRowData.original_price));
      setDiscountPrice(String(tableRowData.discount_price));
      setStatus(String(tableRowData.status));
      setOutOfStock(String(tableRowData.out_of_stock));
      setIsFeatured(String(tableRowData.is_featured));
      setIsNewArrival(String(tableRowData.is_new_arrival));

      if (tableRowData.category_id) {
        getActiveSubCategories(tableRowData.category_id);
      }

      setImages([]);
      setExistingImages(tableRowData.images || []);
    }
  }, [tableRowData]);

  //  Update Product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (
      !name ||
      !description ||
      !brandId ||
      !categoryId ||
      !subCategoryId ||
      !position ||
      !originalPrice ||
      !discountPrice ||
      !status ||
      !outOfStock ||
      !isFeatured ||
      !isNewArrival
    ) return;

    const productBody = {
      name,
      description,
      brand_id: brandId,
      category_id: categoryId,
      sub_category_id: subCategoryId,
      position: parseInt(position),
      original_price: parseInt(originalPrice),
      discount_price: parseInt(discountPrice),
      status: parseInt(status),
      out_of_stock: parseInt(outOfStock),
      is_featured: parseInt(isFeatured),
      is_new_arrival: parseInt(isNewArrival),
    }
    // console.log("product body =>", productBody);

    try {
      setLoading(true);

      const res = await axiosInstance.put(`updateProductsById/${tableRowData.id}`, productBody);

      if (res.data.status === 1) {
        if (images.length > 0) {
          await handleUploadImages(res.data.data.id);
        }

        handleCloseProducts();

        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedProductsTable(res.data.data);

        // reset
        setName("");
        setDescription("");
        setBrandId("");
        setCategoryId("");
        setSubCategoryId("");
        setPosition("");
        setOriginalPrice("");
        setDiscountPrice("");
        setStatus("")
        setOutOfStock("");
        setIsFeatured("");
        setIsNewArrival("");
      } else {
        Swal.fire({
          title: "An error occurred",
          icon: "error",
        });
      }
    } catch (error) {
      console.log("Update Product Error:", error);
      // Swal.fire({
      //   title: error?.message || "An error occurred",
      //   icon: "error",
      //   text: error?.response?.data?.message || "",
      // });
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImages = async (id) => {
    if (!images.length) return;

    const formData = new FormData();

    images.forEach(file => {
      formData.append("images", file);
    });

    try {
      const res = await axiosInstance.post(
        `saveProductImageById/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImages([]);
      setUpdatedProductsTable(res.data);

    } catch (err) {
      Swal.fire("Error", "Image upload failed", "error");
    }
  };

  // Handle image delete
  const handleRemoveImage = async (imgId) => {
    const result = await Swal.fire({
      title: "Remove image?",
      text: "This image will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
    });

    if (result.isConfirmed) {
      try {
        setRemoveLoadingId(imgId);

        const res = await axiosInstance.delete(`deleteProductImageById/${imgId}`);

        setExistingImages(prev => prev.filter(img => img.image_id !== imgId));

        setUpdatedProductsTable(res.data);

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
        setRemoveLoadingId(null);
      }
    }
  };

  const handleRemoveNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Click to open file input
  const handleClickUpload = () => {
    const totalImages = existingImages.length + images.length;

    if (totalImages >= 5) {
      Swal.fire("Limit exceeded", "Max 5 images allowed", "warning");
      return;
    }

    fileInputRef.current.click();
  };

  // Handle uploaded image
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (!files.length) return;

    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 5) {
      Swal.fire("Limit exceeded", "Max 5 images allowed", "warning");
      return;
    }

    const validFiles = files.filter(file => file.size <= 120 * 1024);

    if (validFiles.length !== files.length) {
      Swal.fire("Error", "Each image must be <120KB", "error");
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
  };

  // Get Active Brands
  const getBrands = async () => {
    try {
      const res = await axiosInstance.get("getActiveBrands");
      setBrandList(res.data.data);
    } catch (e) {
      console.log("e =>", e)
    }
  };
  // Options for Brands
  const brandOptionList = brandList ? brandList.map(b => ({
    value: b.id,
    label: b.name
  })) : [];
  // Brand useEffect
  useEffect(() => {
    getBrands();
  }, [])

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

  // Get Active SubCategories
  const getActiveSubCategories = async (catId) => {
    if (!catId) return;

    try {
      const res = await axiosInstance.get(`getActiveSubCategoriesByCategoryId/${catId}`);
      setSubCategoryList(res.data.data);
    } catch (e) {
      console.log("e =>", e)
    }
  };
  // Options for SubCategories
  const subCategoryOptions = subCategoryList ? subCategoryList.map(s => ({
    value: s.id,
    label: s.name
  })) : [];
  // SubCategories useEffect
  useEffect(() => {
    getActiveSubCategories(categoryId);
  }, [categoryId]);

  // Options for Is Featured & Is New Arrival
  const booleanOptions = [
    { value: "1", label: "Yes" },
    { value: "0", label: "No" },
  ];

  // Options For Stock
  const stockOptions = [
    { value: "0", label: "In Stock" },
    { value: "1", label: "Out of Stock" },
  ];

  // Option For Status
  const statusOptions = [
    { value: "1", label: "Active" },
    { value: "0", label: "Inactive" },
  ];

  return (
    <Modal
      show={showProducts}
      onHide={handleCloseProducts}
      centered
      size="lg"
      backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div>
          <h5 className="modal-title-custom">Edit Product</h5>
          {/* <p className="modal-subtitle">Dashboard • Product • Create</p> */}
        </div>
      </Modal.Header>

      <Form onSubmit={handleUpdateProduct}>
        <Modal.Body className="modal-body-custom">

          {/* ===== DETAILS ===== */}
          <div className="form-card">

            <div className="card-header">
              <h6>Details</h6>
              {/* <p>Title, description...</p> */}
            </div>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Product name</Form.Label>
                  <Form.Control
                    className="input-field"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label>Sub description</Form.Label>

                  <div className="editor-container">
                    <CKEditor
                      editor={ClassicEditor}
                      data={description}
                      config={{
                        toolbar: [
                          "bold",
                          "italic",
                          // "underline",
                          "|",
                          "bulletedList",
                          "numberedList",
                          "|",
                          "link",
                          "undo",
                          "redo"
                        ]
                      }}
                      onChange={(event, editor) => {
                        setDescription(editor.getData());
                      }}
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* ===== PROPERTIES ===== */}
          <div className="form-card">

            <div className="card-header">
              <h6>Properties</h6>
              {/* <p>Additional attributes</p> */}
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Select
                    options={brandOptionList}
                    value={brandOptionList.find(opt => opt.value === brandId)}
                    onChange={(selected) => setBrandId(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Select
                    options={categoryOptions}
                    value={categoryOptions.find(opt => opt.value === categoryId)}
                    onChange={(selected) => {
                      const newCategoryId = selected?.value;

                      setCategoryId(newCategoryId);
                      setSubCategoryId("");
                      if (newCategoryId) {
                        getActiveSubCategories(newCategoryId);
                      } else {
                        setSubCategoryList([]);
                      }
                    }}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Sub Category</Form.Label>
                  <Select
                    options={subCategoryOptions}
                    value={subCategoryOptions.find(opt => opt.value === subCategoryId) || null}
                    onChange={(selected) => setSubCategoryId(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Position</Form.Label>
                  <Form.Control
                    className="input-field"
                    value={position}
                    onChange={(e) =>
                      setPosition(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* ===== PRICING ===== */}
          <div className="form-card">

            <div className="card-header">
              <h6>Pricing</h6>
            </div>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Original price</Form.Label>
                  <Form.Control
                    className="input-field"
                    value={originalPrice}
                    onChange={(e) =>
                      setOriginalPrice(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label>Discount price</Form.Label>
                  <Form.Control
                    className="input-field"
                    value={discountPrice}
                    onChange={(e) =>
                      setDiscountPrice(e.target.value.replace(/[^0-9]/g, ""))
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>

          {/* ===== SETTINGS ===== */}
          <div className="form-card">

            <div className="card-header">
              <h6>Settings</h6>
            </div>

            <Row>

              {/* Status */}
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label>Status</Form.Label>
                  <Select
                    options={statusOptions}
                    value={statusOptions.find(opt => opt.value === status)}
                    onChange={(selected) => setStatus(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              {/* Stock */}
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label>Stock</Form.Label>
                  <Select
                    options={stockOptions}
                    value={stockOptions.find(opt => opt.value === outOfStock)}
                    onChange={(selected) => setOutOfStock(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              {/* Featured */}
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label>Featured</Form.Label>
                  <Select
                    options={booleanOptions}
                    value={booleanOptions.find(opt => opt.value === isFeatured)}
                    onChange={(selected) => setIsFeatured(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </Form.Group>
              </Col>

              {/* New Arrival */}
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label>New Arrival</Form.Label>
                  <Select
                    options={booleanOptions}
                    value={booleanOptions.find(opt => opt.value === isNewArrival)}
                    onChange={(selected) => setIsNewArrival(selected?.value)}
                    className="react-select-container"
                    classNamePrefix="react-select"
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

              <input
                type="file"
                multiple
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={handleFileChange}
              />

              {/* EXISTING IMAGES */}
              <div className="preview-grid">
                {existingImages.map((img) => (
                  <div className={`preview-container ${removeLoadingId === img.image_id ? "removing" : ""}`} key={img.image_id}>

                    <div className="remove-btn" onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(img.image_id);
                    }}>
                      {removeLoadingId === img.image_id ? <Spinner size="sm" /> : <FaXmark />}
                    </div>

                    <div onClick={(e) => e.stopPropagation()}>
                      <SimpleImageCell
                        id={img.image_id}
                        endpoint={"getProductImageById"}
                        refreshImage={img.url}
                      />
                    </div>
                  </div>
                ))}

                {/* NEW IMAGES */}
                {images.map((file, index) => (
                  <div className="preview-container" key={index}>

                    <div className="remove-btn" onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveNewImage(index);
                    }}>
                      <FaXmark />
                    </div>

                    <img
                      src={URL.createObjectURL(file)}
                      alt=""
                      className="preview-img"
                    />
                  </div>
                ))}
              </div>

              {/* EMPTY STATE */}
              {(existingImages.length + images.length) === 0 && (
                <div className="upload-content">
                  <span className="upload-icon">📦</span>
                  <p>Drop or select files</p>
                  <small>Max 5 images • 150KB each</small>
                </div>
              )}
            </div>

          </div>

        </Modal.Body>

        <Modal.Footer className="modal-footer-custom">
          <Button className="btn-outline" onClick={handleCloseProducts}>
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

export default UpdateProduct;
