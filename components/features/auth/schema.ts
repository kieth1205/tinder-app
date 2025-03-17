import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string({
      required_error: "Vui lòng nhập tên đăng nhập",
    })
    .min(1, { message: "Vui lòng nhập tên đăng nhập" }),
  password: z
    .string({
      required_error: "Vui lòng nhập mật khẩu",
    })
    .min(1, { message: "Vui lòng nhập mật khẩu" }),
});

export const registerSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tên" }),
  name: z.string().min(1, { message: "Vui lòng nhập tên" }),
  birthday: z
    .date()
    .min(new Date("1900-01-01"), { message: "Ngày sinh không hợp lệ" }),
  gender: z.enum(["male", "female", "other"], {
    message: "Giới tính không hợp lệ",
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
