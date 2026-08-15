import { z } from 'zod'

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be atleast 2 characters")
        .max(50, "Name must be atmost 50 characters")
        .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, "Name must contain uppercase and lowercase letters"),
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email('Invalid email address'),
    password: z
        .string()
        .trim()
        .min(6, 'Password must contain atleast 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, "Password must contain uppercase, lowercase, number and special character"),
    confirmPassword: z
        .string()
})
.refine(data => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword']
})

export const loginSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z
         .string()
         .trim()
        .min(6, 'Password must contain atleast 6 characters')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/, "Password must contain uppercase, lowercase, number and special character")
})

export const otpSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, 'Email is required'),
    otp: z
        .string()
        .trim()
        .regex(/^\d{4}$/, 'OTP must contain only numbers')
        .min(4, "OTP must be exactly 4 digit")
})

export const resendOtpSchema = z.object({
    email: z 
         .string()
         .min(1, 'Email is required')
         .email('Invalid email')
})

export const forgotPasswordSchema = z.object({
    email: z
          .string()
          .trim()
          .min(1, 'Email is required')
          .email('Invalid email')
})

export const resetPasswordSchema = z.object({
    email: z
         .string()
         .trim()
         .min(1, 'Email is required')
         .email('Invalid email'),
    newPassword: z
          .string()
          .trim()
          .min(6, 'Password must contain atleast 6 characters')
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%&*?])[a-zA-Z\d!@$%&*?]{6,}$/),
    confirmPassword: z
          .string(),
    
});

export const updateProfileSchema = z.object({
  name: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(
        /^[A-Za-z]+( [A-Za-z]+)*$/,
        "Name should only contain letters and single spaces"
      )
      .optional()
  ),

  email: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string()
      .trim()
      .email("Invalid email address")
      .optional()
  ),

  password: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string()
      .trim()
      .min(6, "Password must contain at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%*&?])[a-zA-Z\d!@$%*&?]{6,}$/,
        "Password must include uppercase, lowercase, number, and special character"
      )
      .optional()
  ),

  confirmPassword: z.preprocess(
    (val) => val === "" ? undefined : val,
    z.string().optional()
  ),
})
.refine(
  (data) => {
    if (!data.password && !data.confirmPassword) return true;
    if (data.password && !data.confirmPassword) return false;

    return data.password === data.confirmPassword;
  },
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
)
.refine(
  (data) =>
    !!data.name ||
    !!data.email ||
    !!data.password,
  {
    message: "At least one field must be provided",
  }
);

const childSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters")
      .max(30, "Name must be at most 30 characters")
      .regex(/^[A-Za-z]+( [A-Za-z]+)*$/, "Name must contain only letters"),

    age: z.coerce
      .number()
      .min(1, "Age must be at least 1")
      .max(18, "Age must be less than or equal to 18"),

    avatar: z
      .string()
      .trim()
      .min(1, "Please select an avatar"),

    dob: z.string().optional(),
  })
  .superRefine(({ age, dob }, ctx) => {

    if (!dob) return;
    const birthDate = new Date(dob);
    const today = new Date();

    // Invalid date
    if (isNaN(birthDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dob"],
        message: "Invalid date of birth",
      });
      return;
    }

    // Future date
    if (birthDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["dob"],
        message: "Date of birth cannot be in the future",
      });
      return;
    }

    // Calculate actual age
    let actualAge = today.getFullYear() - birthDate.getFullYear();

    const birthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    if (!birthdayPassed) actualAge--;

    if (actualAge !== age) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["age"],
        message: `Age should be ${actualAge} based on the selected date of birth`,
      });
    }
  });


export const addChildSchema = childSchema;

export const updateChildSchema = childSchema.extend({
  id: z.string().trim().min(1, "Child id is required"),
});


export const reportDateSchema = z
  .object({
    from: z.string().min(1, "From date is required"),
    to: z.string().min(1, "To date is required"),
  })
  .superRefine(({ from, to }, ctx) => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    if (isNaN(fromDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "Invalid from date",
      });
    }

    if (isNaN(toDate.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "Invalid to date",
      });
    }

    if (fromDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "From date cannot be in the future",
      });
    }

    if (toDate > today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "To date cannot be in the future",
      });
    }

    if (fromDate > toDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "To date must be after From date",
      });
    }
  });





export const contestSchema = z
  .object({
    // ==========================================================
    // TITLE
    // ==========================================================

    title: z
      .string()
      .trim()
      .min(
        2,
        "Contest title must be at least 2 characters",
      )
      .max(
        100,
        "Contest title must be at most 100 characters",
      ),

    // ==========================================================
    // DESCRIPTION
    // ==========================================================

    description: z
      .string()
      .trim()
      .min(
        5,
        "Description must be at least 5 characters",
      )
      .max(
        500,
        "Description must be at most 500 characters",
      ),

    // ==========================================================
    // CONTEST TYPE
    // ==========================================================

    type: z.enum(
      ["CHALLENGE", "PARTICIPATION"],
      {
        message: "Please select a contest type",
      },
    ),

    // ==========================================================
    // GAMES
    // ==========================================================

    gameIds: z
      .array(
        z.string().min(1),
      )
      .optional(),

    // ==========================================================
    // WINNER CRITERIA
    // ==========================================================

    winnerCriteria: z.enum(
      ["SCORE", "STARS", "LEVELS"],
      {
        message: "Please select winner criteria",
      },
    ),

    // ==========================================================
    // TARGET VALUE
    // ==========================================================

    targetValue: z
      .union([
        z.coerce
          .number()
          .positive(
            "Target value must be greater than 0",
          ),

        z.literal(""),

        z.undefined(),
      ])
      .optional(),

    // ==========================================================
    // START DATE
    // ==========================================================

    startDate: z
      .string()
      .min(
        1,
        "Start date is required",
      ),

    // ==========================================================
    // END DATE
    // ==========================================================

    endDate: z
      .string()
      .min(
        1,
        "End date is required",
      ),
  })

  // ==========================================================
  // CROSS-FIELD VALIDATION
  // ==========================================================

  .superRefine((data, ctx) => {
    // ========================================================
    // PARTICIPATION CONTEST
    // Target value IS required
    // ========================================================

    if (data.type === "PARTICIPATION") {
      if (
        data.targetValue === undefined ||
        data.targetValue === ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["targetValue"],
          message:
            "Target value is required for participation contests",
        });
      }
    }

    // ========================================================
    // CHALLENGE CONTEST
    // Target value is NOT allowed
    // ========================================================

    if (data.type === "CHALLENGE") {
      if (
        data.targetValue !== undefined &&
        data.targetValue !== ""
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["targetValue"],
          message:
            "Target value is not allowed for challenge contests",
        });
      }
    }

    // ========================================================
    // DATE VALIDATION
    // ========================================================

    const start = new Date(data.startDate);
    const end = new Date(data.endDate);

    // --------------------------------------------------------
    // Invalid start date
    // --------------------------------------------------------

    if (isNaN(start.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["startDate"],
        message: "Invalid start date",
      });
    }

    // --------------------------------------------------------
    // Invalid end date
    // --------------------------------------------------------

    if (isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message: "Invalid end date",
      });
    }

    // --------------------------------------------------------
    // End date must be after start date
    // --------------------------------------------------------

    if (
      !isNaN(start.getTime()) &&
      !isNaN(end.getTime()) &&
      end <= start
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endDate"],
        message:
          "End date must be after start date",
      });
    }
  });

// ============================================================
// CREATE
// ============================================================

export const createContestSchema =
  contestSchema;


// ============================================================
// UPDATE
// ============================================================

export const updateContestSchema =
  contestSchema.extend({
    id: z
      .string()
      .min(
        1,
        "Contest ID is required",
      ),
  });

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>