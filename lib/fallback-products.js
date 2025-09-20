// Fallback product data for when database is unavailable
export const fallbackProducts = [
    {
        id: 1,
        name: "Premium Seasoned Hardwood",
        description: "High-quality seasoned hardwood logs, perfect for fireplaces and wood-burning stoves. Burns clean and provides excellent heat output.",
        price: "45.00",
        category: "Hardwood",
        imageUrl: "/images/products/premium-firewood.jpg",
        stockQuantity: 50,
        season: "All Season",
        features: ["Fully seasoned", "Low moisture content", "Long burning", "High heat output"],
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        name: "Oak Firewood Bundle",
        description: "Premium oak logs cut to perfect size for easy handling. Excellent for long-lasting fires with minimal smoke.",
        price: "52.00",
        category: "Oak",
        imageUrl: "/images/products/premium-firewood.jpg",
        stockQuantity: 30,
        season: "Winter",
        features: ["Pure oak", "Slow burning", "High heat", "Low smoke"],
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        name: "Mixed Hardwood Logs",
        description: "A carefully selected mix of hardwood varieties providing consistent burning and great value for money.",
        price: "38.00",
        category: "Mixed",
        imageUrl: "/images/products/premium-firewood.jpg",
        stockQuantity: 75,
        season: "All Season",
        features: ["Mixed varieties", "Good value", "Consistent burn", "Well seasoned"],
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 4,
        name: "Birch Firewood Premium",
        description: "Beautiful birch logs with distinctive bark. Quick to light and provides a lovely flame pattern.",
        price: "48.00",
        category: "Birch",
        imageUrl: "/images/products/premium-firewood.jpg",
        stockQuantity: 25,
        season: "All Season",
        features: ["Easy to light", "Beautiful flame", "Pleasant aroma", "Quick burning"],
        isFeatured: false,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export default fallbackProducts;