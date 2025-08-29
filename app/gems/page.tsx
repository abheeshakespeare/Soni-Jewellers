"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Search, Filter, Gem, Crown, Sparkles } from "lucide-react"
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

export default function GemsPage() {
  const [gems, setGems] = useState<Gem[]>([])
  const [loading, setLoading] = useState(true)
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
      const { data, error } = await supabase
        .from("gems")
        .select("*")
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (error) throw error
      setGems(data || [])
    } catch (error) {
      console.error("Error fetching gems:", error)
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

  const gemCategories = [
    "Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Opal", "Topaz",
    "Amethyst", "Garnet", "Aquamarine", "Turquoise", "Peridot", "Spinel",
    "Citrine", "Zircon", "Moonstone", "Onyx", "Lapis Lazuli"
  ]

  const gemTypes = ["Natural", "Lab-grown", "Synthetic"]

  return (
    <main>
      {/* Gems Section */}
      <section id="gems" className="py-20 bg-gradient-to-br from-gray-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Gemstones</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our exclusive collection of precious and semi-precious gemstones, 
              each with its own unique beauty and significance.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="mb-12 bg-white rounded-2xl shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {gemCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          {/* Gems Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
              <div className="text-amber-600">Loading gems...</div>
            </div>
          ) : sortedGems.length === 0 ? (
            <div className="text-center py-12">
              <Gem className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Gems Found</h3>
              <p className="text-gray-600">Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                      <div className="mb-2">
                        <div className="text-xs text-gray-500 mb-1">{gem.gem_brand_name}</div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors text-sm line-clamp-2">
                          {gem.gem_name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs text-gray-600">
                          {gem.gem_weight} {gem.measurement}
                        </div>
                        <div className="text-xs text-gray-600">
                          {gem.gem_cut} Cut
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-amber-700">
                          {formatPrice(gem.mrp)}
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

          {/* Category Grid (Fallback when no gems) */}
          {!loading && sortedGems.length === 0 && (
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Browse by Category</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {Object.keys(GEMS_CATEGORY_IMAGES).map((gem) => (
                  <Link key={gem} href={`/gems?gem=${gem}`} className="group">
                    <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                      {/* Image */}
                      <div className="aspect-square relative">
                        <Image
                          src={GEMS_CATEGORY_IMAGES[gem]}
                          alt={gem}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                      {/* Title */}
                      <div className="p-6 text-center">
                        <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors text-lg">
                          {gem}
                        </h3>
                        <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ArrowRight className="h-4 w-4 text-yellow-600" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
