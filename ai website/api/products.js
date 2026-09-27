export default async function handler(req, res) {
  const token = process.env.PRINTIFY_API_TOKEN;
  
  if (!token) {
    return res.status(500).json({ error: "Missing PRINTIFY_API_TOKEN environment variable" });
  }

  try {
    // 1. Fetch shops connected to your account (User-Agent header is required by Printify)
    const shopsRes = await fetch("https://api.printify.com/v1/shops.json", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "VeloceStore/1.0"
      }
    });

    if (!shopsRes.ok) {
      const errText = await shopsRes.text();
      throw new Error(`Failed to fetch shops: ${shopsRes.status} ${errText}`);
    }

    const shops = await shopsRes.json();
    if (!shops || shops.length === 0) {
      return res.status(404).json({ error: "No Printify shops found" });
    }

    const shopId = shops[0].id;

    // 2. Fetch the products for that shop
    const productsRes = await fetch(`https://api.printify.com/v1/shops/${shopId}/products.json`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "VeloceStore/1.0"
      }
    });

    if (!productsRes.ok) {
      const errText = await productsRes.text();
      throw new Error(`Failed to fetch products: ${productsRes.status} ${errText}`);
    }

    const productsData = await productsRes.json();
    return res.status(200).json(productsData);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
