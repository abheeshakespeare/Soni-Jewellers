"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Filter, X } from "lucide-react"
import Link from "next/link"

interface MobileFilterButtonProps {
  searchParams: {
    category?: string
    metal?: string
    collection?: string
    gender?: string
    sort?: string
    search?: string
  }
  categories: any[]
  collectionTypes: string[]
  buttonClassName?: string
}

function buildFilterUrl(currentParams: any, newParams: any) {
  const params = new URLSearchParams()
  
  // Copy current params
  Object.entries(currentParams).forEach(([key, value]) => {
    if (value && key !== 'search') { // Don't copy search param to avoid conflicts
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

export default function MobileFilterButton({ 
  searchParams, 
  categories, 
  collectionTypes, 
  buttonClassName = "w-full relative" 
}: MobileFilterButtonProps) {
  const [open, setOpen] = useState(false)

  // Count active filters
  const activeFilters = Object.entries(searchParams).filter(([key, value]) => 
    value && value !== "all" && key !== "sort" && key !== "search"
  ).length

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className={`${buttonClassName} border-amber-300 text-amber-700 hover:bg-amber-50 hover:border-amber-400`}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilters > 0 && (
            <span className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
              {activeFilters}
            </span>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent side="left" className="w-80 overflow-y-auto bg-gradient-to-br from-amber-50 to-yellow-50 border-r border-amber-200">
        <SheetHeader className="border-b border-amber-200 pb-4">
          <SheetTitle className="flex items-center justify-between text-amber-800">
            <span className="text-xl font-bold">Filters</span>
            {activeFilters > 0 && (
              <Link href="/products" onClick={() => setOpen(false)}>
                <Button variant="ghost" size="sm" className="text-amber-600 hover:bg-amber-100 hover:text-amber-800">
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </Link>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-8">
          {/* Category Filter */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-800 text-lg">Category</h4>
            <div className="space-y-3">
              <Link href={buildFilterUrl(searchParams, { category: "all" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={!searchParams.category || searchParams.category === "all" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    !searchParams.category || searchParams.category === "all" 
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  All Categories
                </Badge>
              </Link>
              {categories?.map((category: any) => (
                <Link key={category.id} href={buildFilterUrl(searchParams, { category: category.id })} onClick={() => setOpen(false)}>
                  <Badge
                    variant={searchParams.category === category.id.toString() ? "default" : "outline"}
                    className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      searchParams.category === category.id.toString()
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                        : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                    }`}
                  >
                    {category.name}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Metal Type Filter */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-800 text-lg">Metal Type</h4>
            <div className="space-y-3">
              <Link href={buildFilterUrl(searchParams, { metal: "all" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={!searchParams.metal || searchParams.metal === "all" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    !searchParams.metal || searchParams.metal === "all" 
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  All Metals
                </Badge>
              </Link>
              <Link href={buildFilterUrl(searchParams, { metal: "gold" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={searchParams.metal === "gold" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    searchParams.metal === "gold"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  Gold
                </Badge>
              </Link>
              <Link href={buildFilterUrl(searchParams, { metal: "silver" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={searchParams.metal === "silver" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    searchParams.metal === "silver"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  Silver
                </Badge>
              </Link>
            </div>
          </div>

          {/* Collection Filter */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-800 text-lg">Collection</h4>
            <div className="space-y-3">
              <Link href={buildFilterUrl(searchParams, { collection: "all" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={!searchParams.collection || searchParams.collection === "all" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    !searchParams.collection || searchParams.collection === "all" 
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  All Collections
                </Badge>
              </Link>
              {(collectionTypes as string[]).map((collection: string) => (
                <Link key={collection} href={buildFilterUrl(searchParams, { collection })} onClick={() => setOpen(false)}>
                  <Badge
                    variant={searchParams.collection === collection ? "default" : "outline"}
                    className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      searchParams.collection === collection
                        ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                        : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                    }`}
                  >
                    {collection}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>

          {/* Gender Filter */}
          <div>
            <h4 className="font-semibold mb-4 text-amber-800 text-lg">Gender</h4>
            <div className="space-y-3">
              <Link href={buildFilterUrl(searchParams, { gender: "all" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={!searchParams.gender || searchParams.gender === "all" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    !searchParams.gender || searchParams.gender === "all" 
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  All Genders
                </Badge>
              </Link>
              <Link href={buildFilterUrl(searchParams, { gender: "male" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={searchParams.gender === "male" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    searchParams.gender === "male"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  Male
                </Badge>
              </Link>
              <Link href={buildFilterUrl(searchParams, { gender: "female" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={searchParams.gender === "female" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    searchParams.gender === "female"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  Female
                </Badge>
              </Link>
              <Link href={buildFilterUrl(searchParams, { gender: "flexible" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={searchParams.gender === "flexible" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    searchParams.gender === "flexible"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  Unisex
                </Badge>
              </Link>
              <Link href={buildFilterUrl(searchParams, { gender: "kids" })} onClick={() => setOpen(false)}>
                <Badge
                  variant={searchParams.gender === "kids" ? "default" : "outline"}
                  className={`mr-2 mb-2 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    searchParams.gender === "kids"
                      ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg" 
                      : "border-amber-300 text-amber-700 hover:bg-amber-100 hover:border-amber-400"
                  }`}
                >
                  Kids
                </Badge>
              </Link>
            </div>
          </div>

          {/* Applied Filters Summary */}
          {activeFilters > 0 && (
            <div className="border-t border-amber-200 pt-6">
              <h4 className="font-semibold mb-4 text-amber-800 text-lg">Applied Filters</h4>
              <div className="space-y-3">
                {searchParams.category && searchParams.category !== "all" && (
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <span className="text-sm text-amber-600 font-medium">Category</span>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg">
                      {categories?.find((c: any) => c.id.toString() === searchParams.category)?.name || searchParams.category}
                    </Badge>
                  </div>
                )}
                {searchParams.metal && searchParams.metal !== "all" && (
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <span className="text-sm text-amber-600 font-medium">Metal</span>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg">{searchParams.metal}</Badge>
                  </div>
                )}
                {searchParams.collection && searchParams.collection !== "all" && (
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <span className="text-sm text-amber-600 font-medium">Collection</span>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg">{searchParams.collection}</Badge>
                  </div>
                )}
                {searchParams.gender && searchParams.gender !== "all" && (
                  <div className="flex items-center justify-between p-3 bg-white/50 rounded-lg">
                    <span className="text-sm text-amber-600 font-medium">Gender</span>
                    <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white border-amber-500 shadow-lg">{searchParams.gender}</Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
} 