import Verification from "../models/EmailVerification.js";
import { User } from "../models/User.js";
import { compareString } from "../utils/compareString.js";

export const verifyEmailController = async (req, res) => {
    const { userId, token } = req.params;

    try {
        const result = await Verification.findOne({ userId });

        if (result) {
            const { expiresAt, token: hashedToken } = result;

            if (expiresAt < Date.now()) {
                // Token has expired
                await Verification.findOneAndDelete({ userId });
                await User.findOneAndDelete({ _id: userId });

                const message = "Verification token has expired.";
                res.status(200).send(`<html><body><p>${message}</p></body></html>`);
            } else {
                // Token is still valid
                const isMatch = await compareString(token, hashedToken);

                if (isMatch) {
                    await User.findOneAndUpdate({ _id: userId }, { isVerified: true });
                    await Verification.findOneAndDelete({ userId });

                    const message = "Email verified successfully";
                    res.status(200).send(`<html><body><p>${message}</p></body></html>`);
                } else {
                    // Invalid token
                    const message = "Verification failed or link is invalid";
                    res.status(200).send(`<html><body><p>${message}</p></body></html>`);
                }
            }
        } else {
            // No verification record found for the given userId
            const message = "Invalid verification link. Try again later.";
            res.status(200).send(`<html><body><p>${message}</p></body></html>`);
        }
    } catch (error) {
        // Handle any errors that occur during the verification process
        console.log(error);
        const message = "An error occurred during verification.";
        res.status(500).send(`<html><body><p>${message}</p></body></html>`);
    }
};
