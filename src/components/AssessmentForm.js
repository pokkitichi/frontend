import React, { useState } from 'react';
import questions from '../data/questions';


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

  const scrollToTopSmooth = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNext = () => {
    if (!isStepComplete()) {
      alert('กรุณากรอกข้อมูลให้ครบทุกข้อก่อน');
      return;
    }
    if (step < questions.length) {
      setStep(step + 1);
      setTimeout(scrollToTopSmooth, 100);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
      setTimeout(scrollToTopSmooth, 100);
    }
  };

  const handleSubmit = () => {
    if (!isStepComplete()) {
      alert('กรุณากรอกข้อมูลให้ครบทุกข้อก่อนส่งแบบสอบถาม');
      return;
    }
    onSubmit({ name, department, email, answers });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '1.5rem 0',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 20px 0 rgba(31, 38, 135, 0.3)',
          backdropFilter: 'blur(8px)',
          borderRadius: '1rem',
          padding: '1.5rem'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h2 style={{ 
              color: '#4b0082', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              fontSize: '1.4rem'
            }}>
              12 Dimensions of Life Mastery
            </h2>
            <div style={{
              width: '60px',
              height: '3px',
              backgroundColor: '#4b0082',
              margin: '0 auto',
              borderRadius: '2px'
            }}></div>
          </div>

          {/* Progress Bar */}
          <div style={{
            height: '10px',
            backgroundColor: '#e0e0e0',
            borderRadius: '20px',
            marginBottom: '1rem',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${(step / (questions.length + 1)) * 100}%`,
              backgroundColor: '#4b0082',
              borderRadius: '20px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>

          {/* Step 0: Personal Info */}
          {step === 0 && (
            <div>
              <h4 style={{ 
                color: '#4b0082', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                ข้อมูลส่วนตัว
              </h4>
              
              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '0.4rem'
                }}>
                  <i className="bi bi-person-circle" style={{ marginRight: '0.25rem' }}></i>
                  ชื่อ-นามสกุล*
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    border: '1px solid #ced4da',
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4b0082'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '0.4rem'
                }}>
                  <i className="bi bi-building" style={{ marginRight: '0.25rem' }}></i>
                  หน่วยงาน*
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    border: '1px solid #ced4da',
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4b0082'}
                  onBlur={(e) => e.target.style.borderColor = '#ced4da'}
                />
              </div>

              <div style={{ marginBottom: '0.8rem' }}>
                <label style={{ 
                  display: 'block',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  marginBottom: '0.4rem'
                }}>
                  <i className="bi bi-envelope-at-fill" style={{ marginRight: '0.25rem' }}></i>
                  อีเมล*
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    border: `1px solid ${emailError ? '#dc3545' : '#ced4da'}`,
                    borderRadius: '0.5rem',
                    outline: 'none'
                  }}
                  onFocus={(e) => e.target.style.borderColor = emailError ? '#dc3545' : '#4b0082'}
                  onBlur={(e) => e.target.style.borderColor = emailError ? '#dc3545' : '#ced4da'}
                />
                {emailError && (
                  <div style={{ 
                    color: '#dc3545', 
                    fontSize: '0.75rem', 
                    marginTop: '0.25rem' 
                  }}>
                    {emailError}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question Steps */}
          {step > 0 && step <= questions.length && (
            <div>
              <h4 style={{ 
                color: '#4b0082', 
                marginBottom: '1rem',
                fontSize: '1.1rem'
              }}>
                หัวข้อ {step}: {questions[step - 1].title}
              </h4>
              
              {questions[step - 1].subQuestions.map((subQ, subIndex) => (
                <div key={subIndex} style={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '0.5rem',
                  padding: '0.8rem',
                  marginBottom: '0.8rem'
                }}>
                  <label style={{ 
                    display: 'block',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#4b0082',
                    marginBottom: '0.5rem'
                  }}>
                    {subQ.question}
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {subQ.options.map((optionText, optionIndex) => (
                      <label key={optionIndex} style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        lineHeight: '1.3',
                        paddingLeft: '1.2rem',
                        position: 'relative'
                      }}>
                        <input
                          type="radio"
                          name={`q-${step - 1}-${subIndex}`}
                          value={optionIndex}
                          checked={answers[`${step - 1}-${subIndex}`] === optionIndex}
                          onChange={e => handleAnswerChange(step - 1, subIndex, e.target.value)}
                          style={{
                            position: 'absolute',
                            left: '0',
                            marginTop: '0.1rem'
                          }}
                        />
                        {optionText}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '1rem',
            gap: '0.5rem'
          }}>
            {step > 0 && (
              <button
                type="button"
                onClick={handleBack}
                style={{
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: '1px solid #6c757d',
                  backgroundColor: 'transparent',
                  color: '#6c757d',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#6c757d';
                  e.target.style.color = 'white';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#6c757d';
                }}
              >
                <i className="bi bi-arrow-left" style={{ marginRight: '0.25rem' }}></i>
                ย้อนกลับ
              </button>
            )}

            {step < questions.length && (
              <button
                type="button"
                onClick={handleNext}
                disabled={!isStepComplete()}
                style={{
                  marginLeft: 'auto',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: 'none',
                  background: isStepComplete() 
                    ? 'linear-gradient(to right, #6a11cb, #2575fc)' 
                    : '#ccc',
                  color: isStepComplete() ? 'white' : '#666',
                  borderRadius: '20px',
                  cursor: isStepComplete() ? 'pointer' : 'not-allowed',
                  opacity: isStepComplete() ? 1 : 0.65,
                  boxShadow: isStepComplete() ? '0 3px 12px rgba(106, 17, 203, 0.3)' : 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (isStepComplete()) {
                    e.target.style.background = 'linear-gradient(to right, #5b0eb2, #1c63e2)';
                    e.target.style.boxShadow = '0 4px 15px rgba(106, 17, 203, 0.5)';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (isStepComplete()) {
                    e.target.style.background = 'linear-gradient(to right, #6a11cb, #2575fc)';
                    e.target.style.boxShadow = '0 3px 12px rgba(106, 17, 203, 0.3)';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                ถัดไป <i className="bi bi-arrow-right" style={{ marginLeft: '0.25rem' }}></i>
              </button>
            )}

            {step === questions.length && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isStepComplete()}
                style={{
                  marginLeft: 'auto',
                  padding: '0.4rem 0.9rem',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  border: 'none',
                  backgroundColor: isStepComplete() ? '#2e7d32' : '#ccc',
                  color: isStepComplete() ? 'white' : '#666',
                  borderRadius: '20px',
                  cursor: isStepComplete() ? 'pointer' : 'not-allowed',
                  opacity: isStepComplete() ? 1 : 0.65,
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  if (isStepComplete()) {
                    e.target.style.backgroundColor = '#256625';
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (isStepComplete()) {
                    e.target.style.backgroundColor = '#2e7d32';
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                <i className="bi bi-send-check-fill" style={{ marginRight: '0.25rem' }}></i>
                ส่งแบบสอบถาม
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;