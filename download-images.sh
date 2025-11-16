# Download images using curl (more reliable)
# Make sure you're in the firewood-ecommerce directory

# Create directory
mkdir -p public/images/products

# Download images using curl
curl -L "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&auto=format" -o "public/images/products/oak-logs.jpg"

curl -L "https://images.unsplash.com/photo-1551801841-ecad875a020?w=400&h=300&fit=crop&auto=format" -o "public/images/products/mixed-hardwood.jpg"

curl -L "https://images.unsplash.com/photo-1445024441609-ba2eb8650f95?w=400&h=300&fit=crop&auto=format" -o "public/images/products/birch-logs.jpg"

curl -L "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop&auto=format" -o "public/images/products/ash-logs.jpg"

curl -L "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=300&fit=crop&auto=format" -o "public/images/products/kindling-bundle.jpg"

curl -L "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&auto=format" -o "public/images/products/beech-logs.jpg"

curl -L "https://images.unsplash.com/photo-1550985543-52d8ee9d0c2c?w=400&h=300&fit=crop&auto=format" -o "public/images/products/special-offer-5-tonnes.jpg"

echo "Images downloaded to public/images/products/"
ls -la public/images/products/
