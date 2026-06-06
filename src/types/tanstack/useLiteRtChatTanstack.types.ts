import type { MessageLike } from "@litert-lm/core";
import type {
	UseLiteRtChatNonStreamProps,
	UseLiteRtChatStreamProps,
} from "../base/useLiteRtChat.types";
import type {
	UseQueryOptions,
	experimental_streamedQuery,
} from "@tanstack/react-query";
export interface CacheConfig {
	/**
	 * Time in milliseconds until the data is considered stale.
	 *
	 * @remarks
	 * During the stale time window, cached data is used immediately without background refetch.
	 * After stale time expires, the next query will trigger a background refetch while still
	 * using the stale data initially (if available).
	 *
	 * @default 720000 (12 minutes)
	 */
	staleTime?: number;

	/**
	 * Time in milliseconds until unused data is removed from the cache.
	 *
	 * @remarks
	 * This is the "garbage collection" time. Data that hasn't been accessed since this duration
	 * will be permanently removed from memory. Must be >= staleTime for predictable behavior.
	 *
	 * @default Infinity
	 */
	gcTime?: number;
}
export interface UseLiteRtChatNonStreamTanstackProps
	extends UseLiteRtChatNonStreamProps {
	message: MessageLike;
	cacheConfig?: CacheConfig;
	useQueryOptions?: Omit<
		UseQueryOptions,
		"queryFn" | "queryKey" | "staleTime" | "gcTime"
	>;
}

export interface UseLiteRtChatStreamTanstackProps
	extends UseLiteRtChatStreamProps {
	message: MessageLike;
	cacheConfig?: CacheConfig;
	useQueryOptions?: Omit<
		UseQueryOptions,
		"queryFn" | "queryKey" | "staleTime" | "gcTime"
	>;
	streamQueryOptions?: Omit<typeof experimental_streamedQuery, "streamFn">;
}
