import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json()
    
    if (path) {
      revalidatePath(path)
      return NextResponse.json({ revalidated: true, path })
    }
    
    // Revalidate all product pages
    revalidatePath('/products')
    revalidatePath('/products/[id]')
    
    return NextResponse.json({ revalidated: true, path: 'all products' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to revalidate' }, { status: 500 })
  }
} 