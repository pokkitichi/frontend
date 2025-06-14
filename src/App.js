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
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <style>{`
        body, html {
          margin: 0;
          padding: 0;
          font-family: sans-serif;
        }

        .gradient-background {
          background: #f0f0f0;
          min-height: 100vh;
          padding: 20px 0;
        }

        .glass-card {
          background: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 20px;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        .glass-card::before {
          content: none;
        }

        .title-underline {
          width: 80px;
          height: 4px;
          background: #667eea;
          margin: 0 auto;
          border-radius: 2px;
        }

        .text-primary-custom {
          color: #1e3c72 !important;
        }

        .content-wrapper {
          position: relative;
          z-index: 1;
        }

        @media screen and (max-width: 768px) {
          .gradient-background {
            min-height: 100dvh;
            overflow-y: auto;
          }

          input, textarea, select {
            font-size: 16px !important;
          }

          .glass-card {
            box-shadow: none;
            margin: 10px;
          }
        }
      `}</style>

      <div className="App gradient-background">
        <div className="content-wrapper">
          {!result ? (
            <AssessmentForm onSubmit={handleFormSubmit} />
          ) : (
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="glass-card p-4">
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
