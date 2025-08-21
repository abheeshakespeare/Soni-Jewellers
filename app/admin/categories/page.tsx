"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Edit, Save, X, Plus, Trash2, FolderOpen } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/lib/categories"
import type { Category } from "@/lib/categories"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const categoriesData = await getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast.error('Failed to fetch categories')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAdd = () => {
    setIsAdding(true)
    setEditingId(null)
    setFormData({ name: "", description: "" })
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setIsAdding(false)
    setFormData({
      name: category.name,
      description: category.description || ""
    })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    setFormData({ name: "", description: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      if (editingId) {
        // Update existing category
        await updateCategory(editingId, formData.name, formData.description || undefined)
        toast.success('Category updated successfully')
      } else {
        // Create new category
        await createCategory(formData.name, formData.description || undefined)
        toast.success('Category created successfully')
      }
      
      handleCancel()
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      toast.error('Failed to save category')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) {
      return
    }

    try {
      await deleteCategory(id)
      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      toast.error('Failed to delete category')
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
          <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
          <p className="text-gray-600 mt-2">Manage product categories for better organization</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleAdd}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
          <Link href="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              {editingId ? 'Edit Category' : 'Add New Category'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category-name">
                    Category Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="category-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category-description">Description</Label>
                  <Input
                    id="category-description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter category description"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  {editingId ? 'Update Category' : 'Create Category'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <Badge variant="secondary">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </Badge>
                  </div>
                  {category.description && (
                    <p className="text-gray-600">{category.description}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {categories.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first category.</p>
              <Button onClick={handleAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 