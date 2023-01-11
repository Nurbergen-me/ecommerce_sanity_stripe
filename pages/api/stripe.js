const stripe = require('stripe')(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // console.log(JSON.parse(req.body).map((x) => x.name));
    try {
        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            billing_address_collection: 'auto',
            shipping_options: [
                {shipping_rate: 'shr_1MP1OcLQ1XK7kE6NJlRlG2JQ'},
                {shipping_rate: 'shr_1MP1PKLQ1XK7kE6Nc4X5iU8i'}
            ],
            line_items: JSON.parse(req.body).map((item) => {
                const image = item.image[0].asset._ref;
                const newImage = image.replace('image-', 'https://cdn.sanity.io/images/0u7bxt7m/production/').replace('-webp', '.webp');
                console.log("image", newImage)

                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name,
                            images: [newImage]
                        },
                        unit_amount: item.price * 100,
                    },
                    adjustable_quantity: {
                        enabled: true,
                        minimum: 1
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${req.headers.origin}/success`,
            cancel_url: `${req.headers.origin}/canceled`,
        }
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}