# react-litert-lm

[![npm](https://img.shields.io/npm/v/react-litert-lm?color=brightgreen&label=npm)](https://www.npmjs.com/package/react-litert-lm)
[![docs](https://img.shields.io/badge/docs-live-blue?logo=read-the-docs)](https://sanjaiyan-dev.github.io/react-litert-lm/)
[![license](https://img.shields.io/badge/license-ISC-lightgrey)](https://opensource.org/licenses/ISC)

A lightweight React integration layer for `@litert-lm/core`, crafted for elegant conversational UI workflows.

`react-litert-lm` gives you:

- A React provider that bootstraps a `LiteRt` engine cleanly
- Hook-driven chat flows for both non-streaming and streaming use cases
- Optional TanStack Query adapters for cache-aware and query-driven chat
- Minimal API surface with strong TypeScript support

---

## 🚀 Why this package

`react-litert-lm` is built to help React teams ship modern chat experiences with clarity and composability.

- Clean separation between engine setup and conversation behavior
- Streaming-ready response handling with incremental text rendering
- Optional query orchestration via `@tanstack/react-query`
- Designed for React 19 and `@litert-lm/core`

---

## 📦 Installation

```bash
npm install react-litert-lm
```

> Peer dependencies: `react`, `@litert-lm/core`.
> `@tanstack/react-query` is optional and only required for the TanStack integrations.

---

## ✨ Quick start

Use `LiteRtEngineProvider` to wrap your app and initialize the engine once.

```tsx
import { LiteRtEngineProvider, useLiteRtChatNonStream } from "react-litert-lm";

function Chat() {
  const { result, sendMessage, cancelMessage, isPending } = useLiteRtChatNonStream({
    preface: "You are an assistant that answers clearly.",
  });

  return (
    <div>
      <button onClick={() => sendMessage({ content: "Hello" })}>Send</button>
      {isPending && <span>Loading…</span>}
      {result && <p>{result.content}</p>}
      <button onClick={cancelMessage}>Cancel</button>
    </div>
  );
}

export default function App() {
  return (
    <LiteRtEngineProvider model="gpt-4" backend="openai">
      <Chat />
    </LiteRtEngineProvider>
  );
}
```

---

## 🔥 Streaming chat

Stream messages in real time and render partial responses as they arrive.

```tsx
import { useLiteRtChatStream } from "react-litert-lm";

function StreamingChat() {
  const { streamingText, sendMessage, isStreaming, cancelMessage, error } =
    useLiteRtChatStream({ preface: "You are a streaming assistant." });

  return (
    <div>
      <button onClick={() => sendMessage({ content: "Tell me a short story." })}>
        Start
      </button>
      {isStreaming ? <p>Streaming…</p> : <p>{streamingText}</p>}
      {error && <p style={{ color: "red" }}>{error.message}</p>}
      <button onClick={cancelMessage}>Cancel</button>
    </div>
  );
}
```

---

## ⚡ TanStack Query integration

Use TanStack React Query adapters for cache-backed chat requests and predictable network behavior.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LiteRtEngineProvider } from "react-litert-lm";
import { useLiteRtChatNonStreamTanstackQuery } from "react-litert-lm/tanstack";

const queryClient = new QueryClient();

function QueryChat({ message }: { message: string }) {
  const { data, isFetching } = useLiteRtChatNonStreamTanstackQuery({
    message: { content: message },
    preface: "Answer in one sentence.",
  });

  return <div>{isFetching ? <span>Loading…</span> : <p>{data?.content}</p>}</div>;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LiteRtEngineProvider model="gpt-4" backend="openai">
        <QueryChat message="What is React?" />
      </LiteRtEngineProvider>
    </QueryClientProvider>
  );
}
```

---

## 📚 Exposed API

### `LiteRtEngineProvider`

Initializes a memoized `@litert-lm/core` engine and exposes it through React context.

### `useLiteRtEngine`

Returns the engine instance created from provider settings.

### `useLiteRtChatConversationInit`

Creates a conversation instance with optional session configuration and preface.

### `useLiteRtChatNonStream`

Simple non-streaming chat hook with cancellation support.

### `useLiteRtChatStream`

Streaming chat hook that exposes incremental response text, loading state, and errors.

### `useLiteRtChatNonStreamTanstackQuery`

TanStack Query hook for non-streaming chat with caching and query lifecycle control.

### `useLiteRtChatStreamTanstackQuery`

Stream-aware query hook built around `experimental_streamedQuery`.

---

## 🛠️ Scripts

```bash
npm run build
npm run format
npm run lint
npm run docs
npm run deploy
```

---

## 💡 Contribution guidelines

- Keep APIs minimal and composable
- Maintain strong TypeScript type safety
- Prefer React-friendly hooks and declarative patterns
- Use `tsup` for builds and `typedoc` for docs generation

---

## 📄 License

Released under the `ISC` license.
