import { z } from 'zod'

export const loginSchema = z.object({
    username: z.string().min(1, { message: 'Vui lòng nhập tên đăng nhập' }),
    password: z.string().min(1, { message: 'Vui lòng nhập mật khẩu' })
})

export type LoginSchema = z.infer<typeof loginSchema>