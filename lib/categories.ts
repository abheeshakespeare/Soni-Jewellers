import { createClient } from './supabase/client'

export interface Category {
  id: number
  name: string
  description: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export async function getCategories(): Promise<Category[]> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    throw error
  }

  return data || []
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

export async function createCategory(name: string, description?: string): Promise<Category> {
  const supabase = createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name,
      description,
      created_by: user.id
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    throw error
  }

  return data
}

export async function updateCategory(id: number, name: string, description?: string): Promise<Category> {
  const supabase = createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .update({
      name,
      description
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    throw error
  }

  return data
}

export async function deleteCategory(id: number): Promise<void> {
  const supabase = createClient()
  
  const { error } = await supabase
    .from('categories')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    console.error('Error deleting category:', error)
    throw error
  }
} 