import { BlobServiceClient } from "@azure/storage-blob";
import { getConfig } from "./config";

interface IUploadFile {
  path: string;
  mimetype: string;
  name: string;
}
export const saveImageToCourseThumbnailsContainer = async ({
  path,
  name,
  mimetype,
}: IUploadFile) => {
  const AZURE_STORAGE_CONNECTION_STRING = getConfig(
    "AZURE_STORAGE_CONNECTION_STRING"
  );
  const PUBLIC_BLOB_CONTAINER_NAME = getConfig(
    "AZURE_STORAGE_BLOB_PUBLIC_CONTAINER_NAME"
  );

  if (!(AZURE_STORAGE_CONNECTION_STRING && PUBLIC_BLOB_CONTAINER_NAME)) {
    throw Error("Azure Storage Connection string not found");
  }

  // Create the BlobServiceClient object which will be used to create a container client
  const blobClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  )
    .getContainerClient(PUBLIC_BLOB_CONTAINER_NAME)
    .getBlockBlobClient(name);

  try {
    await blobClient.uploadFile(path, {
      blobHTTPHeaders: {
        blobContentType: mimetype,
      },
    });
    return blobClient.url;
  } catch (error) {
    console.error(error);
    throw Error("Failed to upload image.");
  }
};
