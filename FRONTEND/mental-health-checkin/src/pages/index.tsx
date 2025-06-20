import { useState } from "react";
import axios from "axios";

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

const choices = ["ไม่เคยเลย (0)", "บางครั้ง (1)", "บ่อยครั้ง (2)", "เกือบทุกวัน (3)"];

type ResultType = {
  totalScore: number;
  riskLevel: string;
  flagged: boolean;
} | null;

export default function MentalHealthForm() {
  const [answers, setAnswers] = useState(Array(questions.length).fill(0));
  const [submitted, setSubmitted] = useState(false);
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
    if (totalScore <= 14) riskLevel = "สุขภาวะจิตใจดี";
    else if (totalScore <= 24) riskLevel = "เริ่มมีความเครียด/หมดไฟ";
    else if (totalScore <= 34) riskLevel = "แนวโน้มปัญหาสุขภาพจิตปานกลาง";
    else riskLevel = "ความเสี่ยงสูง ควรได้รับการดูแลทันที";

    const flagged = answers[12] === 3 || answers[13] === 3;

    await axios.post("https://capstoneproject-psychology-foxbith.onrender.com/assessment", {
      answers,
      totalScore,
      riskLevel,
      flagged,
    });

    setResult({ totalScore, riskLevel, flagged });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 to-gray-950 py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-3xl p-10">
        <h1 className="text-3xl font-bold text-center text-black-600 mb-6">
          การพัฒนาเว็บแอปพลิเคชันเพื่อการติดตามสุขภาวะทางจิตใจพนักงาน
บริษัท ฟอกซ์บิธ จํากัด
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((q, qIndex) => (
            <div key={qIndex} className="bg-orange-50 rounded-xl p-4 shadow">
              <p className="font-medium text-gray-700 mb-2">
                {qIndex + 1}. {q}
              </p>
              <div className="flex gap-4">
                {choices.map((choice, cIndex) => (
                  <label key={cIndex} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`question-${qIndex}`}
                      value={cIndex}
                      checked={answers[qIndex] === cIndex}
                      onChange={() => handleChange(qIndex, cIndex)}
                      className="accent-orange-600"
                    />
                    <span className="text-sm text-gray-600">{choice}</span>
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

        {submitted && result && (
          <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4 rounded-xl">
            <h2 className="text-lg font-bold text-green-700 mb-1">ผลการประเมิน</h2>
            <p>คะแนนรวม: <strong>{result.totalScore}</strong></p>
            <p>ระดับสุขภาวะจิตใจ: <strong>{result.riskLevel}</strong></p>
            {result.flagged && <p className="text-red-500 mt-2">⚠️ คำตอบมีความเสี่ยงสูง ควรพิจารณาอย่างใกล้ชิด</p>}
          </div>
        )}
      </div>
    </div>
  );
}
