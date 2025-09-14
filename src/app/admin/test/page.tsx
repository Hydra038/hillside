export default function AdminTestPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600">✅ Admin Test Page</h1>
      <p className="mt-4">If you can see this page, the admin routing is working!</p>
      <a href="/admin" className="text-blue-600 underline">
        Go back to Admin Dashboard
      </a>
    </div>
  )
}
