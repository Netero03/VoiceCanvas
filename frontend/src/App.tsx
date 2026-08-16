import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Whiteboard from './Whiteboard';

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/whiteboard');
  };

  // Responsive sizing for background orb
  const orbWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? '260%' : '190%';

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
      {/* Local animation styles */}
      <style>{`
        @keyframes drawArrow {
          0% { stroke-dashoffset: 140; opacity: .3; }
          30% { opacity: .9; }
          100% { stroke-dashoffset: 0; opacity: .9; }
        }
      `}</style>
      {/* Background with gradient orb */}
      <div style={{ position: 'absolute', inset: '0', width: '100%', overflow: 'hidden' }}>
        {/* Large gradient orb behind content */}
        <div 
          style={{
            position: 'absolute',
            left: '50%',
            aspectRatio: '1',
            width: orbWidth,
            transform: 'translateX(-50%)',
            overflow: 'hidden',
            backgroundImage: 'url(/bg3.png)',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center top',
            WebkitMask: 'linear-gradient(to bottom, transparent 0%, black 5%, black 100%)',
            mask: 'linear-gradient(to bottom, transparent 0%, black 5%, black 100%)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            WebkitPerspective: '1000px',
            perspective: '1000px',
            willChange: 'transform'
          }}
        />
        
        {/* Original subtle gradient overlay */}
        <div style={{ position: 'absolute', inset: '0', marginTop: '0', opacity: '1', filter: 'blur(10px)' }}>
          <div
            style={{
              position: 'absolute',
              left: '50%',
              aspectRatio: '1',
              width: orbWidth,
              transform: 'translateX(-50%)',
              overflow: 'hidden',
              transition: 'all 0.7s ease-out',
              background: 'radial-gradient(ellipse at center, rgba(88, 213, 255, 0.15) 0%, rgba(79, 70, 229, 0.05) 50%, transparent 70%)',
              WebkitMask: 'linear-gradient(to bottom, transparent 0%, black 5%, black 100%)',
              mask: 'linear-gradient(to bottom, transparent 0%, black 5%, black 100%)',
              WebkitBackfaceVisibility: 'hidden',
              backfaceVisibility: 'hidden',
              WebkitPerspective: '1000px',
              perspective: '1000px',
              willChange: 'transform'
            }}
          />
          {/* Muting veil to increase text contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.35) 35%, rgba(255,255,255,0.12) 60%, transparent 75%)'
            }}
          />
        </div>
      </div>

      {/* Grain overlay */}
      <div
        style={{
          position: 'absolute',
          inset: '0',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat',
          backgroundBlendMode: 'overlay',
          backgroundPosition: 'left top',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Main content */}
      <main style={{ 
        position: 'relative', 
        zIndex: '10', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        padding: '2.5rem 1rem', 
        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div style={{ transform: 'translateY(-8vh)' }}>
          {/* Brand/Logo */}
          <div style={{ 
            marginBottom: '2.25rem', 
            fontSize: '0.95rem', 
            fontWeight: 600, 
            color: '#6b7280', 
            letterSpacing: '0.04em'
          }}>
            Realtime Speech-to-Whiteboard
          </div>

          {/* Hero Section */}
          <div>
          <h1 style={{ 
            fontSize: typeof window !== 'undefined' && window.innerWidth < 768 ? '3rem' : '4.25rem', 
            fontWeight: '400', 
            lineHeight: '1.1', 
            marginBottom: '1.1rem', 
            color: '#1f2937', 
            letterSpacing: '-0.025em' 
          }}>
            Visualise Your Ideas,{' '}
            <span style={{ 
              fontWeight: '600', 
              background: 'linear-gradient(to right, #4A2BA1, #7c3aed)', 
              WebkitBackgroundClip: 'text', 
              backgroundClip: 'text', 
              color: 'transparent' 
            }}>
              Instantly
            </span>
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: '#374151', 
            margin: '0 auto 2.4rem', 
            maxWidth: '720px', 
            lineHeight: '1.65' 
          }}>
            Transform spoken concepts into collaborative diagrams with the power of the Gemini API.
            Draw system architectures, workflows, and ideas through natural conversation.
          </p>
          </div>

          {/* CTA Button with Looping Arrow */}
          <div style={{ position: 'relative', display: 'inline-block' }}>
          <button 
            onClick={handleGetStarted}
            style={{
              background: 'rgba(255,255,255,0.14)',
              backdropFilter: 'blur(12px) saturate(160%)',
              WebkitBackdropFilter: 'blur(12px) saturate(160%)',
              color: '#111827',
              fontSize: '1.0625rem',
              fontWeight: 600,
              padding: '0.95rem 2.1rem',
              borderRadius: '999px',
              border: '1px solid rgba(255,255,255,0.35)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(31,41,55,0.08)',
              position: 'relative',
              zIndex: '2'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(31,41,55,0.14)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.55)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.18)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(31,41,55,0.08)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.35)';
              e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            }}
          >
            Get Started
          </button>
          
          
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/whiteboard" element={<Whiteboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
