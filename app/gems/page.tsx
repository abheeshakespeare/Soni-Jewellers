"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Search, Filter, Gem, Crown, Sparkles, ChevronLeft, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatPrice } from "@/lib/utils"

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

const GEMS_CATEGORY_IMAGES: Record<string, string> = {
  "Diamond": "https://blog.brilliance.com/wp-content/uploads/2017/06/perfect-diamond-isolated-on-shiny-background.jpg",
  "Ruby": "https://astteria.com/cdn/shop/articles/5-e1687679784650.jpg?v=1744355002",
  "Emerald": "https://preciousearth.in/cdn/shop/articles/emerald-gemstone-collage_1.jpg?v=1708068826",
  "Sapphire": "https://gemastro.com/wp-content/uploads/2024/11/a-photo-of-a-blue-sapphire-stone-with-a-textured-b-o6SEFwIGTZW-w40AExN4fQ-AGEPh0bVR1u2pgAfaeq3OA-800x800.jpeg",
  "Pearl": "https://m.media-amazon.com/images/I/31uip5SIP1L._UY1100_.jpg",
  "Opal": "https://vastufunda.com/wp-content/uploads/2024/12/52507e74-c0ae-4c7c-bbc5-84f4f4614208.jpg",
  "Topaz": "https://cdn.shopify.com/s/files/1/0217/9316/files/320-IMG_0001-copy1_large.jpg",
  "Amethyst": "https://labradoriteking.com/cdn/shop/files/20240227-181933-01.jpg?v=1712206797&width=2992",
  "Garnet": "https://cdn.shopify.com/s/files/1/0811/8881/5137/files/Garnet_Stone_Benefits_480x480.jpg?v=1712922969",
  "Aquamarine": "https://i.ebayimg.com/00/s/MTE0MFgxMTQw/z/djwAAOSwnxphk53s/$_57.JPG?set_id=8800005007",
  "Turquoise": "https://cdn.shopify.com/s/files/1/2699/2146/files/MIMOSA_Handcrafted_Various_unset_turquoise_cabochons_480x480.jpg?v=1660755907",
  "Peridot": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9Zk78ryQcVnLR05xl6R7l9XzV3iEIUfQ3cw&s",
  "Spinel": "https://rayshouseofgems.com/wp-content/uploads/bb-plugin/cache/Red-spinel-gemstones-square.jpg",
  "Citrine": "https://www.moregems.com/cdn/shop/products/a6e23c28dd9c1bbb29ee246179065985_1600x.jpg?v=1571723914",
  "Zircon": "https://www.angara.com/blog/wp-content/uploads/2023/12/Different-Types-of-Blue-Zircon-Gemstone.jpg",
  "Moonstone": "https://www.grimballjewelers.com/wp-content/uploads/2024/12/6f4f4d788bc436a1/moonstone-gemstone.jpeg",
  "Onyx": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNthMGEXw0xncVSyKi-In1W9QRUnMjMr1DTg&s",
  "Lapis Lazuli": "https://www.stonestoryjewellery.com/cdn/shop/files/2024_06_08_026174_375x375_crop_center.jpg?v=1718794719",
}

const gemCategories = [
  "Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Opal", "Topaz",
  "Amethyst", "Garnet", "Aquamarine", "Turquoise", "Peridot", "Spinel",
  "Citrine", "Zircon", "Moonstone", "Onyx", "Lapis Lazuli"
]

const gemTypes = ["Natural", "Lab-grown", "Synthetic"]

export default function GemsPage() {
  const [gems, setGems] = useState<Gem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const supabase = createClient()

  useEffect(() => {
    fetchGems()
  }, [])

  const fetchGems = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      )
      
      const fetchPromise = supabase
        .from("gems")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any

      if (error) throw error
      setGems(data || [])
    } catch (error: any) {
      console.error("Error fetching gems:", error)
      setError(error.message || "Failed to load gems")
      // Set empty array to show category grid
      setGems([])
    } finally {
      setLoading(false)
    }
  }

  const filteredGems = gems.filter((gem) => {
    const matchesSearch = gem.gem_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gem.gem_brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gem.gem_category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || gem.gem_category === categoryFilter
    const matchesType = typeFilter === "all" || gem.gem_type === typeFilter

    return matchesSearch && matchesCategory && matchesType
  })

  const sortedGems = [...filteredGems].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      case "oldest":
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      case "price-low":
        return a.mrp - b.mrp
      case "price-high":
        return b.mrp - a.mrp
      case "weight-low":
        return a.gem_weight - b.gem_weight
      case "weight-high":
        return b.gem_weight - a.gem_weight
      default:
        return 0
    }
  })

  return (
    <main>
      {/* Gems Section */}
      <section id="gems" className="py-20 bg-gradient-to-br from-gray-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Gemstones</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our exclusive collection of precious and semi-precious gemstones, 
              each with its own unique beauty and significance.
            </p>
          </div>

          {/* Category Carousel - Always Visible */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Browse Categories</h3>
            <div className="relative">
              <div className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4">
                {/* All Categories Option */}
                <button
                  onClick={() => setCategoryFilter("all")}
                  className={`flex-shrink-0 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    categoryFilter === "all"
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 bg-white hover:border-amber-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2 min-w-[80px]">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">All</span>
                  </div>
                </button>

                {/* Category Options */}
                {gemCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`flex-shrink-0 p-4 rounded-2xl border-2 transition-all duration-300 ${
                      categoryFilter === category
                        ? "border-amber-500 bg-amber-50"
                        : "border-gray-200 bg-white hover:border-amber-300"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2 min-w-[80px]">
                      <div className="w-12 h-12 rounded-full overflow-hidden">
                        <img
                          src={GEMS_CATEGORY_IMAGES[category]}
                          alt={category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-900 text-center leading-tight">
                        {category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Scroll Indicators */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Gems</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search gems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {gemTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="weight-low">Weight: Low to High</SelectItem>
                    <SelectItem value="weight-high">Weight: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Failed to Load Gems</h3>
                  <p className="text-red-600">{error}</p>
                </div>
                <button
                  onClick={fetchGems}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <div className="text-amber-600 text-lg">Loading gems...</div>
              <div className="text-gray-500 text-sm mt-2">This may take a few moments</div>
            </div>
          )}

          {/* Gems Grid */}
          {!loading && sortedGems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
              {sortedGems.map((gem) => (
                <Link key={gem.id} href={`/gems/${gem.id}`} className="group">
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    {/* Image */}
                    <div className="aspect-square relative">
                      <img
                        src={gem.gem_image_url}
                        alt={gem.gem_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = GEMS_CATEGORY_IMAGES[gem.gem_category] || "/placeholder.svg?height=400&width=400"
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Badges */}
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-600 text-white text-xs">
                          {gem.gem_category}
                        </Badge>
                      </div>
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white/90 text-gray-700 text-xs">
                          {gem.gem_type}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="p-4">
                      <div className="mb-3">
                        <div className="text-xs text-gray-500 mb-1">{gem.gem_brand_name}</div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm line-clamp-2 mb-2">
                          {gem.gem_name}
                        </h3>
                      </div>
                      
                      {/* Weight and Measurement - Better Layout */}
                      <div className="bg-gray-50 rounded-lg p-3 mb-3">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-gray-500 block">Weight</span>
                            <span className="font-semibold text-gray-900">
                                {gem.gem_weight}
                            </span>
                            <div className="text-sm font-medium text-gray-500">
                              {gem.measurement}
                            </div>

                          </div>
                          <div>
                            <span className="text-gray-500 block">Cut</span>
                            <span className="font-semibold text-gray-900">{gem.gem_cut}</span>
                          </div>
                        </div>
                        {gem.gem_color && (
                          <div className="mt-2 text-xs">
                            <span className="text-gray-500">Color: </span>
                            <span className="font-semibold text-gray-900">{gem.gem_color}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-lg font-bold text-amber-700">
                            {formatPrice(gem.mrp)}
                          </div>
                          {gem.rate_per_cts && (
                            <div className="text-xs text-gray-500">
                              {formatPrice(gem.rate_per_cts)}/ct
                            </div>
                          )}
                        </div>
                        <div className="flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-4 w-4 text-amber-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Gems Found */}
          {!loading && !error && sortedGems.length === 0 && gems.length > 0 && (
            <div className="text-center py-12 mb-16">
              <Gem className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gems Found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters.</p>
              <button
                onClick={() => {
                  setSearchTerm("")
                  setCategoryFilter("all")
                  setTypeFilter("all")
                }}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Category Grid - Always Visible at Bottom */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Explore All Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {gemCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className="group"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                    {/* Image */}
                    <div className="aspect-square relative">
                      <img
                        src={GEMS_CATEGORY_IMAGES[category]}
                        alt={category}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    {/* Title */}
                    <div className="p-4 text-center">
                      <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm">
                        {category}
                      </h3>
                      <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="h-4 w-4 text-amber-600" />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}