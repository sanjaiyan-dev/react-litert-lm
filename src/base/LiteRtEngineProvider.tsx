import { Engine } from "@litert-lm/core";
import {
	createContext,
	startTransition,
	use,
	useEffect,
	useState,
} from "react";
import type { LiteRtEngineProviderProps } from "../types/base/LiteRtEngineProvider.test";

export const LiteRtEngineContext = createContext<Engine | null>(null);

export const useLiteRtEngine = () => {
	const engine = use(LiteRtEngineContext);

	if (engine === null) {
		throw new Error(
			"useLiteRtEngine must be used within a <LiteRtEngineProvider>. " +
				"Please ensure you have wrapped your component tree with the provider.",
		);
	}

	return engine;
};

export const LiteRtEngineProvider = (props: LiteRtEngineProviderProps) => {
	const [initializeEnginePromise, setInitializeEnginePromise] = useState(() =>
		Engine.create(props, props.inputPromptAsHint),
	);

	// biome-ignore lint: For optimized dependency tracking, avoid passing objects as dependencies because React only checks references, which can lead to performance bottlenecks.
	useEffect(() => {
		startTransition(() => {
			setInitializeEnginePromise(() =>
				Engine.create(props, props.inputPromptAsHint),
			);
		});
	}, [props.backend, props.inputPromptAsHint]);

	const liteRtEngine = use(initializeEnginePromise);
	return (
		<LiteRtEngineContext.Provider value={liteRtEngine}>
			{props.children}
		</LiteRtEngineContext.Provider>
	);
};
