import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import ProductDataTable from "./ProductDataTable";
import AddProduct from "./AddProduct";
import { FaPlus } from "react-icons/fa";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [updatedProductsTable, setUpdatedProductsTable] = useState("");

  const handleShowProducts = () => setShowProducts(true);
  const handleCloseProducts = () => setShowProducts(false);

  const getProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("getAllProducts");
      if (res.data.data && Array.isArray(res.data.data)) {
        setProducts(res.data.data);
      } else {
        setProducts([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getProducts();
  }, [updatedProductsTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Products</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • Product • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowProducts}>
          <FaPlus /> Add product
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
        <ProductDataTable
          products={products}
          loading={loading}
          setUpdatedProductsTable={setUpdatedProductsTable}
        />

      </div>
      <AddProduct
        showProducts={showProducts}
        handleShowProducts={handleCloseProducts}
        handleCloseProducts={handleCloseProducts}
        setUpdatedProductsTable={setUpdatedProductsTable}
      />

    </div>
  );
};

export default Products;
