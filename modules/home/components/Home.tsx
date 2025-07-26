import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { socket } from "@/common/lib/socket";
import { useModal } from "@/common/recoil/modal";
import { useSetRoomId } from "@/common/recoil/room";
import NotFoundModal from "../modals/NotFound";
import Left from "./Left";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize(); // initial check
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);


  const styles = {
    container: {
      display: 'flex',
      flexDirection: (isMobile ? 'column' : 'row') as React.CSSProperties['flexDirection'],
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
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
  
  };

  return (
    <div style={styles.container}>
      {/* Left Side - Branding */}
      <Left/>

      {/* Right Side - Forms */}
      <div style={styles.rightSide}>
        <div style={styles.formContainer}>
          <h2 style={styles.formTitle}>Welcome to CoSketch</h2>

          <p style={styles.formSubtitle}>
            Join an existing room or create a new collaborative space
          </p>
           <div style={styles.inputGroup}>
              <label style={styles.label}>
                <span style={styles.labelIcon}>👤</span>
                Display Name
              </label>
              <input
                style={styles.input}
                placeholder="Enter your name..."
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 15))}
                onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e9ecef';
                  e.target.style.background = '#ffffff';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={styles.inputHelper}>
                {username.length}/15 characters
              </div>
            </div>

          <form style={styles.form} onSubmit={handleJoinRoom}>
             <div style={styles.inputGroup}>
                <label style={styles.label}>
                  <span style={styles.labelIcon}>🔑</span>
                  Room Code
                </label>
                <input
                  style={styles.input}
                  placeholder="Enter 6-digit room code..."
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  onFocus={(e) => Object.assign(e.target.style, styles.inputFocus)}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e9ecef';
                    e.target.style.background = '#ffffff';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div style={styles.inputHelper}>
                  Get the code from your team leader
                </div>
              </div>
            <button 
              type="submit" 
              style={styles.button}
            >
             <span style={styles.buttonIcon}>🚀</span>
                Join Collaboration
            </button>
          </form>

            <div style={styles.divider}>
              <div style={styles.dividerLine}></div>
              <span style={styles.dividerText}>New to CoSketch?</span>
              <div style={styles.dividerLine}></div>
            </div>

          <button 
            style={styles.button}
            onClick={handleCreateRoom}
          >
             <span style={styles.buttonIcon}>✨</span>
              Start New Room
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