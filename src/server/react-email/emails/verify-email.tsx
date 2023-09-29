import { env } from "@/env/server.mjs";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Button,
  Text,
  render,
} from "@react-email/components";
import * as React from "react";
import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import logo from "public/logos/logo-light.png"

interface EmailVerificationProps {
  validationToken: string;
}

const baseUrl = env.NEXTAUTH_URL;

export default async function sendVerificationMail(validationToken: string, usermail: string) {
  const transporter = nodemailer.createTransport({
    host: env.EMAIL_SERVER_HOST,
    port: env.EMAIL_SERVER_PORT,
    // secure: true,
    auth: {
      user: env.EMAIL_SERVER_USER,
      pass: env.EMAIL_SERVER_PASSWORD,
    },
  });

  const emailHtml = render(<EmailVerificationMail validationToken={validationToken}/> )
  const emailText = render(
    <EmailVerificationMail validationToken={validationToken} />, { plainText: true }
  );

  const options: Mail.Options = {
    from: env.EMAIL_FROM,
    to: usermail,
    subject: "Verify your Email",
    html: emailHtml,
    text: emailText
  }

  const result = await transporter.sendMail(options)

  const failed = result.rejected.concat(result.pending).filter(Boolean);
  if (failed.length) {
    throw new Error(`Email (${failed.join(", ")}) could not be sent`);
  }

}

export const EmailVerificationMail = ({
  validationToken
}: EmailVerificationProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body>
        <Container>
          <Img src={logo.src} alt="Logo" />
          <Heading as="h1" className="text-2xl font-semibold text-center">
            Verify Your Identity
          </Heading>
          <Text className="text-lg">Please click the following link</Text>
          <Button className="mt-4 rounded-xl bg-lime-500 px-8 py-3">
            <Link
              className="text-xl text-white"
              href={baseUrl + "/auth/verify-email?token=" + validationToken}
            >
              Verify Email
            </Link>
          </Button>
          <Text>Not expecting this email?</Text>
          <Text>
            Contact{" "}
            <Link href="mailto:info@mail.com" className="text-base underline">
              login@plaid.com
            </Link>{" "}
            if you did not request this code.
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
