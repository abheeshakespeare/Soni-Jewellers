import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { getProductById, getRelatedProducts, getGenderDisplayName, getMetalDisplayName } from "@/lib/products"
import ProductCard from "@/components/product-card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, ShoppingCart, Eye, Star, Truck, Shield, RotateCcw } from "lucide-react"
import AddToCartButton from "./add-to-cart-button"
import WishlistButton from "./wishlist-button"

interface ProductDetailPageProps {
  params: {
    id: string
  }
}

// Set revalidation time to 5 minutes for more responsive updates
export const revalidate = 300

function ProductImage({ imageUrl, productName }: { imageUrl: string; productName: string }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={imageUrl || "/placeholder.jpg"}
        alt={productName}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
        quality={95}
      />
    </div>
  )
}

function ProductInfo({ product }: { product: any }) {
  return (
    <div className="space-y-6">
      {/* Product Title and Badges */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          {product.is_featured && (
            <Badge className="bg-yellow-500 text-white rounded-full">Featured</Badge>
          )}
          {product.collection_type && (
            <Badge variant="outline" className="rounded-full border-amber-300 text-amber-700">{product.collection_type}</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-amber-800">{product.name}</h1>
        <div className="flex items-center gap-4 text-2xl font-bold text-yellow-600">
          {product.final_price ? formatPrice(product.final_price) : 'Price not set'}
        </div>
        {product.metal_type === 'other' && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            <p className="font-medium">Fixed Price Product</p>
            <p>This product has a fixed price that includes all costs and taxes.</p>
          </div>
        )}
        {product.metal_type !== 'other' && product.base_price && product.final_price && product.base_price !== product.final_price && (
          <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            <p className="font-medium">Price Breakdown</p>
            <p>Base Price: {formatPrice(product.base_price)}</p>
            <p>Final Price (with GST): {formatPrice(product.final_price)}</p>
          </div>
        )}
      </div>

      {/* Product Description */}
      {product.description && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-amber-800">Description</h3>
          <p className="text-amber-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {/* Product Specifications */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-amber-800">Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-amber-700">
                {product.metal_type === 'other' ? 'Material Type:' : 'Metal Type:'}
              </span>
              <span className="font-medium">{getMetalDisplayName(product.metal_type, product.carat, product.material_color)}</span>
            </div>
            {product.metal_type === 'gold' && product.carat && (
              <div className="flex justify-between">
                <span className="text-amber-700">Purity:</span>
                <span className="font-medium">{product.carat}K Gold</span>
              </div>
            )}
            {product.metal_type === 'silver' && (
              <div className="flex justify-between">
                <span className="text-amber-700">Purity:</span>
                <span className="font-medium">925 Silver</span>
              </div>
            )}
            {product.metal_type === 'other' && product.material_color && (
              <div className="flex justify-between">
                <span className="text-amber-700">Material:</span>
                <span className="font-medium">{product.material_color}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-amber-700">Weight:</span>
              <span className="font-medium">{product.weight_grams}g</span>
            </div>
            <div className="flex justify-between">
              <span className="text-amber-700">Gender:</span>
              <span className="font-medium">{getGenderDisplayName(product.gender)}</span>
            </div>
          </div>
          <div className="space-y-3">
            {product.metal_type !== 'other' && product.material_color && (
              <div className="flex justify-between">
                <span className="text-amber-700">Color:</span>
                <span className="font-medium">{product.material_color}</span>
              </div>
            )}
            {product.size_description && (
              <div className="flex justify-between">
                <span className="text-amber-700">Size:</span>
                <span className="font-medium">{product.size_description}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-amber-700">Category:</span>
              <span className="font-medium">{product.category?.name}</span>
            </div>
            {product.collection_type && (
              <div className="flex justify-between">
                <span className="text-amber-700">Collection:</span>
                <span className="font-medium">{product.collection_type}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Information */}
      <div className="bg-amber-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-amber-700">Stock:</span>
          <span className={`font-medium ${product.stock_quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>{product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full">
        <div className="w-full flex-1">
          <AddToCartButton product={product} />
        </div>
        <div className="w-full flex-1 mt-2 sm:mt-0">
          <WishlistButton productId={product.id} />
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-amber-200">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Truck className="h-5 w-5 text-yellow-600" />
          <span>Shop From Home</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Shield className="h-5 w-5 text-yellow-600" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <RotateCcw className="h-5 w-5 text-yellow-600" />
          <span>Verified Product</span>
        </div>
      </div>
    </div>
  )
}

function RelatedProducts({ products }: { products: any[] }) {
  return (
    <div className="space-y-6">
      <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50 mb-4">
        <CardTitle className="text-2xl font-bold text-amber-800">You May Also Like</CardTitle>
        <CardDescription className="text-amber-600">Explore more jewellery from this category</CardDescription>
      </CardHeader>
      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-amber-600 mb-4">No related products found in this category.</p>
          <Button variant="outline" asChild className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 hover:from-amber-600 hover:to-yellow-600">
            <a href="/products">Browse All Products</a>
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {products.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const productId = parseInt(params.id)
  
  if (isNaN(productId)) {
    notFound()
  }

  const product = await getProductById(productId)
  
  if (!product || !product.is_active) {
    notFound()
  }

  // Get related products from the same category with cache busting
  const relatedProducts = await getRelatedProducts(product.category_id, productId, 8)
  
  // Debug logging
  console.log('Product category_id:', product.category_id)
  console.log('Related products count:', relatedProducts.length)
  console.log('Related products:', relatedProducts)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-yellow-600">Home</a>
          <span>/</span>
          <a href="/products" className="hover:text-yellow-600">Products</a>
          <span>/</span>
          <span className="text-amber-800 font-semibold">{product.name}</span>
        </nav>
        {/* Product Details Card */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl mb-16">
          <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
            <CardTitle className="text-2xl font-bold text-amber-800">Product Details</CardTitle>
            <CardDescription className="text-amber-600">See all information and specifications for this jewellery</CardDescription>
          </CardHeader>
          <CardContent className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="space-y-4">
              <ProductImage imageUrl={product.image_url} productName={product.name} />
            </div>
            {/* Product Information */}
            <div>
              <ProductInfo product={product} />
            </div>
          </CardContent>
        </Card>
        {/* Related Products */}
        <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
          <CardContent className="p-8">
            <RelatedProducts products={relatedProducts} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 