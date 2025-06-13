import React, { useEffect, useRef, useState } from 'react';
import questions from '../data/questions';
import Chart from 'chart.js/auto';

function ResultDisplay({ answers = {}, email }) {
  const radarRef = useRef(null);
  const barRef = useRef(null);
  const radarChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const hasSentRef = useRef(false); // ✅ ใช้สำหรับกันไม่ให้ส่งซ้ำ

  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) return;

    const labels = questions.map((q, index) => `${index + 1}: ${q.title}`);
    const scores = questions.map((q, mainIndex) => {
      let sum = 0;
      q.subQuestions.forEach((_, subIndex) => {
        const key = `${mainIndex}-${subIndex}`;
        const value = parseInt(answers[key], 10);
        if (!isNaN(value)) sum += value;
      });
      return parseFloat((sum / 2.5).toFixed(2)); // สมมุติว่าแต่ละหมวดมี 2 คำถาม
    });

    const sortedIndices = scores
      .map((score, i) => ({ score, i }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(o => o.i);

    if (radarChartRef.current) radarChartRef.current.destroy();
    if (barChartRef.current) barChartRef.current.destroy();

    radarChartRef.current = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'คะแนน',
          data: scores,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: { stepSize: 2 }
          }
        }
      }
    });

    barChartRef.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'คะแนน',
          data: scores,
          backgroundColor: scores.map((_, i) =>
            sortedIndices.includes(i) ? 'rgba(255, 99, 132, 0.7)' : 'rgba(0, 123, 255, 0.7)'
          )
        }]
      },
      options: {
        responsive: true,
        indexAxis: 'y',
        scales: {
          x: {
            suggestedMin: 0,
            suggestedMax: 10
          }
        }
      }
    });
  }, [answers]);

  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0 || !email || hasSentRef.current) return;

    hasSentRef.current = true; // ✅ ป้องกันไม่ให้รันซ้ำ

    const sendPdfToEmail = async () => {
      setSending(true);
      setSendResult(null);
      try {
        const res = await fetch('https://backend-ngel.onrender.com/send-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            answers,
            questions,
            name: answers.name,
            department: answers.department,
          }),
        });
        const data = await res.json();
        setSendResult(res.ok ? '✅ ส่งอีเมลเรียบร้อยแล้ว' : '❌ ส่งอีเมลไม่สำเร็จ: ' + data.message);
      } catch (error) {
        setSendResult('❌ เกิดข้อผิดพลาด: ' + error.message);
      }
      setSending(false);
    };

    const sendToGoogleSheet = async () => {
      try {
        await fetch('https://script.google.com/macros/s/AKfycbx9uzHWhlLah-0be-1a09S_Ozg79k8CB0dimyxJc6g1eYPR916cWmqz_rBC8wvf8HIY/exec', {
          method: 'POST',
          mode: 'no-cors', // ✅ ป้องกัน CORS
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers }),
        });
        console.log('✅ ส่งข้อมูลไป Google Sheets แล้ว (no-cors)');
      } catch (error) {
        console.error('❌ ส่งข้อมูล Google Sheets error:', error);
      }
    };

    sendPdfToEmail();
    sendToGoogleSheet();
  }, [answers, email]);

  if (!answers || Object.keys(answers).length === 0) {
    return <div className="text-center mt-5">ยังไม่มีคำตอบ กรุณาทำแบบสอบถามให้ครบก่อนส่ง</div>;
  }

  return (
    <>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />
      <div className="container py-4">
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">ผลลัพธ์แบบประเมิน</h2>
          <div style={{ width: '80px', height: '4px', background: '#1e3c72', margin: '0 auto' }}></div>
          {sending && <p className="text-muted">กำลังส่งอีเมล...</p>}
          {sendResult && <p>{sendResult}</p>}
        </div>

        <div className="mb-5">
          <h5 className="text-center mb-3">12 Dimensions of Life Mastery (Radar Chart)</h5>
          <canvas ref={radarRef}></canvas>
        </div>

        <div>
          <h5 className="text-center mb-3">12 Dimensions of Life Mastery (Bar Chart)</h5>
          <canvas ref={barRef}></canvas>
        </div>
      </div>
    </>
  );
}

export default ResultDisplay;
