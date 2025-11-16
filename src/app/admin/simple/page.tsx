export default function AdminSimplePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600">🎯 Admin Dashboard - Simple Version</h1>
      <p className="mt-4">This is a simplified admin page to test routing.</p>
      
      <div className="mt-8 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Quick Navigation Test</h2>
        <div className="space-y-2">
          <a href="/admin/test" className="block text-blue-600 underline">
            Test Page (/admin/test)
          </a>
          <a href="/" className="block text-blue-600 underline">
            Home Page
          </a>
          <a href="/signin" className="block text-blue-600 underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}
