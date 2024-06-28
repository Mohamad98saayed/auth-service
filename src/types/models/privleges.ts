export interface PrivlegesSchema {
     // auth
     canLogin: boolean;
     canForgetPassword: boolean;
     canResetPassword: boolean;
     canUpdatePassword: boolean;
     canUpdateProfile: boolean;

     // user managment
     canViewUsers: boolean;
     canWriteUsers: boolean;
}