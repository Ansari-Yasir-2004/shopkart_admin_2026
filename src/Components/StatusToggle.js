import React from "react";
import { InputSwitch } from "primereact/inputswitch";
import axiosInstance from "../axios";
import Swal from "sweetalert2";

const StatusToggle = ({
  rowData,
  idField = "id",
  statusField = "status",
  endpoint,
  setUpdatedTable,
}) => {
  const checked = rowData[statusField] === 1;

  const handleToggle = async () => {
    const newStatus = checked ? false : true;

    try {
      const res = await axiosInstance.put(
        `${endpoint}/${rowData[idField]}/${newStatus}`,
      );

      if (res.data.status === 1) {
        Swal.fire({
          title: res.data.message,
          icon: "success",
          timer: 1200,
          showConfirmButton: false
        });

        setUpdatedTable(res.data.data);
      }
    } catch (error) {
      Swal.fire({
        title: error,
        icon: "error",
      });
      console.error(error);
    }
  };

  return (
    <div className="d-flex align-items-center gap-2">
      <InputSwitch checked={checked} onChange={handleToggle} />
      {/* <span className={`status-badge ${checked ? "active" : "in-active"}`}>
        {checked ? "Active" : "inActive"}
      </span> */}
    </div>
  );
};

export default StatusToggle;
