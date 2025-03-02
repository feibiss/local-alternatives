"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { posthog } from "posthog-js"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useServerAction } from "zsa-react"

import { Button } from "~/components/common/button"
import { Card } from "~/components/common/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/common/form"
import { Hint } from "~/components/common/hint"
import { Input } from "~/components/common/input"
import { Stack } from "~/components/common/stack"
import { Section, SectionContent } from "~/components/web/ui/section"

export function StackAnalyzerForm() {
  const router = useRouter()

  const form = useForm({
    defaultValues: { repository: "" },
  })

  return (
    <>
      <Section>
        <SectionContent>
          <Card hover={false} focus={false}>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(data => { })}
                className="flex flex-col w-full gap-5"
              >
                <FormField
                  control={form.control}
                  name="repository"
                  render={({ field }) => (
                    <FormItem>
                      <Stack className="w-full justify-between">
                        <FormLabel>GitHub Repository URL*:</FormLabel>
                        <Hint className="text-muted-foreground/50">
                          *Must be a public GitHub repository.
                        </Hint>
                      </Stack>

                      <FormControl>
                        <Stack size="sm" className="w-full">
                          <Input
                            size="lg"
                            placeholder="https://github.com/owner/name"
                            className="flex-1"
                            {...field}
                          />

                          <Button type="submit" size="lg">
                            Analyze Repository
                          </Button>
                        </Stack>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </Card>
        </SectionContent>
      </Section>
    </>
  )
}
