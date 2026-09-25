import express, {
  type ErrorRequestHandler,
  type Express,
  type RequestHandler,
} from "express";
import cors from "cors";
import type { IncomingMessage, ServerResponse } from "node:http";
import { pinoHttp } from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();
// This API has no upload or large-payload endpoints; 16 KB leaves ample room
// for future small JSON commands while bounding parser memory consumption.
const requestBodyLimit = "16kb";

type HttpError = Error & {
  status?: number;
  statusCode?: number;
  type?: string;
};

const apiNotFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "Route not found",
    },
  });
};

const apiErrorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  const httpError = error as HttpError;
  const status =
    httpError.type === "entity.too.large"
      ? 413
      : httpError.type === "entity.parse.failed"
        ? 400
        : httpError.statusCode ?? httpError.status ?? 500;
  const isClientError = status >= 400 && status < 500;
  const code =
    status === 413
      ? "PAYLOAD_TOO_LARGE"
      : status === 400
        ? "BAD_REQUEST"
        : "INTERNAL_SERVER_ERROR";
  const message =
    status === 413
      ? "Request body too large"
      : status === 400
        ? "Malformed JSON request body"
        : "Internal server error";

  if (!isClientError) {
    logger.error({ err: error }, "Unhandled API error");
  }

  res.status(status).json({ error: { code, message } });
};

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: IncomingMessage) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: ServerResponse) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
// There is no current cross-origin API consumer. Keep the established
// permissive behavior until preview and production origins are configured.
app.use(cors());
app.disable("x-powered-by");
// This app is served only by the API function, so these response headers do
// not impose a CSP or other browser policy on the separately hosted frontend.
app.use((_req, res, next) => {
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  next();
});
app.use(express.json({ limit: requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: requestBodyLimit }));

app.use("/api", router);
app.use("/api", apiNotFoundHandler);
app.use(apiErrorHandler);

export default app;
