export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">About Hillside Logs Fuel</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          Welcome to <strong>Hillside Logs Fuel</strong>, your trusted supplier of premium quality firewood logs across the UK. 
          We take pride in delivering sustainably sourced, properly seasoned firewood that provides 
          excellent heat output and a clean burn for your home heating needs.
        </p>

        <div className="bg-amber-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Sustainably sourced British hardwood</li>
            <li>Properly seasoned for optimal burning</li>
            <li>Consistent quality and sizing</li>
            <li>Reliable delivery service across the UK</li>
            <li>Expert advice and customer support</li>
            <li>Competitive pricing with no hidden costs</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Hillside Logs Fuel?</h2>
          <p className="mb-4">
            With years of experience in the firewood industry, Hillside Logs Fuel understands the importance 
            of quality fuel for your wood burner, stove, or open fire. Every log we supply is carefully 
            selected and processed to ensure it meets our exceptionally high standards for moisture content, 
            size consistency, and burning performance.
          </p>
          <p className="mb-4">
            At Hillside Logs Fuel, we believe that great firewood starts with great timber. That's why we 
            source only the finest British hardwoods, ensuring you get the best value and performance 
            from every purchase.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Our Process</h2>
          <p className="mb-4">
            From forest to your doorstep, Hillside Logs Fuel maintains strict quality control throughout our 
            entire process. Our logs are cut to consistent sizes, properly seasoned to below 20% moisture content, 
            and stored in our covered facilities to maintain optimal burning conditions.
          </p>
          <p>
            We're committed to sustainable forestry practices and work closely with local woodland managers 
            to ensure our supply chain supports healthy forest ecosystems while providing you with the 
            highest quality firewood available.
          </p>
        </div>
      </div>
    </div>
  )
}
