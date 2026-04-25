// Vitest setup: install fake-indexeddb shims onto globalThis so any module
// that touches IndexedDB (Dexie via getDb, our sync helpers, etc.) gets a
// fresh in-memory implementation per test run.
//
// Loaded via the setupFiles entry in vitest.config.ts.

import "fake-indexeddb/auto";
