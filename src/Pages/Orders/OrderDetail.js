import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Spinner } from "react-bootstrap";
import axiosInstance from "../../axios";
import moment from "moment";

const OrderDetail = ({
  showOrderDetail,
  selectedOrderId,
  handleCloseOrderDetail,
}) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const getOrderDetail = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(`getOrderDetailById/${selectedOrderId}`);
      console.log(res);

      if (res?.data.status === 1) {
        setOrder(res.data.data);
      } else {
        setOrder(null);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!showOrderDetail || !selectedOrderId) return;

    getOrderDetail();
    // eslint-disable-next-line
  }, [showOrderDetail, selectedOrderId]);

  // reset on close
  useEffect(() => {
    if (!showOrderDetail) {
      setOrder(null);
    }
  }, [showOrderDetail]);

  const statusClass = {
    ORDERED: "info",
    ACCEPT: "primary",
    PROGRESS: "secondary",
    COMPLETED: "success",
    CANCELLED: "danger",
  };

  return (
    <Modal
      show={showOrderDetail}
      onHide={handleCloseOrderDetail}
      centered
      size="xl"
      // backdrop="static"
      dialogClassName="modal-container"
    >
      <Modal.Header className="modal-header-custom" closeButton>
        <div className="order-header">
          <div className="order-header-left">
            <h5>
              Order #{order?.id}
              <span className={`status-badge ${statusClass[order?.status]}`}>
                {order?.status}
              </span>
            </h5>

            <p className="mb-0">
              {moment(order?.created_at).format("DD MMM YYYY hh:mm A")}
            </p>
          </div>
        </div>
      </Modal.Header>

      <Modal.Body className="modal-body-custom">
        {loading ? (
          <div className="text-center p-5">
            <Spinner />
          </div>
        ) : order ? (
          <Row>
            {/* ===== LEFT SIDE ===== */}
            <Col md={8}>
              {/* DETAILS */}
              <div className="form-card">
                <div className="card-header">
                  <h6>Details</h6>
                </div>

                <div className="order-items">
                  {order.items.map((item) => (
                    <div className="order-item" key={item.id}>
                      <div className="order-item-left">
                        <div className="item-img"></div>

                        <div>
                          <div className="name-cell">{item.name}</div>
                          <small>x{item.quantity}</small>
                        </div>
                      </div>

                      <div className="order-item-right">
                        ₹{item.total}
                      </div>
                    </div>
                  ))}
                </div>

                {order.invoice.discount > 0 && (
                  <div className="discount-info">
                    You saved ₹{order.invoice.discount} on this order
                  </div>
                )}

                <div className="order-summary">
                  <div><span>Subtotal</span><span>₹{order.invoice.sub_total}</span></div>
                  <div><span>Shipping</span><span>₹{order.invoice.delivery}</span></div>
                  <div><span>Taxes</span><span>₹{order.invoice.tax}</span></div>

                  <div className="total">
                    <span>Total</span>
                    <span>₹{order.invoice.total}</span>
                  </div>
                </div>
              </div>

              {/* HISTORY */}
              <div className="form-card mt-3">
                <div className="card-header">
                  <h6>History</h6>
                </div>

                <div className="timeline">
                  {order.timeline.map((t, i) => (
                    <div className="timeline-item" key={i}>
                      <div className="timeline-line"></div>

                      <div className="timeline-dot"></div>

                      <div className="timeline-content">
                        <div>{t.status}</div>
                        <small>
                          {moment(t.created_at).format("DD MMM YYYY hh:mm A")}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            {/* ===== RIGHT SIDE ===== */}
            <Col md={4}>
              {/* CUSTOMER */}
              <div className="form-card">
                <div className="card-header">
                  <h6>Customer</h6>
                </div>

                <div className="customer-block">
                  <div className="avatar"></div>

                  <div>
                    <div className="name-cell">{order.customer.name}</div>
                    <small>{order.customer.email}</small>
                    <div>{order.customer.mobile}</div>
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="form-card mt-3">
                <div className="card-header">
                  <h6>Shipping</h6>
                </div>

                <div>{order.address}</div>
              </div>

              {/* PAYMENT */}
              <div className="form-card mt-3">
                <div className="card-header d-flex justify-content-between mb-2">
                  <h6 className="mb-0">Payment</h6>
                  <span
                    className={`status-badge ${order.invoice.payment_status === "PENDING"
                      ? "warning"
                      : "success"
                      }`}
                  >
                    {order.invoice.payment_status}
                  </span>
                </div>

                <div>
                  <div>{order.invoice.payment_method}</div>


                </div>
              </div>
            </Col>
          </Row>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default OrderDetail;