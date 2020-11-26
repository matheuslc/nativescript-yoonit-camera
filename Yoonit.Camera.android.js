import { CameraBase } from './Yoonit.Camera.common';
import * as permissions from 'nativescript-permissions';
import { ImageSource, File } from '@nativescript/core';
const CAMERA = () => android.Manifest.permission.CAMERA;
export class YoonitCamera extends CameraBase {
    createNativeView() {
        this.nativeView = new ai.cyberlabs.yoonit.camera.CameraView(this._context);
        this.nativeView.setCameraEventListener(CameraEventListener.initWithOwner(new WeakRef(this)));
        return this.nativeView;
    }
    initNativeView() {
        this.nativeView.owner = this;
        super.initNativeView();
    }
    disposeNativeView() {
        this.nativeView.stopCapture();
        this.nativeView.owner = null;
        super.disposeNativeView();
    }
    startCapture(captureType) {
        this.nativeView.startCaptureType(captureType);
    }
    setFaceNumberOfImages(faceNumberOfImages) {
        this.nativeView.setFaceNumberOfImages(faceNumberOfImages);
    }
    setFaceDetectionBox(faceDetectionBox) {
        this.nativeView.setFaceDetectionBox(faceDetectionBox);
    }
    setFaceSaveImages(faceSaveImages) {
        this.nativeView.setFaceSaveImages(faceSaveImages);
    }
    setFaceTimeBetweenImages(faceTimeBetweenImages) {
        this.nativeView.setFaceTimeBetweenImages(faceTimeBetweenImages);
    }
    setFacePaddingPercent(facePaddingPercent) {
        this.nativeView.setFacePaddingPercent(facePaddingPercent);
    }
    setFaceImageSize(width, height) {
        this.nativeView.setFaceImageSize(width, height);
    }
    setFaceCaptureMinSize(faceCaptureMinSize) {
        this.nativeView.setFaceCaptureMinSize(faceCaptureMinSize);
    }
    setFaceCaptureMaxSize(faceCaptureMaxSize) {
        this.nativeView.setFaceCaptureMaxSize(faceCaptureMaxSize);
    }
    setFrameNumberOfImages(frameNumberOfImages) {
        this.nativeView.setFrameNumberOfImages(frameNumberOfImages);
    }
    setFrameTimeBetweenImages(frameTimeBetweenImages) {
        this.nativeView.setFrameTimeBetweenImages(frameTimeBetweenImages);
    }
    requestPermission(explanation = '') {
        return new Promise((resolve, reject) => permissions
            .requestPermission(CAMERA(), explanation)
            .then(() => resolve(true))
            .catch(err => reject(false)));
    }
    hasPermission() {
        return permissions.hasPermission(CAMERA());
    }
}
var CameraEventListener = /** @class */ (function (_super) {
    __extends(CameraEventListener, _super);
    function CameraEventListener(owner) {
        var _this = _super.call(this) || this;
        _this.owner = owner;
        // Required by Android runtime when native class is extended through TypeScript.
        return global.__native(_this);
    }
    CameraEventListener_1 = CameraEventListener;
    CameraEventListener.initWithOwner = function (owner) {
        return new CameraEventListener_1(owner);
    };
    CameraEventListener.prototype.imageProcessing = function (imagePath) {
        var source = ImageSource.fromFileSync(imagePath);
        var imageFile = File.fromPath(imagePath);
        var binary = imageFile.readSync();
        return {
            path: imagePath,
            source: source,
            binary: binary
        };
    };
    CameraEventListener.prototype.onFaceImageCreated = function (count, total, imagePath) {
        var owner = this.owner.get();
        var image = this.imageProcessing(imagePath);
        if (owner) {
            owner.notify({
                eventName: 'faceImage',
                object: owner,
                count: count,
                total: total,
                image: image
            });
        }
    };
    CameraEventListener.prototype.onFrameImageCreated = function (count, total, imagePath) {
        var owner = this.owner.get();
        var image = this.imageProcessing(imagePath);
        if (owner) {
            owner.notify({
                eventName: 'frameImage',
                object: owner,
                count: count,
                total: total,
                image: image
            });
        }
    };
    CameraEventListener.prototype.onFaceDetected = function (x, y, width, height) {
        var owner = this.owner.get();
        if (owner) {
            owner.notify({
                eventName: 'faceDetected',
                object: owner,
                x: x,
                y: y,
                width: width,
                height: height
            });
        }
    };
    CameraEventListener.prototype.onFaceUndetected = function () {
        var owner = this.owner.get();
        if (owner) {
            owner.notify({
                eventName: 'faceDetected',
                object: owner,
                x: null,
                y: null,
                width: null,
                height: null
            });
        }
    };
    CameraEventListener.prototype.onEndCapture = function () {
        var owner = this.owner.get();
        if (owner) {
            owner.notify({
                eventName: 'endCapture',
                object: owner,
            });
        }
    };
    CameraEventListener.prototype.onBarcodeScanned = function (content) {
        var owner = this.owner.get();
        if (owner) {
            owner.notify({
                eventName: 'qrCodeContent',
                object: owner,
                content: content
            });
        }
    };
    CameraEventListener.prototype.onError = function (error) {
        var owner = this.owner.get();
        if (owner) {
            owner.notify({
                eventName: 'status',
                object: owner,
                status: {
                    type: 'error',
                    status: error
                }
            });
        }
    };
    CameraEventListener.prototype.onMessage = function (message) {
        var owner = this.owner.get();
        if (owner) {
            owner.notify({
                eventName: 'status',
                object: owner,
                status: {
                    type: 'message',
                    status: message
                }
            });
        }
    };
    CameraEventListener.prototype.onPermissionDenied = function () {
        var owner = this.owner.get();
        if (owner) {
            owner.notify({
                eventName: 'permissionDenied',
                object: owner,
            });
        }
    };
    var CameraEventListener_1;
    CameraEventListener = CameraEventListener_1 = __decorate([
        Interfaces([ai.cyberlabs.yoonit.camera.interfaces.CameraEventListener])
    ], CameraEventListener);
    return CameraEventListener;
}(java.lang.Object));
//# sourceMappingURL=Yoonit.Camera.android.js.map