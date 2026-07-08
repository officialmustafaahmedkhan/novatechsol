export interface User {
  id: string
  name: string
  email: string
  role: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  _count?: { products: number }
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  sortOrder: number
}

export interface ProductPricing {
  id: string
  price: number
  effectiveFrom: string
  effectiveTo?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  categoryId: string
  category: Category
  basePrice: number
  currency: string
  published: boolean
  images: ProductImage[]
  pricing: ProductPricing[]
  createdAt: string
  updatedAt: string
}

export interface News {
  id: string
  title: string
  slug: string
  content: string
  excerpt?: string
  image?: string
  author: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  sortOrder: number
  published: boolean
}

export interface Inquiry {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  message: string
  status: "NEW" | "READ" | "REPLIED" | "CLOSED"
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface DashboardStats {
  counts: {
    products: number
    categories: number
    news: number
    faqs: number
    inquiries: number
    users: number
    publishedProducts: number
    newInquiries: number
  }
  recentInquiries: Inquiry[]
}
