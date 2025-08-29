"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Eye, EyeOff, Trash2, Search, Filter } from "lucide-react"
import Link from "next/link"
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

export default function AdminGemsPage() {
  const [gems, setGems] = useState<Gem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [publicFilter, setPublicFilter] = useState("all")

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
        .order("created_at", { ascending: false })

      if (error) throw error
      setGems(data || [])
    } catch (error) {
      console.error("Error fetching gems:", error)
    } finally {
      setLoading(false)
    }
  }

  const togglePublicStatus = async (gemId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("gems")
        .update({ is_public: !currentStatus })
        .eq("id", gemId)

      if (error) throw error
      fetchGems() // Refresh the list
    } catch (error) {
      console.error("Error updating gem status:", error)
    }
  }

  const deleteGem = async (gemId: string) => {
    if (!confirm("Are you sure you want to delete this gem?")) return

    try {
      const { error } = await supabase
        .from("gems")
        .delete()
        .eq("id", gemId)

      if (error) throw error
      fetchGems() // Refresh the list
    } catch (error) {
      console.error("Error deleting gem:", error)
    }
  }

  const filteredGems = gems.filter((gem) => {
    const matchesSearch = gem.gem_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gem.gem_brand_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gem.gem_category.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || gem.gem_category === categoryFilter
    const matchesType = typeFilter === "all" || gem.gem_type === typeFilter
    const matchesPublic = publicFilter === "all" || 
                         (publicFilter === "public" && gem.is_public) ||
                         (publicFilter === "private" && !gem.is_public)

    return matchesSearch && matchesCategory && matchesType && matchesPublic
  })

  const gemCategories = [
    "Diamond", "Ruby", "Emerald", "Sapphire", "Pearl", "Opal", "Topaz",
    "Amethyst", "Garnet", "Aquamarine", "Turquoise", "Peridot", "Spinel",
    "Citrine", "Zircon", "Moonstone", "Onyx", "Lapis Lazuli"
  ]

  const gemTypes = ["Natural", "Lab-grown", "Synthetic"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Gemstones Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your gemstone catalog, add new gems, and control their visibility
            </p>
          </div>
          <Link href="/admin/gems/new">
            <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600">
              <Plus className="h-4 w-4 mr-2" />
              Add New Gem
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search gems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Categories</option>
                  {gemCategories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Types</option>
                  {gemTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Public Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={publicFilter}
                  onChange={(e) => setPublicFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">All Status</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gems Table */}
        <Card>
          <CardHeader>
            <CardTitle>Gemstones ({filteredGems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-amber-600">Loading gems...</div>
              </div>
            ) : filteredGems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-500">No gems found matching your criteria.</div>
                <Link href="/admin/gems/new">
                  <Button className="mt-4 bg-gradient-to-r from-amber-500 to-yellow-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Gem
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Image</TableHead>
                      <TableHead>Brand & Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Rate/Ct</TableHead>
                      <TableHead>MRP</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGems.map((gem) => (
                      <TableRow key={gem.id}>
                        <TableCell>
                          <img
                            src={gem.gem_image_url}
                            alt={gem.gem_name}
                            className="w-16 h-16 object-cover rounded-lg border"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-semibold text-gray-900">{gem.gem_brand_name}</div>
                            <div className="text-sm text-gray-600">{gem.gem_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {gem.gem_category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={gem.gem_type === 'Natural' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {gem.gem_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {gem.gem_weight} {gem.measurement}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {formatPrice(gem.rate_per_cts)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-bold text-amber-700">
                            {formatPrice(gem.mrp)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={gem.is_public ? "default" : "secondary"}
                            className={gem.is_public ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                          >
                            {gem.is_public ? "Public" : "Private"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => togglePublicStatus(gem.id, gem.is_public)}
                              title={gem.is_public ? "Make Private" : "Make Public"}
                            >
                              {gem.is_public ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Link href={`/admin/gems/${gem.id}/edit`}>
                              <Button size="sm" variant="outline">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => deleteGem(gem.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
