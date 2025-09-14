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

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      total: 0,
      addItem: (item) => set((state) => {
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
            total: state.total + item.price,
          }
        }
        // If item doesn't exist, add it with quantity 1
        return {
          items: [...state.items, { ...item, quantity: 1 }],
          total: state.total + item.price,
        }
      }),
      removeItem: (itemId) =>
        set((state) => {
          const item = state.items.find((i) => i.id === itemId)
          if (!item) return state
          return {
            items: state.items.filter((i) => i.id !== itemId),
            total: state.total - item.price * item.quantity,
          }
        }),
      updateQuantity: (itemId, quantity) =>
        set((state) => {
          const item = state.items.find((i) => i.id === itemId)
          if (!item) return state
          if (quantity <= 0) {
            return {
              items: state.items.filter((i) => i.id !== itemId),
              total: state.total - item.price * item.quantity,
            }
          }
          const quantityDiff = quantity - item.quantity
          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity } : i
            ),
            total: state.total + item.price * quantityDiff,
          }
        }),
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'cart-storage', // name of the item in localStorage
    }
  )
)
