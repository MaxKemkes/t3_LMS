import { z } from "zod";

export const Z_EmailRegister = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .refine((val) => val.match(/^[^]{8,24}$/), {
        message: "Must contain be between 8 - 24 characters",
      })
      .refine(
        (val) => val.match(/^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d!@#$%^&*]{8,24}$/),
        {
          message:
            "Must contain at least one Uppercase [A-Z] and one Lowercase [a-z] Letter",
        },
      )
      .refine((val) => val.match(/^(?=.*\d)[A-Za-z\d!@#$%^&*]{8,24}$/), {
        message: "Must contain at least one Digit [0-9]",
      })
      .refine((val) => val.match(/^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,24}$/), {
        message: "Must contain at least one special character [!@#$%^&*]",
      }),
    confirmPassword: z.string(),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
