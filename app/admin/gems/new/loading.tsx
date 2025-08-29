export default function NewGemLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <div className="h-9 bg-amber-200 rounded w-32"></div>
          <div className="animate-pulse">
            <div className="h-8 bg-amber-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-amber-200 rounded w-64"></div>
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j}>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-10 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Button Skeleton */}
        <div className="mt-8 flex justify-end">
          <div className="h-10 bg-amber-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  )
}
