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

const IndexPage = () => {
  const [answers, setAnswers] = useState<number[]>(Array(15).fill(0));
  const [result, setResult] = useState("");

  const handleChange = (index: number, value: number) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const calculateResult = async () => {
    const totalScore = answers.reduce((sum, val) => sum + val, 0);

    let riskLevel = "สุขภาวะจิตใจดี";
    if (totalScore >= 35) riskLevel = "กลุ่มเสี่ยงสูง";
    else if (totalScore >= 25) riskLevel = "กลุ่มเสี่ยงปานกลาง";
    else if (totalScore >= 15) riskLevel = "กลุ่มใกล้เสี่ยง";

    const flagged = answers[12] === 3 || answers[13] === 3;

  try {
    const res = await axios.post("https://capstoneproject-psychology-foxbith.onrender.com/assessment", {
      answers,
      totalScore,
      riskLevel,
      flagged,
    });

    console.log("ส่งข้อมูลสำเร็จ ✅", res.data);
  } catch (error) {
    console.error("ส่งข้อมูลไม่สำเร็จ ❌", error);
  }

  setResult(`คะแนนรวม: ${totalScore} → ${riskLevel}`);
};

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-blue-600">
        แบบประเมินสุขภาวะทางจิตใจ (15 ข้อ)
      </h1>

      {questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-medium mb-2">{i + 1}. {q}</p>
          <div className="flex gap-4">
            {[0, 1, 2, 3].map((val) => (
              <label key={val} className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`q${i}`}
                  value={val}
                  checked={answers[i] === val}
                  onChange={() => handleChange(i, val)}
                />
                {val} = {["ไม่เคยเลย", "บางครั้ง", "บ่อยครั้ง", "เกือบทุกวัน"][val]}
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        className="mt-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded"
        onClick={calculateResult}
      >
        ส่งแบบประเมิน
      </button>

      {result && (
        <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded">
          <p className="text-lg font-semibold">{result}</p>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
