import { Schema, model } from "mongoose";

// Simple Role schema with validators
const RoleSchema = new Schema(
  {
    _id: {
      type: String,
      required: [true, "Role ID is required"],
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Role name is required"],
      enum: {
        values: ["admin", "chef", "waiter"],
        message: "{VALUE} is not a valid role",
      },
      lowercase: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Role description is required"],
      minlength: [3, "Description must be at least 3 characters"],
      maxlength: [200, "Description cannot exceed 200 characters"],
      trim: true,
    },
    permissions: {
      type: [String],
      default: [],
      validate: {
        validator: function (permissions: string[]) {
          // Each permission should follow format: action_resource_field
          return permissions.every((p) =>
            /^[a-zA-Z]+_[a-zA-Z]+_[a-zA-Z]+$/.test(p)
          );
        },
        message: "Invalid permission format. Use: action_resource_field",
      },
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
    collection: "roles",
    _id: false,
  }
);

export const RoleModel = model("Role", RoleSchema);
