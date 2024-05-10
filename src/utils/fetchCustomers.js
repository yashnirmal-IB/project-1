import { axiosInstance } from "./axiosInstance";

const fetchCustomers = async () => {
  try {
    const res = await axiosInstance.get("/users");
    return res.data.users.slice(0, 10).map((user) => {
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        age: user.age,
        gender: user.gender,
        email: user.email,
        birthDate: user.birthDate,
      };
    });
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default fetchCustomers;
