import type { Engine } from "@litert-lm/core";
import { createContext, useContext } from "react";
import type { LiteRtEngineProviderProps } from "../types/base/LiteRtEngineProvider.types";
import { useLiteRtEngine } from "../core/useLiteRtEngine";

export const LiteRtEngineContext = createContext<Engine | null>(null);

export const useLiteRtEngineContext = () => {
	const engine = useContext(LiteRtEngineContext);

	if (engine === null) {
		throw new Error(
			"useLiteRtEngine must be used within a <LiteRtEngineProvider>. " +
				"Please ensure you have wrapped your component tree with the provider.",
		);
	}

	return engine;
};

export const LiteRtEngineProvider = (props: LiteRtEngineProviderProps) => {
	const liteRtEngine = useLiteRtEngine(props);
	return (
		<LiteRtEngineContext.Provider value={liteRtEngine}>
			{props.children}
		</LiteRtEngineContext.Provider>
	);
};
