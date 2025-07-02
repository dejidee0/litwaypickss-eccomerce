import React, { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'sonner'

const AuthContext = createContext()

// Mock users database
const MOCK_USERS = {
  admin: {
    id: 'admin-1',
    email: 'admin@litwaypicks.com',
    password: 'admin123',
    role: 'admin',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+231-888-640-502',
  },
  customers: [
    {
      id: 'customer-1',
      email: 'john.doe@example.com',
      password: 'customer123',
      role: 'customer',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+231-888-123-456',
      address: '123 Main Street',
      city: 'Monrovia',
      county: 'Montserrado'
    },
    {
      id: 'customer-2',
      email: 'sarah.johnson@example.com',
      password: 'customer123',
      role: 'customer',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+231-888-654-321',
      address: '456 Oak Avenue',
      city: 'Paynesville',
      county: 'Montserrado'
    }
  ]
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('litwaypicks-user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('litwaypicks-user')
      }
    }
    setLoading(false)
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('litwaypicks-user', JSON.stringify(user))
    } else {
      localStorage.removeItem('litwaypicks-user')
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check admin credentials
    if (email === MOCK_USERS.admin.email && password === MOCK_USERS.admin.password) {
      const { password: _, ...adminUser } = MOCK_USERS.admin
      setUser(adminUser)
      setLoading(false)
      toast.success('Welcome back, Admin!')
      return { success: true, user: adminUser }
    }

    // Check customer credentials
    const customer = MOCK_USERS.customers.find(
      c => c.email === email && c.password === password
    )

    if (customer) {
      const { password: _, ...customerUser } = customer
      setUser(customerUser)
      setLoading(false)
      toast.success(`Welcome back, ${customer.firstName}!`)
      return { success: true, user: customerUser }
    }

    setLoading(false)
    toast.error('Invalid email or password')
    return { success: false, error: 'Invalid credentials' }
  }

  const register = async (userData) => {
    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check if email already exists
    const emailExists = MOCK_USERS.customers.some(c => c.email === userData.email) || 
                       userData.email === MOCK_USERS.admin.email

    if (emailExists) {
      setLoading(false)
      toast.error('Email already exists')
      return { success: false, error: 'Email already exists' }
    }

    // Create new customer
    const newCustomer = {
      id: `customer-${Date.now()}`,
      ...userData,
      role: 'customer',
    }

    // In a real app, this would be saved to the backend
    MOCK_USERS.customers.push(newCustomer)

    const { password: _, ...userWithoutPassword } = newCustomer
    setUser(userWithoutPassword)
    setLoading(false)
    toast.success('Account created successfully!')
    return { success: true, user: userWithoutPassword }
  }

  const logout = () => {
    setUser(null)
    toast.success('Logged out successfully')
  }

  const updateProfile = async (updatedData) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    setLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))

    const updatedUser = { ...user, ...updatedData }
    setUser(updatedUser)
    setLoading(false)
    toast.success('Profile updated successfully!')
    return { success: true, user: updatedUser }
  }

  const isAdmin = user?.role === 'admin'
  const isCustomer = user?.role === 'customer'
  const isAuthenticated = !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isCustomer,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}