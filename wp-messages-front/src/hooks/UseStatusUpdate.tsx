import { useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useStatusUpdates(onUpdate: (data: any) => void) {
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        console.log("Opening Web Socket...");

        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8081/ws"),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket connected");
                client.subscribe("/topic/queue-updates", (message) => {
                    const update = JSON.parse(message.body);
                    onUpdate(update);
                });
            },
            onStompError: (frame) => {
                console.error("STOMP error", frame.headers["message"]);
            },
            onWebSocketClose: () => {
                console.warn("WebSocket closed");
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            console.log(">>> DISCONNECT");
            if (clientRef.current && clientRef.current.active) {
                clientRef.current.deactivate();
            } else {
                console.warn("WebSocket not connected, skipping disconnect");
            }
        };
    }, []);
}
