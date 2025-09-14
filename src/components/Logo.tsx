'use client'

export default function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <svg 
        className="w-8 h-8 text-amber-600" 
        fill="currentColor" 
        viewBox="0 0 24 24"
      >
        <path d="M7 18C5.9 18 5 18.9 5 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18M17 18C15.9 18 15 18.9 15 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18M7.2 14.8V14.7L8.1 13H15.5C16.2 13 16.9 12.6 17.2 12L21.1 5L19.4 4L15.5 11H8.5L4.3 2H1V4H3L6.6 11.6L5.2 14C5.1 14.3 5 14.6 5 15C5 16.1 5.9 17 7 17H19V15H7.4C7.3 15 7.2 14.9 7.2 14.8M12 9.3L11.4 8.8C9.4 6.8 8 5.4 8 3.8C8 2.4 9.1 1.3 10.5 1.3C11.3 1.3 12.1 1.7 12.6 2.2C13.1 1.7 13.9 1.3 14.7 1.3C16.1 1.3 17.2 2.4 17.2 3.8C17.2 5.4 15.8 6.8 13.8 8.8L13.2 9.3C12.9 9.6 12.4 9.6 12 9.3Z" />
      </svg>
      <span className="text-xl font-bold text-amber-600">Hillside Logs Fuel</span>
    </div>
  )
}
