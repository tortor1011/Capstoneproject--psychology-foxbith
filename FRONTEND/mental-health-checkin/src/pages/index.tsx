'use client'
import { useState } from "react";
import axios from "axios";
import Navbar from "@/components/navbar";
import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";

const questions = [
  "ฉันรู้สึกตึงเครียดอยู่ตลอดเวลา",
  "ฉันรู้สึกว่าไม่สามารถที่จะเอาชนะความยากลำบากต่างๆได้",
  "ฉันรู้สึกเบื่อหน่าย หมดแรงจูงใจในการทำงาน",
  "ฉันรู้สึกว่าตนเองไม่มีคุณค่า หรือไร้ความสามารถ",
  "ฉันมีปัญหาในการนอน เช่น นอนไม่หลับ หลับๆ ตื่นๆ",
  "ฉันมีปัญหาในการมีสมาธิหรือจดจ่อกับงาน",
  "ฉันรู้สึกโกรธหรือหงุดหงิดง่ายกว่าปกติ",
  "ฉันรับรู้ว่างานของฉันไม่มีความหมายหรือไม่มีเป้าหมาย",
  "ฉันรู้สึกเครียดกับการจัดสมดุลระหว่างงานกับชีวิตส่วนตัว",
  "ฉันรู้สึกกดดันจากเวลาหรือปริมาณงานที่มากเกินไป",
  "ฉันรู้สึกว่าตนเองไม่สามารถควบคุมสิ่งต่างๆ ในชีวิตได้",
  "ฉันรู้สึกไม่อยากพบปะผู้คนหรือเพื่อนร่วมงาน",
  "ฉันมีความรู้สึกเศร้า หม่นหมอง หรือไม่มีความสุขส่วนใหญ่ของวัน",
  "ฉันคิดว่าหากไม่มีฉัน งานก็สามารถดำเนินต่อไปได้ดีเหมือนเดิม",
  "ฉันรู้สึกไม่อยากตื่นขึ้นมาทำงานในตอนเช้า",
];

const choices = ["ไม่เคยเลย (0)", "บางครั้ง (1)", "บ่อยครั้ง (2)", "เกือบทุกวัน (3)", "ทุกวัน(4)"];

type ResultType = {
  totalScore: number;
  riskLevel: string;
  flagged: boolean;
} | null;

export default function MentalHealthForm() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [result, setResult] = useState<ResultType>(null);

  const handleChange = (qIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[qIndex] = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const totalScore = answers.reduce((sum, val) => sum + val, 0);
    let riskLevel = "";
    if (totalScore <= 19) riskLevel = "สุขภาวะจิตใจดี";
    else if (totalScore <= 29) riskLevel = "เริ่มมีความเครียด/หมดไฟ";
    else if (totalScore <= 39) riskLevel = "แนวโน้มปัญหาสุขภาพจิตปานกลาง";
    else riskLevel = "ความเสี่ยงสูง ควรได้รับการดูแลทันที";

    const flagged = answers[12] === 4 || answers[13] === 4;

    await axios.post("https://capstoneproject-psychology-foxbith.onrender.com/assessment", {
      answers,
      totalScore,
      riskLevel,
      flagged,
    });

    setResult({ totalScore, riskLevel, flagged });
    setShowModal(true);
  };

  const [showModal, setShowModal] = useState(false);



  return (
    
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-gray-950 py-12 px-6 font-sans">
      <Navbar />
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-10 mt-70">
        <h1 className="text-3xl font-bold text-center text-black-600 mb-6">
          การพัฒนาเว็บแอปพลิเคชันเพื่อการติดตามสุขภาวะทางจิตใจพนักงาน บริษัท ฟอกซ์บิธ จํากัด
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-orange-50 rounded-2xl p-4 shadow">
              <p className="font-medium text-xl text-gray-700 mb-2 flex justify-center">
                {qIndex + 1}. {q}
              </p>
              <div className="flex gap-5 flex-wrap justify-center">
                {choices.map((choice, cIndex) => (
                  <label key={cIndex} className="flex items-center gap-3">
                    <input 
                      type="radio"
                      name={`question-${qIndex}`}
                      value={cIndex}
                      checked={answers[qIndex] === cIndex}
                      onChange={() => handleChange(qIndex, cIndex)}
                      className="accent-orange-600"
                    />
                    <span className="text-md text-gray-600">{choice}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="text-center">
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-full shadow-lg hover:bg-orange-950 transition"
            >
              ส่งแบบประเมิน
            </button>
          </div>
        </form>

        {showModal && (
          <div className="fixed inset-0 bg-gradient-to-br from-orange-500 to-gray-950 bg-opacity-90 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md">
              <h2 className="text-2xl font-semibold text-center text-orange-600 mb-4">ผลการประเมินสุขภาวะจิตใจ</h2>
              <p className="text-gray-800 mb-2"><strong>คะแนนรวม:</strong> {result?.totalScore} / 45</p>
              <p className="text-gray-800 mb-2"><strong>กลุ่มความเสี่ยง:</strong> {result?.riskLevel}</p>
              {result?.flagged && (
                <p className="text-red-500 font-semibold mt-2">⚠️ พบสัญญาณเสี่ยงซึมเศร้า ควรติดตามอย่างใกล้ชิด</p>
              )}
              <button
                onClick={() => setShowModal(false)}
                className="mt-6 w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-950 transition"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
