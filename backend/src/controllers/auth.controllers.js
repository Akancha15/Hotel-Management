import User from "../modals/user.modal.js"
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.json({
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Create initial admin user
export const createInitialAdmin = async () => {
    try {
        const adminExists = await User.findOne({ email: 'admin@hotel.com' });
        if (!adminExists) {
            const admin = new User({
                email: 'admin@hotel.com',
                password: 'admin123'
              
            });
            await admin.save();
            console.log('Initial admin user created');
        }
    } catch (error) {
        console.error('Error creating initial admin:', error);
    }
};

