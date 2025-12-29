import createTokenAndSaveCookie from "../jwt/generateToken.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import validator from "validator"
export const signup = async (req, res) => {
    const { fullname, email, password, confirmPassword } = req.body;

    try {
        // Validate inputs
        if (!fullname || !email || !password || !confirmPassword) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if user already exists
        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ error: "User already registered" });

        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            fullname,
            email,
            password: hashPassword
        });

        // Save user
        await newUser.save();

        // Create token and save cookie - wrap in try/catch to prevent crashes
        try {
            createTokenAndSaveCookie(newUser._id, res);
        } catch (tokenError) {
            console.error("Token creation error:", tokenError);
            // Continue with the response even if token creation fails
            // The user is already created, so we can still return success
        }

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                fullname: newUser.fullname,
                email: newUser.email,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        // Generate token and set cookie
        createTokenAndSaveCookie(user._id, res);

        // Send success response
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        res.status(201).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const allUsers = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const filteredUsers = await User.find({
            _id: { $ne: loggedInUser },
        }).select("-password");

        // Return 200 status code for successful GET requests
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.error("Error in all Users Controller:", error);
        // Add proper error response
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};


export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
            });
        }

        // Find user with case-insensitive email and select specific fields
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.error("Error in getUserByEmail Controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user details",
            error: error.message,
        });
    }
};

export const updateFullname = async (req, res) => {
    const { fullname, email } = req.body;

    try {
        // Validate input
        if (!fullname) {
            return res.status(400).json({ error: "Full name is required" });
        }

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Find user by email and update
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        user.fullname = fullname;
        await user.save();

        return res.status(200).json({
            message: "Full name updated successfully",
            user: {
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
            },
        });
    } catch (error) {
        console.error("Update fullname error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

