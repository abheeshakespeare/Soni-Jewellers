"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "")
  }, [searchParams])

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout
      return (value: string) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          const params = new URLSearchParams(searchParams.toString())
          if (value.trim()) {
            params.set("search", value.trim())
          } else {
            params.delete("search")
          }
          router.push(`/products?${params.toString()}`)
        }, 300) // 300ms delay
      }
    })(),
    [searchParams, router]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    debouncedSearch(value)
  }

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="pl-10 pr-4 border-gray-300 focus:border-yellow-500 focus:ring-yellow-500"
      />
    </div>
  )
} 