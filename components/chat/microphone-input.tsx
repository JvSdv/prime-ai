"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useAtom } from 'jotai';
import { Mic } from 'lucide-react';
import { inputAtom } from '@/atoms/chat';

declare global {
  interface Window {
    webkitSpeechRecognition: any;
  }
}

export default function MicrophoneInput() {
  const [inputValue, setInputValue] = useAtom(inputAtom);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    recognitionRef.current = new window.webkitSpeechRecognition();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;

    recognitionRef.current.onresult = (event:any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal && event.results[i][0].confidence) {
          transcript += event.results[i][0].transcript;
        }
      }
      setInputValue(inputValue + ' ' + transcript);
    };

    recognitionRef.current.start();
  }, [inputValue, setInputValue]);

  
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };
  
  useEffect(() => {
    if (!window.webkitSpeechRecognition) {
      console.log('Speech Recognition API not supported');
      return;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  return (
    <div className="flex items-center justify-center mr-3">
      <button onClick={handleToggleRecording} className="p-2 transition-colors duration-200 ease-in-out bg-transparent hover:bg-red-300 hover:text-white active:bg-red-700 focus:outline-none rounded">
        <Mic size={24} className={`${isRecording ? 'text-red-500' : 'text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300'}`} />
      </button>
    </div>
  );
}
//passos
//peguei o codigo
//mandei retirar o wisper
//mandei retirar o input de texto, deixando apenas o microfone
// retire tudo que tem haver com o input, quero apenas que retorne o icone do microfone e com seu funcionamento, dê o nome do compoente MicrophoneInput, utilize ```const [inputValue, setInputValue] = useAtom(inputAtom);``` para ir modificando o texto do input enquanto ocorre a fala, utilize para o microfone o icone ```import { Mic } from "lucide-react";``` retire também o mantine com popover e actionIcon, deixe apenas o botao do microfone e para o erro reenderize um alert simples, se for utilizar algum estilo utilize o tailwind


//propt:
// export default function MessageInput(props: MessageInputProps) {
//     const message = useAppSelector(selectMessage);
//     const [recording, setRecording] = useState(false);
//     const [speechError, setSpeechError] = useState<string | null>(null);
//     const hasVerticalSpace = useMediaQuery('(min-height: 1000px)');
//     const [useOpenAIWhisper] = useOption<boolean>('speech-recognition', 'use-whisper');
//     const [openAIApiKey] = useOption<string>('openai', 'apiKey');

//     const [initialMessage, setInitialMessage] = useState('');
//     const {
//         transcribing,
//         transcript,
//         startRecording,
//         stopRecording,
//     } = useWhisper({
//         apiKey: openAIApiKey || ' ',
//         streaming: false,
//     });

//     const navigate = useNavigate();
//     const context = useAppContext();
//     const dispatch = useAppDispatch();
//     const intl = useIntl();

//     const tab = useAppSelector(selectSettingsTab);

//     const [showMicrophoneButton] = useOption<boolean>('speech-recognition', 'show-microphone');
//     const [submitOnEnter] = useOption<boolean>('input', 'submit-on-enter');

//     const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
//         dispatch(setMessage(e.target.value));
//     }, [dispatch]);

//     const pathname = useLocation().pathname;

//     const onSubmit = useCallback(async () => {
//         setSpeechError(null);

//         const id = await context.onNewMessage(message);

//         if (id) {
//             if (!window.location.pathname.includes(id)) {
//                 navigate('/chat/' + id);
//             }
//             dispatch(setMessage(''));
//         }
//     }, [context, message, dispatch, navigate]);

//     const onSpeechError = useCallback((e: any) => {
//         console.error('speech recognition error', e);
//         setSpeechError(e.message);

//         try {
//             speechRecognition?.stop();
//         } catch (e) {
//         }

//         try {
//             stopRecording();
//         } catch (e) { }

//         setRecording(false);
//     }, [stopRecording]);

//     const onHideSpeechError = useCallback(() => setSpeechError(null), []);

//     const onSpeechStart = useCallback(async () => {
//         let granted = false;
//         let denied = false;

//         try {
//             const result = await navigator.permissions.query({ name: 'microphone' as any });
//             if (result.state == 'granted') {
//                 granted = true;
//             } else if (result.state == 'denied') {
//                 denied = true;
//             }
//         } catch (e) { }

//         if (!granted && !denied) {
//             try {
//                 const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
//                 stream.getTracks().forEach(track => track.stop());
//                 granted = true;
//             } catch (e) {
//                 denied = true;
//             }
//         }

//         if (denied) {
//             onSpeechError(new Error('speech permission was not granted'));
//             return;
//         }

//         try {
//             if (!recording) {
//                 setRecording(true);

//                 if (useOpenAIWhisper || !supportsSpeechRecognition) {
//                     if (!openAIApiKey) {
//                         dispatch(openOpenAIApiKeyPanel());
//                         return false;
//                     }
//                     // recorder.start().catch(onSpeechError);
//                     setInitialMessage(message);
//                     await startRecording();
//                 } else if (speechRecognition) {
//                     const initialMessage = message;

//                     speechRecognition.continuous = true;
//                     speechRecognition.interimResults = true;

//                     speechRecognition.onresult = (event) => {
//                         let transcript = '';
//                         for (let i = 0; i < event.results.length; i++) {
//                             if (event.results[i].isFinal && event.results[i][0].confidence) {
//                                 transcript += event.results[i][0].transcript;
//                             }
//                         }
//                         dispatch(setMessage(initialMessage + ' ' + transcript));
//                     };

//                     speechRecognition.start();
//                 } else {
//                     onSpeechError(new Error('not supported'));
//                 }
//             } else {
//                 if (useOpenAIWhisper || !supportsSpeechRecognition) {
//                     await stopRecording();
//                     setTimeout(() => setRecording(false), 500);
//                 } else if (speechRecognition) {
//                     speechRecognition.stop();
//                     setRecording(false);
//                 } else {
//                     onSpeechError(new Error('not supported'));
//                 }
//             }
//         } catch (e) {
//             onSpeechError(e);
//         }
//     }, [recording, message, dispatch, onSpeechError, setInitialMessage, openAIApiKey]);

//     useEffect(() => {
//         if (useOpenAIWhisper || !supportsSpeechRecognition) {
//             if (!transcribing && !recording && transcript?.text) {
//                 dispatch(setMessage(initialMessage + ' ' + transcript.text));
//             }
//         }
//     }, [initialMessage, transcript, recording, transcribing, useOpenAIWhisper, dispatch]);

//     useHotkeys([
//         ['n', () => document.querySelector<HTMLTextAreaElement>('#message-input')?.focus()]
//     ]);

//     const blur = useCallback(() => {
//         document.querySelector<HTMLTextAreaElement>('#message-input')?.blur();
//     }, []);

//     const rightSection = useMemo(() => {
//         return (
//             <div style={{
//                 opacity: '0.8',
//                 paddingRight: '0.5rem',
//                 display: 'flex',
//                 justifyContent: 'flex-end',
//                 alignItems: 'center',
//                 width: '100%',
//             }}>
//                 {context.generating && (<>
//                     <Button variant="subtle" size="xs" compact onClick={() => {
//                         context.chat.cancelReply(context.currentChat.chat?.id, context.currentChat.leaf!.id);
//                     }}>
//                         <FormattedMessage defaultMessage={"Cancel"} description="Label for the button that can be clicked while the AI is generating a response to cancel generation" />
//                     </Button>
//                     <Loader size="xs" style={{ padding: '0 0.8rem 0 0.5rem' }} />
//                 </>)}
//                 {!context.generating && (
//                     <>
//                         {showMicrophoneButton && <Popover width={200} position="bottom" withArrow shadow="md" opened={speechError !== null}>
//                             <Popover.Target>
//                                 <ActionIcon size="xl"
//                                     onClick={onSpeechStart}>
//                                     {transcribing && <Loader size="xs" />}
//                                     {!transcribing && <i className="fa fa-microphone" style={{ fontSize: '90%', color: recording ? 'red' : 'inherit' }} />}
//                                 </ActionIcon>
//                             </Popover.Target>
//                             <Popover.Dropdown>
//                                 <div style={{
//                                     display: 'flex',
//                                     flexDirection: 'column',
//                                     alignItems: 'flex-start',
//                                 }}>
//                                     <p style={{
//                                         fontFamily: `"Work Sans", sans-serif`,
//                                         fontSize: '0.9rem',
//                                         textAlign: 'center',
//                                         marginBottom: '0.5rem',
//                                     }}>
//                                         Sorry, an error occured trying to record audio.
//                                     </p>
//                                     <Button variant="light" size="xs" fullWidth onClick={onHideSpeechError}>
//                                         Close
//                                     </Button>
//                                 </div>
//                             </Popover.Dropdown>
//                         </Popover>}
//                         <ActionIcon size="xl"
//                             onClick={onSubmit}>
//                             <i className="fa fa-paper-plane" style={{ fontSize: '90%' }} />
//                         </ActionIcon>
//                     </>
//                 )}
//             </div>
//         );
//     }, [recording, transcribing, onSubmit, onSpeechStart, props.disabled, context.generating, speechError, onHideSpeechError, showMicrophoneButton]);


// //meu codigo:
// const ChatInput = () => {
//   const { addChatHandler } = useChats();
//   const [inputValue, setInputValue] = useAtom(inputAtom);
//   const [isHandling, addMessageHandler] = useAtom(addMessageAtom);
//   const [isRegenerateSeen, regenerateHandler] = useAtom(regenerateHandlerAtom);
//   const hasChatMessages = useAtomValue(currentChatHasMessagesAtom);
//   const cancelHandler = useSetAtom(cancelHandlerAtom);
//   const chatID = useAtomValue(chatIDAtom);

//   // Handle Submit
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!hasChatMessages && !chatID) {
//       await addChatHandler();
//     } else {
//       await addMessageHandler("generate");
//     }
//   };

//   // Enter Key Handler
//   const handleKeyDown = useCallback(
//     async (e: KeyboardEvent) => {
//       if (e.key === "Enter" && !e.shiftKey) {
//         e.preventDefault();
//         if (!hasChatMessages && !chatID) {
//           await addChatHandler();
//         } else {
//           await addMessageHandler("generate");
//         }
//       }
//     },
//     [hasChatMessages, chatID, addMessageHandler, addChatHandler]
//   );

//   // Subsribe to Key Down Event
//   useEffect(() => {
//     addEventListener("keydown", handleKeyDown);
//     return () => removeEventListener("keydown", handleKeyDown);
//   }, [handleKeyDown]);

//   return (
//     <div className="sticky bottom-0 left-0 right-0 px-4 py-10 sm:px-8 bg-gradient-to-b from-transparent dark:via-neutral-950/60 dark:to-neutral-950/90 via-neutral-50/60 to-neutral-50/90">
//       {/* Container */}
//       <div className="w-full max-w-5xl mx-auto">
//         {/* Abort Controller */}
//         {isHandling && (
//           <div className="flex items-center justify-center w-full max-w-5xl py-4">
//             <Button
//               variant="ghost"
//               className="flex items-center gap-2"
//               onClick={cancelHandler}
//             >
//               <span>Stop Generating</span> <StopCircle size="14" />
//             </Button>
//           </div>
//         )}
//         {/* Regenerate Controller - Desktop */}
//         {!isHandling && isRegenerateSeen && (
//           <div className="items-center justify-center hidden py-2 sm:flex">
//             <Button
//               variant="ghost"
//               className="flex items-center gap-2"
//               onClick={regenerateHandler}
//             >
//               <span>Regenerate Response</span> <RefreshCw size="14" />
//             </Button>
//           </div>
//         )}
//         {/* Settings */}
//         {hasChatMessages && <ChatSettingsMenu />}
//         {/* Input Container */}
//         <form
//           onSubmit={handleSubmit}
//           className="flex items-center w-full py-2 bg-white rounded-md shadow-sm focus-within:ring-neutral-300 dark:focus-within:ring-neutral-500 focus-within:ring-1 dark:bg-neutral-900"
//         >
//           <Textarea
//             className="h-auto peer"
//             placeholder="Type your message..."
//             value={inputValue}
//             onChange={(e) => {
//               setInputValue(e.target.value);
//             }}
//           />
//           <button type="submit">
//             <Send
//               size="18"
//               className="mr-4 text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300"
//             />
//           </button>
//           {/* Regenerate Controller - Desktop */}
//           {!isHandling && isRegenerateSeen && (
//             <RefreshCw
//               onClick={regenerateHandler}
//               size="18"
//               className="mr-4 cursor-pointer text-neutral-600 dark:peer-focus:text-neutral-500 peer-focus:text-neutral-300 sm:hidden"
//             />
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };
// eu peguei de um outro projeto essa funcionalidade do microfone e queria que estivesse no meu codigo tambem, voce pode fazer, utilizando apenas o speech to text do navegador sem wisper, utilizando o lucid react para o icone do microfone e criando um componete a parte para lidar com o microfone, dai para setar a mensagem utilize const [inputValue, setInputValue] = useAtom(inputAtom); pois já é um estado global, entao crie para min o componente chamado microphone-input: