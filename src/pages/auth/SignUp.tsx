// ============================================================
// KYSS Vision — Sign Up Page
// US-012
// ============================================================

import { useState } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/integrations/supabase/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'

export default function SignUp() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signUp } = useAuth()

  const defaultRole = (searchParams.get('role') as UserRole) || 'worker'
  const defaultCountry = searchParams.get('country') || ''

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    country: defaultCountry,
    role: defaultRole as UserRole,
    terms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Enter a valid email address'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (!formData.country) newErrors.country = 'Please select a country'
    if (!formData.terms) newErrors.terms = 'You must accept the terms to continue'
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setServerError(null)
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setErrors({})
    setIsLoading(true)

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.name,
      formData.role,
      formData.country
    )

    setIsLoading(false)

    if (error) {
      setServerError(error)
      return
    }

    // Redirect based on role
    if (formData.role === 'worker') {
      navigate('/profile/edit')
    } else if (formData.role === 'employer') {
      navigate('/employer/profile')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">KYSS Vision</Link>
          <p className="text-muted-foreground mt-2 text-sm">Create your free account</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <h1 className="text-xl font-semibold text-foreground mb-6">Get Started</h1>

          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Sophie Laurent"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={errors.name ? 'border-destructive' : ''}
              />
              {errors.name && <p className="text-destructive text-xs">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="sophie@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={errors.password ? 'border-destructive' : ''}
              />
              {errors.password && <p className="text-destructive text-xs">{errors.password}</p>}
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label>Where are you looking for work?</Label>
              <RadioGroup
                value={formData.country}
                onValueChange={(v) => setFormData({ ...formData, country: v })}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="NZ" id="country-nz" />
                  <Label htmlFor="country-nz" className="cursor-pointer">🇳🇿 New Zealand</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="AU" id="country-au" />
                  <Label htmlFor="country-au" className="cursor-pointer">🇦🇺 Australia</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Both" id="country-both" />
                  <Label htmlFor="country-both" className="cursor-pointer">Both</Label>
                </div>
              </RadioGroup>
              {errors.country && <p className="text-destructive text-xs">{errors.country}</p>}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label>I am a...</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(v) => setFormData({ ...formData, role: v as UserRole })}
                className="flex gap-4"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="worker" id="role-worker" />
                  <Label htmlFor="role-worker" className="cursor-pointer">Worker</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="employer" id="role-employer" />
                  <Label htmlFor="role-employer" className="cursor-pointer">Employer</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <Checkbox
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => setFormData({ ...formData, terms: !!checked })}
                className="mt-0.5"
              />
              <div>
                <Label htmlFor="terms" className="cursor-pointer text-sm leading-snug">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </Label>
                {errors.terms && <p className="text-destructive text-xs mt-0.5">{errors.terms}</p>}
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                'Create Free Account →'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link to="/auth/sign-in" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
