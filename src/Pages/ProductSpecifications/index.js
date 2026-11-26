import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import ProductSpecificationDataTable from "./ProductSpecificationDataTable";
import AddProductSpecification from "./AddProductSpecification";
import { FaPlus } from "react-icons/fa";

const ProductSpecification = () => {
  const [productSpecification, setProductSpecification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProductSpecification, setShowProductSpecification] = useState(false);
  const [updatedProductSpecificationTable, setUpdatedProductSpecificationTable] = useState("");

  const handleShowProductSpecification = () => setShowProductSpecification(true);
  const handleCloseProductSpecification = () => setShowProductSpecification(false);

  const getProductSpecification = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("getAllProductSpecifications");
      if (res.data.data && Array.isArray(res.data.data)) {
        setProductSpecification(res.data.data);
      } else {
        setShowProductSpecification([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProductSpecification();
  }, [updatedProductSpecificationTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Product Specifications</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • Product Specification • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowProductSpecification}>
          <FaPlus /> Add product specification
        </Button>
      </div>

      {/* Table Card */}
      <div className="table-card">

        {/* Toolbar */}
        {/* <div className="table-toolbar">

          <div className="toolbar-left">
            <select className="select-input">
              <option>Stock</option>
            </select>

            <select className="select-input">
              <option>Publish</option>
            </select>

            <div className="search-input">
              <i className="pi pi-search"></i>
              <input placeholder="Search..." />
            </div>
          </div>

          <div className="toolbar-right">
            <span>Columns</span>
            <span>Filters</span>
            <span>Export</span>
            <span>Settings</span>
          </div>

        </div> */}

        {/* Table */}
        <ProductSpecificationDataTable
          productSpecification={productSpecification}
          loading={loading}
          setUpdatedProductSpecificationTable={setUpdatedProductSpecificationTable}
        />

      </div>
      <AddProductSpecification
        showProductSpecification={showProductSpecification}
        handleShowProductSpecification={handleCloseProductSpecification}
        handleCloseProductSpecification={handleCloseProductSpecification}
        setUpdatedProductSpecificationTable={setUpdatedProductSpecificationTable}
      />

    </div>
  );
};

export default ProductSpecification;
