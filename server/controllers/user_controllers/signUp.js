import User from "../../models/user_model.js";
const signUp = async (req, res) => {
    try {
        const { name, email, password, confirm_password } = req.body;
        if (!name || !email || !password || !confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, password, and confirm password are required'
            });
        }
        if (password !== confirm_password) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered'
            });
        }
        const newUser = new User({ name, email, password, confirm_password });
        await newUser.save();
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error('Sign up error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during sign up',
            error: error.message
        });
    }
}
export default signUp;