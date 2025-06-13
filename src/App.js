import React, { useState } from 'react';
import AssessmentForm from './components/AssessmentForm';
import ResultDisplay from './components/ResultDisplay';

function App() {
  const [result, setResult] = useState(null); 
  
  const handleFormSubmit = (data) => {
    const fullAnswers = {
      ...data.answers,
      name: data.name,
      department: data.department,
      email: data.email,
    };
    setResult({ answers: fullAnswers });
  };
  
  return (
    <>
      {/* Bootstrap */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(-10px) rotate(-1deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
        
        @keyframes slideIn {
          0% { transform: translateX(-100%); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(30, 60, 114, 0.3); }
          50% { box-shadow: 0 0 40px rgba(42, 82, 152, 0.6), 0 0 60px rgba(30, 60, 114, 0.3); }
        }
        
        .gradient-background {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          min-height: 100vh;
          padding: 20px 0;
          position: relative;
          overflow: hidden;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          25% { background-position: 100% 50%; }
          50% { background-position: 100% 100%; }
          75% { background-position: 0% 100%; }
          100% { background-position: 0% 50%; }
        }
        
        .gradient-background::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
        }
        
        .floating-shapes {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          animation: float 6s ease-in-out infinite;
        }
        
        .shape:nth-child(1) {
          width: 100px;
          height: 100px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.3), rgba(118, 75, 162, 0.3));
        }
        
        .shape:nth-child(2) {
          width: 150px;
          height: 150px;
          top: 60%;
          right: 15%;
          animation-delay: -2s;
          background: linear-gradient(135deg, rgba(245, 87, 108, 0.3), rgba(240, 147, 251, 0.3));
        }
        
        .shape:nth-child(3) {
          width: 80px;
          height: 80px;
          bottom: 20%;
          left: 20%;
          animation-delay: -4s;
          background: linear-gradient(135deg, rgba(79, 172, 254, 0.3), rgba(0, 242, 254, 0.3));
        }
        
        .shape:nth-child(4) {
          width: 120px;
          height: 120px;
          top: 30%;
          right: 30%;
          animation-delay: -1s;
          background: linear-gradient(135deg, rgba(255, 183, 77, 0.3), rgba(255, 119, 198, 0.3));
        }
        
        .shape:nth-child(5) {
          width: 60px;
          height: 60px;
          top: 70%;
          left: 60%;
          animation-delay: -3s;
          background: linear-gradient(135deg, rgba(17, 205, 239, 0.3), rgba(17, 160, 239, 0.3));
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
          position: relative;
          z-index: 10;
          animation: slideIn 0.8s ease-out, glow 4s ease-in-out infinite;
          border-radius: 25px !important;
        }
        
        .glass-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2, #f093fb, #f5576c, #4facfe);
          background-size: 300% 100%;
          animation: gradientShift 3s ease infinite;
          border-radius: 25px 25px 0 0;
        }
        
        .title-underline {
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          margin: 0 auto;
          border-radius: 2px;
          animation: pulse 2s ease-in-out infinite;
        }
        
        .text-primary-custom {
          color: #1e3c72 !important;
          text-shadow: 0 2px 4px rgba(30, 60, 114, 0.1);
        }
        
        .content-wrapper {
          position: relative;
          z-index: 10;
        }
        
        /* Particle effect */
        .particles {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
        }
        
        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(255, 255, 255, 0.6);
          border-radius: 50%;
          animation: particleFloat 8s linear infinite;
        }
        
        @keyframes particleFloat {
          0% {
            transform: translateY(100vh) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(100px);
            opacity: 0;
          }
        }
        
        .particle:nth-child(1) { left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { left: 20%; animation-delay: -1s; }
        .particle:nth-child(3) { left: 30%; animation-delay: -2s; }
        .particle:nth-child(4) { left: 40%; animation-delay: -3s; }
        .particle:nth-child(5) { left: 50%; animation-delay: -4s; }
        .particle:nth-child(6) { left: 60%; animation-delay: -5s; }
        .particle:nth-child(7) { left: 70%; animation-delay: -6s; }
        .particle:nth-child(8) { left: 80%; animation-delay: -7s; }
        .particle:nth-child(9) { left: 90%; animation-delay: -8s; }
        
        /* Marketing hover effects */
        .glass-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.3);
          transition: all 0.3s ease;
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .shape {
            display: none;
          }
          
          .gradient-background {
            padding: 10px 0;
          }
          
          .glass-card {
            margin: 10px;
          }
        }
      `}</style>
      
      <div className="App gradient-background">
        {/* Floating Shapes */}
        <div className="floating-shapes">
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
          <div className="shape"></div>
        </div>
        
        {/* Floating Particles */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="content-wrapper">
          {!result ? (
            <AssessmentForm onSubmit={handleFormSubmit} />
          ) : (
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-10">
                  <div className="glass-card rounded-4 p-5">
                    <ResultDisplay
                      answers={result.answers}
                      email={result.answers.email}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;