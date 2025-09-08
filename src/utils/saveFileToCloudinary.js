import { v2 as cloudinary } from 'cloudinary';
import path from 'node:path';
import fs from 'node:fs/promises';

import { getEnvVar } from './getEnvVar.js';
import { CLOUDINARY } from '../constants/index.js';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';

export const saveFileToCloudinary = async (file) => {
  cloudinary.config({
    secure: true,
    cloud_name: getEnvVar(CLOUDINARY.CLOUD_NAME),
    api_key: getEnvVar(CLOUDINARY.API_KEY),
    api_secret: getEnvVar(CLOUDINARY.API_SECRET),
  });

  const filePath = file.path ?? path.join(TEMP_UPLOAD_DIR, file.filename);

  const response = await cloudinary.uploader.upload(filePath, {
    folder: getEnvVar(CLOUDINARY.FOLDER, 'contacts'),
    overwrite: true,
    resource_type: 'image',
  });

  try {
    await fs.unlink(filePath);
  } catch {
    // do nothing
  }

  return response.secure_url;
};
