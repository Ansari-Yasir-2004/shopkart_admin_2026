import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import { Button } from "react-bootstrap";
import SubCategoryDataTable from "./SubCategoryDataTable";
import AddSubCategory from "./AddSubCategory";
import { FaPlus } from "react-icons/fa";

const SubCategories = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [updatedSubCategoriesTable, setUpdatedSubCategoriesTable] = useState("");

  const handleShowSubCategories = () => setShowSubCategories(true);
  const handleCloseSubCategories = () => setShowSubCategories(false);

  const getSubCategories = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllSubCategories");
      if (res.data.data && Array.isArray(res.data.data)) {
        setSubCategories(res.data.data);
      } else {
        setShowSubCategories([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSubCategories();
  }, [updatedSubCategoriesTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Sub Categories</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • SubCategory • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowSubCategories}>
          <FaPlus /> Add Sub Category
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
        <SubCategoryDataTable
          subCategories={subCategories}
          loading={loading}
          setUpdatedSubCategoriesTable={setUpdatedSubCategoriesTable}
        />

      </div>
      <AddSubCategory
        showSubCategories={showSubCategories}
        handleShowSubCategories={handleCloseSubCategories}
        handleCloseSubCategories={handleCloseSubCategories}
        setUpdatedSubCategoriesTable={setUpdatedSubCategoriesTable}
      />

    </div>
  );
};

export default SubCategories;
