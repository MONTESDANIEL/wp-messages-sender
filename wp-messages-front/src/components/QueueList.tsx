import React from "react";
import { Clock, Check, X } from "lucide-react";

interface TextMessage {
    id: number;
    instance: string;
    number: string;
    status: "pending" | "sended" | "failed";
    text: string;
    createdAt?: string;
}

interface MediaMessage {
    id: number;
    number: string;
    instance: string;
    mediatype: "image" | "video";
    media: string;
    caption?: string;
    status?: "pending" | "sended" | "failed";
    createdAt?: string;
}

interface QueueListProps {
    messages: TextMessage[] | MediaMessage[];
    type: "text" | "media";
}

const QueueList: React.FC<QueueListProps> = ({ messages, type }) => {
    if (messages.length === 0) {
        return (
            <div className="flex items-center justify-center p-4 bg-neutral-100 dark:bg-neutral-900">
                <p className="text-neutral-500 dark:text-neutral-400">No hay mensajes en cola.</p>
            </div>
        );
    }

    return (
        <div className="w-full rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <div className="max-h-[400px] overflow-y-auto">
                {messages.map((message, index) => (
                    <div
                        key={message.id}
                        className={`flex justify-between p-2 ${index % 2 === 0
                            ? "bg-neutral-200 dark:bg-neutral-800"
                            : "bg-neutral-300 dark:bg-neutral-700"
                            }`}
                    >
                        {type === "text" ? (
                            <div>
                                <p className="text-neutral-700 dark:text-neutral-200 font-bold">{(message as TextMessage).number.slice(2)}</p>
                                <p className="text-neutral-500 dark:text-neutral-400">{(message as TextMessage).text}</p>
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <div>
                                    {(message as MediaMessage).mediatype === "video" ? (
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-300 dark:bg-neutral-700">
                                            <video
                                                src={(message as MediaMessage).media}
                                                className="absolute inset-0 w-full h-full object-cover"
                                                preload="metadata"
                                                muted
                                                playsInline
                                                controls={false}
                                                style={{ pointerEvents: "none" }}
                                            />
                                            <span className="absolute inset-0 flex items-center justify-center text-white bg-black/40">
                                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <polygon points="8,5 19,12 8,19" />
                                                </svg>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-neutral-300 dark:bg-neutral-700">
                                            <img
                                                src={(message as MediaMessage).media}
                                                alt={(message as MediaMessage).caption || "No caption"}
                                                className="h-full w-full rounded-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mx-4">
                                    <p className="text-neutral-700 dark:text-neutral-200 font-bold">{(message as MediaMessage).number.slice(2)}</p>
                                    <p className="text-neutral-500 dark:text-neutral-400">{(message as MediaMessage).caption || "No caption"}</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center px-2">
                            {message.status === "pending" ? (
                                <Clock className="text-yellow-500" />
                            ) : message.status === "sended" ? (
                                <Check className="text-green-500" />
                            ) : (
                                <X className="text-red-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div >
        </div>
    );
};

export default QueueList;