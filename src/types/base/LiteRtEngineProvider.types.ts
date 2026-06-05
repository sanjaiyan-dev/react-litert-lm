import type { EngineSettings } from "@litert-lm/core";

export interface LiteRtEngineProviderProps extends EngineSettings {
	inputPromptAsHint?: string;
	children?: React.ReactNode;
}
