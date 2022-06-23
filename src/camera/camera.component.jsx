import React from "react";
import { ReactComponent as CaptureIcon } from "../assets/circle-solid.svg";
import { ReactComponent as CloseCameraIcon } from "../assets/video-slash-solid.svg";
import { ReactComponent as OpenCameraIcon } from "../assets/video-solid.svg";
import { ReactComponent as ChangeCameraIcon } from "../assets/rotate-solid.svg";
import { ReactComponent as ShowImageIcon } from "../assets/images-solid.svg";
import { ReactComponent as CheckIcon } from "../assets/check-solid.svg";
import ImagePreview from "../component/image-preview/image-preview.component";
import "./camera.styles.css";


class Camera extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      front: false,
      cameraIsOn: false,
      currentImage: null,
      attendanceImages: [],
      displayCaptureImage: false,
      displayImagePreview: false,
    };
    this.cameraRef = React.createRef();
    this.cameraStream = null;
    this.canvas = React.createRef();
  }
  componentDidMount() {
    this.clearCanvas();
    this.startstream();
  }

  componentWillUnmount() {
    this.stopstream();
  }
  changeCamera = () => {
    if (this.cameraStream) {
      let currentCameraValue = this.state.front;
      this.setState({ front: !currentCameraValue }, () => {
        this.stopstream();
        this.startstream();
      });
    }
  };

  startstream = () => {
    const mediaSupport = "mediaDevices" in navigator;
    if (mediaSupport && null == this.cameraStream) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: this.state.front ? "user" : "environment" },
        })
        .then((mediaStream) => {
          this.cameraStream = mediaStream;
          this.cameraRef.current.srcObject = mediaStream;
          this.cameraRef.current.play();
          this.setState({ cameraIsOn: true });
        })
        .catch(function (err) {
          console.log("Unable to access camera: " + err);
        });
    } else {
      alert("Your browser does not support media devices.");
      return;
    }
  };

  stopstream = () => {
    if (null != this.cameraStream) {
      this.setState({ cameraIsOn: false });
      this.cameraStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.cameraStream = null;
    }
  };

  capture = () => {
    if (null != this.cameraStream) {
      this.setState({ displayCaptureImage: true }, () => {
        console.log(this.cameraRef.current?.clientHeight);

        this.canvas.current.width = this.cameraRef.current?.clientWidth;
        this.canvas.current.height = this.cameraRef.current?.clientHeight;
        let ctx = this.canvas.current?.getContext("2d");
        ctx?.drawImage(
          this.cameraRef.current,
          0,
          0,
          this.canvas.current?.clientWidth,
          this.canvas.current?.clientHeight
        );
        this.setState(
          { currentImage: this.canvas.current?.toDataURL("image/png") },
          () => {
            console.log(this.state.currentImage);
            this.clearCanvas();
          }
        );
      });
    }
  };

  cancelImage = () => {
    this.setState({ displayCaptureImage: false, currentImage: null });
  };

  selectImage = () => {
    this.setState(
      (preState) => ({
        attendanceImages: [...preState.attendanceImages, preState.currentImage]
      }),
      () => {
        this.setState({ displayCaptureImage: false, currentImage: null });
      }
    );
  };

  clearCanvas = () => {
    this.canvas.current.style.display = "block";
    let ctx = this.canvas.current?.getContext("2d");
    ctx?.clearRect(
      0,
      0,
      this.canvas.current?.clientWidth,
      this.canvas.current?.clientHeight
    );
    this.canvas.current.width = 0;
    this.canvas.current.height = 0;
  };

  continueAttendance = () => {
    
  };

  deleteCapturedImage = (id) => {
    let holdingArray = this.state.attendanceImages;
    holdingArray.splice(id,1);
    this.setState({attendanceImages:[...holdingArray]});
  };

  openImagePreview = () => {
    this.setState({ displayImagePreview: true });
  };

  closeImagePreview = () => {
    this.setState({ displayImagePreview: false });
  };

  render() {
    return (
      <div className="play-area">
        <div className="play-area-sub">
          <p className="loading-camera">loading camera....</p>
          <div className="nav-bar">
            <CheckIcon
              className="nav-bar-icon"
              onClick={this.continueAttendance}
            />
            <div>
              <ShowImageIcon className="nav-bar-icon" onClick={this.openImagePreview} />
              <div className="image-capture-detail" onClick={this.openImagePreview}>
                <p>{this.state.attendanceImages.length}</p>
              </div>
            </div>
          </div>
          <video ref={this.cameraRef} id="stream" autoPlay></video>
          <div className="button-group">
            {this.state.cameraIsOn ? (
              <CloseCameraIcon
                className="camera-icon small-camera-icon"
                onClick={this.stopstream}
              />
            ) : (
              <OpenCameraIcon
                className="camera-icon small-camera-icon"
                onClick={this.startstream}
              />
            )}
            <CaptureIcon className="camera-icon" onClick={this.capture} />
            <ChangeCameraIcon
              className="camera-icon small-camera-icon"
              onClick={this.changeCamera}
            />
          </div>
        </div>
        <canvas ref={this.canvas} id="capture"></canvas>
        {this.state.displayCaptureImage ? (
          <div className="capture-area">
            <img
              className="display-image"
              src={this.state.currentImage}
              alt="imagecaptured"
            />
            <p className="popup-text">Do You want to save this Picture?</p>
            <div>
              <button
                className="btn btn-success m-2"
                onClick={this.selectImage}
              >
                yes
              </button>
              <button className="btn btn-danger m-2" onClick={this.cancelImage}>
                no
              </button>
            </div>
          </div>
        ) : null}
        {this.state.displayImagePreview ? (
          <ImagePreview
            deleteCapturedImage={this.deleteCapturedImage}
            attendanceImages={this.state.attendanceImages}
            closeImagePreview={this.closeImagePreview}
          />
        ) : null}
      </div>
    );
  }
}

export default Camera;
