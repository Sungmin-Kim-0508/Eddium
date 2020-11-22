import AWS from 'aws-sdk'
import sharp from 'sharp'
import { THUMBNAIL_IMG_PATH } from '../constants'
import { UploadedFileResponse, UploadFile } from '../types'
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2'
})
const s3 = new AWS.S3()


export const imageService = {
  resizeImage: async (imageBuffer: string, width: number, height: number) => {
    const resizeBuffer = await sharp(imageBuffer)
      .resize(width, height)
      .toBuffer()
      .then(data => {
        return data
      })
      .catch(error => {
        throw new Error('imageService error resizeImage: ' + error)
      })
    return resizeBuffer
  },
  uploadImage: async (file : UploadFile, fileName: string) : Promise<UploadedFileResponse> => {
    try {
      const bucket = process.env.AWS_BUCKET_NAME!
      const params = {
        Bucket: bucket,
        Key: fileName,
        Body: file.createReadStream(),
        ACL: 'public-read'
      }
      const { Location } = await s3.upload(params).promise()

      return new Promise((resolve, reject) => {
        if (Location) {
          resolve({
            ...file,
            success: true,
            message: 'Successfully Uploaded',
            url: Location
          })
        } else {
          reject({
            ...file,
            success: false,
            message: 'Failed uploading',
            url: 'unknown'
          })
        }
      })
    } catch (error) {
      throw new Error('imageService error uploadImage: ' + error)
    }
  },
  deleteImage: async (fileName: string) => {
    const bucket = process.env.AWS_BUCKET_NAME!
    const params = {
      Bucket: bucket,
      Key: fileName
    }

    return await s3.deleteObject(params).promise()
  },
  createThumbnail: async (file : UploadFile) => {
    const { filename } = file
    const thumbnailPath = THUMBNAIL_IMG_PATH + Date.now() + '_' + filename
    return imageService.uploadImage(file, thumbnailPath)
  },
}