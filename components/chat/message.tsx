"use client";
import { MessageT } from "@/types/collections";

import { useAuth } from "@/lib/supabase/supabase-auth-provider";
import "highlight.js/styles/github-dark-dimmed.css";
//import "@/public/dracula.css";
import { Clipboard, Trash2, FileEdit } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useMessages from "@/hooks/useMenssage";
import { cn } from "@/utils/cn";
import type {CodeComponent} from 'react-markdown/lib/ast-to-react';


const Message = ({ message }: { message: MessageT }) => {
  const isAssistant = message.role === "assistant";
  const codeRef = useRef<HTMLElement>(null);
  const { user } = useAuth();
  const { deleteMessageHandler,updateMessageHandler } = useMessages();

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (message.id) {
      try {
        await deleteMessageHandler(message);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const[isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  useEffect(() => {
    setEditContent(message.content);
  }, [message]);

  const handleEdit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (message.id) {
      try {
        await updateMessageHandler({...message, content: editContent});
        setIsEditing(false);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  }

  return (
    <div
      className={
        !isAssistant
          ? "dark:bg-neutral-950/60 bg-neutral-100/50 last:pb-64 last:sm:pb-44"
          : "dark:bg-neutral-900 bg-neutral-200/40 last:pb-64 last:sm:pb-44"
      }
    >
      {/* Container */}
      <div className="flex w-full max-w-3xl gap-4 px-4 py-10 mx-auto sm:px-8">
        {/* Avatar */}
        <Avatar className="w-8 h-8 ring-2 ring-offset-2 dark:ring-neutral-700 ring-neutral-400">
          <AvatarImage
            src={
              !isAssistant
                ? user?.avatar_url ?? "/user-avatar.png"
                : "/makr.-avatar.png"
            }
          />
          <AvatarFallback>{!isAssistant ? "YOU" : "AI"}</AvatarFallback>
        </Avatar>
        {/* Message */}
        <div className="w-[calc(100%-50px)]">
          {!isEditing ? (
            <div>
              {!isAssistant || message.content !== "" ? (
                <ReactMarkdown
                  className="break-words markdown"
                  components={{
                    code: ({ children, className }) => {
                      const language = className?.split("-")[1];
                      const match = /language-(\w+)/.exec(className || '')
                      if (!match)
                      return (
                        <span className="px-2 py-1 text-sm rounded-md dark:bg-neutral-800 bg-neutral-50">
                          {children}
                        </span>
                      );
                      return (
                        <div className="w-full my-5 overflow-hidden rounded-md">
                          {/* Code Title */}
                          <div className="dark:bg-[#0d111780] bg-neutral-50 py-2 px-3 text-xs flex items-center justify-between">
                            <div>{language ?? "javascript"}</div>
                            {/* Copy code to the clipboard */}
                            <CopyToClipboard
                              text={codeRef?.current?.innerText as string}
                            >
                              <button className="flex items-center gap-1">
                                <Clipboard size="14" />
                                Copy Code
                              </button>
                            </CopyToClipboard>
                          </div>
                          {/* Code Block */}
                          <code
                            ref={codeRef}
                            className={
                              (className ?? "hljs language-javascript") +
                              " !whitespace-pre"
                            }
                            >
                            {children}
                          </code>
                        </div>
                      );
                    },
                  }}
                  rehypePlugins={[rehypeHighlight]}
                  remarkPlugins={[remarkGfm]}
                  >
                  {message.content ?? ""}
                </ReactMarkdown>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1 text-sm rounded-md max-w-fit dark:bg-neutral-950/50 bg-neutral-200">
                  <div className="w-2 h-2 bg-indigo-900 rounded-full animate-pulse" />
                  <span>Thinking</span>
                </div>
              )}
            </div>
          ) : (
            <textarea
              className="break-words w-full resize-none focus:outline-none focus:ring-0 dark:bg-neutral-950/20 p-2 bg-neutral-200"
              value={editContent ?? ""}
              onChange={(e) => setEditContent(e.target.value)}
              rows={Math.max(1, Math.ceil((editContent ?? '').length / 44))}
            />
          )}
        </div>
        <div>
          <button onClick={handleDelete}>
            <Trash2 size={18} className="cursor-pointer text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300" />
          </button>
          {/* {!isEditing ? (
            <button onClick={handleToggleEdit}>
              <FileEdit size={18} className="cursor-pointer text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300" />
            </button>
          ) : (
            <button onClick={handleEdit}>
              Save
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default Message;
