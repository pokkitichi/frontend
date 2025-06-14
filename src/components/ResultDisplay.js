import React, { useEffect, useRef, useState } from 'react';
import questions from '../data/questions';
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';

Chart.register(ChartDataLabels);

function ResultDisplay({ answers = {}, email }) {
  const radarRef = useRef(null);
  const barRef = useRef(null);
  const radarChartRef = useRef(null);
  const barChartRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);
  const hasSentRef = useRef(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!answers || Object.keys(answers).length === 0) return;

    const maxLabelLength = 15;

    const cleanTitle = (text) => {
      const prefix = 'Life Assessment Rubric – ';
      return text.startsWith(prefix) ? text.slice(prefix.length) : text;
    };

    const shortenText = (text) =>
      text.length > maxLabelLength ? text.slice(0, maxLabelLength) + '...' : text;

    const rawLabels = questions.map((q) => cleanTitle(q.title));
    const shortLabels = rawLabels.map(shortenText);

    const scores = questions.map((q, mainIndex) => {
      let sum = 0;
      q.subQuestions.forEach((_, subIndex) => {
        const key = `${mainIndex}-${subIndex}`;
        const value = parseInt(answers[key], 10);
        if (!isNaN(value)) sum += value;
      });
      return parseFloat((sum / 2.5).toFixed(2));
    });

    const averageScore = parseFloat(
      (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1)
    );

    const sortedIndices = scores
      .map((score, i) => ({ score, i }))
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map((o) => o.i);

    if (radarChartRef.current) radarChartRef.current.destroy();
    if (barChartRef.current) barChartRef.current.destroy();

    // Radar Chart - no datalabels
    radarChartRef.current = new Chart(radarRef.current, {
      type: 'radar',
      data: {
        labels: shortLabels,
        datasets: [{
          data: scores,
          fill: true,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 10 },
        scales: {
          r: {
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: {
              stepSize: 2,
              display: false, // ❌ ซ่อนตัวเลขรอบวง
              font: { size: 10 },
            },
            pointLabels: {
              font: { size: 10 },
              callback: (_, index) => shortLabels[index],
            },
          },
        },
        plugins: {
          tooltip: { enabled: false }, // ❌ ปิด tooltip ตอน hover
          legend: { display: false },
          datalabels: { display: false }, // ❌ ปิด datalabels (สำคัญ)
        },
      },
      plugins: [], // ✅ ไม่ใส่ ChartDataLabels ที่นี่
    });


    // Bar Chart - show datalabels
    barChartRef.current = new Chart(barRef.current, {
      type: 'bar',
      data: {
        labels: shortLabels,
        datasets: [{
          label: '',
          data: scores,
          backgroundColor: scores.map((_, i) =>
            sortedIndices.includes(i) ? 'rgba(255, 99, 132, 0.7)' : 'rgba(0, 123, 255, 0.7)'
          ),
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        layout: { padding: 10 },
        scales: {
          x: {
            suggestedMin: 0,
            suggestedMax: 10,
            ticks: { stepSize: 1, font: { size: 10 } },
          },
          y: {
            ticks: {
              font: { size: 10 },
              callback: (_, index) => shortLabels[index],
            },
          },
        },
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: `Average Score: ${averageScore.toFixed(1)}`,
            font: { size: 14, weight: 'bold' },
            color: '#333',
            padding: { bottom: 10 },
          },
          tooltip: {
            callbacks: {
              title: (context) => rawLabels[context[0].dataIndex],
            },
          },
          datalabels: {
            display: true,
            align: 'end',
            anchor: 'end',
            color: '#000',
            font: { size: 10 },
            formatter: (val) => val,
          },
        },
      },
      plugins: [ChartDataLabels],
    });
  }, [answers, isMobile]);

  useEffect(() => {
    if (!answers || !email || hasSentRef.current) return;

    hasSentRef.current = true;
    const sendPdfToEmail = async () => {
      setSending(true);
      setSendResult(null);
      try {
        const res = await fetch('https://backend-8tpc.onrender.com/send-pdf', {
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
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
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
      <div className="container py-4" style={{ maxWidth: '1200px' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold mb-2">ผลลัพธ์แบบประเมิน</h2>
          <div style={{ width: '80px', height: '4px', background: '#1e3c72', margin: '0 auto' }}></div>
          {sending && <p className="text-muted mt-2">กำลังส่งอีเมล...</p>}
          {sendResult && <p className="mt-2">{sendResult}</p>}
        </div>

        <div className="mb-5">
          <h5 className="text-center mb-3">12 Dimensions of Life Mastery (Radar Chart)</h5>
          <div className="d-flex justify-content-center mb-4">
            <div style={{ width: isMobile ? '100%' : '600px', height: isMobile ? '300px' : '400px' }}>
              <canvas ref={radarRef} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>

          <h5 className="text-center mb-3">12 Dimensions of Life Mastery (Bar Chart)</h5>
          <div className="d-flex justify-content-center">
            <div style={{ width: '100%', maxWidth: '700px', height: '450px' }}>
              <canvas ref={barRef} style={{ width: '100%', height: '100%' }} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultDisplay;
