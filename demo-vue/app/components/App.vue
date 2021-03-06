<template>
  <Page @loaded="onLoaded">
    <ActionBar title="Yoonit Camera"/>
    <GridLayout
      height="100%"
      width="100%"
    >
      <GridLayout
        height="100%"
        width="100%"
      >
        <YoonitCamera
          ref="yooCamera"
          :initialLens="cameraLens"
          :captureType="captureType"
          :numberOfImages="numberOfImages"
          :timeBetweenImages="timeBetweenImages"
          :saveImageCaptured="saveImageCaptured"
          :faceDetectionBox="faceDetectionBox"
          :faceROI="faceROI"

          @faceDetected="doFaceDetected"
          @imageCaptured="doImageCaptured"
          @endCapture="doEndCapture"
          @qrCodeContent="doQRCodeContent"
          @status="doStatus"
          @permissionDenied="doPermissionDenied"
        />
      </GridLayout>
      <GridLayout
        height="100%"
        width="100%"
      >
        <FlexboxLayout
          flexDirection="column"
          justifyContent="flex-end"
        >
          <Image
            :src="imagePath"
            width="200"
            height="200"
            v-if="saveImageCaptured && (captureType === 'face' || captureType === 'frame')"
          />
          <TextField
            class="message"
            :text="qrCodeContent"
            v-if="captureType === 'qrcode'"
          />
        </FlexboxLayout>
      </GridLayout>
      <GridLayout
        height="100%"
        width="100%"
      >
        <StackLayout>
          <StackLayout orientation="horizontal">
            <Button
              :text="cameraLens === 'back' ? 'BACK CAM' : 'FRONT CAM'"
              horizontalAlignment="left"
              @tap="cameraLens = cameraLens === 'back' ? 'front' : 'back';" />
            <Button
              text="TOGGLE BOX"
              horizontalAlignment="left"
              @tap="faceDetectionBox = !faceDetectionBox" />
            <Button
              text="TOGGLE SAVE"
              horizontalAlignment="left"
              @tap="saveImageCaptured = !saveImageCaptured" />
          </StackLayout>
          <Label text="Tipos de Captura:" />
          <StackLayout orientation="horizontal">
            <Button
              :class="captureType === 'none' ? 'selected' : ''"
              text="NONE"
              horizontalAlignment="left"
              @tap='captureType ="none"' />
            <Button
              :class="captureType === 'face' ? 'selected' : ''"
              text="FACE"
              horizontalAlignment="left"
              @tap="captureType = 'face'" />
            <Button
              :class="captureType === 'qrcode' ? 'selected' : ''"
              text="QRCODE"
              horizontalAlignment="left"
              @tap="captureType = 'qrcode'" />
            <Button
              :class="captureType === 'frame' ? 'selected' : ''"
              text="FRAME"
              horizontalAlignment="left"
              @tap="captureType = 'frame'" />
          </StackLayout>
          <FlexboxLayout>
            <Label
              v-if="captureType === 'face' || captureType === 'frame'"
              text="Quantidade de captura de imagens: "
            />
            <Label
              v-if="captureType === 'face' || captureType === 'frame'"
              :text="imageInformationCaptured"
            />
          </FlexboxLayout>
        </StackLayout>
      </GridLayout>
    </GridLayout>
  </Page>
</template>

<script>
  export default {
    data: () => ({
      cameraLens: 'front',
      captureType: 'none',
      numberOfImages: 0,
      timeBetweenImages: 1000,
      outputImageWidth: 200,
      outputImageHeight: 200,
      saveImageCaptured: false,
      faceDetectionBox: true,
      faceROI: true,
      imagePath: null,
      imageInformationCaptured: "",
      qrCodeContent: ""
    }),

    methods: {
      async onLoaded() {

        console.log('[YooCamera] Getting Camera view')
        this.$yoo.camera.registerElement(this.$refs.yooCamera)

        console.log('[YooCamera] Getting permission')
        if (await this.$yoo.camera.requestPermission()) {

          console.log('[YooCamera] Permission granted, start preview')
          this.$yoo.camera.preview()
        }
      },

      doFaceDetected({ x, y, width, height }) {
        console.log(
          '[YooCamera] doFaceDetected',
          `{x: ${x}, y: ${y}, width: ${width}, height: ${height}}`
        )

        if (!x || !y || !width || !height) {
          this.imagePath = null
        }
      },

      doImageCaptured({
        type,
        count,
        total,
        image: {
          path,
          source
        }
      }) {
        if (total === 0) {
          console.log('[YooCamera] doImageCaptured', `${type}: [${count}] ${path}`)
          this.imageInformationCaptured = `${count}`
        } else {
          console.log('[YooCamera] doImageCaptured', `${type}: [${count}] of [${total}] - ${path}`)
          this.imageInformationCaptured = `${count} de ${total}`
        }

        this.imagePath = source
      },

      doEndCapture: () => console.log('[YooCamera] doEndCapture'),
      doQRCodeContent: ({ content }) => this.qrCodeContent = content,
      doStatus: ({ status }) => console.log('[YooCamera] doStatus', status),
      doPermissionDenied: () => console.log('[YooCamera] doPermissionDenied'),
    }
  }
</script>

<style scoped>
  ActionBar {
    background-color: #000000;
    color: #ffffff;
  }

  Label {
    margin-left: 12;
  }

  Button {
    padding: 8 12;
    color: #333333;
    background-color: lightgray;
    border-radius: 8;
    margin: 8 0 8 12;
  }

  .selected {
    background-color: #CCCCCC;
  }

  .message {
    vertical-align: center;
    text-align: center;
    font-size: 20;
    color: #333333;
  }
</style>
