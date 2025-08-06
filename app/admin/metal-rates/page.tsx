"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, DollarSign } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { batchUpdateAllProductPrices } from '@/lib/products'

interface MetalRate {
  id: number
  metal_type: string
  rate_per_gram: number
  updated_at: string
  is_active: boolean
}

export default function MetalRatesPage() {
  const [rates, setRates] = useState<MetalRate[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingRates, setEditingRates] = useState({
    gold_22k: 0,
    gold_18k: 0,
    silver: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isBatchUpdating, setIsBatchUpdating] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchRates()
  }, [])

  const fetchRates = async () => {
    try {
      const { data, error } = await supabase
        .from('metal_rates')
        .select('*')
        .eq('is_active', true)
        .order('metal_type')

      if (error) throw error

      if (data) {
        setRates(data)
        // Initialize editing rates with current values
        const initialRates = {
          gold_22k: data.find(r => r.metal_type === 'gold_22k')?.rate_per_gram || 0,
          gold_18k: data.find(r => r.metal_type === 'gold_18k')?.rate_per_gram || 0,
          silver: data.find(r => r.metal_type === 'silver')?.rate_per_gram || 0
        }
        setEditingRates(initialRates)
      }
    } catch (error) {
      console.error('Error fetching rates:', error)
      toast.error('Failed to fetch metal rates')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to current values
    const currentRates = {
      gold_22k: rates.find(r => r.metal_type === 'gold_22k')?.rate_per_gram || 0,
      gold_18k: rates.find(r => r.metal_type === 'gold_18k')?.rate_per_gram || 0,
      silver: rates.find(r => r.metal_type === 'silver')?.rate_per_gram || 0
    }
    setEditingRates(currentRates)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Update each rate
      const updatePromises = Object.entries(editingRates).map(([metalType, rate]) =>
        supabase
          .from('metal_rates')
          .update({ 
            rate_per_gram: rate,
            updated_at: new Date().toISOString(),
            updated_by: user.id
          })
          .eq('metal_type', metalType)
          .eq('is_active', true)
      )

      await Promise.all(updatePromises)
      
      toast.success('Metal rates updated successfully')
      setIsEditing(false)
      fetchRates() // Refresh the data
    } catch (error) {
      console.error('Error updating rates:', error)
      toast.error('Failed to update metal rates')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBatchUpdatePrices = async () => {
    setIsBatchUpdating(true)
    try {
      await batchUpdateAllProductPrices()
      toast.success('All product prices updated based on new metal rates!')
    } catch (err) {
      toast.error('Failed to update product prices')
      console.error(err)
    } finally {
      setIsBatchUpdating(false)
    }
  }

  const formatRate = (rate: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(rate)
  }

  const getMetalDisplayName = (metalType: string) => {
    switch (metalType) {
      case 'gold_22k': return 'Gold (22K)'
      case 'gold_18k': return 'Gold (18K)'
      case 'silver': return 'Silver'
      default: return metalType
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Metal Rates Management</h1>
          <p className="text-gray-600 mt-2">Update daily gold and silver rates for accurate product pricing</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit All Rates
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCancel}
                variant="outline"
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save All Changes'}
              </Button>
            </div>
          )}
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {rates.map((rate) => (
          <Card key={rate.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                  {getMetalDisplayName(rate.metal_type)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Last updated: {new Date(rate.updated_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-2">
                      <Label htmlFor={`rate-${rate.metal_type}`}>
                        Rate per gram (₹)
                      </Label>
                      <Input
                        id={`rate-${rate.metal_type}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingRates[rate.metal_type as keyof typeof editingRates]}
                        onChange={(e) => setEditingRates(prev => ({
                          ...prev,
                          [rate.metal_type]: parseFloat(e.target.value) || 0
                        }))}
                        className="text-lg font-semibold"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Rate per gram</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {formatRate(rate.rate_per_gram)}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {isEditing && (
                    <div className="text-sm text-gray-500 italic">
                      Click "Save All Changes" above to save
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isEditing && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Metal rates are used to calculate product prices. 
            Update these rates regularly to ensure accurate pricing for your jewelry items.
          </p>
        </div>
      )}
      {/* After saving rates, show batch update button */}
      {(!isEditing && !isLoading) && (
        <Button onClick={handleBatchUpdatePrices} disabled={isBatchUpdating} className="mt-4">
          {isBatchUpdating ? 'Updating Product Prices...' : 'Update All Product Prices'}
        </Button>
      )}
    </div>
  )
} 