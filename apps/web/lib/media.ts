import { DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { stripURLSubpath } from "@curiousleaf/utils"
wretch from "wretch"
import QueryStringAddon from "wretch/addons/queryString"
import { env } from "~/env"
import { s3Client } from "~/services/s3"
import { tryCatch } from "~/utils/helpers"

/**
 * Uploads a file to S3 and returns the S3 location.
 * @param file - The file to upload.
 * @param key - The S3 key to upload the file to.
 * @returns The S3 location of the uploaded file.
 */
const uploadToS3Storage = async (file: Buffer, key: string) => {
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: env.S3_BUCKET,
      Key: key,
      Body: file,
      StorageClass: "STANDARD",
    },
    queueSize: 4,
    partSize: 1024 * 1024 * 5,
    leavePartsOnError: false,
  })

  const result = await upload.done()

  if (!result.Location) {
    throw new Error("Failed to upload")
  }

  return `https://${env.S3_BUCKET}.s3.${env.S3_REGION}.amazonaws.com/${result.Key}`
}

/**
 * Removes a directory from S3.
 * @param directory - The directory to remove.
 */
export const removeS3Directory = async (directory: string) => {
  const listCommand = new ListObjectsV2Command({
    Bucket: env.S3_BUCKET,
    Prefix: `${directory}/`,
  })

  let continuationToken: string | undefined

  do {
    const listResponse = await s3Client.send(listCommand)
    for (const object of listResponse.Contents || []) {
      if (object.Key) {
        await removeS3File(object.Key)
      }
    }
    continuationToken = listResponse.NextContinuationToken
    listCommand.input.ContinuationToken = continuationToken
  } while (continuationToken)
}

/**
 * Removes a file from S3.
 * @param key - The S3 key of the file to remove.
 */
export const removeS3File = async (key: string) => {
  const deleteCommand = new DeleteObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
  })

  return await s3Client.send(deleteCommand)
}

/**
 * Uploads a favicon to S3 and returns the S3 location.
 * @param url - The URL of the website to fetch the favicon from.
 * @param s3Key - The S3 key to upload the favicon to.
 * @returns The S3 location of the uploaded favicon.
 */
export const uploadFavicon = async (url: string, s3Key: string): Promise<string | null> => {
  const timestamp = Date.now()
  const cleanedUrl = encodeURIComponent(stripURLSubpath(url) ?? "")
  const faviconUrl = `https://www.google.com/s2/favicons?sz=128&domain_url=${cleanedUrl}`

  const faviconResponse = await tryCatch(
    wretch(faviconUrl)
      .get()
      .badRequest(console.error)
      .arrayBuffer()
      .then(buffer => Buffer.from(buffer)),
  )

  if (faviconResponse.error) {
    console.error("Error fetching favicon:", faviconResponse.error)
    return null
  }

  // Upload to S3
  const { data, error } = await tryCatch(uploadToS3Storage(faviconResponse.data, `${s3Key}.png`))

  if (error) {
    console.error("Error uploading favicon:", error)
    return null
  }

  return `${data}?v=${timestamp}`
}