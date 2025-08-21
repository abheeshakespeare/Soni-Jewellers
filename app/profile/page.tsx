"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { User, Phone, MapPin, Mail, Lock, ShoppingBag, Edit3, Save, X, Crown, Gem, ChevronDown, ChevronUp, Eye, Package } from "lucide-react"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"

interface UserProfile {
  id: string
  email: string
  name: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  avatar_url?: string
}

interface Order {
  id: string
  order_number: string
  status: string
  subtotal: number
  advance_paid: number
  remaining: number
  delivery_type: string
  created_at: string
  items?: any[]
}

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [orderCount, setOrderCount] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [showOrders, setShowOrders] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  })

  // Add state for password change
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const fetchProfile = async () => {
      try {
        if (!mounted) return
        setIsLoading(true)
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (!mounted) return

        if (userError) {
          console.error("Auth error:", userError)
          toast.error("Authentication error: " + userError.message)
          router.push("/auth")
          return
        }

        if (!user) {
          console.log("No user found in session")
          toast.error("Please sign in to view your profile")
          router.push("/auth")
          return
        }

        console.log("Fetching profile for user:", user.id)

        // Add a small delay to ensure loading state is visible
        await new Promise(resolve => setTimeout(resolve, 500))

        if (!mounted) return

        // Get user profile
        let profileData: UserProfile | null = null
        const { data: fetchedProfile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        if (!mounted) return

        if (profileError) {
          console.error("Profile fetch error:", profileError)
          
          if (profileError.code === "PGRST116") {
            // No profile found, create one
            const { data: newProfile, error: createError } = await supabase
              .from("users")
              .insert({
                id: user.id,
                email: user.email,
                name: user.user_metadata.full_name || user.user_metadata.name,
                role: 'customer',
                address: {
                  street: "",
                  city: "",
                  state: "",
                  pincode: ""
                },
                phone: "",
                avatar_url: user.user_metadata.avatar_url || null
              })
              .select()
              .single()

            if (!mounted) return

            if (createError) {
              console.error("Profile creation error:", createError)
              toast.error("Error creating profile: " + createError.message)
              return
            }

            profileData = newProfile
          } else {
            toast.error("Error fetching profile: " + profileError.message)
            return
          }
        } else {
          profileData = fetchedProfile
        }

        if (!mounted) return

        // Get order count
        const { count, error: orderError } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id)

        if (!mounted) return

        if (orderError) {
          console.error("Order count error:", orderError)
        } else {
          setOrderCount(count || 0)
        }

        if (profileData) {
          setProfile(profileData)
          setFormData({
            name: profileData.name || "",
            phone: profileData.phone || "",
            street: profileData.address?.street || "",
            city: profileData.address?.city || "",
            state: profileData.address?.state || "",
            pincode: profileData.address?.pincode || "",
          })
        }
      } catch (error) {
        if (!mounted) return
        console.error("Unexpected error:", error)
        toast.error("An unexpected error occurred while fetching your profile")
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      mounted = false
    }
  }, [supabase, router])

  const fetchOrders = async () => {
    if (orders.length > 0) return // Already loaded
    
    setOrdersLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: ordersData, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching orders:", error)
        toast.error("Failed to load orders")
        return
      }

      setOrders(ordersData || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast.error("Failed to load orders")
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleViewOrders = async () => {
    if (!showOrders) {
      await fetchOrders()
    }
    setShowOrders(!showOrders)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "processing":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "ready":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleUpdateProfile = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast.error("Please sign in to update your profile")
        return
      }

      const { error } = await supabase
        .from("users")
        .update({
          name: formData.name,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) {
        console.error("Update error:", error)
        toast.error("Error updating profile: " + error.message)
        return
      }

      // Update local state
      if (profile) {
        setProfile({
          ...profile,
          name: formData.name,
          phone: formData.phone,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
        })
      }

      setEditMode(false)
      toast.success("Profile updated successfully!")
    } catch (error) {
      console.error("Unexpected error:", error)
      toast.error("An unexpected error occurred while updating your profile")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }
    setPasswordLoading(true)
    let error: any = null
    try {
      // Race between updateUser and a 2s timeout
      await Promise.race([
        (async () => {
          const { error: updateError } = await supabase.auth.updateUser({ password: passwordData.newPassword })
          if (updateError) throw updateError
        })(),
        new Promise((resolve) => setTimeout(resolve, 2000))
      ])
    } catch (err: any) {
      error = err
    } finally {
      setPasswordLoading(false)
      if (!error) {
        toast.success("Password updated successfully!")
        setPasswordData({ newPassword: "", confirmPassword: "" })
        setShowPasswordForm(false)
      } else {
        toast.error("Error updating password: " + error.message)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded w-1/4 mb-12"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="h-80 bg-amber-200 rounded-xl"></div>
              </div>
              <div className="lg:col-span-2">
                <div className="h-80 bg-amber-200 rounded-xl mb-8"></div>
                <div className="h-64 bg-amber-200 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-amber-800 mb-4">Profile Not Found</h2>
          <p className="text-amber-600 mb-8">Unable to load your profile information.</p>
          <Button 
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-amber-800 mb-3">My Profile</h1>
          <p className="text-amber-600 text-lg">Manage your account and view your jewelry orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Summary Card */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl h-fit">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <Avatar className="w-28 h-28 mx-auto mb-6 border-4 border-amber-200 shadow-lg">
                    <AvatarImage src={profile.avatar_url || ""} alt={profile.name} />
                    <AvatarFallback className="bg-gradient-to-br from-amber-400 to-yellow-500 text-white text-3xl font-bold">
                      {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold text-amber-800 mb-2">{profile.name || "User"}</h2>
                  <p className="text-amber-600">{profile.email}</p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center text-amber-700">
                    <Mail className="w-5 h-5 mr-4 text-amber-500" />
                    <div>
                      <p className="text-sm text-amber-600">Email</p>
                      <p className="font-medium">{profile.email}</p>
                    </div>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center text-amber-700">
                      <Phone className="w-5 h-5 mr-4 text-amber-500" />
                      <div>
                        <p className="text-sm text-amber-600">Phone</p>
                        <p className="font-medium">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                  {profile.address?.city && (
                    <div className="flex items-center text-amber-700">
                      <MapPin className="w-5 h-5 mr-4 text-amber-500" />
                      <div>
                        <p className="text-sm text-amber-600">Location</p>
                        <p className="font-medium">{profile.address.city}, {profile.address.state}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-amber-200">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-700 hover:bg-amber-50 h-12"
                    onClick={() => setEditMode(!editMode)}
                  >
                    {editMode ? (
                      <>
                        <X className="w-4 h-4 mr-2" />
                        Cancel Edit
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Details Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardTitle className="text-2xl font-bold text-amber-800 flex items-center">
                  <User className="w-6 h-6 mr-3" />
                  Profile Details
                </CardTitle>
                <CardDescription className="text-amber-600">
                  Update your personal information and delivery address
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={(e) => { e.preventDefault(); handleUpdateProfile(); }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-amber-800 font-medium flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter your full name"
                        className={`h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium ${
                          !editMode ? 'bg-amber-50/50' : 'bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-amber-800 font-medium flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter your phone number"
                        className={`h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium ${
                          !editMode ? 'bg-amber-50/50' : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="street" className="text-amber-800 font-medium flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      disabled={!editMode}
                      placeholder="Enter your street address"
                      className={`h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium ${
                        !editMode ? 'bg-amber-50/50' : 'bg-white'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="city" className="text-amber-800 font-medium">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter your city"
                        className={`h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium ${
                          !editMode ? 'bg-amber-50/50' : 'bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="state" className="text-amber-800 font-medium">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter your state"
                        className={`h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium ${
                          !editMode ? 'bg-amber-50/50' : 'bg-white'
                        }`}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="pincode" className="text-amber-800 font-medium">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        disabled={!editMode}
                        placeholder="Enter PIN code"
                        className={`h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium ${
                          !editMode ? 'bg-amber-50/50' : 'bg-white'
                        }`}
                      />
                    </div>
                  </div>

                  {editMode && (
                    <div className="flex justify-end pt-6">
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Change Password Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardTitle className="text-2xl font-bold text-amber-800 flex items-center">
                  <Lock className="w-6 h-6 mr-3" />
                  Change Password
                </CardTitle>
                <CardDescription className="text-amber-600">
                  Update your account password instantly. No email required.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {showPasswordForm ? (
                  <form onSubmit={handleChangePassword} className="space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="newPassword" className="text-amber-800 font-medium flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="Enter new password"
                          className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium bg-white pr-12"
                          autoComplete="new-password"
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
                          onClick={() => setShowNewPassword(v => !v)}
                          tabIndex={-1}
                        >
                          {showNewPassword ? <Eye className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword" className="text-amber-800 font-medium flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordInputChange}
                          placeholder="Re-enter new password"
                          className="h-12 border-amber-200 focus:border-amber-400 focus:ring-amber-400 text-gray-800 font-medium bg-white pr-12"
                          autoComplete="new-password"
                          minLength={8}
                          required
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-700"
                          onClick={() => setShowConfirmPassword(v => !v)}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? <Eye className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-end pt-6 space-x-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                        onClick={() => setShowPasswordForm(false)}
                        disabled={passwordLoading}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
                        disabled={passwordLoading}
                      >
                        {passwordLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Change Password
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-50 h-12"
                    onClick={() => setShowPasswordForm(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Orders Card */}
            <Card className="bg-white/80 backdrop-blur-sm border-amber-200 shadow-xl">
              <CardHeader className="border-b border-amber-100 bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardTitle className="text-2xl font-bold text-amber-800 flex items-center">
                  <Package className="w-6 h-6 mr-3" />
                  My Orders
                </CardTitle>
                <CardDescription className="text-amber-600">
                  View your jewellery purchase history and track current orders
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                {orderCount === 0 ? (
                  <div className="text-center py-16">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-amber-100 to-yellow-100 rounded-full flex items-center justify-center">
                        <Gem className="w-16 h-16 text-amber-500" />
                      </div>
                      <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">No orders yet</h3>
                    <p className="text-amber-600 mb-8 text-lg">Start your jewellery collection journey with us!</p>
                    <Button 
                      className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
                      onClick={() => router.push("/products")}
                    >
                      <Gem className="w-5 h-5 mr-2" />
                      Explore Jewellery
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="text-center py-8 border-b border-amber-100 mb-6">
                      <div className="mb-6">
                        <div className="text-5xl font-bold text-amber-600 mb-3">{orderCount}</div>
                        <p className="text-amber-700 text-lg">Total Orders</p>
                      </div>
                      <Button 
                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-full font-medium shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105"
                        onClick={handleViewOrders}
                        disabled={ordersLoading}
                      >
                        {ordersLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Loading...
                          </>
                        ) : (
                          <>
                            {showOrders ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                            {showOrders ? "Hide Orders" : "View All Orders"}
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Orders List */}
                    {showOrders && (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {ordersLoading ? (
                          <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500 border-t-transparent mx-auto mb-4"></div>
                            <p className="text-amber-600 text-lg">Loading orders...</p>
                          </div>
                        ) : orders.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-amber-600 text-lg">No orders found.</p>
                          </div>
                        ) : (
                          orders.map((order) => (
                            <Card key={order.id} className="border-amber-200 bg-amber-50/30 hover:bg-amber-50/50 transition-colors">
                              <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                  <div>
                                    <h4 className="font-semibold text-amber-800 text-lg">Order #{order.order_number}</h4>
                                    <p className="text-amber-600">
                                      {new Date(order.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-4 mb-4">
                                  <div className="text-center p-3 bg-white/50 rounded-lg">
                                    <span className="text-amber-600 text-sm block mb-1">Total</span>
                                    <p className="font-bold text-amber-800 text-lg">{formatPrice(order.subtotal)}</p>
                                  </div>
                                  <div className="text-center p-3 bg-white/50 rounded-lg">
                                    <span className="text-amber-600 text-sm block mb-1">Paid</span>
                                    <p className="font-bold text-green-600 text-lg">{formatPrice(order.advance_paid)}</p>
                                  </div>
                                  <div className="text-center p-3 bg-white/50 rounded-lg">
                                    <span className="text-amber-600 text-sm block mb-1">Remaining</span>
                                    <p className="font-bold text-orange-600 text-lg">{formatPrice(order.remaining)}</p>
                                  </div>
                                </div>

                                <div className="flex justify-between items-center">
                                  <div className="text-amber-600">
                                    <span className="capitalize font-medium">{order.delivery_type}</span>
                                    {order.items && (
                                      <span className="ml-3 text-sm">
                                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                      </span>
                                    )}
                                  </div>
                                  <Link href={`/orders/${order.id}`}>
                                    <Button variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50">
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                  </Link>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}