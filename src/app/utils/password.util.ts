import bcrypt from 'bcryptjs';

//minimun 8 characters regex, at least one uppercase letter, one lowercase letter, one number and one special character
const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;

export const validatePassword = (password: string):boolean => {
    return regex.test(password);
}

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return await bcrypt.compare(password, hash);
}

