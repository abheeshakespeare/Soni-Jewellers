import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Home } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center">
        <div className="mx-auto h-24 w-24 text-gray-400 mb-6">
          <Search className="h-full w-full" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          Sorry, the product you're looking for doesn't exist or has been removed.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Search className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          </Link>
          
          <Link href="/">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 