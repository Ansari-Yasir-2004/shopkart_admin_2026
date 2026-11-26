import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import DefaultImage from "../assets/images/png/no_image_available.png"
import axiosInstance from "../axios";

const SimpleImageCell = ({ id, endpoint, refreshImage, }) => {
  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState(DefaultImage);
  const [loading, setLoading] = useState(false);

  const fetchImage = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `${endpoint}/${id}`,
        {
          responseType: "blob",
          validateStatus: (status) => status === 200 || status === 404,
        }
      );

      if (res.status === 200) {
        const imageUrl = URL.createObjectURL(res.data);
        setImgSrc(imageUrl);
      } else {
        setImgSrc(DefaultImage);
      }

    } catch (error) {
      setImgSrc(DefaultImage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id || !endpoint) return;
    fetchImage();
    // eslint-disable-next-line
  }, [id, endpoint, refreshImage]);

  return (
    <>
      <div className="image-cell-wrapper">
        {loading ? (
          <div className="img-loader">
            <Spinner animation="border" size="sm" />
          </div>
        ) : (
          <img
            src={imgSrc}
            alt=""
            className="img-cell"
            onClick={() => setShow(true)}
          />
        )}
      </div>

      <Modal show={show} onHide={() => setShow(false)} centered size="lg">
        <Modal.Body style={{ padding: 0 }}>
          <img src={imgSrc} alt="" style={{ width: "100%" }} />
        </Modal.Body>
      </Modal>
    </>
  );
};
export default SimpleImageCell; 