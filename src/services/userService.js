import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { userModel } from '~/models/userModel'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { pickUser } from '~/utils/formatter'
import { WEBSITE_DOMAINS } from '~/utils/constants'
import { brevoProvider } from '~/providers/BrevoProvider'

const createNew = async (reqBody) => {
  try {
    // kiểm tra xem email đã tồn tại chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exists!')
    }

    // tạo data lưu vào DB
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      // 8: số vòng lặp băm, càng nhiều vòng lặp thì càng an toàn nhưng sẽ tốn thời gian hơn
      password: bcrypt.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    // lưu vào DB
    const createdUser = await userModel.createNew(newUser)
    const getUser = await userModel.findOneById(createdUser.insertedId)

    // gửi email xác thực cho user
    const verifiCationLink = `${WEBSITE_DOMAINS}/account/verification?email=${getUser.email}&token=${getUser.verifyToken}`
    const customSubject = 'Verify your email address'
    const htmlContent = `
      <h3>Verify your email address</h3>
      <h3>${verifiCationLink}</h3>
    `

    // gọi tới provider gửi email
    await brevoProvider.sendEmail(getUser.email, customSubject, htmlContent)

    // trả về phía controller
    return pickUser(getUser)
  } catch (error) { throw error }
}

export const userService = {
  createNew
}