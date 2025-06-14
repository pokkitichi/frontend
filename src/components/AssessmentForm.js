import questions from '../data/questions';
import React, { useState, useEffect } from 'react';

const AssessmentForm = ({ onSubmit = (data) => console.log('Form submitted:', data) }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [answers, setAnswers] = useState({});

  const validateEmail = (value) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(value.toLowerCase())) {
      setEmailError('กรุณากรอกอีเมลในรูปแบบ user@example.com');
    } else {
      setEmailError('');
    }
  };

  const handleAnswerChange = (mainIndex, subIndex, value) => {
    const key = `${mainIndex}-${subIndex}`;
    setAnswers(prev => ({ ...prev, [key]: parseInt(value) }));
  };

  const isStepComplete = () => {
    if (step === 0) {
      return (
        name.trim() !== '' &&
        department.trim() !== '' &&
        email.trim() !== '' &&
        emailError === ''
      );
    } else {
      const currentQuestion = questions[step - 1];
      if (!currentQuestion) return false;

      return currentQuestion.subQuestions.every((_, idx) =>
        answers.hasOwnProperty(`${step - 1}-${idx}`)
      );
    }
  };

  const handleNext = () => {
    if (!isStepComplete()) {
      alert('กรุณากรอกข้อมูลให้ครบทุกข้อก่อน');
      return;
    }
    if (step < questions.length) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isStepComplete()) {
      alert('กรุณากรอกข้อมูลให้ครบทุกข้อก่อนส่งแบบสอบถาม');
      return;
    }
    onSubmit({ name, department, email, answers });
  };

  // Auto scroll to top on step change
  useEffect(() => {
    requestAnimationFrame(() => {
      const topElement = document.getElementById('form-top');
      if (topElement) {
        topElement.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }, [step]);

  return (
    <>
      {/* Bootstrap Icons */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
      />

      {/* Styles */}
      <style>{`
        .gradient-background {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 3rem 0;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 1rem;
        }

        .text-primary-custom {
          color: #4b0082;
        }

        .title-underline {
          width: 80px;
          height: 4px;
          background-color: #4b0082;
          margin: 0 auto;
        }

        .progress-custom {
          height: 14px;
          background-color: #e0e0e0;
        }

        .progress-bar {
          background-color: #4b0082;
        }

        .question-card {
          background-color: #f8f9fa;
          border: 1px solid #ddd;
        }

        .btn-primary-custom {
          font-weight: 600;
          color: white;
          border: none;
        }

        .btn-primary-custom:enabled {
          background: linear-gradient(to right, #6a11cb, #2575fc);
          border-color: transparent;
          color: white;
          box-shadow: 0 4px 15px rgba(106, 17, 203, 0.4);
          transition: all 0.3s ease-in-out;
        }

        .btn-primary-custom:enabled:hover {
          background: linear-gradient(to right, #5b0eb2, #1c63e2);
          box-shadow: 0 6px 18px rgba(106, 17, 203, 0.6);
        }

        .btn-primary-custom:disabled,
        .btn-primary-custom.disabled {
          background-color: #ccc !important;
          border-color: #ccc !important;
          color: #666 !important;
          opacity: 0.65;
          cursor: not-allowed;
          box-shadow: none;
        }

        .btn-success-custom {
          background-color: #2e7d32;
          border-color: #2e7d32;
          font-weight: 600;
        }

        .btn-success-custom:hover {
          background-color: #256625;
          border-color: #256625;
        }
      `}</style>

      <div className="gradient-background">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <form className="glass-card rounded-4 p-5" onSubmit={handleSubmit}>
                <div id="form-top" />
                
                {/* Header */}
                <div className="text-center mb-4">
                  <h2 className="text-primary-custom fw-bold mb-3">12 Dimensions of Life Mastery</h2>
                  <div className="title-underline rounded"></div>
                </div>

                {/* Progress Bar */}
                <div className="progress progress-custom rounded-pill mb-4">
                  <div 
                    className="progress-bar rounded-pill" 
                    role="progressbar" 
                    style={{ width: `${(step / (questions.length + 1)) * 100}%` }}
                    aria-valuenow={step} 
                    aria-valuemin="0" 
                    aria-valuemax={questions.length + 1}
                  ></div>
                </div>

                {/* Step 0: Personal Info */}
                {step === 0 && (
                  <div>
                    <h4 className="text-primary-custom mb-4">ข้อมูลส่วนตัว</h4>
                    
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">
                        <i className="bi bi-person-circle me-2"></i>ชื่อ-นามสกุล*
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="department" className="form-label fw-semibold">
                        <i className="bi bi-building me-2"></i>หน่วยงาน*
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-3"
                        id="department"
                        value={department}
                        onChange={e => setDepartment(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="form-label fw-semibold">
                        <i className="bi bi-envelope-at-fill me-2"></i>อีเมล*
                      </label>
                      <input
                        type="email"
                        className={`form-control form-control-lg rounded-3 ${emailError ? 'is-invalid' : ''}`}
                        id="email"
                        value={email}
                        onChange={e => {
                          setEmail(e.target.value);
                          validateEmail(e.target.value);
                        }}
                        required
                      />
                      {emailError && <div className="invalid-feedback">{emailError}</div>}
                    </div>
                  </div>
                )}

                {/* Question Steps */}
                {step > 0 && step <= questions.length && (
                  <div>
                    <h4 className="text-primary-custom mb-4">
                      หัวข้อ {step}: {questions[step - 1].title}
                    </h4>
                    
                    {questions[step - 1].subQuestions.map((subQ, subIndex) => (
                      <div key={subIndex} className="question-card rounded-3 p-4 mb-4">
                        <label className="form-label fw-semibold text-primary-custom mb-3">
                          {subQ.question}
                        </label>
                        <div className="d-flex flex-column gap-2 ms-3">
                          {subQ.options.map((optionText, optionIndex) => (
                            <div className="form-check" key={optionIndex}>
                              <input
                                className="form-check-input"
                                type="radio"
                                name={`q-${step - 1}-${subIndex}`}
                                id={`q-${step - 1}-${subIndex}-${optionIndex}`}
                                value={optionIndex}
                                checked={answers[`${step - 1}-${subIndex}`] === optionIndex}
                                onChange={e => handleAnswerChange(step - 1, subIndex, e.target.value)}
                                required
                              />
                              <label className="form-check-label" htmlFor={`q-${step - 1}-${subIndex}-${optionIndex}`}>
                                {optionText}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  {step > 0 && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary btn-lg rounded-pill px-4"
                      onClick={handleBack}
                    >
                      <i className="bi bi-arrow-left me-2"></i>ย้อนกลับ
                    </button>
                  )}

                  {step < questions.length && (
                    <button
                      type="button"
                      className="btn btn-primary-custom btn-lg rounded-pill px-4 ms-auto"
                      onClick={handleNext}
                      disabled={!isStepComplete()}
                    >
                      ถัดไป <i className="bi bi-arrow-right ms-2"></i>
                    </button>
                  )}

                  {step === questions.length && (
                    <button
                      type="submit"
                      className="btn btn-success-custom btn-lg rounded-pill px-4 ms-auto"
                      disabled={!isStepComplete()}
                    >
                      <i className="bi bi-send-check-fill me-2"></i>ส่งแบบสอบถาม
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssessmentForm;
