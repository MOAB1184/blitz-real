import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const roleOptions = [
  { id: 'sponsor', title: 'Sponsor', description: 'I want to sponsor others' },
  { id: 'receiver', title: 'Receiver', description: 'I\'m looking for sponsorship' },
]

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['sponsor', 'receiver']),
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)
    try {
      // TODO: Implement registration logic
      console.log(data)
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full name
        </label>
        <div className="mt-1">
          <input
            id="name"
            type="text"
            {...register('name')}
            className="input-field"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <input
            id="email"
            type="email"
            {...register('email')}
            className="input-field"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            type="password"
            {...register('password')}
            className="input-field"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          I am a...
        </label>
        <div className="mt-2 space-y-4">
          {roleOptions.map((option) => (
            <div key={option.id} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  id={option.id}
                  type="radio"
                  value={option.id}
                  {...register('role')}
                  className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={option.id} className="text-sm font-medium text-gray-700">
                  {option.title}
                </label>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full"
        >
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </div>
    </form>
  )
} 