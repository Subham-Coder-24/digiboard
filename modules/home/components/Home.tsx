import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "../modals/NotFound";

const Home = () => {
  const { openModal } = useModal();
  const setAtomRoomId = useSetRoomId();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    document.body.style.backgroundColor = "#ffffff";
    document.body.style.margin = "0";
    document.body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";
  }, []);

  useEffect(() => {
    socket.on("created", (roomIdFromServer) => {
      setAtomRoomId(roomIdFromServer);
      router.push(roomIdFromServer);
    });

    const handleJoinedRoom = (roomIdFromServer: string, failed?: boolean) => {
      if (!failed) {
        setAtomRoomId(roomIdFromServer);
        router.push(roomIdFromServer);
      } else {
        openModal(<NotFoundModal id={roomId} />);
      }
    };

    socket.on("joined", handleJoinedRoom);

    return () => {
      socket.off("created");
      socket.off("joined", handleJoinedRoom);
    };
  }, [openModal, roomId, router, setAtomRoomId]);

  useEffect(() => {
    socket.emit("leave_room");
    setAtomRoomId("");
  }, [setAtomRoomId]);

  const handleCreateRoom = () => {
    socket.emit("create_room", username);
  };

  const handleJoinRoom = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (roomId) socket.emit("join_room", roomId, username);
  };

  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    },
    
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
    <div style={styles.container}>
      {/* Left Side - Branding */}
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

      {/* Right Side - Forms */}
      <div style={styles.rightSide}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Get Started</h2>
          <p style={styles.formSubtitle}>
            Join an existing room or create a new collaborative space
          </p>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Your Name</label>
            <input
              style={styles.input}
              placeholder="Enter your name..."
              value={username}
              onChange={(e) => setUsername(e.target.value.slice(0, 15))}
              onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
              onBlur={(e) => {
                e.target.style.borderColor = '#e9ecef';
                e.target.style.background = '#f8f9fa';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <form style={styles.form} onSubmit={handleJoinRoom}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Room ID</label>
              <input
                style={styles.input}
                placeholder="Enter room ID to join..."
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.background = '#f8f9fa';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
            <button 
              type="submit" 
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Join Room
            </button>
          </form>

          <div style={styles.divider}>
            <div style={styles.dividerLine}></div>
            <span style={styles.dividerText}>or</span>
            <div style={styles.dividerLine}></div>
          </div>

          <button 
            style={{...styles.button, ...styles.buttonSecondary}}
            onClick={handleCreateRoom}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#000000';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#000000';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Create New Room
          </button>
        </div>
        
      </div>
      
      <style jsx>{`
        @keyframes radar {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes typewriter {
          0% { width: 0; }
          50% { width: 100%; }
          100% { width: 100%; }
        }
        @keyframes blink {
          0%, 50% { border-color: rgba(255, 255, 255, 0.7); }
          51%, 100% { border-color: transparent; }
        }
        @keyframes drawPath {
          0%, 20% { stroke-dashoffset: 1000; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -1000; }
        }
        
        @keyframes drawPath2 {
          0%, 20% { stroke-dashoffset: 800; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -800; }
        }
        
        @keyframes drawCircle {
          0%, 20% { stroke-dashoffset: 188; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -188; }
        }
        
        @keyframes drawRect {
          0%, 20% { stroke-dashoffset: 280; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -280; }
        }
        
        @keyframes floatDot {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(20px, -30px) scale(1.5); opacity: 0.6; }
          50% { transform: translate(-10px, -20px) scale(0.8); opacity: 0.4; }
          75% { transform: translate(15px, 10px) scale(1.2); opacity: 0.5; }
        }
        
        @keyframes floatDot2 {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          33% { transform: translate(-25px, 20px) scale(1.3); opacity: 0.5; }
          66% { transform: translate(30px, -15px) scale(0.9); opacity: 0.3; }
        }
        
        @keyframes moveCursor {
          0% { top: 30%; left: 20%; opacity: 0; }
          10% { opacity: 0.4; }
          25% { top: 25%; left: 35%; }
          50% { top: 45%; left: 60%; }
          75% { top: 35%; left: 25%; }
          90% { opacity: 0.4; }
          100% { top: 30%; left: 20%; opacity: 0; }
        }
        
        @keyframes moveCursor2 {
          0% { top: 50%; left: 80%; opacity: 0; }
          10% { opacity: 0.3; }
          25% { top: 30%; left: 60%; }
          50% { top: 70%; left: 30%; }
          75% { top: 20%; left: 70%; }
          90% { opacity: 0.3; }
          100% { top: 50%; left: 80%; opacity: 0; }
        }
        
        @keyframes moveCursor3 {
          0% { top: 80%; left: 40%; opacity: 0; }
          10% { opacity: 0.2; }
          30% { top: 40%; left: 80%; }
          60% { top: 20%; left: 20%; }
          80% { top: 60%; left: 60%; }
          90% { opacity: 0.2; }
          100% { top: 80%; left: 40%; opacity: 0; }
        }
        
        @keyframes drawTriangle {
          0%, 20% { stroke-dashoffset: 160; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -160; }
        }
        
        @keyframes drawZigzag {
          0%, 20% { stroke-dashoffset: 100; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -100; }
        }
        
        @keyframes drawArrow {
          0%, 20% { stroke-dashoffset: 80; }
          50%, 80% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -80; }
        }
        
        @media (max-width: 768px) {
          .container {
            flex-direction: column !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;