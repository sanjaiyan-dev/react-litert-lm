import {
	startTransition,
	use,
	useEffect,
	useMemo,
	useRef,
	useState,
	useTransition,
} from "react";
import { useLiteRtEngineContext } from "./LiteRtEngineProvider";
import type {
	UseLiteRtChatConversationInitProps,
	UseLiteRtChatNonStreamProps,
	UseLiteRtChatNonStreamSendMessageProps,
	UseLiteRtChatStreamProps,
	UseLiteRtChatStreamSendMessageProps,
} from "../types/base/useLiteRtChat.types";
import type { Message } from "@litert-lm/core";

export const useLiteRtChatConversationInit = (
	props: UseLiteRtChatConversationInitProps,
) => {
	const liteRtEngine = useLiteRtEngineContext();
	const chatInit = useMemo(
		() =>
			liteRtEngine.createConversation({
				preface: props.preface,
				sessionConfig: props.sessionConfig,
				filterChannelContentFromKvCache: props.filterChannelContentFromKvCache,
				prefillPrefaceOnInit: props.prefillPrefaceOnInit,
				enableConstrainedDecoding: props.enableConstrainedDecoding,
			}),
		[
			liteRtEngine,
			props.preface,
			props.enableConstrainedDecoding,
			props.sessionConfig,
			props.filterChannelContentFromKvCache,
			props.prefillPrefaceOnInit,
		],
	);
	const chat = use(chatInit);

	return chat;
};

export const useLiteRtChatNonStream = (props: UseLiteRtChatNonStreamProps) => {
	const conversation = useLiteRtChatConversationInit(props);
	const [isPending, deferUpdate] = useTransition();
	const [result, setResult] = useState<Message>();
	const sendMessage = (
		sendMsgProps: UseLiteRtChatNonStreamSendMessageProps,
	) => {
		deferUpdate(async () => {
			const response = await conversation.sendMessage(sendMsgProps);
			deferUpdate(() => {
				setResult(response);
			});
		});
	};

	const cancelMessage = () => {
		conversation.cancel();
	};

	useEffect(() => {
		return () => {
			conversation.cancel();
		};
	}, [conversation.cancel]);

	return {
		isPending,
		result,
		sendMessage,
		cancelMessage,
	};
};

const consumeChatStream = async (
	streamPromise: Promise<ReadableStream<Message>> | ReadableStream<Message>,
	callbacks: {
		onText: (text: string) => void;
		onError: (err: Error) => void;
		onDone: () => void;
		isCancelled: () => boolean;
	},
) => {
	"use memo";
	try {
		const stream = await streamPromise;

		for await (const chunk of stream) {
			if (callbacks.isCancelled()) {
				break;
			}

			if (typeof chunk?.content === "string") {
				callbacks.onText(chunk.content);
			}

			if (Array.isArray(chunk?.content)) {
				let chunkText = "";
				for (const item of chunk.content) {
					if (item.type === "text") {
						chunkText += item.text;
					}
				}
				if (chunkText) {
					callbacks.onText(chunkText);
				}
			}
		}
	} catch (err) {
		if (!callbacks.isCancelled()) {
			callbacks.onError(err instanceof Error ? err : new Error(String(err)));
		}
	} finally {
		if (!callbacks.isCancelled()) {
			callbacks.onDone();
		}
	}
};

export const useLiteRtChatStream = (props: UseLiteRtChatStreamProps) => {
	"use memo";
	const conversation = useLiteRtChatConversationInit(props);
	const [streamingText, setStreamingText] = useState<string>("");
	const [isStreaming, setIsStreaming] = useState<boolean>(false);
	const [error, setError] = useState<Error | null>(null);

	const isCancelledRef = useRef<boolean>(false);

	const sendMessage = async (
		sendMsgProps: UseLiteRtChatStreamSendMessageProps,
	) => {
		"use memo";
		setIsStreaming(true);
		setError(null);
		setStreamingText("");
		isCancelledRef.current = false;
		const stream = conversation.sendMessageStreaming(sendMsgProps);

		await consumeChatStream(stream, {
			onText: (chunkText) => {
				startTransition(() => {
					setStreamingText((prev) => prev + chunkText);
				});
			},
			onError: (err) => {
				setError(err);
			},
			onDone: () => {
				setIsStreaming(false);
			},
			isCancelled: () => isCancelledRef.current,
		});
	};

	const cancelMessage = () => {
		conversation.cancel();
	};
	useEffect(() => {
		return () => {
			isCancelledRef.current = true;
			conversation.cancel();
		};
	}, [conversation.cancel]);

	return {
		sendMessage,
		cancelMessage,
		streamingText,
		error,
		isStreaming,
	};
};
