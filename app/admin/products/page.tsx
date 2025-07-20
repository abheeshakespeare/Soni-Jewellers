"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Trash2, Plus, Search, Eye, Star, Package } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getAllProductsForAdmin, deleteProduct, toggleProductFeatured } from "@/lib/products"
import { getCategories } from "@/lib/categories"
import type { Product } from "@/lib/products"
import type { Category } from "@/lib/categories"
import { getGenderDisplayName, getMetalDisplayName } from "@/lib/products"
import { formatPrice } from "@/lib/utils"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedMetal, setSelectedMetal] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        getAllProductsForAdmin(),
        getCategories()
      ])
      setProducts(productsData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return
    }

    try {
      await deleteProduct(id)
      toast.success('Product deleted successfully')
      fetchData() // Refresh the list
      
      // Trigger revalidation of product pages
      try {
        await fetch('/api/revalidate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: '/products' }),
        })
      } catch (revalidateError) {
        console.error('Error revalidating cache:', revalidateError)
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const handleToggleFeatured = async (id: number, isFeatured: boolean) => {
    try {
      await toggleProductFeatured(id, !isFeatured)
      toast.success(`Product ${!isFeatured ? 'marked as featured' : 'unmarked as featured'}`)
      fetchData() // Refresh the list
    } catch (error) {
      console.error('Error toggling featured status:', error)
      toast.error('Failed to update featured status')
    }
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "all" || product.category_id.toString() === selectedCategory
    const matchesMetal = selectedMetal === "all" || product.metal_type === selectedMetal
    const matchesGender = selectedGender === "all" || product.gender === selectedGender

    return matchesSearch && matchesCategory && matchesMetal && matchesGender
  })

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId)
    return category?.name || 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          <p className="text-gray-600 mt-2">Manage your jewelry product catalog</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Metal</label>
              <Select value={selectedMetal} onValueChange={setSelectedMetal}>
                <SelectTrigger>
                  <SelectValue placeholder="All metals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All metals</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Gender</label>
              <Select value={selectedGender} onValueChange={setSelectedGender}>
                <SelectTrigger>
                  <SelectValue placeholder="All genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="flexible">Unisex</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedMetal("all")
                  setSelectedGender("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.jpg'
                }}
              />
              {product.is_featured && (
                <Badge className="absolute top-2 right-2 bg-yellow-500">
                  <Star className="h-3 w-3 mr-1" />
                  Featured
                </Badge>
              )}
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
                </div>
                
                <div className="space-y-1 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <Package className="h-3 w-3" />
                    {getCategoryName(product.category_id)}
                  </div>
                                     <div>{getMetalDisplayName(product.metal_type, product.carat || undefined, product.material_color || undefined)}</div>
                  <div>{product.weight_grams}g • {getGenderDisplayName(product.gender)}</div>
                  {product.collection_type && (
                    <div className="text-blue-600">{product.collection_type}</div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="text-lg font-bold text-green-600">
                    {product.final_price ? formatPrice(product.final_price) : 'Price not set'}
                  </div>
                  {product.base_price && product.final_price && product.base_price !== product.final_price && (
                    <div className="text-xs text-gray-500 line-through">
                      {formatPrice(product.base_price)}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                  >
                    <Star className={`h-3 w-3 mr-1 ${product.is_featured ? 'text-yellow-500' : 'text-gray-400'}`} />
                    {product.is_featured ? 'Unfeature' : 'Feature'}
                  </Button>
                  
                  <Link href={`/admin/products/${product.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </Link>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id, product.name)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600 mb-4">
              {products.length === 0 
                ? "Get started by adding your first product." 
                : "Try adjusting your filters to see more products."
              }
            </p>
            {products.length === 0 && (
              <Link href="/admin/products/new">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      )}

      {/* Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          <span>
            {products.filter(p => p.is_featured).length} featured products
          </span>
        </div>
      </div>
    </div>
  )
} 