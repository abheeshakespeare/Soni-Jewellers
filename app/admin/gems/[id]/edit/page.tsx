"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Gem {
  id: string
  gem_brand_name: string
  gem_name: string
  gem_image_url: string
  gem_category: string
  gem_type: string
  gem_cut: string
  gem_color: string
  gem_weight: number
  measurement: string
  rate_per_cts: number
  mrp: number
  is_public: boolean
  created_at: string
  updated_at: string
}

export default function EditGemPage() {
  const router = useRouter()
  const params = useParams()
  const gemId = params.id as string
  const supabase = createClient()
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [gem, setGem] = useState<Gem | null>(null)

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
    is_public: false
  })

  const gemCategories = [
    "Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Opal", "Topaz", "Coral",
  "Amethyst", "Garnet", "Aquamarine", "Turquoise", "Peridot", "Spinel",
  "Citrine", "Zircon", "Moonstone", "Onyx", "Lapis Lazuli",
  "Cats Eye", "Nili", "Moissanite", "Hessonite"
  ]

  const gemTypes = ["Natural", "Lab-grown", "Synthetic"]

  const gemCuts = [
    "Round", "Oval", "Princess", "Cushion", "Emerald", "Pear", "Marquise", "Square",
    "Radiant", "Asscher", "Heart", "Baguette", "Trillion", "Rose", "Cabochon","Triangle",
  ]

  const measurements = ["cts", "grams", "carats", "mm", "inches"]

  useEffect(() => {
    if (gemId) {
      fetchGem()
    }
  }, [gemId])

  const fetchGem = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("gems")
        .select("*")
        .eq("id", gemId)
        .single()

      if (error) throw error

      setGem(data)
      setFormData({
        gem_brand_name: data.gem_brand_name,
        gem_name: data.gem_name,
        gem_image_url: data.gem_image_url,
        gem_category: data.gem_category,
        gem_type: data.gem_type,
        gem_cut: data.gem_cut,
        gem_color: data.gem_color,
        gem_weight: data.gem_weight.toString(),
        measurement: data.measurement,
        rate_per_cts: data.rate_per_cts.toString(),
        mrp: data.mrp.toString(),
        is_public: data.is_public
      })
    } catch (error) {
      console.error("Error fetching gem:", error)
      toast.error("Failed to fetch gem details")
      router.push("/admin/gems")
    } finally {
      setLoading(false)
    }
  }

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

    setSaving(true)

    try {
      const { error } = await supabase
        .from("gems")
        .update({
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
        .eq("id", gemId)

      if (error) throw error

      toast.success("Gem updated successfully!")
      router.push("/admin/gems")
    } catch (error) {
      console.error("Error updating gem:", error)
      toast.error("Failed to update gem. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-amber-600" />
          <div className="text-amber-600">Loading gem details...</div>
        </div>
      </div>
    )
  }

  if (!gem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Gem not found</div>
          <Link href="/admin/gems">
            <Button>Back to Gems</Button>
          </Link>
        </div>
      </div>
    )
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
              Edit Gemstone
            </h1>
            <p className="text-gray-600 mt-1">
              Update gemstone details
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
              disabled={saving}
              className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Updating Gem...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Gem
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
