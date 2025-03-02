import type { Metadata } from "next"
import type { PropsWithChildren } from "react"
import { Intro, IntroDescription, IntroTitle } from "~/components/web/ui/intro"
import { metadataConfig } from "~/config/metadata"

export const metadata: Metadata = {
  title: "New Tool",  // Updated title
  description: "Description of your new tool goes here.",
  openGraph: { ...metadataConfig.openGraph, url: "/tools/new-tool" },  // Updated URL
  alternates: { ...metadataConfig.alternates, canonical: "/tools/new-tool" },  // Updated URL
}

export default function NewToolLayout({ children }: PropsWithChildren) {
  return (
    <>
      <Intro>
        <IntroTitle>{`${metadata.title}`}</IntroTitle>
        <IntroDescription>{metadata.description}</IntroDescription>
      </Intro>

      {/* Removed StackAnalyzerForm */}

      {children}
    </>
  )
}
