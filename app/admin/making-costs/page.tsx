"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Settings, Calculator } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import type { MakingCost } from '@/lib/making-costs'
import { getMakingCosts, formatMakingCost, getMetalDisplayName } from "@/lib/making-costs"
import { batchUpdateAllProductPrices } from '@/lib/products'

export default function MakingCostsPage() {
  const [costs, setCosts] = useState<MakingCost[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingCosts, setEditingCosts] = useState({
    gold_22k: { making: 0 },
    gold_18k: { making: 0 },
    silver: { making: 0 }
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isBatchUpdating, setIsBatchUpdating] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchCosts()
  }, [])

  const fetchCosts = async () => {
    try {
      const costsData = await getMakingCosts()
      setCosts(costsData)
      // Explicitly type initialCosts
      const initialCosts: {
        gold_22k: { making: number },
        gold_18k: { making: number },
        silver: { making: number }
      } = {
        gold_22k: {
          making: costsData.find(c => c.metal_type === 'gold_22k')?.making_charge_percent || 0
        },
        gold_18k: {
          making: costsData.find(c => c.metal_type === 'gold_18k')?.making_charge_percent || 0
        },
        silver: {
          making: costsData.find(c => c.metal_type === 'silver')?.making_charge_percent || 0
        }
      }
      setEditingCosts(initialCosts)
    } catch (error) {
      console.error('Error fetching costs:', error)
      toast.error('Failed to fetch making costs')
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
    const currentCosts = {
      gold_22k: { 
        making: costs.find(c => c.metal_type === 'gold_22k')?.making_charge_percent || 0
      },
      gold_18k: { 
        making: costs.find(c => c.metal_type === 'gold_18k')?.making_charge_percent || 0
      },
      silver: { 
        making: costs.find(c => c.metal_type === 'silver')?.making_charge_percent || 0
      }
    }
    setEditingCosts(currentCosts)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Update each cost
      const updatePromises = Object.entries(editingCosts).map(([metalType, costs]) =>
        supabase
          .from('making_costs')
          .update({ 
            making_charge_percent: costs.making,
            updated_at: new Date().toISOString(),
            updated_by: user.id
          })
          .eq('metal_type', metalType)
          .eq('is_active', true)
      )

      await Promise.all(updatePromises)
      
      toast.success('Making costs updated successfully')
      setIsEditing(false)
      fetchCosts() // Refresh the data
    } catch (error) {
      console.error('Error updating costs:', error)
      toast.error('Failed to update making costs')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBatchUpdatePrices = async () => {
    setIsBatchUpdating(true)
    try {
      await batchUpdateAllProductPrices()
      toast.success('All product prices updated based on new making costs!')
    } catch (err) {
      toast.error('Failed to update product prices')
      console.error(err)
    } finally {
      setIsBatchUpdating(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Making Costs Management</h1>
          <p className="text-gray-600 mt-2">Update making charges and wastage costs for gold and silver jewelry</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit All Costs
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
        {costs.map((cost) => (
          <Card key={cost.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  {getMetalDisplayName(cost.metal_type)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    Last updated: {new Date(cost.updated_at).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`making-${cost.metal_type}`}>
                        Making Charge (% of metal value)
                      </Label>
                      <Input
                        id={`making-${cost.metal_type}`}
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingCosts[cost.metal_type as keyof typeof editingCosts]?.making || 0}
                        onChange={(e) => setEditingCosts(prev => ({
                          ...prev,
                          [cost.metal_type]: {
                            making: parseFloat(e.target.value) || 0
                          }
                        }))}
                        className="text-lg font-semibold inline-block w-24"
                      />
                      <span className="ml-2">%</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Making Charge (%)</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {cost.making_charge_percent}%
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end">
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
          <div className="flex items-start space-x-3">
            <Calculator className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">How Making Costs Work</p>
              <p className="text-sm text-blue-700">
                Making charges cover the cost of crafting jewelry, while wastage charges account for material loss during production. 
                These costs are added to the metal value to calculate the final product price.
              </p>
            </div>
          </div>
        </div>
      )}
      {/* After saving costs, show batch update button */}
      {(!isEditing && !isLoading) && (
        <Button onClick={handleBatchUpdatePrices} disabled={isBatchUpdating} className="mt-4">
          {isBatchUpdating ? 'Updating Product Prices...' : 'Update All Product Prices'}
        </Button>
      )}
    </div>
  )
} 