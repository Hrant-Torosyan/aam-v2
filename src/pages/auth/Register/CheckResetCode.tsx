import React, { useState } from "react";
import { useResetPasswordMutation } from "src/store/auth/authAPI";

interface CheckResetCodeProps {
    handlePageChange: (page: string) => void;
}

const CheckResetCode: React.FC<CheckResetCodeProps> = ({ handlePageChange }) => {
    const [enteredCode, setEnteredCode] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");

    const [resetPassword] = useResetPasswordMutation();

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
            await resetPassword({ code: enteredCode, newPassword, confirmPassword }).unwrap();
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
                onChange={(e) => setEnteredCode(e.target.value)} // Update enteredCode state
            />
            <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)} // Update newPassword state
            />
            <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)} // Update confirmPassword state
            />
            <button onClick={handleResetPassword}>Reset Password</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default CheckResetCode;