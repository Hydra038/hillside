import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  imageUrl?: string
}

interface CartStore {
  items: CartItem[]
  total: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
}

const calculateTotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => {
    const price = typeof item.price === 'number' ? item.price : 0
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0
    return sum + price * quantity
  }, 0)
}

const validateItem = (item: any): item is CartItem => {
  return (
    item &&
    typeof item.id === 'number' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number'
  )
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        if (!item || typeof item.price !== 'number') {
          console.error('Invalid item data:', item)
          return
        }
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          if (existingItem) {
            // If item exists, increment quantity
            const updatedItems = state.items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + 1 }
                : i
            )
            return {
              items: updatedItems,
              total: calculateTotal(updatedItems)
            }
          }
          // If item doesn't exist, add it with quantity 1
          const newItems = [...state.items, { ...item, quantity: 1 }]
          return {
            items: newItems,
            total: calculateTotal(newItems)
          }
        })
      },
      removeItem: (itemId) => {
        set((state) => {
          const newItems = state.items.filter((i) => i.id !== itemId)
          return {
            items: newItems,
            total: calculateTotal(newItems)
          }
        })
      },
      updateQuantity: (itemId, quantity) => {
        if (typeof quantity !== 'number') {
          console.error('Invalid quantity:', quantity)
          return
        }
        set((state) => {
          if (quantity <= 0) {
            const newItems = state.items.filter((i) => i.id !== itemId)
            return {
              items: newItems,
              total: calculateTotal(newItems)
            }
          }
          const newItems = state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          )
          return {
            items: newItems,
            total: calculateTotal(newItems)
          }
        })
      },
      clearCart: () => set({ items: [], total: 0 })
    }),
    {
      name: 'cart-storage'
    }
  )
)
