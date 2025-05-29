const styles = {
  mainTicket: `
    .copyBtnStyle {
      display: block;
      background-color: #f9f9f9;
      cursor: pointer;
      color: #999;
      border: 1px solid rgb(197, 208, 220);
      padding: 7px 12px 8px;
      line-height: 18px;
    }

    .copyBtnStyle:hover {
      background-color: #fff;
      border: 1px solid #000;
      color: #cc0000;
    }

    .copyCellphoneBtn {
      position: absolute;
      right: 0;
      padding: 7px 7px 7px;
    }

    .histBtn {
      background-color: #f9f9f9;
      cursor: pointer;
      color: #999;
      border: 1px solid gray;
      line-height: 1.5;
      padding: 1.5px 5px;
      padding-bottom: 3px;
      margin-inline: 2px;
    }

    .histBtn:hover {
      background-color: #fff;
      border: 1px solid #000;
      color: #cc0000 !important;
    }

    .histBlock {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      padding-inline: 0;
    }

    .azureBtnStyle:hover {
      color: #0078d4;
    }

    .selectDefaultTextStyle,
    .selectDefaultTextStyle:focus {
      background: #fff;
      vertical-align: middle;
      background-color: #fafafa !important;
    }

    .selectTopic {
      background: #d5d5d5;
      font-weight: bold;
    }

    .azureBtnStyle:hover {
      color: #0078d4;
    }

    .selectDefaultTextStyle,
    .selectDefaultTextStyle:focus {
      background: #fff;
      vertical-align: middle;
      background-color: #fafafa !important;
    }

    .selectTopic {
      background: #d5d5d5;
      font-weight: bold;
    }

    .modalBackdrop {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100vw;
      height: 100vh;
      background-color: #00000096;
    }

    .modalWrapper {
      width: 65vw;
      height: 80vh;
      background-color: #fff;
      padding: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      gap: 20px;
    }

    .modalContent {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
    }

    .modalMsg {
      max-width: 95%;
      background-color: #ff88004a;
      padding: 10px;
      border-radius: 10px 0px 10px 10px;
      word-break: break-all;
    }

    .modalMsgOther {
      max-width: 95%;
      background-color: #00000012;
      padding: 10px;
      border-radius: 0px 10px 10px 10px;
    }

    .modalMsgInfo {
      font-size: 10px;
      color: #cdcbcb;
    }

    .modalMsgWrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-inline: 5px;
    }

    .modalTextArea {
      width: 100%;
      height: 100%;
      resize: none;
      border-radius: 10px;
      font-size: 18px;
      background-color: #e4e6e9;
      color: #696969;
    }

    .modalTextArea:focus {
      background-color: #e4e6e9;
      color: #696969;
    }

    .modalSendBtn {
      color: #0078d4;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      outline: none;
      scale: 1.5;
    }

    .modalSendWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      gap: 20px;
    }

    .modalLinkWrapper {
      min-width: 20vw;
      min-height: 20vh;
      background-color: #fff;
      padding: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      gap: 20px;
    }

    .modalLinkInput {
      width: 100%;
      height: 100%;
      resize: none;
      border-radius: 10px;
      font-size: 18px;
      background-color: white;
      padding: 5px;
      color: #696969;
      border: 1px solid #d5d5d5;
    }

    .modalLinkInput:focus {
      background-color: #e4e6e9;
      color: #696969;
    }

    .modalLinkConfirmBtn {
      color: #0078d4;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      outline: none;
      transition: all 0.3s;
    }

    .modalLinkConfirmBtn:hover {
      scale: 1.1;
    }
  `,
  mainHistory: `
    .histBtn {
      display: block;
      background-color: #f9f9f9;
      cursor: pointer;
      color: #999;
      border: 1px solid gray;
      line-height: 1.5;
      margin: 0 !important;
    }

    .histBtn:hover {
      background-color: #fff;
      border: 1px solid #000;
      color: #cc0000 !important;
    }

    .histBlock {
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      padding-inline: 0;
    }

    .azureBtnStyle:hover {
      color: #0078d4;
    }

    .selectDefaultTextStyle,
    .selectDefaultTextStyle:focus {
      background: #fff;
      vertical-align: middle;
      background-color: #fafafa !important;
    }

    .selectTopic {
      background: #d5d5d5;
      font-weight: bold;
    }

    .modalBackdrop {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 0;
      left: 0;
      z-index: 100;
      width: 100vw;
      height: 100vh;
      background-color: #00000096;
    }

    .modalWrapper {
      width: 65vw;
      height: 80vh;
      background-color: #fff;
      padding: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      border-radius: 10px;
      gap: 20px;
    }

    .modalContent {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
      overflow-y: auto;
    }

    .modalMsg {
      max-width: 95%;
      background-color: #ff88004a;
      padding: 10px;
      border-radius: 10px 0px 10px 10px;
      word-break: break-all;
    }

    .modalMsgOther {
      max-width: 95%;
      background-color: #00000012;
      padding: 10px;
      border-radius: 0px 10px 10px 10px;
    }

    .modalMsgInfo {
      font-size: 10px;
      color: #cdcbcb;
    }

    .modalMsgWrapper {
      display: flex;
      flex-direction: column;
      gap: 5px;
      margin-inline: 5px;
    }

    .modalTextArea {
      width: 100%;
      height: 100%;
      resize: none;
      border-radius: 10px;
      font-size: 18px;
      background-color: #e4e6e9;
      color: #696969;
    }

    .modalTextArea:focus {
      background-color: #e4e6e9;
      color: #696969;
    }

    .modalSendBtn {
      color: #0078d4;
      padding: 10px;
      border-radius: 10px;
      cursor: pointer;
      border: none;
      outline: none;
      scale: 1.5;
    }

    .modalSendWrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100px;
      gap: 20px;
    }

    .copyBtnStyle {
      display: block;
      background-color: #f9f9f9;
      cursor: pointer;
      color: #999;
      border: 1px solid rgb(197, 208, 220);
      padding: 5px 5px 5px;
      line-height: 18px;
    }

    .copyBtnStyle:hover {
      background-color: #fff;
      border: 1px solid #000;
      color: #cc0000;
    }
  `,
  mainAlert: `
    .alertBtn {
      background-color: #f9f9f9;
      cursor: pointer;
      color: #999;
      border: 1px solid gray;
      line-height: 1.5;
      padding: 1.5px 5px;
      padding-bottom: 3px;
      margin-inline: 2px;
    }

    .alertBtn:hover {
      background-color: #fff;
      border: 1px solid #000;
      color: #cc0000 !important;
    }

    .alertListContainer {
      position: relative;
      max-width: 0;
      max-height: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .alertListContainerOpen {
      max-width: 300px;
      max-height: 500px;
      overflow-x: hidden;
      overflow-y: auto;
    }
  `,
};
