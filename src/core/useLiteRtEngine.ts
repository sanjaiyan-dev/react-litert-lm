import { Engine } from "@litert-lm/core";
import type { LiteRtEngineProviderProps } from "../types/base/LiteRtEngineProvider.types";
import { use, useMemo } from "react";

export const useLiteRtEngine = ({
	model,
	backend,
	inputPromptAsHint,
	mainExecutorSettings,
}: Omit<LiteRtEngineProviderProps, "children">) => {
	const initializeEnginePromise = useMemo(
		() =>
			Engine.create(
				{ model, backend, mainExecutorSettings },
				inputPromptAsHint,
			),
		[model, backend, mainExecutorSettings, inputPromptAsHint],
	);

	return use(initializeEnginePromise);
};
