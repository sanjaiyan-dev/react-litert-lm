import {
	useQuery,
	experimental_streamedQuery as streamedQuery,
} from "@tanstack/react-query";
import { useLiteRtChatConversationInit } from "../base/useLiteRtChat";
import type {
	UseLiteRtChatNonStreamTanstackProps,
	UseLiteRtChatStreamTanstackProps,
} from "../types/tanstack/useLiteRtChatTanstack.types";
import { useDeferredValue } from "react";

export const useLiteRtChatConversationTanstackInit =
	useLiteRtChatConversationInit;

export const useLiteRtChatNonStreamTanstackQuery = (
	props: UseLiteRtChatNonStreamTanstackProps,
) => {
	const conversation = useLiteRtChatConversationTanstackInit(props);
	const onAbort = () => {
		conversation.cancel();
	};

	const deferedMessage = useDeferredValue(props.message);

	return useQuery({
		queryKey: [
			"react-lite-rt",
			"useLiteRtChatNonStreamTanstackQuery",
			deferedMessage,
		] as const,

		queryFn: async ({ signal }) => {
			if (signal.aborted) {
				throw new Error(signal.reason ?? "AbortError");
			}

			signal.addEventListener("abort", onAbort);

			try {
				const response = await conversation.sendMessage(deferedMessage);
				signal.removeEventListener("abort", onAbort);
				return response;
			} catch (err) {
				signal.removeEventListener("abort", onAbort);
				throw err;
			}
		},
		staleTime: props.cacheConfig?.staleTime ?? 720000,
		gcTime: props.cacheConfig?.gcTime ?? Infinity,
		enabled: Boolean(props.useQueryOptions?.enabled),
		retry: props.useQueryOptions?.retry,
		networkMode: props.useQueryOptions?.networkMode,
		experimental_prefetchInRender:
			props.useQueryOptions?.experimental_prefetchInRender,
	});
};

export const useLiteRtChatStreamTanstackQuery = (
	props: UseLiteRtChatStreamTanstackProps,
) => {
	const conversation = useLiteRtChatConversationTanstackInit(props);
	const deferedMessage = useDeferredValue(props.message);

	return useQuery({
		queryKey: [
			"react-lite-rt",
			"useLiteRtChatStreamTanstackQuery",
			deferedMessage,
		] as const,

		queryFn: streamedQuery({
			streamFn: () => conversation.sendMessageStreaming(deferedMessage),
		}),
		staleTime: props.cacheConfig?.staleTime ?? 720000,
		gcTime: props.cacheConfig?.gcTime ?? Infinity,
		enabled: Boolean(props.useQueryOptions?.enabled),
		retry: props.useQueryOptions?.retry,
		networkMode: props.useQueryOptions?.networkMode,
		experimental_prefetchInRender:
			props.useQueryOptions?.experimental_prefetchInRender,
	});
};
