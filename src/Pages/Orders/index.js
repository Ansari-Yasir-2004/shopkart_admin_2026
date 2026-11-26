import React, { useEffect, useState } from "react";
import axiosInstance from "../../axios";
import OrdersDataTable from "./OrderDataTable";
import { Tabs, Tab } from "react-bootstrap";

const STATUS_TABS = [
  // { key: "ALL", label: "All" },
  { key: "ORDERED", label: "Pending" },
  // { key: "ORDERED", label: "Ordered" },
  { key: "ACCEPT", label: "Accepted" },
  { key: "PROGRESS", label: "Progress" },
  { key: "COMPLETED", label: "Completed" },
  { key: "CANCELLED", label: "Cancelled" },
];

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatedOrdersTable, setUpdatedOrdersTable] = useState("");

  const [status, setStatus] = useState("ORDERED");
  // eslint-disable-next-line
  const [paymentStatus, setPaymentStatus] = useState("");

  const getOrders = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`getAllOrders?status=${status}&payment_status=${paymentStatus}`);

      if (res.data.data) {
        setOrders(res.data.data);
      } else {
        setOrders([]);
      }
      console.log(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
    // eslint-disable-next-line
  }, [updatedOrdersTable, status, paymentStatus]);

  return (
    <div className="module-root">

      {/* Header */}
      <div className="module-header">
        <h4 className="module-title">Orders</h4>
      </div>

      <div className="table-card">

        <div className="tabs-wrapper">

          <Tabs
            activeKey={status || "PENDING"}
            onSelect={(key) => {
              setStatus(key);
            }}
            className="order-tabs-custom"
          >
            {STATUS_TABS.map((tab) => (
              <Tab
                key={tab.key}
                eventKey={tab.key}
                title={<span className="tab-label">{tab.label}</span>}
              />
            ))}
          </Tabs>

        </div>

        {/* Table */}
        <OrdersDataTable
          orders={orders}
          loading={loading}
          setUpdatedOrdersTable={setUpdatedOrdersTable}
        />
      </div>

    </div>
  );
};

export default Orders;