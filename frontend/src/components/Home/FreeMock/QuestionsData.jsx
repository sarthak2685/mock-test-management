import q3 from "../../../assets/QuestionData/q3.png";
import q3o1 from "../../../assets/QuestionData/q3o1.png";
import q3o2 from "../../../assets/QuestionData/q3o2.png";
import q3o3 from "../../../assets/QuestionData/q3o3.png";
import q3o4 from "../../../assets/QuestionData/q3o4.png";
import q11 from "../../../assets/QuestionData/q11.png";
import q11o1 from "../../../assets/QuestionData/q11o1.jpg";
import q11o2 from "../../../assets/QuestionData/q11o2.jpg";
import q11o3 from "../../../assets/QuestionData/q11o3.jpg";
import q11o4 from "../../../assets/QuestionData/q11o4.jpg";
import q13 from "../../../assets/QuestionData/q13.png";
import q13o1 from "../../../assets/QuestionData/q13o1.png";
import q13o2 from "../../../assets/QuestionData/q13o2.png";
import q13o3 from "../../../assets/QuestionData/q13o3.png";
import q13o4 from "../../../assets/QuestionData/q13o4.png";
import q17 from "../../../assets/QuestionData/q17.png";
import q19 from "../../../assets/QuestionData/q19.png";
import q19o1 from "../../../assets/QuestionData/q19o1.png";
import q19o2 from "../../../assets/QuestionData/q19o2.png";
import q19o3 from "../../../assets/QuestionData/q19o3.png";
import q19o4 from "../../../assets/QuestionData/q19o4.png";
import q21 from "../../../assets/QuestionData/q21.png";
import q25 from "../../../assets/QuestionData/q25.png";
import q4 from "../../../assets/QuestionData/q4.png";
import q6 from "../../../assets/QuestionData/q6.png";
import q6o1 from "../../../assets/QuestionData/q6o1.png";
import q6o2 from "../../../assets/QuestionData/q6o2.png";
import q6o3 from "../../../assets/QuestionData/q6o3.png";
import q6o4 from "../../../assets/QuestionData/q6o4.png";
import q7 from "../../../assets/QuestionData/q7.png";
import q8 from "../../../assets/QuestionData/q8.png";
import q8o1 from "../../../assets/QuestionData/q8o1.png";
import q10 from "../../../assets/QuestionData/q10.png";
import q1_3 from "../../../assets/QuestionData/q1_3.png";
import q1_3o1 from "../../../assets/QuestionData/q1_3o1.png";
import q1_3o2 from "../../../assets/QuestionData/q1_3o2.png";
import q1_3o3 from "../../../assets/QuestionData/q1_3o3.png";
import q1_3o4 from "../../../assets/QuestionData/q1_3o4.png";
import q14 from "../../../assets/QuestionData/q14.png";
import q16 from "../../../assets/QuestionData/q16.png";
import q16o1 from "../../../assets/QuestionData/q16o1.png";
import q16o2 from "../../../assets/QuestionData/q16o2.png";
import q16o3 from "../../../assets/QuestionData/q16o3.png";
import q16o4 from "../../../assets/QuestionData/q16o4.png";
import q22 from "../../../assets/QuestionData/q22.png";
import q22o1 from "../../../assets/QuestionData/q22o1.png";
import q22o2 from "../../../assets/QuestionData/q22o2.png";
import q22o3 from "../../../assets/QuestionData/q22o3.png";
import q22o4 from "../../../assets/QuestionData/q22o4.png";
import q23 from "../../../assets/QuestionData/q23.png";
import q2_5 from "../../../assets/QuestionData/q2_5.png";












export const QuestionsData = [
  {
    section: "General Intelligence and Reasoning",
    questions: [
      {
        question: [
          `In a certain code language:`,
          `- ‘A + B’ means ‘A is the mother of B’`,
          `- ‘A – B’ means ‘A is the father of B’`,
          `- ‘A $ B’ means ‘A is the son of B’`,
          `- ‘A % B’ means ‘A is the sister of B’`,
          `- ‘A / B’ means ‘A is the wife of B’`,
          `- ‘A = B’ means ‘A is the brother of B’`,
          `Which of the following means A is the daughter of K?`,
        ],
        options: [
          "A + K / J – P = D",
          "J % P = K + A = D",
          "K + A / P – D % J",
          "D + K = A / P – J",
        ],
        correctAnswer: "K + A / P – D % J",
      },
      {
        question: [
          "Three statements are given followed by three conclusions numbered I, II and III. Assuming the statements to be true, even if they seem to be at variance with commonly known facts, decide which of the conclusions logically follow(s) from the statements.",
          "Statements:",
          "- No card is a parcel.",
          "- All cards are envelopes.",
          "- Some envelopes are bags.",
          "Conclusions:",
          "I. All envelopes can never be parcels.",
          "II. No card is a bag.",
          "III. At least some bags are postcards.",
        ],
        options: [
          "Only I follows",
          "Only II and III follow",
          "Only II follows",
          "Only I and III follow",
        ],
        correctAnswer: "Only I follows",
      },

      {
        question: [
          "In a certain code language:",
          "‘what where how’ is written as ‘aa dd ff’",
          "‘where there that’ is written as ‘dd zz pp’",
          "‘which what here’ is written as ‘ff kk ll’",
          "How is ‘how’ written in that language?",
        ],
        options: ["kk", "aa", "ff", "zz"],
        correctAnswer: "aa",
      },
      {
        question: [
          "Select the correct mirror image of the given figure when the mirror is placed at MN as shown below.",
          q3, // Store the image as an object in the array
        ],
        options: [q3o1, q3o2, q3o3, q3o4],
        correctAnswer: q3o3,
      },

      {
        question: [
          "Select the option that is related to the fifth letter-cluster in the same way as the second letter-cluster is related to the first letter-cluster and the fourth letter-cluster is related to the third letter-cluster.",
          "MEK: NVP :: GYT: TBG :: JWH: ?",
        ],
        options: ["QDS", "QDT", "PCR", "PCS"],
        correctAnswer: "QDS",
      },
      {
        question: [
          "Which of the following numbers will replace the question mark (?) in the given series?",
          "1, 3, 10, 41, ?, 1237",
        ],
        options: ["210", "202", "206", "200"],
        correctAnswer: "206",
      },
      {
        question: [
          "What will come in the place of ‘?’ in the following equation, if ‘+’ and ‘–‘ are interchanged and ‘×’ and ‘÷’ are interchanged?",
          "5 – 4 ÷ 9 + 80 × 10 = ?",
        ],
        options: ["33", "30", "35", "31"],
        correctAnswer: "33",
      },
      {
        question: [
          "Select the option that represents the letters that when placed from left to right in the blanks below will complete the letter series.",
          "L_P_QS_K_P_S_KP_Q_L_ _PQS",
        ],
        options: ["KPLPQLPSKP", "KPLPLQLSPK", "KPLPQQLPSK", "PKLPQPLSKP"],
        correctAnswer: "KPLPQLPSKP",
      },
      {
        question: [
          "The position of how many letters will remain unchanged if each of the letters in the word ‘NIGHTMARES’ is re-arranged in the English alphabetical order from left to right?",
        ],
        options: ["One", "Three", "Two", "Four"],
        correctAnswer: "Four",
      },
      {
        question: [
          "Which of the following terms will replace the question mark (?) in the given series?",
          "YZUW, ?, QTQU, MQOT, INMS",
        ],
        options: ["UWSV", "WUSV", "UWVS", "USWV"],
        correctAnswer: "UWSV",
      },
      {
        question: [
          "Identify the option figure that when put in place of the question mark (?) will logically complete the series.",
          q11,
        ],
        options: [q11o1, q11o2, q11o3, q11o4],
        correctAnswer: q11o1,
      },
      {
        question: [
          "Three statements are given followed by three conclusions numbered I, II and III. Assuming the statements to be true, even if they seem to be at variance with commonly known facts, decide which of the conclusions logically follow(s) from the statements.",
          "Statements:",
          "Some tears are drops.",
          "Some drops are streams.",
          "All streams are rivers.",
          "Conclusions:",
          "I. All tears can never be rivers.",
          "II. Some drops are rivers.",
          "III. All tears being streams is a possibility.",
        ],
        options: [
          "Both I and II conclusion follow",
          "Only conclusion I follows",
          "Only conclusion III follows",
          "Both II and III conclusion follow",
        ],
        correctAnswer: "Both II and III conclusion follow",
      },
      {
        question: [
          "Select the correct mirror image of the given figure when the mirror is placed at MN as shown below.",
          q13,
        ],
        options: [q13o1, q13o2, q13o3, q13o4],
        correctAnswer: q13o4,
      },
      {
        question: [
          "In a certain code language, 'NAME’ is written as 'FNBO' and 'NANO' is written as 'POBO’. How will 'NAIL’ be written in that language?",
        ],
        options: ["MJOB", "MJBO", "MOJB", "MOBJ"],
        correctAnswer: "MJBO",
      },
      {
        question: [
          "Which of the four options will replace the question mark (?) in the following series? UE 88, VG 84, WI 80, XK 76, ?",
        ],
        options: ["YN 73", "YM 72", "ZN 71", "ZM 72"],
        correctAnswer: "YM 72",
      },
      {
        question: [
          "19 is related to 209 following a certain logic. Following the same logic, 27 is related to 297. To which of the following is 61 related, following the same logic?",
        ],
        options: ["653", "671", "571", "600"],
        correctAnswer: "671",
      },
      {
        question: [
          "Six letters Q, Z, V, T, L and A are written on different faces of a dice. Two positions of this dice are shown in the figures below. Find the letter on the face opposite to Q.",
          q17,
        ],
        options: ["T", "V", "Z", "A"],
        correctAnswer: "T",
      },
      {
        question: [
          "In the following number-pairs, the second number is obtained by applying certain mathematical operations to the first number. In three of the four pairs, the same pattern is applied and hence they form a group. Select the number-pair that DOES NOT belong to this group.",
          "NOTE: Operations should be performed on the whole numbers, without breaking down the numbers into their constituent digits. E.g. 13 – Operations on 13 such as adding/subtracting/multiplying to 13 can be performed. Breaking down 13 into 1 and 3 and then performing mathematical operations on 1 and 3 is not allowed.",
        ],
        options: ["335 - 119", "358 - 152", "317 - 101", "308 - 92"],
        correctAnswer: "358 - 152",
      },
      {
        question: [
          "Identify the figure from the given options, which when put in place of the question mark (?), will logically complete the series.",
          q19,
        ],
        options: [q19o1, q19o2, q19o3, q19o4],
        correctAnswer: q19o2,
      },
      {
        question: [
          "What will come in place of the question mark (?) in the following equation, if ‘+’ and ‘–’ are interchanged and ‘×’ and ‘÷’ are interchanged?",
          "4515 × 5 – 431 ÷ 3 + 821 = ?",
        ],
        options: ["1575", "1335", "1375", "1775"],
        correctAnswer: "1375",
      },
      {
        question: ["How many triangles are there in the given figure?", q21],
        options: ["21", "20", "19", "18"],
        correctAnswer: "21",
      },
      {
        question: [
          "31 is related to 152 by certain logic. Following the same logic, 47 is related to 168. To which of the following is 66 related, following the same logic?",
          "(NOTE: Operations should be performed on the whole numbers, without breaking down the numbers into its constituent digits. E.g. 13 – Operations on 13 such as adding /deleting /multiplying etc., to 13 can be performed. Breaking down 13 into 1 and 3 and then performing mathematical operations on 1 and 3 is not allowed.)",
        ],
        options: ["180", "190", "185", "187"],
        correctAnswer: "187",
      },
      {
        question: [
          "The question contains pairs of words that are related to each other in a certain way. Three of the following four word pairs are alike as these have the same relationship and thus form a group. Which word pair is the one that DOES NOT belong to that group?",
          "(The words must be considered as meaningful English words and must not be related to each other based on the number of letters/number of consonants/vowels in the word.)",
        ],
        options: [
          "Triangle - 3 sides",
          "Pentagon - 5 sides",
          "Square - 4 sides",
          "Hexagon - 8 sides",
        ],
        correctAnswer: "Hexagon - 8 sides",
      },
      {
        question: [
          "Select the option in which the numbers share the same relationship as that shared by the given pair of numbers.",
          "(149, 213)",
          "(168, 232)",
          "(NOTE: Operations should be performed on the whole numbers, without breaking down the numbers into its constituent digits. E.g. 13 – Operations on 13 such as adding/deleting/multiplying etc. to 13 can be performed. Breaking down 13 into 1 and 3 and then performing mathematical operations on 1 and 3 is not allowed.)",
        ],
        options: ["(162, 222)", "(137, 211)", "(153, 217)", "(144, 198)"],
        correctAnswer: "(153, 217)",
      },
      {
        question: [
          "Six numbers 21, 22, 23, 24, 25 and 26 are written on different faces of a dice. Three positions of this dice are shown in the figure.",
          "Find the number on the face opposite to 24.",
          q25,
        ],
        options: ["22", "21", "26", "25"],
        correctAnswer: "21",
      },
    ],
  },
  {
    section: "General Awareness",
    questions: [
      {
        question: [
          "Who among the following has authored the play ‘Nil Darpan’?",
        ],
        options: [
          "Motilal Nehru",
          "Chittaranjan Das",
          "Dinabandhu Mitra",
          "Sarojini Naidu",
        ],
        correctAnswer: "Dinabandhu Mitra",
      },
      {
        question: [
          "Which of the following awards was won by Lata Mangeshkar in the year 2001?",
        ],
        options: [
          "Filmfare Lifetime Achievement Award",
          "Padma Vibhushan",
          "Dadasaheb Phalke Award",
          "Bharat Ratna",
        ],
        correctAnswer: "Bharat Ratna",
      },
      {
        question: ["Which of the following is a correct order of basicity?"],
        options: [
          "LiOH>NaOH>KOH>CsOH",
          "LiOH>KOH>CsOH>NaOH",
          "KOH>CsOH>NaOH>LiOH",
          "CsOH>KOH>NaOH>LiOH",
        ],
        correctAnswer: "CsOH>KOH>NaOH>LiOH",
      },
      {
        question: ["Who founded the Prarthana Samaj in Mumbai in 1867?"],
        options: [
          "Atmaram Pandurang",
          "Gopal Krishna Gokhale",
          "Shri Ram Bajpai",
          "Ram Mohan Roy",
        ],
        correctAnswer: "Atmaram Pandurang",
      },
      {
        question: [
          "Who among the following formed the Bihar Provincial Kisan Sabha in 1929?",
        ],
        options: [
          "Kunwar Singh",
          "JM Sengupta",
          "Jayprakash Narayan",
          "Swami Sahajanand Saraswati",
        ],
        correctAnswer: "Swami Sahajanand Saraswati",
      },
      {
        question: ["In which city was the first golf club of India situated?"],
        options: ["Shimla", "Gulmarg", "Mysore", "Kolkata"],
        correctAnswer: "Kolkata",
      },
      {
        question: [
          "Which article has a similar provision to that of Article 32 and deals with writ jurisdiction?"
        ],
        options: [
          "Article 227",
          "Article 228",
          "Article 225",
          "Article 226"
        ],
        correctAnswer: "Article 226"
      },
      {
        question: [
          "Mahendravarman I was the ruler of which of the following dynasties?"
        ],
        options: [
          "Pandya",
          "Chola",
          "Chalukya",
          "Pallava"
        ],
        correctAnswer: "Pallava"
      },
      {
        question: [
          "What challenge does foreign investment often face in India?"
        ],
        options: [
          "Excessive foreign competition",
          "Inconsistent regulatory environment",
          "Lack of skilled labour",
          "Lack of consumer base"
        ],
        correctAnswer: "Inconsistent regulatory environment"
      },
      {
        question: [
          "Who is Union Minister of State (Independent Charge) for Science and Technology as of July 2023?",
        ],
        options: [
          "Ramesh Pokhriyal",
          "Dharmendra Pradhan",
          "Ashwini Vaishnaw",
          "Jitendra Singh",
        ],
        correctAnswer: "Jitendra Singh",
      },
      {
        question: ["Lathmar Holi is primarily celebrated in the state of:"],
        options: [
          "Karnataka",
          "Arunachal Pradesh",
          "Uttar Pradesh",
          "Himachal Pradesh",
        ],
        correctAnswer: "Uttar Pradesh",
      },
      {
        question: [
          "Which of the following is NOT a condition for the President’s office in India?",
        ],
        options: [
          "He shall not be entitled, without payment of rent, to use his official residence.",
          "He shall not be a member of either House of the Parliament.",
          "The allowances shall not be diminished during his term of office.",
          "He shall not hold any office of profit.",
        ],
        correctAnswer:
          "He shall not be entitled, without payment of rent, to use his official residence.",
      },
      {
        question: [
          "Which Indian among the following has his name in Time Magazine’s list of ‘100 most influential people of 2021’?",
        ],
        options: ["Neeraj Chopra", "Narendra Modi", "Virat Kohli", "Amit Shah"],
        correctAnswer: "Narendra Modi",
      },
      {
        question: [
          "When the analysis of population density is done by calculating it through net cultivated area, then the measure is termed as:",
        ],
        options: [
          "Agricultural density",
          "Physiological density",
          "Gross density",
          "Net density",
        ],
        correctAnswer: "Agricultural density",
      },
      {
        question: [
          "Mohan Veena player, Pandit Vishwa Mohan Bhatt won the ____ Award in the year 1994.",
        ],
        options: [
          "Sangita Kalanidhi",
          "Oscar",
          "Grammy",
          "Sangeet Natak Akademi",
        ],
        correctAnswer: "Grammy",
      },
      {
        question: [
          "Which plateaus are very fertile because they are rich in black soil that is very good for farming?",
        ],
        options: [
          "African plateau",
          "Ethiopian plateau",
          "Katanga plateau",
          "Deccan lava plateau",
        ],
        correctAnswer: "Deccan lava plateau",
      },
      {
        question: [
          "Which of the following pairs is INCORRECT regarding the grade of organisation and its example?",
        ],
        options: [
          "Cellular grade organisation - Sycon",
          "Protoplasmic grade organisation - Paramecium",
          "Cell-tissue grade organisation - Jellyfish",
          "Tissue-organ grade organisation - Euplectella",
        ],
        correctAnswer: "Tissue-organ grade organisation - Euplectella",
      },
      {
        question: ["Who is the Chief Minister of Tamil Nadu as of July 2023?"],
        options: ["Pinarayi Vijayan", "M Yedurappa", "KN Nehru", "MK Stalin"],
        correctAnswer: "MK Stalin",
      },
      {
        question: [
          "Which of the following states is the biggest producer of Pulses?",
        ],
        options: ["Madhya Pradesh", "Haryana", "Punjab", "Bihar"],
        correctAnswer: "Madhya Pradesh",
      },
      {
        question: ["In which year was Project Tiger launched in India?"],
        options: ["1985", "1973", "1972", "1970"],
        correctAnswer: "1973",
      },
      {
        question: [
          "The head office of Board of Control for Cricket in India (BCCI) is located in ____.",
        ],
        options: ["Mumbai", "Kolkata", "New Delhi", "Chennai"],
        correctAnswer: "Mumbai",
      },
      {
        question: [
          "Which of the following decomposition reactions is NOT a redox reaction?",
        ],
        options: [
          "Decomposition of dihydrogen monoxide",
          "Decomposition of sodium hydride",
          "Decomposition of potassium chlorate",
          "Decomposition of calcium carbonate",
        ],
        correctAnswer: "Decomposition of calcium carbonate",
      },
      {
        question: [
          "Which of the following statements best defines the monoecious?",
        ],
        options: [
          "A flower with both androecium and gynoecium",
          "A flower with dithecous",
          "A flower with gynoecium only",
          "A flower with androecium only",
        ],
        correctAnswer: "A flower with both androecium and gynoecium",
      },
      {
        question: [
          "____ is an industry association and self-regulatory organisation (SRO) whose primary objective is to work towards the robust development of the microfinance sector.",
        ],
        options: [
          "Self-help Group Association",
          "Microfinance Institutions Network",
          "Microfinance and Investments Regulatory Authority",
          "NABARD",
        ],
        correctAnswer: "Microfinance Institutions Network",
      },
      {
        question: [
          "Details about Sudarshana lake is given in a rock inscription at Girnar (Junagarh), which was composed to record the achievements of the Shaka ruler ____.",
        ],
        options: ["Rudrasimha III", "Rudradaman I", "Chashtana", "Maues"],
        correctAnswer: "Rudradaman I",
      },
    ],
  },
  {
    section: "Quantitative Aptitude",
    questions: [
        {
            question: ["Which of the following statements is sufficient to conclude that two triangles are congruent?"], 
            options: [
              "These have two equal sides and the same perimeter.", 
              "These have the same area and the same base.", 
              "One side and one angle of both triangles are equal.", 
              "These have the same base and the same height."
            ], 
            correctAnswer: "These have two equal sides and the same perimeter."
          },
          {
            question: ["The average marks (out of 100) of boys and girls in an examination are 75 and 80, respectively. If the average marks of all the students in that examination are 78. Find the ratio of the number of boys to the number of girls."], 
            options: [
              "2 : 3", 
              "3 : 4", 
              "1 : 3", 
              "1 : 2"
            ], 
            correctAnswer: "2 : 3"
          },
          {
            question: ["If the sum of two sides of an equilateral triangle is 16 cm, then find the third side."], 
            options: [
              "4 cm", 
              "16 cm", 
              "Cannot be found", 
              "8 cm"
            ], 
            correctAnswer: "8 cm"
          },
          {
            question: ["The following table shows the total candidates appeared and number of candidates present, in different exam centres – P, Q and R.",
                " Study the table and answer the question that follows.",
                " 'Total' denotes total candidates applied for the centre, 'Present' denotes the candidates appeared. In which year was the number of absentees the second highest in total of all centres?",
                q4,

            ], 
            options: [
              "2018", 
              "2017", 
              "2020", 
              "2019"
            ], 
            correctAnswer: "2019"
          }
          ,
          {
            question: ["Which of the following can be the value of ‘k’ so that the number 217924k is divisible by 6?"], 
            options: [
              "4", 
              "6", 
              "2", 
              "0"
            ], 
            correctAnswer: "2"
          },
          {
              question: ["Read the given information and answer the question that follows.",
              " The following table gives the percentage of marks obtained by seven students in six different subjects in an examination.",
              " The number in the brackets give the maximum marks in each subject.",
              " If someone secured all the highest scores that have been obtained by some student or the other in the six subjects as given in the table above, what would be the exact overall percentage score obtained by that student?",
              q6,

            ],
              options: [q6o1, q6o2, q6o3, q6o4],
              correctAnswer: q6o1,
           },
            {
              question: [ q7 ],
              options: [
                "1", 
                "2", 
                "4", 
                "0"
              ],
              correctAnswer: "0"
            },
          
          
            {
              question: [ q8 ],
              options: [
                q8o1, 
                "2", 
                "1", 
                "0"
              ],
              correctAnswer: "1"
            },
          
            {
              question: [
                "An article is marked at ₹550. If it is sold at a discount of 40%, then the selling price becomes 10% more than its cost price. What is the cost price (in ₹)?"
              ],
              options: [
                "220",
                "330",
                "300",
                "200"
              ],
              correctAnswer: "300"
            },
            {
              question: [q10], 
              options: [
                "3",
                "1",
                "0",
                "2"
              ],
              correctAnswer: "1"
            },
            {
              question: [
                "Fill pipe P is 21 times faster than fill pipe Q. If Q can fill a cistern in 110 minutes, find the time it takes to fill the cistern when both fill pipes are opened together."
              ],
              options: [
                "5 minutes",
                "4 minutes",
                "3 minutes",
                "6 minutes"
              ],
              correctAnswer: "5 minutes"
            },
            {
              question: [
                "The radii of the two cones are in the ratio of 2 : 5 and their volumes are in the ratio of 3 : 5. What is the ratio of their heights?"
              ],
              options: [
                "15 : 4",
                "11 : 15",
                "13 : 11",
                "4 : 11"
              ],
              correctAnswer: "15 : 4"
            },
            {
              question: [q1_3], 
              options: [
               q1_3o1,
               q1_3o2,
               q1_3o3,
               q1_3o4
              ],
              correctAnswer: q1_3o3
            },
            {
              question: [q14], 
              options: [
                "1,10",
                "4,7",
                "3,10",
                "2,7"
              ],
              correctAnswer: "1,10"
            },
            {
              question: [
                "Let O be the centre of the circle and AB and CD are two parallel chords on the same side of the radius. OP is perpendicular to AB and OQ is perpendicular to CD. If AB = 10 cm, CD = 24 cm and PQ = 7 cm, then the diameter (in cm) of the circle is equal to:"
              ],
              options: [
                "26",
                "13",
                "12",
                "24"
              ],
              correctAnswer: "26"
            },
            {
              question: [q16],
              options: [
               q16o1,
               q16o2,
               q16o3,
               q16o4
              ],
              correctAnswer: q16o3
            },
            {
              question: [
                "The distance between the centres of two circles of radii 22 cm and 10 cm is 37 cm. If the points of contact of a direct common tangent to these circles are M and Q, then find the length of the line segment MQ."
              ],
              options: [
                "35 cm",
                "39 cm",
                "29 cm",
                "25 cm"
              ],
              correctAnswer: "35 cm"
            },
            {
              question: [
                "In a circular race of 840 m, A and B start running in the same direction at the same time from the same point at the speeds of 6 m/s and 12 m/s, respectively. After how much time will they meet next?"
              ],
              options: [
                "140 s",
                "20 s",
                "40 s",
                "70 s"
              ],
              correctAnswer: "140 s"
            },
            {
              question: [
                "R pays ₹100 to P with ₹5, ₹2 and ₹1 coins. The total number of coins used for paying are 40. What is the number of coins of denomination ₹5 in the payment?"
              ],
              options: [
                "16",
                "17",
                "18",
                "13"
              ],
              correctAnswer: "13"
            },
            {
              question: [
                "In an election between two candidates, y% of the voters did not vote. 10% of the votes cast were declared invalid, while all the valid votes were cast in favour of either of the two candidates. The candidate who got 59.375% of the valid votes cast was declared elected by 2484 votes. If the number of people eligible to vote in that election was 16,000, what is the value of y?"
              ],
              options: [
                "7.2",
                "8.4",
                "8",
                "7.5"
              ],
              correctAnswer: "8"
            },
            {
              question: [
                "Mohan borrows a sum of ₹4,22,092 at the rate of 20% per annum simple interest. At the end of the first year, he repays ₹21,679 towards return of principal amount borrowed. If Mohan clears all pending dues at the end of the second year, including interest payment that accrued during the first year, how much does he pay (in ₹) at the end of the second year?"
              ],
              options: [
                "556367",
                "558380",
                "561347",
                "564914"
              ],
              correctAnswer: "564914"
            },
            {
              question: [q22], 
              options: [
               q22o1,
               q22o2,
               q22o3,
               q22o4
              ],
              correctAnswer: q22o2
            },
            {
              question: [q23], 
              options: [
                "60",
                "20",
                "54",
                "56"
              ],
              correctAnswer: "54"
            },
            {
              question: [
                "A grocer professes to sell rice at the cost price, but uses a fake weight of 870 g for 1 kg. Find his profit percentage (correct to two decimal places)."
              ],
              options: [
                "15.11%",
                "14.94%",
                "18.21%",
                "11.11%"
              ],
              correctAnswer: "14.94%"
            },
            {
              question: [q2_5], 
              options: [
                "Sumit",
                "Mohit",
                "Rohit",
                "Tarun"
              ],
              correctAnswer: "Tarun"
            }
            ,
    ],
  },
  {
    section: "English Comprehension",
    questions: [
      {
        question: [
          "Select the option that expresses the given sentence in passive voice. Ishika saw the tiger in the forest."
        ],
        options: [
          "The tiger saw by Ishika in the forest.",
          "The tiger was seen by the forest in Ishika.",
          "The tiger was seen by Ishika in the forest.",
          "The tiger sees Ishika in the forest."
        ],
        correctAnswer: "The tiger was seen by Ishika in the forest."
      },
      {
        question: [
          "Select the most appropriate synonym of the given word. Innuendo"
        ],
        options: [
          "Prose",
          "Crude",
          "Ragged",
          "Insinuation"
        ],
        correctAnswer: "Insinuation"
      },
      {
        question: [
          "Select the most appropriate option that can substitute the underlined segment in the given sentence. ‘Spy Family’ is a graphic novel that is a narrative work in which the story is conveyed to the reader using uninterrupted art in a traditional comics format."
        ],
        options: [
          "sequential art in a traditional",
          "existential art in a traditional",
          "sedimental art in a traditional",
          "longitudinal art in a traditional"
        ],
        correctAnswer: "sequential art in a traditional"
      },
      {
        question: [
          "Select the most appropriate synonym of the given word. Fatal"
        ],
        options: [
          "Deadly",
          "Additional",
          "Jovial",
          "Easy"
        ],
        correctAnswer: "Deadly"
      },
      {
        question: [
          "The following sentence has been divided into four segments. Identify the segment that contains an error. Mr. Abhilash and his family / have received / no informations / about the incident."
        ],
        options: [
          "have received",
          "no informations",
          "about the incident.",
          "Mr. Abhilash and his family"
        ],
        correctAnswer: "no informations"
      },
      {
        question: [
          "Select the option that expresses the opposite meaning of the underlined word. The explosive used is of my own formulation, and I can vouch for its efficiency."
        ],
        options: [
          "Maintain",
          "Certify",
          "Invalidate",
          "Witness"
        ],
        correctAnswer: "Invalidate"
      },
      {
        question: [
          "Select the most appropriate option to fill in the blank. Vinod had a ___ escape in the car accident."
        ],
        options: [
          "comfortable",
          "full",
          "narrow",
          "wide"
        ],
        correctAnswer: "narrow"
      },
      {
        question: [
          "Select the INCORRECTLY spelt word."
        ],
        options: [
          "Embarrass",
          "Connoisseur",
          "Relevent",
          "Bureaucracy"
        ],
        correctAnswer: "Relevent"
      },
      {
        question: [
          "Select the most appropriate synonym of the word in bold. We’d better watch our step and not give him any excuse to harass us further."
        ],
        options: [
          "betray",
          "relish",
          "soothe",
          "intimidate"
        ],
        correctAnswer: "intimidate"
      },
      {
        question: [
          "Select the option that can be used as a one-word substitute for the given phrase. A short interesting story about a real person or event"
        ],
        options: [
          "Poem",
          "Sketch",
          "Anecdote",
          "Narrative"
        ],
        correctAnswer: "Anecdote"
      },
      {
        question: [
          "Select the option that can be used as a one-word substitute for the underlined group of words. She is proficient in speaking many languages."
        ],
        options: [
          "Monolithic",
          "Multilingual",
          "Heterolinguistic",
          "Bilingual"
        ],
        correctAnswer: "Multilingual"
      },
      {
        question: [
          "Select the most appropriate meaning of the given idiom. To have bigger fish to fry"
        ],
        options: [
          "To have an interest in cooking",
          "To know different kinds of fishing techniques",
          "To take calculated risks",
          "To have bigger things to take care of than the menial task at hand"
        ],
        correctAnswer: "To have bigger things to take care of than the menial task at hand"
      },
      {
        question: [
          "The following sentence has been split into four segments. Identify the segment that contains a grammatical error. My brother performed / extremely good / in the class test / held yesterday."
        ],
        options: [
          "held yesterday",
          "in the class test",
          "My brother performed",
          "extremely good"
        ],
        correctAnswer: "extremely good"
      },
      {
        question: [
          "Select the most appropriate synonym of the given word. Toxic"
        ],
        options: [
          "Laudatory",
          "Lanky",
          "Lethal",
          "Licit"
        ],
        correctAnswer: "Lethal"
      },
      {
        question: [
          "Select the option that can be used as a one-word substitute for the given group of words. A person who likes to argue about anything"
        ],
        options: [
          "Reticent",
          "Coward",
          "Veracious",
          "Contentious"
        ],
        correctAnswer: "Contentious"
      },
      {
        question: [
          "Select the most appropriate option to substitute the underlined segment in the given sentence. She has been studying for two o’clock."
        ],
        options: [
          "study from two o’clock",
          "studying since two o’clock",
          "study for two o’clock",
          "studying two o’clock"
        ],
        correctAnswer: "studying since two o’clock"
      },
      {
        question: [
          "In the following sentence, four words are underlined out of which one word is misspelt. Identify the INCORRECTLY spelt word. After the recapture (A) of Tololing and the adjacent features, evacting (B) the enemy from this well-fortified (C) position became a priority.(D)"
        ],
        options: [
          "B",
          "D",
          "A",
          "C"
        ],
        correctAnswer: "B"
      },
      {
        question: [
          "Select the option that expresses the given sentence in active voice. Lovely tunes are composed by Domnica."
        ],
        options: [
          "Domnica composed lovely tunes.",
          "Domnica composes tunes lovely.",
          "Domnica will compose lovely tunes.",
          "Domnica composes lovely tunes."
        ],
        correctAnswer: "Domnica composes lovely tunes."
      },
      {
        question: [
          "Select the word which means the same as the group of words given. Unit of weight for precious stones"
        ],
        options: [
          "Pure",
          "Reliable",
          "Carat",
          "Accurate"
        ],
        correctAnswer: "Carat"
      },
      {
        question: [
          "Select the most appropriate synonym to replace the underlined word in the given sentence. No altruistic act is truly sincere."
        ],
        options: [
          "philanthropic",
          "phantasmal",
          "phenomenal",
          "phonotypical"
        ],
        correctAnswer: "philanthropic"
      },
      {
        question: [
          "Comprehension:",
          "In the following passage, some words have been deleted. Read the passage carefully and select the most appropriate option to fill in each blank.",
         "There is a saying that coming events cast their shadows before. (1)	, it is not universally true. Something can happen within a second, and one may not (2)	it. (3)	, some instances show that predictions based on certain signs have gone wrong. People generally say that natural calamities can be predicted by observing the animals. But what if animals are suffering from some disease and don’t show any signs before the event appears? They may fail to make peculiar sounds or actions about the events which are going to take place. (4)		, some unnatural calamities that are likely to appear may forecast their shadows by some bad omens. (5)	, we should not completely cancel out the possibilities that animals can sense certain unnatural happenings",
         "Select the most appropriate option to fill in blank number 1."
        ],
        options: [
          "Moreover",
          "Therefore",
          "Furthermore",
          "However"
        ],
        correctAnswer: "However"
      },
      {
        question: [
          "Comprehension:",
          "In the following passage, some words have been deleted. Read the passage carefully and select the most appropriate option to fill in each blank.",
         "There is a saying that coming events cast their shadows before. (1)	, it is not universally true. Something can happen within a second, and one may not (2)	it. (3)	, some instances show that predictions based on certain signs have gone wrong. People generally say that natural calamities can be predicted by observing the animals. But what if animals are suffering from some disease and don’t show any signs before the event appears? They may fail to make peculiar sounds or actions about the events which are going to take place. (4)		, some unnatural calamities that are likely to appear may forecast their shadows by some bad omens. (5)	, we should not completely cancel out the possibilities that animals can sense certain unnatural happenings",
         "Select the most appropriate option to fill in blank number 2."
        ],
        options: [
          "legalise",
          "foresee",
          "rescind",
          "affect"
        ],
        correctAnswer: "foresee"
      },
      {
        question: [
          "Comprehension:",
          "In the following passage, some words have been deleted. Read the passage carefully and select the most appropriate option to fill in each blank.",
         "There is a saying that coming events cast their shadows before. (1)	, it is not universally true. Something can happen within a second, and one may not (2)	it. (3)	, some instances show that predictions based on certain signs have gone wrong. People generally say that natural calamities can be predicted by observing the animals. But what if animals are suffering from some disease and don’t show any signs before the event appears? They may fail to make peculiar sounds or actions about the events which are going to take place. (4)		, some unnatural calamities that are likely to appear may forecast their shadows by some bad omens. (5)	, we should not completely cancel out the possibilities that animals can sense certain unnatural happenings",
         "Select the most appropriate option to fill in blank number 3."
        ],
        options: [
          "Therefore",
          "Moreover",
          "Nevertheless",
          "However"
        ],
        correctAnswer: "Moreover"
      },
      {
        question: [
          "Comprehension:",
          "In the following passage, some words have been deleted. Read the passage carefully and select the most appropriate option to fill in each blank.",
         "There is a saying that coming events cast their shadows before. (1)	, it is not universally true. Something can happen within a second, and one may not (2)	it. (3)	, some instances show that predictions based on certain signs have gone wrong. People generally say that natural calamities can be predicted by observing the animals. But what if animals are suffering from some disease and don’t show any signs before the event appears? They may fail to make peculiar sounds or actions about the events which are going to take place. (4)		, some unnatural calamities that are likely to appear may forecast their shadows by some bad omens. (5)	, we should not completely cancel out the possibilities that animals can sense certain unnatural happenings",
         "Select the most appropriate option to fill in blank number 4."
        ],
        options: [
          "Besides",
          "Secondly",
          "Therefore",
          "Despite"
        ],
        correctAnswer: "Besides"
      },
      {
        question: [
          "Comprehension:",
          "In the following passage, some words have been deleted. Read the passage carefully and select the most appropriate option to fill in each blank.",
         "There is a saying that coming events cast their shadows before. (1)	, it is not universally true. Something can happen within a second, and one may not (2)	it. (3)	, some instances show that predictions based on certain signs have gone wrong. People generally say that natural calamities can be predicted by observing the animals. But what if animals are suffering from some disease and don’t show any signs before the event appears? They may fail to make peculiar sounds or actions about the events which are going to take place. (4)		, some unnatural calamities that are likely to appear may forecast their shadows by some bad omens. (5)	, we should not completely cancel out the possibilities that animals can sense certain unnatural happenings",
         "Select the most appropriate option to fill in blank number 5."
        ],
        options: [
          "However",
          "Nevertheless",
          "Moreover",
          "Therefore"
        ],
        correctAnswer: "Therefore"
      }
    ],
  },
];
