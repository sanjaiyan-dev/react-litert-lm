import { useQuery } from "@tanstack/react-query";
import { useLiteRtChatConversationInit } from "../base/useLiteRtChat";
import type { UseLiteRtChatNonStreamTanstackProps } from "../types/tanstack/useLiteRtChatTanstack.types";

export const useLiteRtChatConversationTanstackInit =
	useLiteRtChatConversationInit;

export const useLiteRtChatNonStreamTanstackQuery = (
	props: UseLiteRtChatNonStreamTanstackProps,
) => {
	const conversation = useLiteRtChatConversationTanstackInit(props);
	const onAbort = () => {
		conversation.cancel();
	};

	return useQuery({
		queryKey: [
			"react-lite-rt",
			"useLiteRtChatNonStreamTanstackQuery",
			props.message,
		] as const,

		queryFn: async ({ signal }) => {
			if (signal.aborted) {
				throw new DOMException("Query aborted", "AbortError");
			}

			signal.addEventListener("abort", onAbort);

			try {
				const response = await conversation.sendMessage(props.message);
				signal.removeEventListener("abort", onAbort);
				return response;
			} catch (err) {
				signal.removeEventListener("abort", onAbort);
				throw err;
			}
		},
		staleTime: props.cacheConfig?.staleTime ?? 720000,
		gcTime: props.cacheConfig?.gcTime ?? Infinity,
		...props.useQueryOptions,
	});
};
