"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Users, ShoppingCart, TrendingUp, Plus, Settings, Percent, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  is_complete: boolean;
  created_at: string;
}

export default function AdminDashboardContent() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (mounted) {
        setUser(user)
      }
    }
    getUser()

    return () => {
      mounted = false
    }
  }, [supabase.auth])

  useEffect(() => {
    let mounted = true

    const fetchStats = async () => {
      try {
        // Fetch all stats in parallel
        const [productsResult, ordersResult, usersResult] = await Promise.all([
          supabase.from("products").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("subtotal"),
          supabase.from("users").select("*", { count: "exact", head: true })
        ])

        if (!mounted) return

        const totalRevenue = ordersResult.data?.reduce((sum, order) => sum + order.subtotal, 0) || 0

        setStats({
          totalProducts: productsResult.count || 0,
          totalOrders: ordersResult.data?.length || 0,
          totalUsers: usersResult.count || 0,
          totalRevenue,
        })
      } catch (error) {
        console.error("Error fetching stats:", error)
      }
    }

    if (user) {
      fetchStats()
    }

    return () => {
      mounted = false
    }
  }, [supabase, user])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-4">Please reload the page to try again.</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Admin Dashboard
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mb-6"></div>
          <Badge variant="secondary">Admin Panel</Badge>
        </div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(stats.totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="flex overflow-x-auto whitespace-nowrap gap-2 rounded-lg bg-white/80 shadow border border-amber-200 p-2 mb-4 scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent">
            <TabsTrigger value="products" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Products
            </TabsTrigger>

            <TabsTrigger value="gemstones" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Gemstones
            </TabsTrigger>
            
            <TabsTrigger value="orders" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Orders
            </TabsTrigger>
            <TabsTrigger value="metal-rates" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Metal Rates
            </TabsTrigger>
            <TabsTrigger value="making-costs" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Making Costs
            </TabsTrigger>
            <TabsTrigger value="gst" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              GST
            </TabsTrigger>
            <TabsTrigger value="users" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Users
            </TabsTrigger>
            <TabsTrigger value="contacts" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="Banner" className="min-w-[120px] px-4 py-2 rounded-lg font-bold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=inactive]:bg-white/80 data-[state=inactive]:text-amber-700 data-[state=inactive]:border data-[state=inactive]:border-amber-200">
              Banner
            </TabsTrigger>
            
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Product Management</h2>
              <Link href="/admin/products/new">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <p className="text-gray-600">
                  Manage your product catalog, add new items, update existing products, and control inventory.
                </p>
                <div className="mt-4 flex flex-col md:flex-row gap-3">
                  <Link href="/admin/products">
                    <Button variant="outline" className="rounded-lg">View All Products</Button>
                  </Link>
                  <Link href="/admin/categories">
                    <Button variant="outline" className="rounded-lg">Manage Categories</Button>
                  </Link>
                  <Link href="/admin/products/new">
                    <Button variant="outline" className="rounded-lg">Add New Product</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gemstones" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Gemstones Management</h2>
              <Link href="/admin/gems/new">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Gemstone
                </Button>
              </Link>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <p className="text-gray-600">
                  Manage your gemstone catalog, add new gems, update existing gemstones, and control their visibility.
                </p>
                <div className="mt-4 flex flex-col md:flex-row gap-3">
                  <Link href="/admin/gems">
                    <Button variant="outline" className="rounded-lg">View All Gemstones</Button>
                  </Link>
                  <Link href="/admin/gems/new">
                    <Button variant="outline" className="rounded-lg">Add New Gemstone</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Order Management</h2>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <AdminOrdersPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metal-rates" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Metal Rates Management</h2>
              <Link href="/admin/metal-rates">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Update Metal Rates
                </Button>
              </Link>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <p className="text-gray-600">Manage gold and silver rates to ensure accurate product pricing. Update rates for Gold (22K), Gold (18K), and Silver.</p>
                <div className="mt-4 flex flex-col md:flex-row gap-3">
                  <Link href="/admin/metal-rates">
                    <Button variant="outline" className="rounded-lg">View Current Rates</Button>
                  </Link>
                  <Link href="/admin/metal-rates">
                    <Button variant="outline" className="rounded-lg">Update Rates</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="making-costs" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Making Costs Management</h2>
              <Link href="/admin/making-costs">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600">
                  <Settings className="h-4 w-4 mr-2" />
                  Update Making Costs
                </Button>
              </Link>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <p className="text-gray-600">Manage making charges and wastage costs for gold and silver jewelry. These costs are added to metal value for final pricing.</p>
                <div className="mt-4 flex flex-col md:flex-row gap-3">
                  <Link href="/admin/making-costs">
                    <Button variant="outline" className="rounded-lg">View Current Costs</Button>
                  </Link>
                  <Link href="/admin/making-costs">
                    <Button variant="outline" className="rounded-lg">Update Costs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gst" className="space-y-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">GST Management</h2>
              <Link href="/admin/gst">
                <Button className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600">
                  <Percent className="h-4 w-4 mr-2" />
                  Update GST Percentage
                </Button>
              </Link>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <p className="text-gray-600">Manage GST percentage for product pricing. GST is calculated on the total value (metal value + making charges).</p>
                <div className="mt-4 flex flex-col md:flex-row gap-3">
                  <Link href="/admin/gst">
                    <Button variant="outline" className="rounded-lg">View Current GST</Button>
                  </Link>
                  <Link href="/admin/gst">
                    <Button variant="outline" className="rounded-lg">Update GST</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">User Management</h2>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <UsersAdminPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contacts" className="space-y-6">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Contact Messages</h2>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <ContactsAdminPanel />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="Banner" className="space-y-6">
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-6 shadow mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">Banner Management</h2>
            </div>
            <Card className="rounded-xl shadow-lg border-amber-200/50">
              <CardContent className="p-6">
                <BannerAdminPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ContactsAdminPanel() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    const res = await fetch('/api/contacts')
    const data = await res.json()
    setContacts(data)
    setLoading(false)
  }

  const handleStatusToggle = async (id: number, currentStatus: boolean) => {
    await fetch(`/api/contacts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_complete: !currentStatus })
    })
    fetchContacts()
  }

  const filteredContacts = contacts.filter(c => {
    if (filter === 'all') return true
    if (filter === 'complete') return c.is_complete
    if (filter === 'incomplete') return !c.is_complete
    return true
  })

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Button variant={filter==='all'?'default':'outline'} onClick={()=>setFilter('all')}>All</Button>
        <Button variant={filter==='incomplete'?'default':'outline'} onClick={()=>setFilter('incomplete')}>Incomplete</Button>
        <Button variant={filter==='complete'?'default':'outline'} onClick={()=>setFilter('complete')}>Complete</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filteredContacts.length === 0 ? (
        <div>No contact messages found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map(contact => (
            <Card key={contact.id} className={contact.is_complete ? 'opacity-60' : ''}>
              <CardHeader>
                <CardTitle>{contact.name} <span className="text-xs text-gray-400">({new Date(contact.created_at).toLocaleString()})</span></CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-2"><b>Email:</b> {contact.email}</div>
                <div className="mb-2"><b>Phone:</b> {contact.phone}</div>
                <div className="mb-2"><b>Message:</b> {contact.message}</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant={contact.is_complete ? 'outline' : 'default'} onClick={()=>handleStatusToggle(contact.id, contact.is_complete)}>
                    {contact.is_complete ? 'Mark Incomplete' : 'Mark Complete'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

function UsersAdminPanel() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    // Fetch all users from Supabase
    const supabase = createClient()
    const { data, error } = await supabase.from("users").select("*").order("created_at", { ascending: false })
    if (!error && data) {
      setUsers(data)
    }
    setLoading(false)
  }

  return (
    <div>
      {loading ? (
        <div>Loading users...</div>
      ) : users.length === 0 ? (
        <div>No users found.</div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-white/80 rounded-xl shadow">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name || "-"}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "-"}</TableCell>
                  <TableCell>
                    <span className={user.role === "admin" ? "text-amber-700 font-bold" : "text-gray-700"}>{user.role}</span>
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{user.updated_at ? new Date(user.updated_at).toLocaleString() : "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function AdminOrdersPanel() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [dateSort, setDateSort] = useState<'desc' | 'asc'>('desc')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    const supabase = createClient()
    const { data, error } = await supabase.from("orders").select("*, users(name, email)").order("created_at", { ascending: false })
    if (!error && data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const markComplete = async (orderId: string) => {
    const supabase = createClient()
    await supabase.from("orders").update({ status: "completed" }).eq("id", orderId)
    fetchOrders()
  }

  // Filtering and sorting logic
  const filteredOrders = orders
    .filter((order) => {
      if (statusFilter === 'all') return true
      if (statusFilter === 'pending') return order.status === 'pending'
      if (statusFilter === 'completed') return order.status === 'completed'
      return true
    })
    .sort((a, b) => {
      if (dateSort === 'desc') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      } else {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      }
    })

  return (
    <div>
      {/* Filter and Sort Controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="font-medium mr-2">Status:</label>
          <select
            className="border rounded px-2 py-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="font-medium mr-2">Sort by Date:</label>
          <select
            className="border rounded px-2 py-1"
            value={dateSort}
            onChange={e => setDateSort(e.target.value as 'desc' | 'asc')}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="py-12 text-center text-amber-700 font-semibold">Loading orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-16 text-center">
          <XCircle className="mx-auto mb-4 w-12 h-12 text-amber-300" />
          <div className="text-2xl font-bold text-amber-700 mb-2">No Orders Found</div>
          <div className="text-amber-500">No customer orders have been placed yet.</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full bg-white/80 rounded-xl shadow">
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <>
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.order_number}</TableCell>
                    <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={order.status === "completed" ? "bg-green-100 text-green-800 border-green-200" : "bg-yellow-100 text-yellow-800 border-yellow-200"}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>{order.users?.name || "-"}</div>
                      <div className="text-xs text-gray-500">{order.users?.email}</div>
                    </TableCell>
                    <TableCell>{formatPrice(order.subtotal)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                        {expanded === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} Details
                      </Button>
                      {order.status !== "completed" && (
                        <Button size="sm" className="ml-2 bg-green-600 hover:bg-green-700 text-white" onClick={() => markComplete(order.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" /> Mark Complete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  {expanded === order.id && (
                    <TableRow>
                      <TableCell colSpan={6} className="bg-amber-50">
                        <div className="p-4 space-y-4">
                          <div className="font-semibold text-amber-800 mb-2">Products:</div>
                          <div className="flex flex-wrap gap-4 mb-2">
                            {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                              order.items.map((item: any, idx: number) => (
                                <div key={idx} className="flex items-center gap-2 bg-white border border-amber-100 rounded p-2 min-w-[180px]">
                                  <a
                                    href={item.product?.id ? `/products/${item.product.id}` : undefined}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={item.product?.id ? "hover:opacity-80 transition" : "pointer-events-none opacity-60"}
                                  >
                                    <img
                                      src={item.product?.image_url || item.product?.image_urls?.[0] || "/placeholder.svg?height=40&width=40"}
                                      alt={item.product?.name || "Product"}
                                      width={40}
                                      height={40}
                                      className="rounded object-cover border"
                                    />
                                  </a>
                                  <div>
                                    <div className="font-medium text-amber-800 text-sm">{item.product?.name || "Product"}</div>
                                    <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-gray-500 italic">No products found.</div>
                            )}
                          </div>
                          {order.special_instructions && (
                            <div><span className="font-semibold">Special Instructions:</span> <span className="italic">{order.special_instructions}</span></div>
                          )}
                          {order.product_size_details && (
                            <div><span className="font-semibold">Product Size Details:</span> <span className="italic">{order.product_size_details}</span></div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <span className="text-gray-600">Order Date:</span> <span className="font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Delivery Type:</span> <span className="font-medium capitalize">{order.delivery_type}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Status:</span> <span className="font-medium capitalize">{order.status}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Order Number:</span> <span className="font-medium">{order.order_number}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
} 

function BannerAdminPanel() {
  const [bannerUrl, setBannerUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [currentBanner, setCurrentBanner] = useState<string>("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchCurrentBanner()
  }, [])

  const fetchCurrentBanner = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("banners")
        .select("banner_url")
        .maybeSingle()
      
      if (!error && data) {
        setCurrentBanner(data.banner_url)
        setBannerUrl(data.banner_url)
      }
    } catch (error) {
      console.error("Error fetching banner:", error)
    }
  }

  const handleUpdateBanner = async () => {
    if (!bannerUrl.trim()) {
      setMessage("Please enter a valid banner URL")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const supabase = createClient()
      
      // Check if banner exists, if not create, if yes update
      const { data: existingBanner } = await supabase
        .from("banners")
        .select("id")
        .maybeSingle()

      if (existingBanner) {
        // Update existing banner
        const { error } = await supabase
          .from("banners")
          .update({ banner_url: bannerUrl.trim() })
          .eq("id", existingBanner.id)

        if (error) throw error
      } else {
        // Create new banner
        const { error } = await supabase
          .from("banners")
          .insert({ banner_url: bannerUrl.trim() })

        if (error) throw error
      }

      setCurrentBanner(bannerUrl.trim())
      setMessage("Banner updated successfully!")
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      console.error("Error updating banner:", error)
      setMessage("Error updating banner. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
        <h3 className="text-xl font-semibold text-amber-800 mb-4">Current Banner</h3>
        {currentBanner ? (
          <div className="space-y-3">
            <div className="text-sm text-gray-600">Current Banner URL:</div>
            <div className="bg-white p-3 rounded border break-all text-sm font-mono text-amber-700">
              {currentBanner}
            </div>
            <div className="text-sm text-gray-500">
              This banner is currently displayed on the homepage.
            </div>
          </div>
        ) : (
          <div className="text-amber-600 italic">No banner is currently set.</div>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 border border-amber-200">
        <h3 className="text-xl font-semibold text-amber-800 mb-4">Update Banner</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="bannerUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image URL
            </label>
            <input
              id="bannerUrl"
              type="url"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              placeholder="https://example.com/banner-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter the URL of the banner image you want to display on the homepage.
            </p>
          </div>

          {message && (
            <div className={`p-3 rounded-md text-sm ${
              message.includes("Error") 
                ? "bg-red-100 text-red-700 border border-red-200" 
                : "bg-green-100 text-green-700 border border-green-200"
            }`}>
              {message}
            </div>
          )}

          <Button
            onClick={handleUpdateBanner}
            disabled={loading || !bannerUrl.trim()}
            className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:from-amber-600 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Banner"}
          </Button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use high-quality images with recommended dimensions: 1200x400 pixels</li>
          <li>• Ensure the image URL is publicly accessible</li>
          <li>• Supported formats: JPG, PNG, WebP</li>
          <li>• The banner will be automatically displayed on the homepage</li>
        </ul>
      </div>
    </div>
  )
} 