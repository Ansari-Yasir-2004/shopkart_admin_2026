import React, { useState } from "react";
import DynamicTable from "../../Components/DynamicTable";
import Swal from "sweetalert2";
import axiosInstance from "../../axios";
import moment from "moment/moment";
import OrderDetail from "./OrderDetail";

const OrdersDataTable = ({ orders, loading, setUpdatedOrdersTable }) => {
  const columns = [
    { field: "id", header: "Order ID" },
    {
      field: "customer_name",
      header: "Customer Name",
      body: (rowData) => (
        <div className="name-cell">{rowData.customer_name}</div>
      ),
    },
    {
      field: "mobile",
      header: "Mobile Number",
    },
    {
      field: "address",
      header: "Address",
      style: { minWidth: "200px", textWrap: "wrap" },
      body: (rowData) => (
        <div>
          {rowData.address}
        </div>
      ),
    },
    {
      field: "total_amount",
      header: "Price",
      body: (rowData) => `₹${rowData.total_amount}`,
    },
    {
      field: "payment_status",
      header: "Payment",
      body: (rowData) => (
        <span
          className={`status-badge ${rowData.payment_status === "PENDING" ? "warning" : "success"
            }`}
        >
          {rowData.payment_status}
        </span>
      ),
    },
    {
      field: "status",
      header: "Order Status",
      body: (rowData) => {
        const map = {
          PENDING: "warning",
          ORDERED: "info",
          ACCEPT: "primary",
          PROGRESS: "secondary",
          COMPLETED: "success",
          CANCELLED: "danger",
        };
        return (
          <span className={`status-badge ${map[rowData.status]}`}>
            {rowData.status}
          </span>
        );
      },
    },
    {
      field: "created_at",
      header: "Created at",
      body: (rowData) => (
        <div>
          {moment(rowData.created_at).format("DD MMM YYYY")}
          <br />
          <small>
            {moment(rowData.created_at).format("hh:mm A")}
          </small>
        </div>
      )
    },
    {
      header: "Actions",
      body: (rowData) => (
        <div className="action-group">

          {rowData.status === "ORDERED" && (
            <button
              className="action-btn success"
              onClick={() => handleAccept(rowData)}
            >
              Accept
            </button>
          )}

          {rowData.status === "ORDERED" && (
            <button
              className="action-btn danger"
              onClick={() => handleCancel(rowData)}
            >
              Cancel
            </button>
          )}

          {rowData.status === "ACCEPT" && (
            <button
              className="action-btn primary"
              onClick={() => handleStart(rowData)}
            >
              Start
            </button>
          )}

          {rowData.status === "PROGRESS" && (
            <button
              className="action-btn complete"
              onClick={() => handleComplete(rowData)}
            >
              Complete
            </button>
          )}

          <button
            className="action-btn"
            onClick={() => handleOrderDetail(rowData.id)}
          >
            View
          </button>

        </div>
      ),
    },
  ];

  // ============ ORDER DETAIL MODAL STATES =============
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const handleCloseOrderDetail = () => setShowOrderDetail(false);
  const handleShowOrderDetail = () => setShowOrderDetail(true);

  const handleOrderDetail = (orderId) => {
    setSelectedOrderId(orderId);
    handleShowOrderDetail();
  };

  const handleAccept = async (row) => {
    const result = await Swal.fire({
      title: "Accept Order?",
      text: "This order will be accepted.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, accept",
      confirmButtonColor: "#1f4f4f",
    });

    if (result.isConfirmed) {
      const acceptBody = {
        status: "ACCEPT"
      }
      try {
        const res = await axiosInstance.put(`updateOrderStatusById/${row.id}`, acceptBody);
        console.log(res);

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedOrdersTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Accept Order Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  };

  const handleCancel = async (row) => {
    const result = await Swal.fire({
      title: "Cancel Order?",
      text: "This order will be cancelled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      confirmButtonColor: "#d33",
    });

    if (result.isConfirmed) {
      const cancelBody = {
        status: "CANCELLED"
      }
      try {
        const res = await axiosInstance.put(`updateOrderStatusById/${row.id}`, cancelBody);
        console.log(res);

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedOrdersTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Cancel Order Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  };

  const handleStart = async (row) => {
    const result = await Swal.fire({
      title: "Start Order?",
      text: "This order will move to progress.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, start",
      confirmButtonColor: "#1f4f4f",
    });

    if (result.isConfirmed) {
      const startBody = {
        status: "PROGRESS"
      };
      try {
        const res = await axiosInstance.put(`updateOrderStatusById/${row.id}`, startBody);
        console.log(res);

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedOrdersTable(res.data.data);
        } else {
          Swal.fire({
            title: "An error occurred",
            icon: "error",
          });
        }
      } catch (error) {
        console.log("Start Order Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  };

  const handleComplete = async (row) => {
    const result = await Swal.fire({
      title: "Complete Order?",
      text: "This order will be marked as completed.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, complete",
      confirmButtonColor: "#1f4f4f",
    });

    if (result.isConfirmed) {
      const completeBody = {
        status: "COMPLETED"
      };
      try {
        const res = await axiosInstance.put(`updateOrderStatusById/${row.id}`, completeBody);
        console.log(res);

        if (res.data.status === 1) {
          Swal.fire({
            title: res.data.message,
            icon: "success",
            timer: 1200,
            showConfirmButton: false
          });

          setUpdatedOrdersTable(res.data.data);
        }
      } catch (error) {
        console.log("Complete Order Error:", error);
        // Swal.fire({
        //   title: error?.message || "An error occurred",
        //   icon: "error",
        //   text: error?.response?.data?.message || "",
        // });
      }
    }
  };

  return (
    <>
      <DynamicTable
        data={orders}
        columns={columns}
        loading={loading}
      />
      <OrderDetail
        showOrderDetail={showOrderDetail}
        selectedOrderId={selectedOrderId}
        handleCloseOrderDetail={handleCloseOrderDetail}
      />
    </>
  );
};

export default OrdersDataTable;