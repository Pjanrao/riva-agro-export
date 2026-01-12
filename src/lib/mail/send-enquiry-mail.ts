import nodemailer from "nodemailer";

interface EnquiryMailProps {
  productName: string;
  category?: string;
  name: string;
  email: string;
  phone?: string;
  quantity?: string;
  message?: string;
}

export async function sendEnquiryMail(data: EnquiryMailProps) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Website Enquiry" <${process.env.SMTP_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: `New Product Enquiry – ${data.productName}`,
    html: `
      <h2>New Product Enquiry</h2>
      <p><strong>Product:</strong> ${data.productName}</p>
      <p><strong>Category:</strong> ${data.category ?? "-"}</p>

      <hr />

      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone ?? "-"}</p>
      <p><strong>Quantity:</strong> ${data.quantity ?? "-"}</p>

      <p><strong>Message:</strong><br/>${data.message ?? "-"}</p>

      <hr />
      <p>Received from website enquiry form</p>
    `,
  });
}
