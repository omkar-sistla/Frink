import bcrypt from "bcrypt";

export const hashString = async (useValue) => {
    const salt = await bcrypt.genSalt(10);
  
    const hashedpassword = await bcrypt.hash(useValue, salt);
    return hashedpassword;
};