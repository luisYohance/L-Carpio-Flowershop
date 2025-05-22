"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (email: string, subject: string, message: string) => {
    await resend.emails.send({
        from: "Flowers <onboarding@resend.dev>",
        to: email,
        subject: subject,
        text: message,
    });
};
