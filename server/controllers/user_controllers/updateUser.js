import User from "../../models/user_model.js";
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    try {
        const user = await User.findByIdAndUpdate(userId, { name, email, password }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};
export default updateUser;