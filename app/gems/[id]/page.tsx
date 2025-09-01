"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Star, Gem, Crown, Sparkles, MessageCircle, Scale, Scissors, Palette, Award, Shield, Eye, ChevronRight } from "lucide-react"
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
  const [imageLoaded, setImageLoaded] = useState(false)

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-amber-200 border-t-amber-600 mx-auto mb-6"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-amber-600 animate-pulse" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Loading Gemstone</h3>
          <p className="text-amber-600">Preparing the finest details...</p>
        </div>
      </div>
    )
  }

  if (!gem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-3xl p-8 shadow-xl">
            <Gem className="h-20 w-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Gemstone Not Found</h2>
            <p className="text-gray-600 mb-6">This precious stone is not available or has been moved to our private collection.</p>
            <Link href="/gems">
              <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Explore Our Collection
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-yellow-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Navigation */}
        <div className="mb-8">
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
            <Link href="/gems" className="hover:text-amber-600 transition-colors">Gemstones</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{gem.gem_category}</span>
            <ChevronRight className="h-4 w-4" />
            <span className="text-amber-600 font-medium truncate max-w-xs">{gem.gem_name}</span>
          </nav>
          <Link href="/gems">
            <Button variant="outline" size="sm" className="border-amber-200 hover:bg-amber-50 hover:border-amber-300">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Collection
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Enhanced Gem Image */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div className="aspect-square relative">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="animate-pulse">
                      <Gem className="h-12 w-12 text-gray-400" />
                    </div>
                  </div>
                )}
                <img
                  src={gem.gem_image_url}
                  alt={gem.gem_name}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=600&width=600"
                    setImageLoaded(true)
                  }}
                />
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                
                {/* Floating Badges */}
                <div className="absolute top-6 right-6 space-y-2">
                  <Badge className="bg-amber-600/90 text-white px-4 py-2 text-sm font-semibold backdrop-blur-sm shadow-lg">
                    {gem.gem_category}
                  </Badge>
                  <Badge className="bg-white/90 text-gray-800 px-4 py-2 text-sm font-semibold backdrop-blur-sm shadow-lg">
                    Premium Quality
                  </Badge>
                </div>

                {/* Authenticity Mark */}
                <div className="absolute bottom-6 left-6">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <Scale className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">{gem.gem_weight}</div>
                <div className="text-sm text-gray-600">{gem.measurement}</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <Scissors className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">{gem.gem_cut}</div>
                <div className="text-sm text-gray-600">Cut</div>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-lg text-center">
                <Palette className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-lg font-bold text-gray-900">{gem.gem_color}</div>
                <div className="text-sm text-gray-600">Color</div>
              </div>
            </div>
          </div>

          {/* Enhanced Gem Details */}
          <div className="space-y-8">
            {/* Header Section */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown className="h-6 w-6 text-amber-600" />
                    <span className="text-lg font-medium text-amber-700 bg-amber-50 px-4 py-1 rounded-full">
                      {gem.gem_brand_name}
                    </span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">{gem.gem_name}</h1>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 px-4 py-2">
                      <Award className="h-4 w-4 mr-2" />
                      {gem.gem_type}
                    </Badge>
                    <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50 px-4 py-2">
                      <Eye className="h-4 w-4 mr-2" />
                      {gem.gem_cut} Cut
                    </Badge>
                    <Badge variant="outline" className="text-purple-700 border-purple-300 bg-purple-50 px-4 py-2">
                      <Palette className="h-4 w-4 mr-2" />
                      {gem.gem_color}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Pricing Section */}
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm text-amber-700 font-medium mb-2 block">Rate per Carat</Label>
                    <div className="text-2xl font-bold text-amber-800">{formatPrice(gem.rate_per_cts)}</div>
                  </div>
                  <div>
                    <Label className="text-sm text-amber-700 font-medium mb-2 block">Market Price</Label>
                    <div className="text-3xl font-bold text-amber-900">{formatPrice(gem.mrp)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Specifications */}
            <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Sparkles className="h-6 w-6" />
                  Gemstone Specifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="bg-amber-100 p-3 rounded-full">
        <Scale className="h-6 w-6 text-amber-600" />
      </div>
      <div>
        <Label className="text-sm text-gray-600 font-medium">Total Weight</Label>
        <div className="text-xl font-bold text-gray-900">
  <div>{gem.gem_weight}</div>
  <div className="text-sm font-medium text-gray-500">{gem.measurement}</div>
</div>
      </div>
    </div>

    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="bg-blue-100 p-3 rounded-full">
        <Scissors className="h-6 w-6 text-blue-600" />
      </div>
      <div>
        <Label className="text-sm text-gray-600 font-medium">Cut Style</Label>
        <div className="text-xl font-bold text-gray-900">{gem.gem_cut}</div>
      </div>
    </div>

    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="bg-purple-100 p-3 rounded-full">
        <Palette className="h-6 w-6 text-purple-600" />
      </div>
      <div>
        <Label className="text-sm text-gray-600 font-medium">Color Grade</Label>
        <div className="text-xl font-bold text-gray-900">{gem.gem_color}</div>
      </div>
    </div>

    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
      <div className="bg-green-100 p-3 rounded-full">
        <Award className="h-6 w-6 text-green-600" />
      </div>
      <div>
        <Label className="text-sm text-gray-600 font-medium">Origin Type</Label>
        <div className="text-xl font-bold text-gray-900">{gem.gem_type}</div>
      </div>
    </div>
  </div>
</CardContent>

            </Card>

            {/* Enhanced Contact Section */}
            <Card className="shadow-xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <MessageCircle className="h-6 w-6" />
                  Contact Gemstone Expert
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
                    <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Get Expert Consultation</h3>
                    <p className="text-gray-600">
                      Connect with our certified gemologists to discuss this precious stone's 
                      authenticity, valuation, and investment potential.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setShowContactModal(true)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                  >
                    <MessageCircle className="h-5 w-5 mr-3" />
                    Contact Gemstone Owner
                  </Button>
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </div>

      {/* Contact Modal - Unchanged */}
      {showContactModal && (
        <OrderNoticeModal 
          open={showContactModal} 
          onClose={() => setShowContactModal(false)} 
        />
      )}
    </div>
  )
}