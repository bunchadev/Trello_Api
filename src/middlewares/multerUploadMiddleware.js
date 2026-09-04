import multer from 'multer'
import { LIMIT_COMMON_FILE_SIZE, ALLOW_COMMON_FILE_TYPES } from '../utils/validators.js'
import ApiError from '../utils/ApiError.js'
import { StatusCodes } from 'http-status-codes'

// function check which file type is allowed
const customeFileFilter = (req, file, callback) => {
  // console.log('file', file)

  // check file use mimetype
  if (!ALLOW_COMMON_FILE_TYPES.includes(file.mimetype)) {
    const errorMessage = 'File type is invalid. Only accept jpg, jpeg and png'
    return callback(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage), null)
  }
  // if type file is allowed, return true
  return callback(null, true)
}

// function upload file with multer
const upload = multer({
  limits: { fileSize: LIMIT_COMMON_FILE_SIZE },
  fileFilter: customeFileFilter
})

export const multerUploadMiddleware = { upload }