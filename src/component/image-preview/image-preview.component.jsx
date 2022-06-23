import React from "react";
import "./image-preview.styles.css";
import { ReactComponent as CrossIcon } from "../../assets/x-solid.svg";
import {ReactComponent as TrashIcon} from "../../assets/trash-solid.svg";

const ImagePreview = ({
  deleteCapturedImage,
  attendanceImages,
  closeImagePreview,
}) => (
  <div className="image-preview">
    <div className="cross-icon-div">
      <CrossIcon className="cross-icon" onClick={closeImagePreview} />
    </div>
    {attendanceImages.map((image, index) => (
      <div className="image-card" key={index}>
        <div className="cross-icon-div">

        <TrashIcon
          className="cross-icon"
          onClick={() => {
            deleteCapturedImage(index);
          }}
        />
        </div>
        <img className="attendance-card-image" src={image} alt={index} />
      </div>
    ))}
  </div>
);

export default ImagePreview;
