import { Metadata } from "next"
import { H4 } from "~/components/common/heading"
import { BackButton } from "~/components/web/ui/back-button"
import { NavLink } from "~/components/web/ui/nav-link"
import { Prose } from "~/components/web/ui/prose"
import { metadataConfig } from "~/config/metadata"

export const maxDuration = 60
export const dynamic = "force-static"

// Removed the 'url' reference

export const metadata: Metadata = {
  title: "GitHub Tech Stack Analyzer",
  description:
    "Analyze the tech stack of any public GitHub repository instantly. Discover the frameworks, libraries, and tools used in any project.",
  openGraph: { ...metadataConfig.openGraph },
  alternates: { ...metadataConfig.alternates },
}
