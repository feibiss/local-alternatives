import type { BrandLinkAPIResult } from "@specfy/stack-analyser"
import wretch from "wretch"

// Remove the AnalyzerAPIResult and analyzerApi references

export type BrandLinkAPIResult = Record<string, Array<Record<string, string> & { url: string }>>

export const brandLinkApi = wretch("https://brandlink.piotr-f64.workers.dev/api")
  .errorType("json")
  .resolve(r => r.json<BrandLinkAPIResult>())
