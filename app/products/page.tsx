import { createServerClient } from "@/lib/supabase/server"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "@/lib/products"
import { getProducts } from "@/lib/products"
import Link from "next/link"
import SortDropdown from "./sort-dropdown"
import SearchForm from "./search-form"
import MobileFilterButton from "../../components/mobile-filter-button"
import { Gem, Crown } from "lucide-react"

interface ProductsPageProps {
  searchParams: {
    category?: string
    metal?: string
    collection?: string
    gender?: string
    sort?: string
    search?: string
  }
}

// Set revalidation time to 1 hour
export const revalidate = 3600

async function getCategories(supabase: any) {
  return supabase.from("categories").select("*").order("name")
}

function ProductGrid({ products }: { products: Product[] }) {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
            <Gem className="w-16 h-16 text-amber-500" />
          </div>
          <div className="absolute -top-3 -right-8 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
            <Crown className="w-5 h-5 text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-amber-800 mb-4">No products found</h3>
        <p className="text-amber-600 mb-8 text-lg">Try adjusting your search criteria or check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

function buildFilterUrl(currentParams: any, newParams: any) {
  const params = new URLSearchParams()
  
  // Copy current params
  Object.entries(currentParams).forEach(([key, value]) => {
    if (value && key !== 'search') { 
      params.set(key, value as string)
    }
  })
  
  // Apply new params
  Object.entries(newParams).forEach(([key, value]) => {
    if (value === "all" || value === "" || value === undefined || value === null) {
      params.delete(key)
    } else {
      params.set(key, value as string)
    }
  })
  
  const queryString = params.toString()
  return queryString ? `?${queryString}` : ""
}

function ClearFiltersButton({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  if (!hasActiveFilters) return null;
  
  return (
    <Link href="/products">
      <Button 
        variant="outline" 
        className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 bg-amber-50/50"
      >
        <span className="mr-2">🗑️</span>
        Clear All Filters
      </Button>
    </Link>
  )
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const supabase = createServerClient()

  // Get all products first
  let products: Product[] = []
  try {
    products = await getProducts()
  } catch (error) {
    console.error('Error fetching products:', error)
  }

  // Get categories
  const { data: categories } = await getCategories(supabase)

  // Filter products based on search params
  let filteredProducts = products

  // Search filter
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase()
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchTerm) ||
      p.description?.toLowerCase().includes(searchTerm) ||
      p.collection_type?.toLowerCase().includes(searchTerm)
    )
  }

  if (searchParams.category && searchParams.category !== "all") {
    const category = categories?.find((c: any) => c.id.toString() === searchParams.category)
    if (category) {
      filteredProducts = filteredProducts.filter(p => Number(p.category_id) === Number(category.id))
    }
  }

  if (searchParams.metal && searchParams.metal !== "all") {
    filteredProducts = filteredProducts.filter(p => p.metal_type === searchParams.metal)
  }

  if (searchParams.collection && searchParams.collection !== "all") {
    filteredProducts = filteredProducts.filter(p => p.collection_type === searchParams.collection)
  }

  if (searchParams.gender && searchParams.gender !== "all") {
    filteredProducts = filteredProducts.filter(p => p.gender === searchParams.gender)
  }

  // Sort products
  switch (searchParams.sort) {
    case "price-low":
      filteredProducts = filteredProducts.sort((a, b) => (a.final_price || 0) - (b.final_price || 0))
      break
    case "price-high":
      filteredProducts = filteredProducts.sort((a, b) => (b.final_price || 0) - (a.final_price || 0))
      break
    case "newest":
      filteredProducts = filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    case "all":
      // Show all products without featured priority
      filteredProducts = filteredProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      break
    default:
      // Featured first, then by creation date
      filteredProducts = filteredProducts.sort((a, b) => {
        if (a.is_featured && !b.is_featured) return -1
        if (!a.is_featured && b.is_featured) return 1
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }

  // Get unique collection types from products
  const collectionTypes: string[] = products 
    ? [...new Set(products.map((p: Product) => p.collection_type).filter(Boolean) as string[])]
    : []

  const hasActiveFilters = !!(
    searchParams.search || 
    (searchParams.category && searchParams.category !== "all") || 
    (searchParams.metal && searchParams.metal !== "all") || 
    (searchParams.collection && searchParams.collection !== "all") || 
    (searchParams.gender && searchParams.gender !== "all")
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Elegant Header Section */}
        <div className="mb-12 text-center">
          <div className="inline-block">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Exquisite Jewellery Collection
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg font-light">Discover timeless elegance and craftsmanship</p>
          </div>
        </div>

        {/* Enhanced Search Bar */}
        <div className="mb-10">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-yellow-200 rounded-2xl blur opacity-20"></div>
              <div className="relative bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200/50 p-2">
                <SearchForm />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="block lg:hidden mb-8">
          <div className="flex flex-row gap-3 justify-center overflow-x-auto scrollbar-hide flex-nowrap px-1 -mx-1">
            <MobileFilterButton
              searchParams={searchParams}
              categories={categories}
              collectionTypes={collectionTypes}
              buttonClassName="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex-shrink-0"
            />
            <ClearFiltersButton hasActiveFilters={hasActiveFilters} />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          {/* Compact Enhanced Filters Sidebar */}
          <div className="lg:w-80 space-y-6 hidden lg:block">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-amber-200/50 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-6 py-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg text-amber-800 flex items-center gap-2">
                    <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
                    Refine Your Search
                  </h3>
                  <ClearFiltersButton hasActiveFilters={hasActiveFilters} />
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <Suspense fallback={<Skeleton className="h-32 rounded-xl" />}>
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                      Category
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Link href={buildFilterUrl(searchParams, { category: "all" })}>
                        <Badge
                          variant={!searchParams.category || searchParams.category === "all" ? "default" : "outline"}
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-3 py-1.5 ${
                            !searchParams.category || searchParams.category === "all"
                              ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                              : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                          }`}
                        >
                          All
                        </Badge>
                      </Link>
                      {categories?.map((category: any) => (
                        <Link key={category.id} href={buildFilterUrl(searchParams, { category: category.id })}>
                          <Badge
                            variant={searchParams.category === category.id.toString() ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-3 py-1.5 ${
                              searchParams.category === category.id.toString()
                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                                : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                            }`}
                          >
                            {category.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Metal Type & Gender Filter Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Metal Type Filter */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        Metal
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Link href={buildFilterUrl(searchParams, { metal: "all" })}>
                          <Badge
                            variant={!searchParams.metal || searchParams.metal === "all" ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-2 py-1 ${
                              !searchParams.metal || searchParams.metal === "all"
                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                                : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                            }`}
                          >
                            All
                          </Badge>
                        </Link>
                        <Link href={buildFilterUrl(searchParams, { metal: "gold" })}>
                          <Badge
                            variant={searchParams.metal === "gold" ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-2 py-1 ${
                              searchParams.metal === "gold"
                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                                : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                            }`}
                          >
                            ✨ Gold
                          </Badge>
                        </Link>
                        <Link href={buildFilterUrl(searchParams, { metal: "silver" })}>
                          <Badge
                            variant={searchParams.metal === "silver" ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-2 py-1 ${
                              searchParams.metal === "silver"
                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                                : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                            }`}
                          >
                            🌟 Silver
                          </Badge>
                        </Link>
                      </div>
                    </div>

                    {/* Gender Filter */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                        Gender
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        <Link href={buildFilterUrl(searchParams, { gender: "all" })}>
                          <Badge
                            variant={!searchParams.gender || searchParams.gender === "all" ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-2 py-1 ${
                              !searchParams.gender || searchParams.gender === "all"
                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                                : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                            }`}
                          >
                            All
                          </Badge>
                        </Link>
                        {[
                          { value: "male", label: "👨 Male" },
                          { value: "female", label: "👩 Female" },
                          { value: "flexible", label: "🔄 Unisex" },
                          { value: "kids", label: "👶 Kids" }
                        ].map((gender) => (
                          <Link key={gender.value} href={buildFilterUrl(searchParams, { gender: gender.value })}>
                            <Badge
                              variant={searchParams.gender === gender.value ? "default" : "outline"}
                              className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-2 py-1 ${
                                searchParams.gender === gender.value
                                  ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                                  : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                              }`}
                            >
                              {gender.label}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Collection Filter */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-amber-800 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                      Collection
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Link href={buildFilterUrl(searchParams, { collection: "all" })}>
                        <Badge
                          variant={!searchParams.collection || searchParams.collection === "all" ? "default" : "outline"}
                          className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-3 py-1.5 ${
                            !searchParams.collection || searchParams.collection === "all"
                              ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                              : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                          }`}
                        >
                          All Collections
                        </Badge>
                      </Link>
                      {(collectionTypes as string[]).map((collection: string) => (
                        <Link key={collection} href={buildFilterUrl(searchParams, { collection })}>
                          <Badge
                            variant={searchParams.collection === collection ? "default" : "outline"}
                            className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-lg text-xs px-3 py-1.5 ${
                              searchParams.collection === collection
                                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md"
                                : "bg-white/70 text-amber-700 border-amber-200 hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50"
                            }`}
                          >
                            {collection}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </div>
                </Suspense>
              </div>
            </div>
          </div>

          {/* Enhanced Products Grid */}
          <div className="flex-1">
            <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-amber-200/50 shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 px-8 py-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-amber-800">
                      {searchParams.category && searchParams.category !== "all" 
                        ? `${categories?.find((c: any) => c.id.toString() === searchParams.category)?.name || searchParams.category}` 
                        : "All Products"}
                      {searchParams.search && ` • "${searchParams.search}"`}
                    </h2>
                    <p className="text-amber-600 font-medium mt-1 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full"></span>
                      {filteredProducts.length} of {products.length} exquisite pieces
                    </p>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center gap-3">
                      <ClearFiltersButton hasActiveFilters={hasActiveFilters} />
                      <SortDropdown />
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-0 py-3">
                <Suspense fallback={
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="group">
                        <Skeleton className="h-[400px] rounded-2xl" />
                        <div className="mt-4 space-y-2">
                          <Skeleton className="h-4 w-3/4 rounded-full" />
                          <Skeleton className="h-4 w-1/2 rounded-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                }>
                  {filteredProducts && filteredProducts.length > 0 ? (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                      <ProductGrid products={filteredProducts} />
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <div className="max-w-md mx-auto">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <span className="text-4xl">💎</span>
                        </div>
                        <h3 className="text-2xl font-bold text-amber-800 mb-4">No Treasures Found</h3>
                        <p className="text-amber-600 text-lg mb-2">We couldn't find any jewellery matching your criteria.</p>
                        <p className="text-amber-500 text-sm mb-8">
                          We have {products.length} beautiful pieces in our collection
                        </p>
                        <Link href="/products">
                          <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105">
                            ✨ Explore All Jewellery
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}