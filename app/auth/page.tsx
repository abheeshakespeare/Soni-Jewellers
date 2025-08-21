"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Crown, Eye, EyeOff, Loader2, Mail, Lock, User, ArrowRight } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")
  const router = useRouter()
  const supabase = createClient()

  // Password strength indicator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { strength: 0, text: "" }
    const hasLower = /[a-z]/.test(pass)
    const hasUpper = /[A-Z]/.test(pass)
    const hasNumber = /\d/.test(pass)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    const length = pass.length >= 8
    
    const strength = [hasLower, hasUpper, hasNumber, hasSpecial, length].filter(Boolean).length
    
    const text = strength < 2 ? "Weak" : strength < 4 ? "Medium" : "Strong"
    return { strength, text }
  }

  const passwordStrength = getPasswordStrength(password)

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if user is admin
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single()

        // Redirect to appropriate page
        if (userData?.role === 'admin') {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }
    }
    checkUser()
  }, [router, supabase])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error, data: { user } } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message)
      } else {
        // Check if user is admin
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', user?.id)
          .single()

        toast.success("Signed in successfully!")
        
        // Redirect admin users to admin panel, others to home
        if (userData?.role === 'admin') {
          router.push("/admin")
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      toast.error("An error occurred during sign in")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Account created! Please check your email to verify.")
      }
    } catch (error) {
      toast.error("An error occurred during sign up")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        toast.error(error.message)
      }
    } catch (error) {
      toast.error("An error occurred during Google sign in")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center py-8 px-2 sm:px-4 lg:px-8">
      <div className="w-full max-w-md mx-auto">
        {/* Elegant Header Section */}
        <div className="mb-8 text-center">
          <div className="inline-block">
            <img
              src="/logo.png"
              alt="Soni Navratna Jewellers Logo"
              className="mx-auto h-14 w-14 rounded-full border-2 border-yellow-800 shadow-md bg-white mb-3"
              style={{ filter: 'contrast(1.3)' }}
            />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-2">
              Welcome to Soni Navratna Jewellers
            </h1>
            <div className="h-1 w-20 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-base font-light">Sign in to your account or create a new one</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-200/50 max-w-full mx-auto">
          {/* Gradient Bar at Top */}
          <div className="h-1.5 w-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-2xl mb-0" />
          <div className="px-4 py-6 sm:px-6 sm:py-8">
            <div className="mb-6 text-center">
              <h2 className="text-xl font-bold text-amber-800 mb-1">Sign In or Create Account</h2>
              <p className="text-amber-600 text-sm">Choose your preferred sign in method</p>
            </div>
            <Tabs 
              defaultValue="signin" 
              className="w-full"
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-amber-100 rounded-lg">
                <TabsTrigger value="signin" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-base py-2 rounded-lg">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-base py-2 rounded-lg">Sign Up</TabsTrigger>
              </TabsList>
              <div className="relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: activeTab === "signin" ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: activeTab === "signin" ? 20 : -20 }}
                    transition={{ duration: 0.3, layout: { duration: 0.3 } }}
                    className="w-full"
                    layout
                  >
                    {activeTab === "signin" ? (
                      <TabsContent 
                        value="signin" 
                        className="space-y-4 min-h-[220px] data-[state=active]:animate-in"
                        forceMount
                      >
                        <form onSubmit={handleSignIn} className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your email"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your password"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                            <div className="flex justify-end">
                              <Link 
                                href="/auth/forgot-password" 
                                className="text-xs text-yellow-600 hover:text-yellow-700 transition-colors"
                              >
                                Forgot password?
                              </Link>
                            </div>
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full relative group px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 text-base"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                              <>
                                Sign In
                                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    ) : (
                      <TabsContent 
                        value="signup" 
                        className="space-y-4 min-h-[220px] data-[state=active]:animate-in"
                        forceMount
                      >
                        <form onSubmit={handleSignUp} className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor="name">Full Name</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                id="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your full name"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                placeholder="Enter your email"
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                              <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                placeholder="Create a password"
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4 text-gray-500" />
                                ) : (
                                  <Eye className="h-4 w-4 text-gray-500" />
                                )}
                              </Button>
                            </div>
                            {password && (
                              <div className="mt-1">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 flex-1 rounded-full bg-gray-200 overflow-hidden">
                                    <div 
                                      className={`h-full transition-all duration-300 ${
                                        passwordStrength.strength < 2 
                                          ? "bg-red-500" 
                                          : passwordStrength.strength < 4 
                                          ? "bg-yellow-500" 
                                          : "bg-green-500"
                                      }`}
                                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-600">{passwordStrength.text}</span>
                                </div>
                              </div>
                            )}
                          </div>
                          <Button 
                            type="submit" 
                            className="w-full relative group px-6 py-2.5 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-xl font-semibold shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-105 text-base"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <Loader2 className="h-5 w-4 animate-spin" />
                            ) : (
                              <>
                                Create Account
                                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                              </>
                            )}
                          </Button>
                        </form>
                      </TabsContent>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Button 
                    onClick={handleGoogleSignIn} 
                    variant="outline" 
                    className="w-full relative group hover:border-yellow-600 transition-colors bg-white border-amber-200 text-amber-700 font-semibold rounded-xl py-2.5 mt-2 text-base shadow"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        Continue with Google
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
