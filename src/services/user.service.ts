import User from "../models/user.model";

// Find user by email
export const findUserByEmail = async (email: string) => {
  return await User.findOne({
    email,
  });
};

// Find user by email
export const findUserByEmailWithPassword = async (email: string) => {
  return await User.findOne({
    email,
  }).select("password");
};

// Find user by id
export const findUserById = async (id: string) => {
  return await User.findById(id);
};

// Create new user
export const createNewUser = async ({
  name,
  email,
  phoneNumber,
  password,
  role,
}: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}) => {
  const user = await User.create({
    name,
    email,
    password,
    phoneNumber,
    role,
  });

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};
