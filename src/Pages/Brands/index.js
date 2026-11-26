import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import BrandDataTable from "./BrandDataTable";
import AddBrand from "./AddBrand";
import { FaPlus } from "react-icons/fa";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBrands, setShowBrands] = useState(false);
  const [updatedBrandsTable, setUpdatedBrandsTable] = useState("");

  const handleShowBrands = () => setShowBrands(true);
  const handleCloseBrands = () => setShowBrands(false);

  const getBrands = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllBrands");
      if (res.data.data && Array.isArray(res.data.data)) {
        setBrands(res.data.data);
      } else {
        setBrands([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrands();
  }, [updatedBrandsTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Brands</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • Brand • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowBrands}>
          <FaPlus /> Add Brand
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
        <BrandDataTable
          brands={brands}
          loading={loading}
          setUpdatedBrandsTable={setUpdatedBrandsTable}
        />

      </div>
      <AddBrand
        showBrands={showBrands}
        handleShowBrands={handleCloseBrands}
        handleCloseBrands={handleCloseBrands}
        setUpdatedBrandsTable={setUpdatedBrandsTable}
      />

    </div>
  );
};

export default Brands;
