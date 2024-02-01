import { Response } from "express";

function UnauthenticatedError(response: Response) {
  response.status(401).json({
    statusCode: 401,
    message: "You need to be authenticated to access this route",
  })
}

function InternalServerError(response: Response, message?: string) {
  response.status(500).json({
    statusCode: 500,
    message: message || "Something happened on the servers",
  })
}

function UnprocessableEntityError(response: Response, details: Object, message?: string) {
  response.status(422).json({
    statusCode: 422,
    message: message || "Unable to process type of the input",
    details: details || {},
  })
}

function NotFoundError(response: Response, message?: string) {
  response.status(404).json({
    statusCode: 404,
    message: message || "Requested resoure doest exists.",
  })
}

export default Object.freeze({
  UnauthenticatedError,
  InternalServerError,
  UnprocessableEntityError,
  NotFoundError,
});
