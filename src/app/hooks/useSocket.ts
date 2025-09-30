
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string) {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io(url, {
            transports: ["websocket", "polling"],
        });

        setSocket(newSocket);

        // Khi connect
        newSocket.on("connect", () => {
            console.log("✅ Connected:", newSocket.id);
        });

        // Khi disconnect
        newSocket.on("disconnect", () => {
            console.log("❌ Disconnected");
        });

        return () => {
            newSocket.disconnect();
        };
    }, [url]);

    return socket;
}
