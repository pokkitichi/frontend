import questions from '../data/questions';
import React, { useState } from 'react';

const AssessmentForm = ({ onSubmit = (data) => console.log('Form submitted:', data) }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');  // เพิ่ม state สำหรับ error
  const [answers, setAnswers] = useState({});

  // ฟังก์ชันตรวจสอบรูปแบบอีเมล
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

  return (
    <>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      
      {/* Custom Styles */}
      <style>{`
        /* (เดิมตามโค้ดของคุณ) */
      `}</style>

      <div className="gradient-background">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 col-md-10">
              <form className="glass-card rounded-4 p-5" onSubmit={handleSubmit}>
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

                {/* Step 0: Personal Information */}
                {step === 0 && (
                  <div className="slide-in">
                    <h4 className="text-primary-custom mb-4">ข้อมูลส่วนตัว</h4>
                    
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label fw-semibold">ชื่อ-นามสกุล</label>
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
                      <label htmlFor="department" className="form-label fw-semibold">หน่วยงาน</label>
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
                      <label htmlFor="email" className="form-label fw-semibold">อีเมล</label>
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
                  <div className="slide-in">
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
                      ย้อนกลับ
                    </button>
                  )}

                  {step < questions.length && (
                    <button
                      type="button"
                      className={`btn btn-primary-custom btn-lg rounded-pill px-4 ms-auto ${!isStepComplete() ? 'disabled' : ''}`}
                      onClick={handleNext}
                      disabled={!isStepComplete()}
                    >
                      ถัดไป
                    </button>
                  )}

                  {step === questions.length && (
                    <button
                      type="submit"
                      className={`btn btn-success-custom btn-lg rounded-pill px-4 ms-auto ${!isStepComplete() ? 'disabled' : ''}`}
                      disabled={!isStepComplete()}
                    >
                      ส่งแบบสอบถาม
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
