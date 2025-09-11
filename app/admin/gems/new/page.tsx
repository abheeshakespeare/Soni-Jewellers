"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewGemPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    gem_brand_name: "",
    gem_name: "",
    gem_image_url: "",
    gem_category: "",
    gem_type: "",
    gem_cut: "",
    gem_color: "",
    gem_weight: "",
    measurement: "",
    rate_per_cts: "",
    mrp: "",
    is_public: true
  })

  const gemCategories = [
    "Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Opal", "Topaz", "Coral",
    "Amethyst", "Garnet", "Aquamarine", "Turquoise", "Peridot", "Spinel",
    "Citrine", "Zircon", "Moonstone", "Onyx", "Lapis Lazuli"
  ]

  const gemTypes = ["Natural", "Lab-grown", "Synthetic"]

  const gemCuts = [
    "Round", "Oval", "Princess", "Cushion", "Emerald", "Pear", "Marquise",
    "Radiant", "Asscher", "Heart", "Baguette", "Trillion", "Rose", "Cabochon"
  ]

  const measurements = ["cts", "grams", "carats", "mm", "inches"]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.gem_brand_name || !formData.gem_name || !formData.gem_image_url || 
        !formData.gem_category || !formData.gem_type || !formData.gem_cut || 
        !formData.gem_color || !formData.gem_weight || !formData.measurement || 
        !formData.rate_per_cts || !formData.mrp) {
      toast.error("Please fill in all required fields")
      return
    }

    setLoading(true)
    const timeout = setTimeout(() => setLoading(false), 15000)

    try {
      const { error } = await supabase
        .from("gems")
        .insert({
          gem_brand_name: formData.gem_brand_name.trim(),
          gem_name: formData.gem_name.trim(),
          gem_image_url: formData.gem_image_url.trim(),
          gem_category: formData.gem_category,
          gem_type: formData.gem_type,
          gem_cut: formData.gem_cut,
          gem_color: formData.gem_color.trim(),
          gem_weight: parseFloat(formData.gem_weight),
          measurement: formData.measurement,
          rate_per_cts: parseFloat(formData.rate_per_cts),
          mrp: parseFloat(formData.mrp),
          is_public: formData.is_public
        })

      if (error) throw error

      toast.success("Gem added successfully!")
      router.push("/admin/gems")
    } catch (error) {
      console.error("Error adding gem:", error)
      toast.error("Failed to add gem. Please try again.")
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/gems">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gems
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Add New Gemstone
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new gemstone to your catalog
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gem_brand_name">Gem Brand Name *</Label>
                  <Input
                    id="gem_brand_name"
                    value={formData.gem_brand_name}
                    onChange={(e) => handleInputChange("gem_brand_name", e.target.value)}
                    placeholder="e.g., Tiffany & Co., Cartier"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gem_name">Gem Name *</Label>
                  <Input
                    id="gem_name"
                    value={formData.gem_name}
                    onChange={(e) => handleInputChange("gem_name", e.target.value)}
                    placeholder="e.g., Blue Diamond, Ruby Stone"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gem_image_url">Gem Image URL *</Label>
                  <Input
                    id="gem_image_url"
                    type="url"
                    value={formData.gem_image_url}
                    onChange={(e) => handleInputChange("gem_image_url", e.target.value)}
                    placeholder="https://example.com/gem-image.jpg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="gem_category">Gem Category *</Label>
                  <Select value={formData.gem_category} onValueChange={(value) => handleInputChange("gem_category", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {gemCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Gem Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Gem Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="gem_type">Gemstone Type *</Label>
                  <Select value={formData.gem_type} onValueChange={(value) => handleInputChange("gem_type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {gemTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gem_cut">Gem Cut *</Label>
                  <Select value={formData.gem_cut} onValueChange={(value) => handleInputChange("gem_cut", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cut" />
                    </SelectTrigger>
                    <SelectContent>
                      {gemCuts.map((cut) => (
                        <SelectItem key={cut} value={cut}>
                          {cut}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="gem_color">Gem Color *</Label>
                  <Input
                    id="gem_color"
                    value={formData.gem_color}
                    onChange={(e) => handleInputChange("gem_color", e.target.value)}
                    placeholder="e.g., Blue, Red, Green, Colorless"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gem_weight">Gem Weight *</Label>
                    <Input
                      id="gem_weight"
                      type="number"
                      step="0.001"
                      value={formData.gem_weight}
                      onChange={(e) => handleInputChange("gem_weight", e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="measurement">Measurement *</Label>
                    <Select value={formData.measurement} onValueChange={(value) => handleInputChange("measurement", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {measurements.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="rate_per_cts">Rate per Carat *</Label>
                  <Input
                    id="rate_per_cts"
                    type="number"
                    step="0.01"
                    value={formData.rate_per_cts}
                    onChange={(e) => handleInputChange("rate_per_cts", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="mrp">MRP (Maximum Retail Price) *</Label>
                  <Input
                    id="mrp"
                    type="number"
                    step="0.01"
                    value={formData.mrp}
                    onChange={(e) => handleInputChange("mrp", e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="is_public"
                    type="checkbox"
                    checked={formData.is_public}
                    onChange={(e) => handleInputChange("is_public", e.target.checked)}
                    className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                  />
                  <Label htmlFor="is_public">Make this gem public</Label>
                </div>
              </CardContent>
            </Card>

            {/* Preview Card */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.gem_image_url && (
                  <div className="space-y-3">
                    <img
                      src={formData.gem_image_url}
                      alt="Gem preview"
                      className="w-full h-48 object-cover rounded-lg border"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=192&width=400"
                      }}
                    />
                    <div className="text-sm space-y-1">
                      <div><strong>Brand:</strong> {formData.gem_brand_name || "Not specified"}</div>
                      <div><strong>Name:</strong> {formData.gem_name || "Not specified"}</div>
                      <div><strong>Category:</strong> {formData.gem_category || "Not specified"}</div>
                      <div><strong>Type:</strong> {formData.gem_type || "Not specified"}</div>
                      <div><strong>Cut:</strong> {formData.gem_cut || "Not specified"}</div>
                      <div><strong>Color:</strong> {formData.gem_color || "Not specified"}</div>
                      <div><strong>Weight:</strong> {formData.gem_weight ? `${formData.gem_weight} ${formData.measurement}` : "Not specified"}</div>
                      <div><strong>Rate/Ct:</strong> {formData.rate_per_cts ? `₹${parseFloat(formData.rate_per_cts).toLocaleString()}` : "Not specified"}</div>
                      <div><strong>MRP:</strong> {formData.mrp ? `₹${parseFloat(formData.mrp).toLocaleString()}` : "Not specified"}</div>
                    </div>
                  </div>
                )}
                {!formData.gem_image_url && (
                  <div className="text-center text-gray-500 py-8">
                    Add an image URL to see preview
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding Gem...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Add Gem
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
