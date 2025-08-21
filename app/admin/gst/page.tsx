"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Percent, Calculator, Receipt } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getGstSettings, formatGstPercentage, formatCurrency, calculateGstAmount, calculateTotalWithGst } from "@/lib/gst"
import { batchUpdateAllProductPrices } from '@/lib/products'

interface GstSetting {
  id: number
  gst_percentage: number
  is_active: boolean
  updated_at: string
}

export default function GstPage() {
  const [gstSettings, setGstSettings] = useState<GstSetting[]>([])
  const [currentGst, setCurrentGst] = useState<GstSetting | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editingPercentage, setEditingPercentage] = useState(18.00)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isBatchUpdating, setIsBatchUpdating] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    fetchGstSettings()
  }, [])

  const fetchGstSettings = async () => {
    try {
      const settings = await getGstSettings()
      setGstSettings(settings)
      if (settings.length > 0) {
        setCurrentGst(settings[0])
        setEditingPercentage(settings[0].gst_percentage)
      }
    } catch (error) {
      console.error('Error fetching GST settings:', error)
      toast.error('Failed to fetch GST settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to current value
    if (currentGst) {
      setEditingPercentage(currentGst.gst_percentage)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Deactivate current GST setting
      if (currentGst) {
        await supabase
          .from('gst_settings')
          .update({ is_active: false })
          .eq('id', currentGst.id)
      }

      // Create new GST setting
      const { data, error } = await supabase
        .from('gst_settings')
        .insert({
          gst_percentage: editingPercentage,
          is_active: true,
          updated_by: user.id
        })
        .select()
        .single()

      if (error) throw error

      toast.success('GST percentage updated successfully')
      setIsEditing(false)
      fetchGstSettings() // Refresh the data
    } catch (error) {
      console.error('Error updating GST percentage:', error)
      toast.error('Failed to update GST percentage')
    } finally {
      setIsSaving(false)
    }
  }

  const handleBatchUpdatePrices = async () => {
    setIsBatchUpdating(true)
    try {
      await batchUpdateAllProductPrices()
      toast.success('All product prices updated based on new GST!')
    } catch (err) {
      toast.error('Failed to update product prices')
      console.error(err)
    } finally {
      setIsBatchUpdating(false)
    }
  }

  // Example calculation for demonstration
  const exampleBaseAmount = 10000
  const gstAmount = calculateGstAmount(exampleBaseAmount, editingPercentage)
  const totalWithGst = calculateTotalWithGst(exampleBaseAmount, editingPercentage)

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GST Management</h1>
          <p className="text-gray-600 mt-2">Update GST percentage for product pricing calculations</p>
        </div>
        <div className="flex items-center gap-3">
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit GST Percentage
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
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        {/* Current GST Setting */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-green-600" />
                Current GST Percentage
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  Last updated: {currentGst ? new Date(currentGst.updated_at).toLocaleDateString() : 'Never'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-2">
                    <Label htmlFor="gst-percentage">
                      GST Percentage (%)
                    </Label>
                    <Input
                      id="gst-percentage"
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={editingPercentage}
                      onChange={(e) => setEditingPercentage(parseFloat(e.target.value) || 0)}
                      className="text-lg font-semibold w-32"
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current GST Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {formatGstPercentage(currentGst?.gst_percentage || 0.00)}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                {isEditing && (
                  <div className="text-sm text-gray-500 italic">
                    Click "Save Changes" above to save
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Example Calculation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Base Amount</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(exampleBaseAmount)}
                  </p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">GST Amount</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(gstAmount)}
                  </p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total with GST</p>
                  <p className="text-xl font-bold text-blue-700">
                    {formatCurrency(totalWithGst)}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                <strong>Formula:</strong> Total Price = Base Amount + (Base Amount × {formatGstPercentage(editingPercentage)})
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isEditing && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Receipt className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium mb-1">How GST Works</p>
              <p className="text-sm text-blue-700">
                GST is calculated on the total value of the product (metal value + making charges). 
                The current rate of {formatGstPercentage(currentGst?.gst_percentage || 0.00)} will be applied to all jewelry products.
              </p>
            </div>
          </div>
        </div>
      )}
      {(isEditing || !isLoading) && (
        <Button onClick={handleBatchUpdatePrices} disabled={isBatchUpdating} className="mt-4">
          {isBatchUpdating ? 'Updating Product Prices...' : 'Update All Product Prices'}
        </Button>
      )}
    </div>
  )
} 