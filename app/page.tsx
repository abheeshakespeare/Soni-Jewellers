import { createServerClient } from "@/lib/supabase/server"
import ProductCard from "@/components/product-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Crown, Sparkles, Shield, Truck, Star, ArrowRight, Heart, Gem, Award } from "lucide-react"
import TestimonialsCarousel from "@/components/testimonials-carousel"
import { getBanner } from "@/lib/banner"

const CATEGORY_IMAGES: Record<string, string> = {
  "Ring": "https://www.tanishq.co.in/dw/image/v2/BKCK_PRD/on/demandware.static/-/Sites-Tanishq-product-catalog/default/dwcfbf242b/images/hi-res/511099FHGAA00.jpg?sw=640&sh=640",
  "Necklace": "https://i.pinimg.com/736x/9d/5f/c3/9d5fc31d392662fce420bc3388a662f1.jpg",
  "Earrings": "https://www.tarinika.in/cdn/shop/products/IMGL4927.jpg",
  "Bracelet": "https://img4.dhresource.com/webp/m/0x0/f3/albu/jc/y/19/49b5b1b4-c59a-4915-a9cd-7dc36e927b4b.jpg",

  "Pendant": "https://static.wixstatic.com/media/ae337e_4935196b72f74062b17a6d6138a877dd~mv2.jpeg/v1/fill/w_560,h_560,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/ae337e_4935196b72f74062b17a6d6138a877dd~mv2.jpeg",

  "Anklet": "https://imagescdn.jaypore.com/img/app/product/3/39592161-11590400.jpg?w=500&auto=format",
  // Add more as needed
};

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch featured products
  const { data: featuredProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .eq("is_active", true)
    .limit(8)

  // Fetch categories
  const { data: categories } = await supabase.from("categories").select("*").limit(6)

  // Fetch banner
  const bannerUrl = await getBanner()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://t4.ftcdn.net/jpg/05/27/71/81/360_F_527718147_x7XDK929xZnZqjgh0oPYz7xK0EvtnlIF.jpg"
            alt="Jewelry Collection Background"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-yellow-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-yellow-600 rounded-full blur-2xl animate-pulse delay-500"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400" />
                <span className="text-xs sm:text-sm font-medium text-yellow-400 bg-yellow-400/20 backdrop-blur-sm px-3 py-1 rounded-full border border-yellow-400/30">
                  Premium Collection
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight">
                <span className="text-white drop-shadow-lg">Exquisite</span>
                <span className="block bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent drop-shadow-lg">
                  Jewellery
                </span>
                <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal text-white/90 drop-shadow-lg block mt-2">
                  For Every Occasion
                </span>
              </h1>
              
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 md:mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 drop-shadow-sm">
                Discover our premium collection of handcrafted jewellery, from traditional designs to contemporary masterpieces.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start justify-center lg:justify-start">
                <Link href="/products">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </Link>
                <a href="#categories" className="inline-block">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-white/70 text-black hover:bg-yellow-500 hover:text-white backdrop-blur-sm px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold transition-all duration-300"
                  >
                    Explore Categories
                  </Button>
                </a>
              </div>
              
              
              {/* Stats */}
              <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-8 mt-8 md:mt-12 pt-6 md:pt-8 border-t border-white/20">
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">10K+</div>
                  <div className="text-xs sm:text-sm text-white/80">Happy Customers</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">500+</div>
                  <div className="text-xs sm:text-sm text-white/80">Unique Designs</div>
                </div>
                <div className="text-center lg:text-left">
                  <div className="text-lg sm:text-2xl font-bold text-white drop-shadow-lg">25+</div>
                  <div className="text-xs sm:text-sm text-white/80">Years Experience</div>
                </div>
              </div>
            </div>
            
            {/* Optional: Additional content or space for jewelry showcase */}
            <div className="hidden lg:block">
              {/* This space can be used for additional content or left empty to let the background image shine */}
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      {bannerUrl && (
        <section className="w-full py-4 md:py-8 bg-gradient-to-r from-yellow-50 to-orange-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative w-full overflow-hidden rounded-lg md:rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Image
                src={bannerUrl}
                alt="Promotional Banner"
                width={1200}
                height={400}
                className="w-full h-auto object-cover object-center"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                priority
              />
              {/* Optional overlay for better interaction */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-yellow-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-lg md:rounded-2xl"></div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section - Hidden on Mobile */}
      <section className="py-20 bg-white hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Soni Jewellers And Navratna Bhandar?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine traditional craftsmanship with modern technology to create jewellery that stands the test of time.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Crown className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed">Certified gold and silver jewellery with hallmark guarantee and purity certification.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Exquisite Designs</h3>
              <p className="text-gray-600 leading-relaxed">Handcrafted by skilled artisans with attention to detail and unique artistic vision.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-900">Lifetime Warranty</h3>
              <p className="text-gray-600 leading-relaxed">Comprehensive warranty and after-sales service to ensure your investment is protected.</p>
            </div>
            
            <div className="text-center group">
              <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mx-auto flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Truck className="h-10 w-10 text-white" />
            </div>
        </div>
  <h3 className="text-xl font-semibold mb-3 text-gray-900">Store Pickup</h3>
  <p className="text-gray-600 leading-relaxed">
    Convenient in-store pickup available. Visit our store to collect your order safely and quickly.
  </p>
</div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-gradient-to-br from-gray-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our diverse collection of jewellery categories, each crafted with precision and care to meet your unique style.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories?.map((category) => (
              <Link key={category.id} href={`/products?category=${category.id}`} className="group">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className="aspect-square relative">
                    <Image
                      src={CATEGORY_IMAGES[category.name] || category.image_url || "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors text-lg">
                      {category.name}
                    </h3>
                    <div className="flex items-center justify-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowRight className="h-4 w-4 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-yellow-600 fill-current" />
              <span className="text-sm font-medium text-yellow-600 bg-yellow-100 px-3 py-1 rounded-full">
                Featured Collection
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Handpicked for You</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular and trending jewelry pieces, carefully selected for their exceptional quality and timeless appeal.
            </p>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Gem className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Products</h3>
              <p className="text-gray-600 mb-6">Check back soon for our latest featured collection.</p>
              <Link href="/products">
                <Button>View All Products</Button>
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our valued customers have to say about their experience.
            </p>
          </div>

          {/* Desktop Testimonials */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The quality of jewellery is exceptional. I've been a customer for years and never been disappointed. The craftsmanship is outstanding!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                  SP
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Sarah Patel</div>
                  <div className="text-sm text-gray-600">Loyal Customer</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "Amazing collection and excellent service. The staff helped me find the perfect piece for my wedding. Highly recommended!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                  RK
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Rajesh Kumar</div>
                  <div className="text-sm text-gray-600">Wedding Customer</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                "The online shopping experience is seamless. Fast delivery and the jewellery exceeded my expectations. Will definitely shop again!"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center text-white font-semibold">
                  AM
                </div>
                <div className="ml-4">
                  <div className="font-semibold text-gray-900">Aisha Mehta</div>
                  <div className="text-sm text-gray-600">Online Customer</div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Testimonials Carousel */}
          <TestimonialsCarousel />
        </div>
      </section>
    </div>
  )
}