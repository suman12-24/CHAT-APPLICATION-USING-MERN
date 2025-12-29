import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
    },
    profilePhoto: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
