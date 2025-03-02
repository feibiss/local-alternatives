import { createServerAction } from "zsa"
import { getIP, isRateLimited } from "~/lib/rate-limiter"
import { newsletterSchema } from "~/server/schemas"
import { isDisposableEmail } from "~/utils/helpers"

/**
 * Subscribe to the newsletter
 * @param input - The newsletter data to subscribe to
 * @returns The newsletter that was subscribed to
 */
export const subscribeToNewsletter = createServerAction()
  .input(newsletterSchema)
  .handler(async ({ input: { value: email, ...input } }) => {
    const ip = await getIP()

    // Rate limiting check
    if (await isRateLimited(ip, "newsletter")) {
      throw new Error("Too many attempts. Please try again later.")
    }

    // Disposable email check
    if (await isDisposableEmail(email)) {
      throw new Error("Invalid email address, please use a real one")
    }

    // Handle subscription logic (store email in your database, send a welcome email, etc.)
    // Example:
    // await saveToDatabase(email, input);

    return "You've been subscribed to the newsletter."
  })
