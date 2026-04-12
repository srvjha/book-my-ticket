import { z } from "zod";
import BaseDto from "../../dto/base.dto.js";

export class SignUpDto extends BaseDto {
  static schema = z.object({
    username: z.string().min(1, "Username is required"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().nullable().optional(),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
  });
}

export class SignInDto extends BaseDto {
  static schema = SignUpDto.schema.pick({
    email: true,
    password: true,
  });
}

export class TokenDto extends BaseDto {
  static schema = z.object({
    token: z.string().max(4096),
  });
}

export class EmailDto extends BaseDto {
  static schema = SignUpDto.schema.pick({
    email: true,
  });
}

export class ForgotPasswordDto extends BaseDto {
  static schema = SignUpDto.schema.pick({
    email: true,
  });
}

export class ForgotPasswordVerifyDto extends BaseDto {
  static schema = z.object({
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  });
}

export class ChangePasswordDto extends BaseDto {
  static schema = z
    .object({
      oldPassword: z
        .string()
        .min(8, "Old password must be at least 8 characters long"),
      newPassword: z
        .string()
        .min(8, "New password must be at least 8 characters long"),
      confirmNewPassword: z
        .string()
        .min(8, "Confirm password must be at least 8 characters long"),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "New password and confirm password do not match",
      path: ["confirmNewPassword"],
    });
}
