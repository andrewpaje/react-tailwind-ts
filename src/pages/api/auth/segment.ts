import { Server as IOServer } from "socket.io";
import type { Server as HTTPServer } from "http";
import type { Socket as NetSocket } from "net";
import Analytics from "@segment/analytics-node";
import { getSession, getSegmentKey } from "@eco/stratos-auth";
import getConfig from "next/config";
import { Claims } from "@auth0/nextjs-auth0";
import { AuthInfo } from "@eco/stratos-auth/dist/types";
import { NextApiRequest, NextApiResponse } from "next";
import { nanoid } from "nanoid";

interface SocketServer extends HTTPServer {
  io?: IOServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

const segmentHandler = async (
  req: NextApiRequest,
  res: NextApiResponseWithSocket,
) => {
  const { publicRuntimeConfig, serverRuntimeConfig } = getConfig() as AuthInfo;
  const segmentKey = await getSegmentKey();

  if (segmentKey !== undefined) {
    const analytics = new Analytics({
      writeKey: segmentKey,
    });
    if (!res.socket.server.io) {
      const io = new IOServer(res.socket.server, {
        transports: ["websocket"],
      });

      let user: Claims | undefined = undefined;

      await getSession(req, res).then((data) => ({ user } = data!));

      const startSession = (uuid: string) => {
        analytics.track({
          userId: user!.sub as string,
          event: "Session Start",
          properties: {
            sessionId: uuid,
            clientId: serverRuntimeConfig.DTN_CLIENT_ID,
            productCode: publicRuntimeConfig.DTN_PRODUCT_CODE,
            userId: user!.sub as string,
            requesterIp: user!["https://auth.dtn.com/requesterIp"] as string,
          },
        });
      };

      const endSession = (uuid: string) => {
        analytics.track({
          userId: user!.sub as string,
          event: "Session End",
          properties: {
            sessionId: uuid,
            clientId: serverRuntimeConfig.DTN_CLIENT_ID,
            productCode: publicRuntimeConfig.DTN_PRODUCT_CODE,
            userId: user!.sub as string,
            requesterIp: user!["https://auth.dtn.com/requesterIp"] as string,
          },
        });
      };

      io.on("connection", (socket) => {
        if (user) {
          const uuid = nanoid();

          startSession(uuid);

          socket.on("disconnecting", () => {
            endSession(uuid);
          });

          socket.on("session active", () => {
            startSession(uuid);
          });

          socket.on("session idle", () => {
            endSession(uuid);
          });
        }
      });

      res.socket.server.io = io;
    }
  } else {
    console.warn(
      "eco-auth could not retrieve the segment write key from identity.",
    );
  }

  res.end();
};

export default segmentHandler;
