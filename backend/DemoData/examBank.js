const demoExamBank = [
    { id: "00000001", type: "Single Choice", Question: "Demo Question：6 + 4 = ?", A: "9", B: "10", C: "11", D: "12", E: "", correctAnswer: "B", description: "Basic addition problem.", inCorrectCount: 0 },
    { id: "00000002", type: "Single Choice", Question: "Demo Question：15 - 7 = ?", A: "6", B: "7", C: "8", D: "9", E: "", correctAnswer: "C", description: "Basic subtraction problem.", inCorrectCount: 0 },
    { id: "00000003", type: "Single Choice", Question: "Demo Question：3 × 3 = ?", A: "6", B: "7", C: "9", D: "12", E: "", correctAnswer: "C", description: "Basic multiplication problem.", inCorrectCount: 0 },
    { id: "00000004", type: "Single Choice", Question: "Demo Question：20 ÷ 5 = ?", A: "2", B: "3", C: "4", D: "5", E: "", correctAnswer: "C", description: "Basic division problem.", inCorrectCount: 0 },
    { id: "00000005", type: "Single Choice", Question: "Demo Question：18 % 7 = ?", A: "1", B: "2", C: "3", D: "4", E: "", correctAnswer: "C", description: "Modulo operation.", inCorrectCount: 0 },
    { id: "00000006", type: "Multiple Choice", Question: "Demo Question：Which numbers are odd?", A: "1", B: "2", C: "3", D: "4", E: "5", correctAnswer: "ACE", description: "Odd numbers are not divisible by 2.", inCorrectCount: 0 },
    { id: "00000007", type: "Multiple Choice", Question: "Demo Question：Which of these numbers are prime?", A: "2", B: "6", C: "7", D: "9", E: "11", correctAnswer: "ACE", description: "Prime numbers have only two factors: 1 and themselves.", inCorrectCount: 0 },
    { id: "00000008", type: "Multiple Choice", Question: "Demo Question：Which numbers are multiples of 5?", A: "10", B: "12", C: "15", D: "17", E: "20", correctAnswer: "ACE", description: "Multiples of 5 end in 0 or 5.", inCorrectCount: 0 },
    { id: "00000009", type: "Multiple Choice", Question: "Demo Question：Which numbers are perfect squares?", A: "4", B: "8", C: "9", D: "12", E: "16", correctAnswer: "ACE", description: "Perfect squares are numbers like 4, 9, 16, etc.", inCorrectCount: 0 },
    { id: "00000010", type: "Multiple Choice", Question: "Demo Question：Which of these are factors of 12?", A: "2", B: "3", C: "5", D: "6", E: "9", correctAnswer: "ABD", description: "Factors of 12 divide evenly into 12.", inCorrectCount: 0 },
    { id: "00000011", type: "Filling Blank", Question: "Demo Question：√49 = __", A: "", B: "", C: "", D: "", E: "", correctAnswer: "7", description: "Square root of 49.", inCorrectCount: 0 },
    { id: "00000012", type: "Filling Blank", Question: "Demo Question：8 × 8 = __", A: "", B: "", C: "", D: "", E: "", correctAnswer: "64", description: "Multiplication of 8 by itself.", inCorrectCount: 0 },
    { id: "00000013", type: "Filling Blank", Question: "Demo Question：45 + 15 = __", A: "", B: "", C: "", D: "", E: "", correctAnswer: "60", description: "Basic addition.", inCorrectCount: 0 },
    { id: "00000014", type: "Filling Blank", Question: "Demo Question：81 ÷ 9 = __", A: "", B: "", C: "", D: "", E: "", correctAnswer: "9", description: "Division problem.", inCorrectCount: 0 },
    { id: "00000015", type: "Filling Blank", Question: "Demo Question：What is 3⁴?", A: "", B: "", C: "", D: "", E: "", correctAnswer: "81", description: "Exponentiation of 3 to the power of 4.", inCorrectCount: 0 },
    { id: "00000016", type: "Judgements", Question: "Demo Question：11 is a prime number.", A: "", B: "", C: "", D: "", E: "", correctAnswer: "True", description: "11 is only divisible by 1 and itself.", inCorrectCount: 0 },
    { id: "00000017", type: "Judgements", Question: "Demo Question：30 is an odd number.", A: "", B: "", C: "", D: "", E: "", correctAnswer: "False", description: "30 is even.", inCorrectCount: 0 },
    { id: "00000018", type: "Judgements", Question: "Demo Question：The product of two even numbers is always even.", A: "", B: "", C: "", D: "", E: "", correctAnswer: "True", description: "Even × Even = Even.", inCorrectCount: 0 },
    { id: "00000019", type: "Judgements", Question: "Demo Question：The number 1 is a prime number.", A: "", B: "", C: "", D: "", E: "", correctAnswer: "False", description: "1 has only one factor (itself), so it's not prime.", inCorrectCount: 0 },
    { id: "00000020", type: "Judgements", Question: "Demo Question：0 is neither positive nor negative.", A: "", B: "", C: "", D: "", E: "", correctAnswer: "True", description: "0 is neutral.", inCorrectCount: 0 }
];

module.exports = demoExamBank;