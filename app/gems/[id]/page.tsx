"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Star, Gem, Crown, Sparkles, MessageCircle } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { toast } from "sonner"
import OrderNoticeModal from "@/app/notice/gemcontact"

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

export default function GemDetailPage() {
  const params = useParams()
  const gemId = params.id as string
  const supabase = createClient()
  
  const [gem, setGem] = useState<Gem | null>(null)
  const [loading, setLoading] = useState(true)
  const [showContactModal, setShowContactModal] = useState(false)

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
        .eq("is_public", true)
        .single()

      if (error) throw error
      setGem(data)
    } catch (error) {
      console.error("Error fetching gem:", error)
      toast.error("Gem not found or not available")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <div className="text-amber-600">Loading gem details...</div>
        </div>
      </div>
    )
  }

  if (!gem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Gem className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Gem Not Found</h2>
          <p className="text-gray-600 mb-4">This gem is not available or has been removed.</p>
          <Link href="/gems">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gems
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link href="/gems">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Gems
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gem Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-xl">
              <img
                src={gem.gem_image_url}
                alt={gem.gem_name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=384&width=600"
                }}
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-amber-600 text-white px-3 py-1">
                  {gem.gem_category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Gem Details */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-5 w-5 text-amber-600" />
                <span className="text-sm text-gray-600">{gem.gem_brand_name}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{gem.gem_name}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-amber-700 border-amber-300">
                  {gem.gem_type}
                </Badge>
                <Badge variant="outline" className="text-blue-700 border-blue-300">
                  {gem.gem_cut} Cut
                </Badge>
                <Badge variant="outline" className="text-green-700 border-green-300">
                  {gem.gem_color}
                </Badge>
              </div>
            </div>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-600" />
                  Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">Weight</Label>
                    <div className="font-semibold">{gem.gem_weight} {gem.measurement}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">Rate per Carat</Label>
                    <div className="font-semibold text-amber-700">{formatPrice(gem.rate_per_cts)}</div>
                  </div>
                </div>
                <div className="pt-3 border-t">
                  <Label className="text-sm text-gray-600">MRP</Label>
                  <div className="text-2xl font-bold text-amber-700">{formatPrice(gem.mrp)}</div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Owner */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-amber-600" />
                  Contact Owner
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Interested in this gemstone? Contact the owner to discuss details, 
                  pricing, and availability.
                </p>
                <Button 
                  onClick={() => setShowContactModal(true)}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold hover:from-amber-600 hover:to-yellow-600"
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Owner
                </Button>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">About This Gemstone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <span>Premium quality {gem.gem_category.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gem className="h-4 w-4 text-blue-500" />
                  <span>Expertly cut {gem.gem_cut.toLowerCase()} shape</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-purple-500" />
                  <span>Certified {gem.gem_type.toLowerCase()} origin</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <OrderNoticeModal 
          open={showContactModal} 
          onClose={() => setShowContactModal(false)} 
        />
      )}
    </div>
  )
}
