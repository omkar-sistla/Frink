import bcrypt from "bcrypt";

export const compareString = async (userPassword, password) => {
    const isMatch = await bcrypt.compare(userPassword, password);
    return isMatch;
};