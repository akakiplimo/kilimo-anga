// packages/types/src/user.ts
export interface User {
    id: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: User;
  }