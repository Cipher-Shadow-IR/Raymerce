import nodemailer from 'nodemailer';

const isConfigured = () => process.env.EMAIL_USER && process.env.EMAIL_PASS;

const getTransporter = () => {
  if (isConfigured()) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
      port: Number(process.env.EMAIL_PORT) || 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return null;
};

const buildOrderEmail = (order) => `
╔══════════════════════════════════════════════╗
║         📦 ORDER CONFIRMATION                ║
╠══════════════════════════════════════════════╣
║ Order ID: #${order._id.toString().slice(-8).toUpperCase()}${' '.repeat(28)}
║ Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}${' '.repeat(20)}
║ Payment: ${order.paymentMethod}${' '.repeat(25)}
╠══════════════════════════════════════════════╣
║ ITEMS:${' '.repeat(46)}
${order.orderItems.map(item => `║  ${item.name} × ${item.qty} — $${(item.price * item.qty).toFixed(2)}`).join('\n')}
╠══════════════════════════════════════════════╣
║ Subtotal:  $${order.itemsPrice.toFixed(2)}${' '.repeat(34)}
║ Shipping:  ${order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}${' '.repeat(33)}
║ Tax (8%):  $${order.taxPrice.toFixed(2)}${' '.repeat(34)}
║ TOTAL:     $${order.totalPrice.toFixed(2)}${' '.repeat(34)}
╠══════════════════════════════════════════════╣
║ SHIPPING TO:${' '.repeat(41)}
║  ${order.shippingAddress.address}${' '.repeat(Math.max(1, 40 - order.shippingAddress.address.length))}
║  ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}${' '.repeat(Math.max(1, 35 - order.shippingAddress.city.length - order.shippingAddress.postalCode.length))}
║  ${order.shippingAddress.country}${' '.repeat(Math.max(1, 40 - order.shippingAddress.country.length))}
║  Phone: ${order.phone}${' '.repeat(Math.max(1, 35 - order.phone.length))}
╚══════════════════════════════════════════════╝
`;

const sendOrderConfirmation = async ({ to, name, order }) => {
  const message = {
    from: `"Raymerce Store" <${process.env.EMAIL_FROM || 'orders@raymerce.com'}>`,
    to,
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()}`,
    text: buildOrderEmail(order),
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Segoe UI,sans-serif;background:#f8fafc;padding:24px">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <table width="540" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
        <tr style="background:#6366f1"><td style="padding:24px;text-align:center;color:#fff">
          <h1 style="margin:0;font-size:22px">&#10003; Order Confirmed</h1>
          <p style="margin:4px 0 0;opacity:.9">${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </td></tr>
        <tr><td style="padding:24px">
          <p style="margin:0 0 16px;color:#1e293b">Hi <strong>${name}</strong>,</p>
          <p style="margin:0 0 16px;color:#64748b">Your order has been placed successfully!</p>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
            <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">Order ID</td>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;color:#1e293b;font-weight:600">#${order._id.toString().slice(-8).toUpperCase()}</td></tr>
            <tr><td style="padding:8px 0;border-bottom:1px solid #e2e8f0;color:#64748b;font-size:13px">Payment</td>
                <td style="padding:8px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-size:13px;color:#1e293b">${order.paymentMethod}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px">Phone</td>
                <td style="padding:8px 0;text-align:right;font-size:13px;color:#1e293b">${order.phone}</td></tr>
          </table>

          <h3 style="margin:0 0 8px;font-size:14px;color:#1e293b">Items</h3>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
            ${order.orderItems.map(item => `
            <tr><td style="padding:6px 0;border-bottom:1px solid #f1f5f9;color:#475569;font-size:13px">${item.name} × ${item.qty}</td>
                <td style="padding:6px 0;border-bottom:1px solid #f1f5f9;text-align:right;color:#1e293b;font-size:13px;font-weight:600">$${(item.price * item.qty).toFixed(2)}</td></tr>
            `).join('')}
          </table>

          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
            <tr><td style="padding:4px 0;color:#64748b;font-size:13px">Subtotal</td>
                <td style="padding:4px 0;text-align:right;color:#1e293b;font-size:13px">$${order.itemsPrice.toFixed(2)}</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;font-size:13px">Shipping</td>
                <td style="padding:4px 0;text-align:right;color:#1e293b;font-size:13px">${order.shippingPrice === 0 ? 'Free' : `$${order.shippingPrice.toFixed(2)}`}</td></tr>
            <tr><td style="padding:4px 0;color:#64748b;font-size:13px">Tax</td>
                <td style="padding:4px 0;text-align:right;color:#1e293b;font-size:13px">$${order.taxPrice.toFixed(2)}</td></tr>
            <tr><td style="padding:8px 0;border-top:2px solid #6366f1;font-weight:700;color:#1e293b;font-size:15px">Total</td>
                <td style="padding:8px 0;border-top:2px solid #6366f1;text-align:right;font-weight:700;color:#6366f1;font-size:15px">$${order.totalPrice.toFixed(2)}</td></tr>
          </table>

          <h3 style="margin:0 0 8px;font-size:14px;color:#1e293b">Shipping To</h3>
          <p style="margin:0;color:#475569;font-size:13px;line-height:1.6">
            ${order.shippingAddress.address}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
            ${order.shippingAddress.country}
          </p>

          <hr style="border:none;border-top:1px solid #e2e8f0;margin:20px 0">
          <p style="margin:0;text-align:center;color:#94a3b8;font-size:12px">Built by <a href="https://github.com/Cipher-Shadow-IR" style="color:#6366f1">Ishaan Ray (Cipher Shadow)</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  };

  const transporter = getTransporter();

  if (transporter) {
    try {
      await transporter.sendMail(message);
      return;
    } catch (err) {
      console.warn('SMTP send failed, falling back to console mock:', err.message);
    }
  }

  console.log('\n' + '='.repeat(58));
  console.log('  📧 MOCK EMAIL — Order Confirmation');
  console.log('  To:', to);
  console.log('  Subject:', message.subject);
  console.log(buildOrderEmail(order));
  console.log('='.repeat(58) + '\n');
};

export default sendOrderConfirmation;
