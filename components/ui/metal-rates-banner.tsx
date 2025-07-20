"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Clock } from "lucide-react"
import { getMetalRates, formatMetalRate, getMetalDisplayName } from "@/lib/metal-rates"

interface MetalRate {
  id: number
  metal_type: string
  rate_per_gram: number
  updated_at: string
  is_active: boolean
}

export default function MetalRatesBanner() {
  const [rates, setRates] = useState<MetalRate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const ratesData = await getMetalRates()
        setRates(ratesData)
      } catch (error) {
        console.error('Error fetching metal rates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRates()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-8">
            <div className="animate-pulse flex items-center space-x-2">
              <div className="h-4 w-4 bg-yellow-300 rounded"></div>
              <div className="h-4 w-24 bg-yellow-300 rounded"></div>
            </div>
            <div className="animate-pulse flex items-center space-x-2">
              <div className="h-4 w-4 bg-yellow-300 rounded"></div>
              <div className="h-4 w-24 bg-yellow-300 rounded"></div>
            </div>
            <div className="animate-pulse flex items-center space-x-2">
              <div className="h-4 w-4 bg-yellow-300 rounded"></div>
              <div className="h-4 w-24 bg-yellow-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (rates.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-gray-700">Today's Metal Rates</span>
            </div>
            
            <div className="flex items-center space-x-6">
              {rates.map((rate) => (
                <div key={rate.id} className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {getMetalDisplayName(rate.metal_type)}
                  </Badge>
                  <span className="text-sm font-semibold text-gray-900">
                    {formatMetalRate(rate.rate_per_gram)}/g
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Clock className="h-3 w-3" />
            <span>
              Updated: {new Date(rates[0]?.updated_at || Date.now()).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
