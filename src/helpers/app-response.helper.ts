import * as fs from "fs";

function formatMessage(objectOrMessage: any) {
  if (typeof objectOrMessage === "string") return objectOrMessage;

  if (typeof objectOrMessage === "object" && objectOrMessage.message) {
    return objectOrMessage.message;
  }

  return "";
}

function appResponse(
  res: any,
  statusCode: number = 200,
  objectOrMessage: string,
  data: any = null
) {
  const statusCodeFirstChar = statusCode.toString().charAt(0);
  const success =
    statusCodeFirstChar === "4" || statusCodeFirstChar === "5" ? false : true;
  if (data) {
    res.status(statusCode).send({
      success,
      message: formatMessage(objectOrMessage),
      data,
    });
    return;
  }

  res.status(statusCode).send({
    success,
    message: formatMessage(objectOrMessage),
  });
  return;
}

function appResponseWithoutRes(
  success = null,
  objectOrMessage: any,
  data = null
) {
  if (data) {
    return {
      success: success === null ? true : success,
      message: formatMessage(objectOrMessage),
      data,
    };
  }
  return {
    success: success === null ? true : success,
    message: formatMessage(objectOrMessage),
  };
}

function appDownloadResponse(
  res: any,
  data: any = null
) {

  res.download(data);

  // to ensure file is deleted
  res.download(data, () => {
    fs.unlink(data, (err) => {});
  });

  return;
}

export { appResponse, appResponseWithoutRes, appDownloadResponse };
