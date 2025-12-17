import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize the R2 Client
const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export async function uploadVideo(file: Buffer | Blob, fileName: string) {
  // Create a clean, unique filename (prevents overwriting)
  const uniqueFileName = `videos/${Date.now()}-${fileName.replace(/\s+/g, '-')}`;

  try {
    console.log("📤 Uploading to R2:", uniqueFileName);

    // Upload the file
    await r2.send(new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: file instanceof Blob ? Buffer.from(await file.arrayBuffer()) : file,
      ContentType: fileName.endsWith('.webm') ? 'video/webm' : 'video/mp4',
    }));

    // Construct the Public URL manually
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFileName}`;
    
    console.log("✅ Upload success:", publicUrl);
    return publicUrl;

  } catch (error) {
    console.error("❌ R2 Upload Error:", error);
    throw new Error("Failed to upload video");
  }
}
