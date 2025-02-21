import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string({
        required_error: 'Vui lòng nhập tên đăng nhập'
    }).min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
    password: z.string({
        required_error: 'Vui lòng nhập mật khẩu'
    }).min(1, { message: 'Vui lòng nhập mật khẩu' })
})

export const registerSchema = z.object({
    tags: z.array(z.string()).min(1, { message: 'Vui lòng chọn ít nhất một tag' }),
    tag: z.string().min(1, { message: 'Vui lòng chọn ít nhất một tag' }),
})

export type LoginSchema = z.infer<typeof loginSchema>
export type RegisterSchema = z.infer<typeof registerSchema>

