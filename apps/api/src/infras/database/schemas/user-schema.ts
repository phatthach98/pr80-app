import { Schema, model } from "mongoose";

// Simple User schema with validators
const UserSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, "User ID is required"],
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name cannot exceed 100 characters"],
      trim: true,
      validate: {
        validator: function (name: string) {
          return /^[a-zA-Z\s]+$/.test(name); // Only letters and spaces
        },
        message: "Name can only contain letters and spaces",
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: function (phone: string) {
          // International phone format validation
          return /^\+?[1-9]\d{1,14}$/.test(phone.replace(/\s/g, ""));
        },
        message: "Invalid phone number format",
      },
    },
    passCode: {
      type: String,
      required: [true, "Pass code is required"],
      minlength: [4, "Pass code must be at least 4 characters"],
      maxlength: [4, "Pass code cannot exceed 4 characters"],
      trim: true,
    },
    roles: {
      type: [
        {
          id: {
            type: String,
            ref: "Role",
            required: [true, "Role id is required"],
            trim: true,
          },
        },
      ],
      required: [true, "At least one role is required"],
      validate: {
        validator: (roles: { id: string }[]) => Array.isArray(roles) && roles.length > 0,
        message: "User must have at least one role.",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: "users",
    _id: false,
  }
);

UserSchema.virtual('populatedRoles', {
  ref: 'Role',
  localField: 'roles.id',
  foreignField: '_id',
  justOne: false,
})

export const UserModel = model("User", UserSchema);
