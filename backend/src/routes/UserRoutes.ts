const express = require('express');
import {
    resetForgottenPassword,
    confirmUserAccount,
    sendResetPasswordMail,
    changeUserPassword,
    loginUser,
    registerNewUser
} from "../services/UserServices";

import {protectedPath} from "../middleware/AuthenticationMiddleWare";

const userRouter = express.Router();

userRouter.post('/', registerNewUser);
userRouter.post('/login', loginUser);
userRouter.put('/password', protectedPath, changeUserPassword);
userRouter.post('/forgot/password', sendResetPasswordMail);
userRouter.put('/forgot/password/reset', resetForgottenPassword);
userRouter.post('/confirm/:confirm_token', confirmUserAccount);

export default userRouter;