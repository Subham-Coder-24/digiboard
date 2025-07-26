import React, { useEffect, useState } from 'react'

const Left = () => {

      const styles = {
    // Left Side - Branding
    leftSide: {
      flex: 1,
      background: '#000000',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem 3rem',
      position: 'relative' as const,
      overflow: 'hidden',
    },
    backgroundPattern: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 70% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%)`,
      pointerEvents: 'none' as const,
    },
    whiteboardElements: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      pointerEvents: 'none' as const,
      overflow: 'hidden',
    },
    drawingPath: {
      position: 'absolute' as const,
      stroke: 'rgba(255, 255, 255, 0.1)',
      strokeWidth: '2',
      fill: 'none',
      strokeDasharray: '1000',
      strokeDashoffset: '1000',
      animation: 'drawPath 8s ease-in-out infinite',
    },
    drawingPath2: {
      position: 'absolute' as const,
      stroke: 'rgba(255, 255, 255, 0.08)',
      strokeWidth: '2',
      fill: 'none',
      strokeDasharray: '800',
      strokeDashoffset: '800',
      animation: 'drawPath2 10s ease-in-out infinite 2s',
    },
    floatingDot: {
      position: 'absolute' as const,
      width: '4px',
      height: '4px',
      background: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '50%',
      animation: 'floatDot 6s ease-in-out infinite',
    },
    floatingDot2: {
      position: 'absolute' as const,
      width: '3px',
      height: '3px',
      background: 'rgba(255, 255, 255, 0.2)',
      borderRadius: '50%',
      animation: 'floatDot2 8s ease-in-out infinite 3s',
    },
    cursor: {
      position: 'absolute' as const,
      width: '12px',
      height: '12px',
      border: '2px solid rgba(255, 255, 255, 0.4)',
      borderRadius: '50%',
      animation: 'moveCursor 12s ease-in-out infinite',
    },
    gridLines: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.02) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
      `,
      backgroundSize: '40px 40px',
      opacity: 0.5,
    },
    brandingContent: {
      position: 'relative' as const,
      zIndex: 2,
      textAlign: 'center' as const,
      color: '#ffffff',
    },
    logo: {
      fontSize: 'clamp(3rem, 6vw, 5rem)',
      fontWeight: 900,
      background: 'linear-gradient(135deg, #ffffff 0%, #cccccc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      marginBottom: '2rem',
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
    },
    tagline: {
      fontSize: '1.25rem',
      color: '#888888',
      marginBottom: '3rem',
      fontWeight: 300,
      lineHeight: 1.6,
      maxWidth: '400px',
    },
    features: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '1.5rem',
      marginTop: '2rem',
    },
    feature: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      color: '#cccccc',
      fontSize: '1rem',
    },
    featureIcon: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #ffffff 0%, #888888 100%)',
      flexShrink: 0,
    },
    
    // Right Side - Forms
    rightSide: {
      flex: 1,
      background: '#ffffff',
      display: 'flex',
      flexDirection: 'column' as const,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '4rem 3rem',
    },
    formContainer: {
      width: '100%',
      maxWidth: '450px',
    },
    formTitle: {
      fontSize: '2rem',
      fontWeight: 700,
      color: '#000000',
      marginBottom: '0.5rem',
      textAlign: 'center' as const,
    },
    formSubtitle: {
      fontSize: '1rem',
      color: '#666666',
      marginBottom: '3rem',
      textAlign: 'center' as const,
    },
    inputGroup: {
      marginBottom: '2rem',
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: 600,
      color: '#333333',
      marginBottom: '0.75rem',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
    },
    input: {
      width: '100%',
      padding: '1rem 1.5rem',
      background: '#f8f9fa',
      border: '2px solid #e9ecef',
      borderRadius: '12px',
      color: '#000000',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxSizing: 'border-box' as const,
    },
    inputFocus: {
      borderColor: '#000000',
      background: '#ffffff',
      boxShadow: '0 0 0 3px rgba(0, 0, 0, 0.1)',
    },
    button: {
      width: '100%',
      padding: '1rem 2rem',
      background: '#000000',
      color: '#ffffff',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textTransform: 'uppercase' as const,
      letterSpacing: '0.05em',
      outline: 'none',
    },
    buttonSecondary: {
      background: 'transparent',
      color: '#000000',
      border: '2px solid #000000',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '2rem 0',
      gap: '1rem',
    },
    dividerLine: {
      flex: 1,
      height: '1px',
      background: '#e9ecef',
    },
    dividerText: {
      color: '#666666',
      fontSize: '0.875rem',
      fontWeight: 500,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.1em',
    },
     labelIcon: {
        marginRight: '10px',
    },
     inputHelper: {
      fontSize: '0.75rem',
      color: '#6c757d',
      marginTop: '0.5rem',
      marginLeft: '0.25rem',
    },
      primaryButton: {
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      color: '#ffffff',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    },
    buttonIcon:{
      marginRight: '10px',
    },
     formFooter: {
      marginTop: '1rem',
      textAlign: 'center' as const,
    },
    footerText: {
      fontSize: '0.8rem',
      color: '#6c757d',
      // lineHeight: 1.4,
      margin: 0,
    },
    footerLink: {
      color: '#000000',
      textDecoration: 'none',
      fontWeight: 500,
    },
    
    form: {
      width: '100%',
    },
    
    // Responsive
    '@media (max-width: 768px)': {
      container: {
        flexDirection: 'column' as const,
      },
      leftSide: {
        minHeight: '50vh',
        padding: '2rem',
      },
      rightSide: {
        minHeight: '50vh',
        padding: '2rem',
      },
    },
  };
  return (
        
    <div style={styles.leftSide}>
    <div style={styles.gridLines}></div>
    <div style={styles.backgroundPattern}></div>
    
    {/* Whiteboard Animation Elements */}
    <div style={styles.whiteboardElements}>
        {/* Animated Drawing Paths - Spread Throughout */}
        <svg width="100%" height="100%" style={{position: 'absolute', top: 0, left: 0}}>
        {/* Top Section Drawings */}

        <path d="M 50 700 Q 150 750 250 700 T 450 750" style={styles.drawingPath} />
        <path d="M 50 650 Q 150 700 250 650 T 450 700" style={{...styles.drawingPath2, animationDelay: '1s'}} />
        
        {/* Geometric Shapes Scattered */}
        <circle cx="120" cy="100" r="25" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="2" fill="none" strokeDasharray="157" strokeDashoffset="157" style={{animation: 'drawCircle 6s ease-in-out infinite 1s'}} />
        <circle cx="350" cy="180" r="35" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" fill="none" strokeDasharray="220" strokeDashoffset="220" style={{animation: 'drawCircle 8s ease-in-out infinite 4s'}} />
        <circle cx="80" cy="400" r="20" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="2" fill="none" strokeDasharray="126" strokeDashoffset="126" style={{animation: 'drawCircle 7s ease-in-out infinite 6s'}} />
        
        {/* Rectangles */}
        <rect x="200" y="60" width="60" height="40" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="2" fill="none" strokeDasharray="200" strokeDashoffset="200" style={{animation: 'drawRect 5s ease-in-out infinite 2s'}} />
        <rect x="350" y="300" width="80" height="50" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="2" fill="none" strokeDasharray="260" strokeDashoffset="260" style={{animation: 'drawRect 6s ease-in-out infinite 4s'}} />
        <rect x="50" y="500" width="70" height="45" stroke="rgba(255, 255, 255, 0.07)" strokeWidth="2" fill="none" strokeDasharray="230" strokeDashoffset="230" style={{animation: 'drawRect 7s ease-in-out infinite 6s'}} />
        
        {/* Triangles */}
        <path d="M 400 120 L 440 80 L 480 120 Z" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="2" fill="none" strokeDasharray="160" strokeDashoffset="160" style={{animation: 'drawTriangle 5s ease-in-out infinite 3s'}} />
        <path d="M 150 450 L 190 410 L 230 450 Z" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" fill="none" strokeDasharray="160" strokeDashoffset="160" style={{animation: 'drawTriangle 6s ease-in-out infinite 7s'}} />
        
        {/* Zigzag Lines */}
        <path d="M 300 50 L 320 30 L 340 50 L 360 30 L 380 50" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="2" fill="none" strokeDasharray="100" strokeDashoffset="100" style={{animation: 'drawZigzag 4s ease-in-out infinite 2s'}} />
        <path d="M 100 200 L 120 180 L 140 200 L 160 180 L 180 200" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" fill="none" strokeDasharray="100" strokeDashoffset="100" style={{animation: 'drawZigzag 5s ease-in-out infinite 4s'}} />
        
        {/* Arrows */}
        <path d="M 250 400 L 300 380 M 290 370 L 300 380 L 290 390" stroke="rgba(255, 255, 255, 0.06)" strokeWidth="2" fill="none" strokeDasharray="80" strokeDashoffset="80" style={{animation: 'drawArrow 4s ease-in-out infinite 1s'}} />
        <path d="M 400 250 L 450 230 M 440 220 L 450 230 L 440 240" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="2" fill="none" strokeDasharray="80" strokeDashoffset="80" style={{animation: 'drawArrow 5s ease-in-out infinite 5s'}} />
        </svg>
        
        {/* Floating Dots - More Scattered */}
        <div style={{...styles.floatingDot, top: '15%', left: '10%'}}></div>
        <div style={{...styles.floatingDot2, top: '25%', left: '80%'}}></div>
        <div style={{...styles.floatingDot, top: '35%', left: '60%', animationDelay: '2s'}}></div>
        <div style={{...styles.floatingDot2, top: '45%', left: '20%', animationDelay: '3s'}}></div>
        <div style={{...styles.floatingDot, top: '55%', left: '85%', animationDelay: '1s'}}></div>
        <div style={{...styles.floatingDot2, top: '65%', left: '40%', animationDelay: '4s'}}></div>
        <div style={{...styles.floatingDot, top: '75%', left: '15%', animationDelay: '2.5s'}}></div>
        <div style={{...styles.floatingDot2, top: '85%', left: '70%', animationDelay: '1.5s'}}></div>
        <div style={{...styles.floatingDot, top: '10%', left: '45%', animationDelay: '3.5s'}}></div>
        <div style={{...styles.floatingDot2, top: '90%', left: '30%', animationDelay: '4.5s'}}></div>
        <div style={{...styles.floatingDot, bottom: '10%', right: '10%', animationDelay: '3.5s'}}></div>
        <div style={{...styles.floatingDot2, bottom: '20%', right: '15%', animationDelay: '4.5s'}}></div>
        <div style={{...styles.floatingDot2, bottom: '15%', right: '20%', animationDelay: '4.5s'}}></div>
        <div style={{...styles.floatingDot2, bottom: '18%', right: '30%', animationDelay: '4.5s'}}></div>
        
        {/* Multiple Moving Cursors */}
        <div style={styles.cursor}></div>
        <div style={{...styles.cursor, animation: 'moveCursor2 15s ease-in-out infinite 3s'}}></div>
        <div style={{...styles.cursor, animation: 'moveCursor3 18s ease-in-out infinite 6s', border: '2px solid rgba(255, 255, 255, 0.3)'}}></div>
    </div>
    
    <div style={styles.brandingContent}>
        <h1 style={styles.logo}>CoSketch</h1>
        {/* <p style={styles.tagline}>
        The ultimate collaborative whiteboard experience for modern teams. 
        Create, collaborate, and innovate together in real-time.
        </p> */}
        <p style={{
        fontSize: '1rem',
        color: '#888888',
        marginBottom: '4rem',
        fontWeight: 300,
        lineHeight: 1.6,
        maxWidth: '540px',
        fontFamily: 'monospace',
        borderRight: '2px solid rgba(255, 255, 255, 0.7)',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        animation: 'typewriter 4s steps(80, end) infinite, blink 1s step-end infinite',
        margin:'30px'
    }}>
        {/* The ultimate collaborative whiteboard experience for modern teams.  */}
        Create, collaborate, and innovate together in real-time.
    </p>
    

        
    <div style={{
        marginTop: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.8rem',
        justifyContent: 'center'
    }}>
        {['Real-time Drawing', 'Secure Rooms', 'Pro Tools', 'Instant Sync','Colors','Shapes'].map((feature, i) => (
        <div key={i} style={{
            position: 'relative',
            padding: '0.6rem 1.2rem',
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '20px',
            color: '#ccc',
            fontSize: '0.8rem',
            overflow: 'hidden'
        }}>
            <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
            animation: `radar 3s linear infinite ${i * 0.7}s`
            }}></div>
            <span style={{position: 'relative', zIndex: 1}}>{feature}</span>
        </div>
        ))}
    </div>


    </div>
    </div>
  )
}

export default Left