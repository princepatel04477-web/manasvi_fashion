import { Order } from "./db-orders";
import { formatINR } from "./store";

export async function sendOrderConfirmationEmail(order: Order) {
  const apiKey = process.env.RESEND_API_KEY;
  const customerEmail = order.customerEmail;
  const customerName = order.customerName;

  // Format delivery estimate: 3 to 5 business days from order creation
  const orderDate = new Date(order.createdAt || Date.now());
  const minDelivery = new Date(orderDate);
  minDelivery.setDate(orderDate.getDate() + 3);
  const maxDelivery = new Date(orderDate);
  maxDelivery.setDate(orderDate.getDate() + 5);

  const deliveryStr = `${minDelivery.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long"
  })} - ${maxDelivery.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })}`;

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #E7C2B8; font-family: sans-serif;">
        <td style="padding: 12px 0; font-size: 14px; color: #3B2B28;">
          <strong>${item.title}</strong><br/>
          <span style="font-size: 12px; color: #8B6B61;">Size: ${item.size}</span>
        </td>
        <td style="padding: 12px 0; font-size: 14px; text-align: center; color: #3B2B28;">${item.qty}</td>
        <td style="padding: 12px 0; font-size: 14px; text-align: right; color: #3B2B28;">${formatINR(item.price)}</td>
      </tr>
    `
    )
    .join("");

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Order Confirmed — Manasvi Fashion</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FAF7F2; font-family: sans-serif; color: #3B2B28; -webkit-font-smoothing: antialiased;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; margin: 40px auto; border: 1px solid #E7C2B8; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(92, 74, 68, 0.05);">
          <!-- HEADER -->
          <tr>
            <td style="background-color: #3B2B28; padding: 40px 20px; text-align: center;">
              <h1 style="margin: 0; font-family: Georgia, serif; font-size: 28px; color: #FAF7F2; font-weight: 300; letter-spacing: 0.15em; text-transform: uppercase;">
                MANASVI FASHION
              </h1>
              <p style="margin: 8px 0 0 0; font-size: 11px; color: #C98E87; letter-spacing: 0.25em; text-transform: uppercase;">
                Atelier & Cinematic Boutique
              </p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="margin-top: 0; font-family: Georgia, serif; font-size: 20px; font-weight: normal; color: #3B2B28; border-bottom: 1px solid #FAF7F2; padding-bottom: 15px;">
                Your Order is Confirmed
              </h2>
              <p style="font-size: 14px; line-height: 1.6; color: #5C4A44;">
                Dear ${customerName},
              </p>
              <p style="font-size: 14px; line-height: 1.6; color: #5C4A44;">
                Thank you for acquiring from Manasvi Fashion. Your custom order is now secured and being prepared at our atelier.
              </p>
              
              <!-- ORDER INFO -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0; background-color: #FAF7F2; border-radius: 8px; padding: 20px;">
                <tr>
                  <td style="font-size: 12px; color: #8B6B61; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 8px;">Order Reference</td>
                  <td style="font-size: 12px; color: #8B6B61; text-transform: uppercase; letter-spacing: 0.05em; padding-bottom: 8px; text-align: right;">Estimated Delivery</td>
                </tr>
                <tr>
                  <td style="font-size: 16px; font-weight: bold; color: #3B2B28;">${order.id}</td>
                  <td style="font-size: 14px; color: #3B2B28; text-align: right;">${deliveryStr}</td>
                </tr>
              </table>

              <!-- ORDER ITEMS -->
              <h3 style="margin-top: 30px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8B6B61; border-bottom: 2px solid #3B2B28; padding-bottom: 5px;">
                Your Selection
              </h3>
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 30px;">
                <thead>
                  <tr style="border-bottom: 1px solid #E7C2B8;">
                    <th style="text-align: left; padding: 10px 0; font-size: 11px; text-transform: uppercase; color: #8B6B61;">Garment</th>
                    <th style="text-align: center; padding: 10px 0; font-size: 11px; text-transform: uppercase; color: #8B6B61; width: 60px;">Qty</th>
                    <th style="text-align: right; padding: 10px 0; font-size: 11px; text-transform: uppercase; color: #8B6B61; width: 100px;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                  <tr>
                    <td colspan="2" style="padding-top: 15px; font-size: 14px; font-weight: bold; color: #3B2B28;">Order Total</td>
                    <td style="padding-top: 15px; font-size: 16px; font-weight: bold; color: #3B2B28; text-align: right;">${formatINR(order.totalAmount)}</td>
                  </tr>
                </tbody>
              </table>

              <!-- DELIVERY ADDRESS -->
              <h3 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #8B6B61; border-bottom: 1px solid #E7C2B8; padding-bottom: 5px;">
                Shipping Address
              </h3>
              <p style="font-size: 13px; line-height: 1.6; color: #5C4A44; margin-bottom: 30px; white-space: pre-line;">
                ${order.shippingAddress}
              </p>

              <div style="text-align: center; margin-top: 40px; border-top: 1px solid #FAF7F2; padding-top: 25px;">
                <p style="font-size: 12px; color: #8B6B61; font-style: italic; margin-bottom: 5px;">
                  "Crafting cinematic elegance for the modern woman."
                </p>
                <p style="font-size: 11px; color: #C98E87; margin: 0;">
                  If you have questions about sizing, tailoring, or shipping, contact our stylist concierge.
                </p>
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color: #FAF7F2; padding: 25px 20px; text-align: center; border-top: 1px solid #E7C2B8;">
              <p style="margin: 0; font-size: 11px; color: #8B6B61; letter-spacing: 0.05em;">
                &copy; ${new Date().getFullYear()} Manasvi Fashion. All Rights Reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  if (apiKey) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: "Manasvi Fashion <orders@manasvifashion.com>",
          to: customerEmail,
          subject: `Your Manasvi Fashion Order ${order.id} is Confirmed`,
          html: emailHtml
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[Email Service] Resend API failed:", errorText);
      } else {
        console.log(`[Email Service] Success: Order confirmation sent to ${customerEmail}`);
      }
    } catch (err) {
      console.error("[Email Service] Error connecting to Resend API:", err);
    }
  } else {
    // Beautiful local logging for development/simulated environment
    console.log("=========================================================================");
    console.log("             [SIMULATED EMAIL] CONFIRMATION SENT SUCCESSFULLY             ");
    console.log("=========================================================================");
    console.log(`To: ${customerName} <${customerEmail}>`);
    console.log(`Subject: Your Manasvi Fashion Order ${order.id} is Confirmed`);
    console.log(`Order ID: ${order.id}`);
    console.log(`Total Amount: ${formatINR(order.totalAmount)}`);
    console.log(`Address:\n${order.shippingAddress}`);
    console.log("-------------------------------------------------------------------------");
    console.log(`Estimated Delivery: ${deliveryStr}`);
    console.log("=========================================================================");
  }
}
