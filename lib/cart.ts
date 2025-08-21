"use client"

import type { Product } from "./products"

export interface CartItem {
  product: Product
  quantity: number
  price: number
}

export class CartManager {
  private static STORAGE_KEY = "jewelry-cart"

  static getCart(): CartItem[] {
    if (typeof window === "undefined") return []

    try {
      const cart = localStorage.getItem(this.STORAGE_KEY)
      return cart ? JSON.parse(cart) : []
    } catch {
      return []
    }
  }

  static addToCart(product: Product, price: number, quantity = 1): void {
    const cart = this.getCart()
    const existingItem = cart.find((item) => item.product.id.toString() === product.id.toString())

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ product, quantity, price })
    }

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
  }

  static removeFromCart(productId: number): void {
    const cart = this.getCart().filter((item) => item.product.id !== productId)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
    window.dispatchEvent(new Event("cart-updated"))
  }

  static updateQuantity(productId: number, quantity: number): void {
    const cart = this.getCart()
    const item = cart.find((item) => item.product.id === productId)

    if (item) {
      if (quantity <= 0) {
        this.removeFromCart(productId)
      } else {
        item.quantity = quantity
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cart))
        window.dispatchEvent(new Event("cart-updated"))
      }
    }
  }

  static clearCart(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    window.dispatchEvent(new Event("cart-updated"))
  }

  static getCartTotal(): number {
    return this.getCart().reduce((total, item) => total + item.price * item.quantity, 0)
  }

  static getCartCount(): number {
    return this.getCart().reduce((count, item) => count + item.quantity, 0)
  }
}
