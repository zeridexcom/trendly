import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { Sparkles, ArrowRight, TrendingUp, Calendar, Lightbulb, Zap } from 'lucide-react'

export default async function HomePage() {
  // Always redirect to dashboard
  redirect('/dashboard')

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          padding: 'var(--space-4) var(--space-8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(10, 10, 15, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--color-border)',
          zIndex: 100,
        }}
      >
        <Link href="/" className="flex items-center gap-3">
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--gradient-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles size={24} color="white" />
          </div>
          <span
            style={{
              fontSize: 'var(--text-xl)',
              fontWeight: 'var(--font-bold)',
            }}
            className="text-gradient"
          >
            Trendly
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login" className="btn btn-ghost">
            Sign In
          </Link>
          <Link href="/login" className="btn btn-primary">
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: 'var(--space-8)',
          paddingTop: 'calc(var(--header-height) + var(--space-16))',
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-2) var(--space-4)',
            background: 'var(--color-primary-subtle)',
            border: '1px solid var(--color-primary)',
            borderRadius: 'var(--radius-full)',
            marginBottom: 'var(--space-6)',
          }}
        >
          <Zap size={14} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)' }}>
            AI-Powered Content Planning
          </span>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 'var(--font-bold)',
            lineHeight: 1.1,
            marginBottom: 'var(--space-6)',
            maxWidth: 900,
          }}
        >
          Your Social Media{' '}
          <span className="text-gradient">Command Center</span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 'var(--text-xl)',
            color: 'var(--color-text-secondary)',
            maxWidth: 600,
            marginBottom: 'var(--space-10)',
            lineHeight: 'var(--leading-relaxed)',
          }}
        >
          Unify content ideas, capture trends, and plan your social media calendar —
          all in one place with AI-powered suggestions.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link
            href="/login"
            className="btn btn-primary btn-lg"
            style={{ padding: 'var(--space-4) var(--space-8)' }}
          >
            Start Planning Free
            <ArrowRight size={18} />
          </Link>
          <Link href="#features" className="btn btn-secondary btn-lg">
            See Features
          </Link>
        </div>

        {/* Features Grid */}
        <div
          id="features"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-6)',
            marginTop: 'var(--space-20)',
            width: '100%',
            maxWidth: 1200,
          }}
        >
          {/* Feature 1 */}
          <div
            className="card card-elevated"
            style={{
              textAlign: 'left',
              padding: 'var(--space-8)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(168, 85, 247, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}
            >
              <TrendingUp size={28} style={{ color: '#a855f7' }} />
            </div>
            <h3
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Trend Capture
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Never miss a viral moment. Capture and organize trending topics, sounds,
              and formats from across all platforms.
            </p>
          </div>

          {/* Feature 2 */}
          <div
            className="card card-elevated"
            style={{
              textAlign: 'left',
              padding: 'var(--space-8)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(234, 179, 8, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Lightbulb size={28} style={{ color: '#eab308' }} />
            </div>
            <h3
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Idea Pipeline
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Transform inspiration into action. Manage ideas through a visual Kanban
              board from concept to production.
            </p>
          </div>

          {/* Feature 3 */}
          <div
            className="card card-elevated"
            style={{
              textAlign: 'left',
              padding: 'var(--space-8)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Calendar size={28} style={{ color: '#22c55e' }} />
            </div>
            <h3
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-2)',
              }}
            >
              Visual Calendar
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              See your content at a glance. Schedule posts, track progress, and never
              miss a deadline across all your channels.
            </p>
          </div>

          {/* Feature 4 */}
          <div
            className="card card-elevated"
            style={{
              textAlign: 'left',
              padding: 'var(--space-8)',
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 'var(--radius-lg)',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
              }}
            >
              <Sparkles size={28} style={{ color: '#6366f1' }} />
            </div>
            <h3
              style={{
                fontSize: 'var(--text-xl)',
                fontWeight: 'var(--font-semibold)',
                marginBottom: 'var(--space-2)',
              }}
            >
              AI Assistance
            </h3>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Let AI help you create. Generate content ideas, craft engaging captions,
              and write scroll-stopping hooks instantly.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: 'var(--space-8)',
          borderTop: '1px solid var(--color-border)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-sm)',
        }}
      >
        <p>© 2024 Trendly. Built for social media teams.</p>
      </footer>
    </div>
  )
}
