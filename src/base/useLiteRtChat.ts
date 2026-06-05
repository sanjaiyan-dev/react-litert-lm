import { use, useMemo, useState, useTransition } from "react";
import { useLiteRtEngineContext } from "./LiteRtEngineProvider";
import type {
	UseLiteRtChatConversationInitProps,
	UseLiteRtChatNonStreamProps,
	UseLiteRtChatNonStreamSendMessageProps,
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
	const chat = useLiteRtChatConversationInit(props);
	const [isPending, startTransition] = useTransition();
	const [result, setResult] = useState<Message>();
	const sendMessage = (
		sendMsgProps: UseLiteRtChatNonStreamSendMessageProps,
	) => {
		startTransition(async () => {
			const response = await chat.sendMessage(sendMsgProps);
			setResult(response);
		});
	};

	return {
		isPending,
		result,
		sendMessage,
	};
};
