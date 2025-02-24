import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/store/store"; // Adjust the import to your store location
import { setEnteredCode, setNewPassword, setConfirmPassword } from "src/store/auth/authSlice";
import { resetPass } from "src/store/auth/authAPI";
import { AppDispatch } from "src/store/store";

interface CheckResetCodeProps {
    handlePageChange: (page: string) => void;
}

const CheckResetCode: React.FC<CheckResetCodeProps> = ({ handlePageChange }) => {
    const dispatch = useDispatch<AppDispatch>();

    const enteredCode = useSelector((state: RootState) => state.auth.enteredCode);
    const newPassword = useSelector((state: RootState) => state.auth.newPassword);
    const { email, confirmPassword } = useSelector((state: RootState) => state.auth);

    const [errorMessage, setErrorMessage] = useState<string>("");

    const handleResetPassword = async () => {
        if (!newPassword || !enteredCode || !confirmPassword) {
            setErrorMessage("Please fill in all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.");
            return;
        }

        try {
            await dispatch(
                resetPass({
                    email,
                    code: enteredCode,
                    password: newPassword,
                    passwordConfirm: confirmPassword,
                })
            ).unwrap();

            alert("Password reset successfully");
            handlePageChange("login");
        } catch (error) {
            setErrorMessage("Failed to reset password. Please try again.");
        }
    };

    return (
        <div>
            <h2>Enter Reset Code and New Password</h2>
            <input
                type="text"
                placeholder="Enter reset code"
                value={enteredCode}
                onChange={(e) => dispatch(setEnteredCode(e.target.value))}
            />
            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => dispatch(setNewPassword(e.target.value))}
            />
            <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
            />
            <button onClick={handleResetPassword}>Reset Password</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default CheckResetCode;