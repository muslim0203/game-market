import nodemailer from "nodemailer";

type MailInput = {
  to: string;
  subject: string;
  html: string;
};

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  const { EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD } = process.env;

  if (!EMAIL_SERVER_HOST || !EMAIL_SERVER_PORT || !EMAIL_SERVER_USER || !EMAIL_SERVER_PASSWORD) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: EMAIL_SERVER_HOST,
      port: Number(EMAIL_SERVER_PORT),
      secure: Number(EMAIL_SERVER_PORT) === 465,
      auth: {
        user: EMAIL_SERVER_USER,
        pass: EMAIL_SERVER_PASSWORD
      }
    });
  }

  return transporter;
}

export async function sendMail(input: MailInput) {
  const from = process.env.EMAIL_FROM || "no-reply@digitalhub.local";
  const client = getTransporter();

  if (!client) {
    console.info("[mail:mock]", { to: input.to, subject: input.subject });
    return;
  }

  await client.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html
  });
}

export async function sendOrderPaidMail(args: { to: string; orderId: string; productName: string }) {
  await sendMail({
    to: args.to,
    subject: `Payment received for ${args.productName}`,
    html: `
      <h2>Buyurtma tasdiqlandi</h2>
      <p>To'lov qabul qilindi. Buyurtma ID: <b>${args.orderId}</b></p>
      <p>Akkaunt ma'lumotlari tayyor bo'lgach sizga yuboriladi.</p>
    `
  });
}

export async function sendOrderDeliveredMail(args: {
  to: string;
  orderId: string;
  productName: string;
  login: string;
  password: string;
  extraInfo?: string | null;
}) {
  await sendMail({
    to: args.to,
    subject: `${args.productName} account delivered`,
    html: `
      <h2>Akkaunt yuborildi</h2>
      <p>Buyurtma ID: <b>${args.orderId}</b></p>
      <p>Mahsulot: <b>${args.productName}</b></p>
      <p>Login: <b>${args.login}</b></p>
      <p>Password: <b>${args.password}</b></p>
      <p>Qo'shimcha: <b>${args.extraInfo || "-"}</b></p>
      <p>Iltimos ma'lumotlarni xavfsiz saqlang.</p>
    `
  });
}

export async function sendOrderFailedMail(args: { to: string; orderId: string }) {
  await sendMail({
    to: args.to,
    subject: "Order issue detected",
    html: `
      <h2>Buyurtmada muammo</h2>
      <p>Buyurtma ID: <b>${args.orderId}</b></p>
      <p>Support bilan bog'laning: support@digitalhub.local</p>
    `
  });
}
