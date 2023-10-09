import { MessageT } from "@/types/collections";
import { messagesAtom } from "@/atoms/chat";

import { useAtom } from "jotai";  

const useMessages = () => {
    // States
    const [messages, setMessages] = useAtom(messagesAtom);

    const deleteMessageHandler = async (message: MessageT) => {
        await fetch("/api/supabase/message", {
            method: "PATCH",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            message,
            }),
        });
  
        // Remove it from the messages list
        const newMessages = messages.filter((m) => m.id !== message.id);
        setMessages(newMessages);
    }

    const updateMessageHandler = async (message: MessageT) => {
        await fetch("/api/supabase/message", {
            method: "PUT",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
            message,
            }),
        });

        // Update it from the messages list
        const newMessages = messages.map((m) => {
            if (m.id === message.id) {
            return message;
            }
            return m;
        });
        setMessages(newMessages);
    }

    return {
        deleteMessageHandler,
        updateMessageHandler,
    };
};

export default useMessages;