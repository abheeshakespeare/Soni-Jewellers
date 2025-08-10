"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu"
import { CartManager } from "@/lib/cart"
import { useWishlist } from "@/contexts/wishlist-context"
import { ShoppingCart, UserIcon, Heart, Menu, X, Crown, Search, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

// Categories will be fetched dynamically

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const router = useRouter()
  const supabase = createClient()
  const { wishlistCount } = useWishlist()

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("Checking admin status for user:", userId)
      const { data: userData, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single()

      if (error) {
        console.error("Error checking admin status:", error)
        return false
      }

      console.log("User role:", userData?.role)
      return userData?.role === 'admin'
    } catch (error) {
      console.error("Unexpected error checking admin status:", error)
      return false
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser()

        if (userError) {
          console.error("Error getting user:", userError)
          return
        }

        setUser(user)

        if (user) {
          const isUserAdmin = await checkAdminStatus(user.id)
          console.log("Setting admin status:", isUserAdmin)
          setIsAdmin(isUserAdmin)
        }
      } catch (error) {
        console.error("Unexpected error in getUser:", error)
      }
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        const isUserAdmin = await checkAdminStatus(session.user.id)
        console.log("Setting admin status after auth change:", isUserAdmin)
        setIsAdmin(isUserAdmin)
      } else {
        setIsAdmin(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(CartManager.getCartCount())
    }

    updateCartCount()
    window.addEventListener("cart-updated", updateCartCount)
    return () => window.removeEventListener("cart-updated", updateCartCount)
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('name')
        
        if (error) {
          console.error('Error fetching categories:', error)
        } else {
          setCategories(data || [])
        }
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0 max-w-full">
            <img
              src="/logo.png"
              alt="Soni Navratna Jewellers Logo"
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 rounded-full border-2 border-yellow-800 shadow-md flex-shrink-0 bg-white"
              style={{ filter: 'contrast(1.3)' }}
            />
            <span className="text-yellow-800 font-bold text-base sm:text-lg md:text-xl lg:text-xl xl:text-xl leading-tight text-left sm:text-left break-words">
              Soni Jewellers<br />
              And Navratna Bhandar
            </span>
          </Link>


          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-yellow-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-yellow-600 transition-colors">
              All Products
            </Link>
            
            {/* Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-1">
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories.map((category) => (
                  <DropdownMenuItem key={category.id} asChild>
                    <Link href={`/products?category=${category.id}`}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/stores" className="text-gray-700 hover:text-yellow-600 transition-colors">
              Our Stores
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-yellow-600 transition-colors">
              Contact Us
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">

            {user && (
              <Link href="/wishlist" className="relative">
                <Button variant="ghost" size="sm">
                  <Heart className="h-5 w-5" />
                  {wishlistCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      {wishlistCount}
                    </Badge>
                  )}
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <UserIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Admin Panel</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button size="sm">Sign In</Button>
              </Link>
            )}

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetContent side="right" className="w-full max-w-xs sm:w-80 bg-gradient-to-br from-amber-50 to-yellow-50 border-l border-amber-200 p-0 overflow-y-auto">
              <SheetHeader className="border-b border-amber-200 pb-4">
                <SheetTitle className="flex items-center justify-between text-amber-800">
                  <span className="text-xl font-bold">Menu</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-4 px-4">
                <Link href="/" className="block py-2 text-amber-800 font-semibold rounded hover:bg-amber-100 transition" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
                <Link href="/products" className="block py-2 text-amber-800 font-semibold rounded hover:bg-amber-100 transition" onClick={() => setIsMenuOpen(false)}>
                  All Products
                </Link>
                <div className="text-amber-700 font-bold mt-4 mb-2">Categories</div>
                {categories.map((category) => (
                  <Link key={category.id} href={`/products?category=${category.id}`} className="block pl-4 py-2 text-amber-700 rounded hover:bg-amber-100 transition" onClick={() => setIsMenuOpen(false)}>
                    {category.name}
                  </Link>
                ))}
                <Link href="/stores" className="block py-2 text-amber-800 font-semibold rounded hover:bg-amber-100 transition" onClick={() => setIsMenuOpen(false)}>
                  Our Stores
                </Link>
                <Link href="/contact" className="block py-2 text-amber-800 font-semibold rounded hover:bg-amber-100 transition" onClick={() => setIsMenuOpen(false)}>
                  Contact Us
                </Link>
                {user && (
                  <Link href="/wishlist" className="block py-2 text-amber-800 font-semibold rounded hover:bg-amber-100 transition flex items-center justify-between" onClick={() => setIsMenuOpen(false)}>
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <Badge className="h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {wishlistCount}
                      </Badge>
                    )}
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </nav>
  )
}
