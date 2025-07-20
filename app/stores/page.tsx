import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Clock } from 'lucide-react'

const stores = [
  {
    name: 'Latehar - Sonijewellers',
    address: 'Opp. V-Mart, Main Road Latehar, Jharkhand',
    phone: '+91 9334997066',
    hours: 'Sun-Sat: 10:00 AM - 7:00 PM',
    lat: 23.745102434528814,
    lng: 84.50544616180471,
  },
  
]

export default function StoresPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Our Stores
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-amber-400 to-yellow-500 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg font-light">Visit our stores across India for a premium jewellery experience</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store, idx) => (
            <Card key={idx} className="overflow-hidden shadow-xl border-amber-200/50 bg-white/90">
              <CardHeader className="p-0">
                <div className="w-full h-50">
                  <iframe
                    title={`Google Map of ${store.name}`}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${store.lat},${store.lng}&z=15&output=embed`}
                    allowFullScreen
                  ></iframe>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <CardTitle className="text-2xl font-bold text-amber-800 mb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-yellow-600" /> {store.name}
                </CardTitle>
                <div className="text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" />
                  <span>{store.address}</span>
                </div>
                <div className="text-gray-700 mb-2 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-400" />
                  <a href={`tel:${store.phone.replace(/\s+/g, '')}`} className="hover:text-yellow-700 font-medium">{store.phone}</a>
                </div>
                <div className="text-gray-700 mb-2 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" />
                  <span>{store.hours}</span>
                </div>
                <Badge variant="secondary" className="mt-2">Walk-in Welcome</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 