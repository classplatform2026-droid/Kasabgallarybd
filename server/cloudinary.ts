import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

let isConfigured = false;

export function getCloudinaryClient() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  if (!isConfigured) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });
    isConfigured = true;
  }

  return cloudinary;
}

export function getCloudinaryStatus() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  const configured = Boolean(cloudName && apiKey && apiSecret);
  return {
    configured,
    storageType: configured ? 'cloudinary' : 'local',
    cloudName: cloudName ? cloudName.substring(0, 3) + '***' : null,
    message: configured
      ? 'Cloudinary is configured and ready for uploads.'
      : 'Local storage fallback is active. Cloudinary is optional.',
  };
}

function parseDataUrl(dataUrl: string): { mimeType: string; extension: string; buffer: Buffer } {
  const matches = dataUrl.match(/^data:([A-Za-z-+/0-9]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    const raw = dataUrl.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(raw, 'base64');
    return { mimeType: 'image/jpeg', extension: 'jpg', buffer };
  }
  const mimeType = matches[1];
  let extension = 'jpg';
  if (mimeType.includes('png')) extension = 'png';
  else if (mimeType.includes('webp')) extension = 'webp';
  else if (mimeType.includes('gif')) extension = 'gif';
  else if (mimeType.includes('svg')) extension = 'svg';

  const buffer = Buffer.from(matches[2], 'base64');
  return { mimeType, extension, buffer };
}

export function uploadToLocalStorage(fileData: string): { url: string; public_id: string; source: 'local' } {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const { extension, buffer } = parseDataUrl(fileData);
  const randomSuffix = crypto.randomBytes(4).toString('hex');
  const filename = `kasab-${Date.now()}-${randomSuffix}.${extension}`;
  const filePath = path.join(uploadsDir, filename);

  fs.writeFileSync(filePath, buffer);

  return {
    url: `/uploads/${filename}`,
    public_id: `local_${filename}`,
    source: 'local',
  };
}

export async function uploadToCloudinary(
  fileData: string,
  folder: string = 'kasab_gallery'
): Promise<{ url: string; public_id: string; source: 'cloudinary' | 'local' }> {
  const client = getCloudinaryClient();
  if (client) {
    try {
      const result = await client.uploader.upload(fileData, {
        folder: `kasab_gallery/${folder}`,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
        ],
      });

      return {
        url: result.secure_url,
        public_id: result.public_id,
        source: 'cloudinary',
      };
    } catch (err) {
      console.warn('[Cloudinary] Remote upload failed, falling back to local storage:', err);
    }
  }

  // Graceful fallback to local storage
  return uploadToLocalStorage(fileData);
}

export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (publicId.startsWith('local_')) {
    const filename = publicId.replace('local_', '');
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        return true;
      } catch (err) {
        console.error('[Upload] Delete local error:', err);
        return false;
      }
    }
    return true;
  }

  const client = getCloudinaryClient();
  if (!client) {
    return false;
  }

  try {
    await client.uploader.destroy(publicId);
    return true;
  } catch (err) {
    console.error('[Cloudinary] Delete error:', err);
    return false;
  }
}
