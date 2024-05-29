import { User } from "@/types/User";

export default function GetUsers() {
    const users: User[] = [
        {
          id: 1,
          name: "John Doe",
          email: "jd@email.com",
        },
        {
          id: 2,
          name: "Jane Doe",
          email: "jane@email.com",
        },
      ];

    return users;
}