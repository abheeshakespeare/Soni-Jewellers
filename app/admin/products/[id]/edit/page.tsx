"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2, Package } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getProductById, updateProduct } from "@/lib/products"
import { getCategories } from "@/lib/categories"
import type { Product } from "@/lib/products"
import type { Category } from "@/lib/categories"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = parseInt(params.id as string)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    metal_type: "" as "gold" | "silver" | "other" | "",
    carat: "",
    weight_grams: "",
    material_color: "",
    size_description: "",
    gender: "" as "male" | "female" | "flexible" | "kids" | "",
    category_id: "",
    collection_type: "",
    manual_price: ""
  })

  useEffect(() => {
    if (productId) {
      fetchData()
    }
  }, [productId])

  const fetchData = async () => {
    try {
      const [productData, categoriesData] = await Promise.all([
        getProductById(productId),
        getCategories()
      ])
      
      if (!productData) {
        toast.error('Product not found')
        router.push('/admin/products')
        return
      }

      setProduct(productData)
      setCategories(categoriesData)
      
      // Populate form with existing data
      setFormData({
        name: productData.name,
        description: productData.description || "",
        image_url: productData.image_url,
        metal_type: productData.metal_type,
        carat: productData.carat?.toString() || "",
        weight_grams: productData.weight_grams.toString(),
        material_color: productData.material_color || "",
        size_description: productData.size_description || "",
        gender: productData.gender,
        category_id: productData.category_id.toString(),
        collection_type: productData.collection_type || "",
        manual_price: productData.metal_type === 'other' ? (productData.base_price?.toString() || "") : ""
      })
    } catch (error) {
      console.error('Error fetching data:', error)
      toast.error('Failed to fetch product data')
      router.push('/admin/products')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.image_url || !formData.metal_type || 
          !formData.weight_grams || !formData.gender || !formData.category_id) {
        toast.error('Please fill in all required fields')
        return
      }

      // Validate carat for gold
      if (formData.metal_type === 'gold' && !formData.carat) {
        toast.error('Please select carat for gold products')
        return
      }

      // Validate material type for other metals
      if (formData.metal_type === 'other' && !formData.material_color) {
        toast.error('Please specify material type for other metal products')
        return
      }

      // Validate manual price for other metals
      if (formData.metal_type === 'other' && !formData.manual_price) {
        toast.error('Please specify the price for other metal products')
        return
      }

      const productData = {
        name: formData.name,
        description: formData.description || undefined,
        image_url: formData.image_url,
        metal_type: formData.metal_type as "gold" | "silver" | "other",
        carat: formData.metal_type === 'gold' ? parseInt(formData.carat) : undefined,
        weight_grams: parseFloat(formData.weight_grams),
        material_color: formData.material_color || undefined,
        size_description: formData.size_description || undefined,
        gender: formData.gender as "male" | "female" | "flexible" | "kids",
        category_id: parseInt(formData.category_id),
        collection_type: formData.collection_type || undefined,
        manual_price: formData.metal_type === 'other' ? parseFloat(formData.manual_price) : undefined
      }

      await updateProduct(productId, productData)
      toast.success('Product updated successfully')
      router.push('/admin/products')
    } catch (error) {
      console.error('Error updating product:', error)
      if (error instanceof Error) {
        toast.error(`Failed to update product: ${error.message}`)
      } else {
        toast.error('Failed to update product')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-4">The product you're looking for doesn't exist.</p>
          <Link href="/admin/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600 mt-2">Update product details and information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Product Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image_url">
                  Image URL (Google Drive) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => handleInputChange('image_url', e.target.value)}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Metal & Weight Information */}
        <Card>
          <CardHeader>
            <CardTitle>Metal & Weight Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metal_type">
                  Metal Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.metal_type} onValueChange={(value) => handleInputChange('metal_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select metal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.metal_type === 'gold' && (
                <div className="space-y-2">
                  <Label htmlFor="carat">
                    Carat <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formData.carat} onValueChange={(value) => handleInputChange('carat', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select carat" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="22">22K</SelectItem>
                      <SelectItem value="18">18K</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.metal_type === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="material_color">
                    Material Type <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="material_color"
                    value={formData.material_color}
                    onChange={(e) => handleInputChange('material_color', e.target.value)}
                    placeholder="e.g., Platinum, Rose Gold, Diamond, Pearl"
                    required
                  />
                </div>
              )}

              {formData.metal_type === 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="manual_price">
                    Product Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="manual_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.manual_price}
                    onChange={(e) => handleInputChange('manual_price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                  <p className="text-xs text-gray-500">Enter the final price including all costs</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="weight_grams">
                  Weight (grams) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight_grams"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formData.weight_grams}
                  onChange={(e) => handleInputChange('weight_grams', e.target.value)}
                  placeholder="0.000"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.metal_type !== 'other' && (
                <div className="space-y-2">
                  <Label htmlFor="material_color">Material Color</Label>
                  <Input
                    id="material_color"
                    value={formData.material_color}
                    onChange={(e) => handleInputChange('material_color', e.target.value)}
                    placeholder="e.g., Yellow Gold, White Gold"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="size_description">Size Description</Label>
                <Input
                  id="size_description"
                  value={formData.size_description}
                  onChange={(e) => handleInputChange('size_description', e.target.value)}
                  placeholder="e.g., Size 7, Adjustable"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Collection */}
        <Card>
          <CardHeader>
            <CardTitle>Category & Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="flexible">Unisex</SelectItem>
                    <SelectItem value="kids">Kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collection_type">Collection</Label>
                <Input
                  id="collection_type"
                  value={formData.collection_type}
                  onChange={(e) => handleInputChange('collection_type', e.target.value)}
                  placeholder="e.g., Daily Wear, Party"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Pricing Info */}
        {product.base_price && product.final_price && (
          <Card>
            <CardHeader>
              <CardTitle>Current Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-600">Base Price</Label>
                  <p className="text-lg font-semibold">{product.base_price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-600">Final Price (with GST)</Label>
                  <p className="text-lg font-semibold text-green-600">{product.final_price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Prices will be automatically recalculated when you save changes based on current metal rates and making costs.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/products">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating Product...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Update Product
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 