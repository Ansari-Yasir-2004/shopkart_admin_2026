import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import AddCategory from "./AddCategory";
import { Button } from "react-bootstrap";
import CategoryDataTable from "./CategoryDataTable";
import { FaPlus } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [updatedCategoriesTable, setUpdatedCategoriesTable] = useState("");

  const handleShowCategories = () => setShowCategories(true);
  const handleCloseCategories = () => setShowCategories(false);

  const getCategories = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get("getAllCategories");
      if (res.data.data && Array.isArray(res.data.data)) {
        setCategories(res.data.data);
      } else {
        setCategories([]);
      }
      console.log(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [updatedCategoriesTable]);

  return (
    <div className="module-root">

      {/* Top Bar */}
      <div className="module-header">
        <div>
          <h4 className="module-title">Categories</h4>
          {/* <div className="module-breadcrumb">
            Dashboard • Category • <span>List</span>
          </div> */}
        </div>

        <Button
          className="secondary-btn"
          onClick={handleShowCategories}>
          <FaPlus /> Add Category
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
        <CategoryDataTable
          categories={categories}
          loading={loading}
          setUpdatedCategoriesTable={setUpdatedCategoriesTable}
        />

      </div>
      <AddCategory
        showCategories={showCategories}
        handleShowCategories={handleCloseCategories}
        handleCloseCategories={handleCloseCategories}
        setUpdatedCategoriesTable={setUpdatedCategoriesTable}
      />

    </div>
  );
};

export default Categories;
