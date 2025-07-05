import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const users = [];

export const registerUser = async ({ name, surname, role, username, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: uuidv4(),
    name,
    surname,
    role,
    username,
    password: hashedPassword
  };
  users.push(newUser);
  return newUser;
};

export const loginUser = async ({ username, password }) => {
  const user = users.find((u) => u.username === username);
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  return isMatch ? user : null;
};
