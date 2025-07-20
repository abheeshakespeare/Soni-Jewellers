"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "featured") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <Select value={searchParams.get("sort") || "featured"} onValueChange={handleSortChange}>
      <SelectTrigger className="w-48 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="all">All Products</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="price-low">Price: Low to High</SelectItem>
        <SelectItem value="price-high">Price: High to Low</SelectItem>
      </SelectContent>
    </Select>
  )
} 