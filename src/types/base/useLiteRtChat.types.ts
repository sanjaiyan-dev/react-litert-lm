import type { ConversationConfig, MessageLike } from "@litert-lm/core";

export interface UseLiteRtChatConversationInitProps
	extends ConversationConfig {}
export interface UseLiteRtChatNonStreamProps
	extends UseLiteRtChatConversationInitProps {}
export interface UseLiteRtChatStreamProps
	extends UseLiteRtChatConversationInitProps {}

export type UseLiteRtChatNonStreamSendMessageProps = MessageLike & {};
export type UseLiteRtChatStreamSendMessageProps = MessageLike & {};
