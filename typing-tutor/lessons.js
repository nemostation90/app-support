// Original typing curriculum for the typing tutor.
// Structure mirrors a standard touch-typing course (progressive key
// introduction -> drills -> words -> short sentences -> paragraphs),
// but ALL drill text is authored here from scratch. No third-party
// lesson content is copied.

export const LESSONS = [
  // ============ HOME ROW ============
  {
    id: "hr-1", unit: "Home Row", title: "1. f and j",
    keys: ["f", "j"],
    lines: ["fff jjj fff jjj fj jf fj jf", "jf fj jjf ffj jfj fjf jf fj", "ff jj fj jf ffj jjf fjf jfj"],
  },
  {
    id: "hr-2", unit: "Home Row", title: "2. d and k",
    keys: ["d", "k"],
    lines: ["ddd kkk ddd kkk dk kd dk kd", "dk kd dkd kdk ddk kkd dk kd", "fjdk jfkd dkfj kdjf fj dk"],
  },
  {
    id: "hr-3", unit: "Home Row", title: "3. s and l",
    keys: ["s", "l"],
    lines: ["sss lll sss lll sl ls sl ls", "sl ls sls lsl ssl lls sl ls", "asdf jkl fdsa lkj fjdksla"],
  },
  {
    id: "hr-4", unit: "Home Row", title: "4. a and ;",
    keys: ["a", ";"],
    lines: ["aaa ;;; aaa ;;; a; ;a a; ;a", "asdf jkl; asdf jkl; fj dk sl a;", "a; ;a asd jkl asdf jkl; aaa ;;;"],
  },
  {
    id: "hr-5", unit: "Home Row", title: "5. g and h",
    keys: ["g", "h"],
    lines: ["fgf jhj fgf jhj gh hg gh hg", "gas had hag gash dash glad", "a glad lad; half a flag; gas lamp"],
  },
  {
    id: "hr-6", unit: "Home Row", title: "6. Home Row Words",
    keys: ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";"],
    lines: ["ask all fall lads glad half", "ash flag hall salad shall gash", "a glad lass; all halls fall; salad dash"],
  },
  {
    id: "hr-7", unit: "Home Row", title: "7. Home Row Sentences",
    keys: [],
    lines: ["a lad has half a flask", "all glad lads dash; a salad falls", "ask dad; a flag, a hall, a salad"],
  },

  // ============ TOP ROW ============
  {
    id: "tr-1", unit: "Top Row", title: "8. e and i",
    keys: ["e", "i"],
    lines: ["ded kik ded kik die fie lie tie", "deed feed seek like side life", "a field lie; a fine deal; she likes ice"],
  },
  {
    id: "tr-2", unit: "Top Row", title: "9. r and u",
    keys: ["r", "u"],
    lines: ["frf juj frf juj rug fur run sure", "true rude fury surf turf hour", "run fast; sure surf; a rude hour"],
  },
  {
    id: "tr-3", unit: "Top Row", title: "10. t and y",
    keys: ["t", "y"],
    lines: ["ftf jyj ftf jyj try toy stay duty", "tidy tasty style they that type", "they try; a tidy yard; stay steady today"],
  },
  {
    id: "tr-4", unit: "Top Row", title: "11. w and o",
    keys: ["w", "o"],
    lines: ["sws lol sws lol wow owl word slow", "would world wood flow show low", "we work two days; a slow owl; show me how"],
  },
  {
    id: "tr-5", unit: "Top Row", title: "12. q and p",
    keys: ["q", "p"],
    lines: ["aqa ;p; aqa ;p; quip quiz pump prep", "quiet quick proper puzzle paper", "a quiet pup; quick quiz; pour a quart"],
  },
  {
    id: "tr-6", unit: "Top Row", title: "13. Top Row Words",
    keys: [],
    lines: ["type quote power write proud quiet", "report unique people pretty wiper", "we wrote eight pretty quotes"],
  },
  {
    id: "tr-7", unit: "Top Row", title: "14. Top Row Sentences",
    keys: [],
    lines: ["we ride the quiet trail", "she put the white kite outside", "type the report, then take a quick rest"],
  },

  // ============ BOTTOM ROW ============
  {
    id: "br-1", unit: "Bottom Row", title: "15. c and comma",
    keys: ["c", ","],
    lines: ["dcd k,k dcd k,k cat cot cut ice", "code cave clock clean comic come", "ice, cake, cocoa, and a clean cup"],
  },
  {
    id: "br-2", unit: "Bottom Row", title: "16. v and m",
    keys: ["v", "m"],
    lines: ["fvf jmj fvf jmj move vim mom van", "movie vivid mime mauve avid muse", "move the van; mom made a movie"],
  },
  {
    id: "br-3", unit: "Bottom Row", title: "17. b and n",
    keys: ["b", "n"],
    lines: ["fbf jnj fbf jnj ban bin bun nab", "brown bench begin number ribbon", "a brown bench; begin to bend; ten beans"],
  },
  {
    id: "br-4", unit: "Bottom Row", title: "18. x and period",
    keys: ["x", "."],
    lines: ["sxs l.l sxs l.l fox box six axe.", "exit extra mixex relax index.", "the fox ran. six boxes. relax and exit."],
  },
  {
    id: "br-5", unit: "Bottom Row", title: "19. z and slash",
    keys: ["z", "/"],
    lines: ["aza ;/; aza ;/; zip zap zoo size", "zebra dozen amaze hazel zone", "a lazy zebra; zip the zone; size and/or zip"],
  },
  {
    id: "br-6", unit: "Bottom Row", title: "20. Bottom Row Words",
    keys: [],
    lines: ["zebra brave climb mince banjo vivid", "buzz vance maximum combine number", "the brave zebra can climb the bank"],
  },

  // ============ ALL LETTERS / WORDS ============
  {
    id: "wd-1", unit: "Common Words", title: "21. Short Words",
    keys: [],
    lines: ["the and you for are was his she had", "not but all can her one out day get", "two new now old big red top hot fun job"],
  },
  {
    id: "wd-2", unit: "Common Words", title: "22. Everyday Words",
    keys: [],
    lines: ["water house plant happy money green", "music light table chair window paper", "school garden friend dinner pocket"],
  },
  {
    id: "wd-3", unit: "Common Words", title: "23. Action Words",
    keys: [],
    lines: ["jump walk read write play swim climb", "drive ride open close build clean carry", "we drive on the street and walk to the park"],
  },
  {
    id: "wd-4", unit: "Common Words", title: "24. Longer Words",
    keys: [],
    lines: ["another important question remember", "together computer beautiful neighbor", "the important question is easy to remember"],
  },

  // ============ CAPITALS / SHIFT ============
  {
    id: "cap-1", unit: "Capitals", title: "25. Capital Letters",
    keys: [],
    lines: ["Sam Tom Ann Ben Kim Joe Eva Max", "Monday Tuesday April June London Rome", "Anna and Ben went to Rome in April"],
  },
  {
    id: "cap-2", unit: "Capitals", title: "26. Capitalized Sentences",
    keys: [],
    lines: ["The dog ran across the yard.", "We drive on the street to the lake.", "My sister reads a book every night."],
  },

  // ============ NUMBERS ============
  {
    id: "nm-1", unit: "Numbers", title: "27. Number Row",
    keys: ["1","2","3","4","5","6","7","8","9","0"],
    lines: ["1 2 3 4 5 6 7 8 9 0 0 9 8 7 6 5 4 3 2 1", "12 34 56 78 90 19 28 37 46 50", "11 22 33 44 55 66 77 88 99 00"],
  },
  {
    id: "nm-2", unit: "Numbers", title: "28. Numbers in Words",
    keys: [],
    lines: ["room 101 has 25 chairs and 3 tables", "the bus leaves at 8 and arrives by 9", "buy 6 apples, 4 pears, and 12 eggs"],
  },

  // ============ SYMBOLS ============
  {
    id: "sy-1", unit: "Symbols", title: "29. Common Symbols",
    keys: [],
    lines: ["@ # $ % & * ( ) - + = !", "email@site.com 50% off $9.99", "use #1 today (it is a big deal!)"],
  },
  {
    id: "sy-2", unit: "Symbols", title: "30. Punctuation Practice",
    keys: [],
    lines: ["Wait! Are you ready? Yes, I am.", "She said, \"Let's go now,\" and smiled.", "Pack your bag; bring water, food, and a map."],
  },

  // ============ SENTENCES ============
  {
    id: "sn-1", unit: "Sentences", title: "31. Easy Sentences",
    keys: [],
    lines: ["The cat sat on the soft mat.", "We ride our bikes down the road.", "She drinks a cup of warm milk."],
  },
  {
    id: "sn-2", unit: "Sentences", title: "32. Daily Sentences",
    keys: [],
    lines: ["Every morning I eat eggs and toast.", "The bus stops near the green gate.", "Please close the door when you leave."],
  },
  {
    id: "sn-3", unit: "Sentences", title: "33. Action Sentences",
    keys: [],
    lines: ["The fast train moves through the hills.", "Drive slowly when the road is wet.", "He throws the ball and runs to first base."],
  },
  {
    id: "sn-4", unit: "Sentences", title: "34. Question Sentences",
    keys: [],
    lines: ["Where did you put my blue shoes?", "How many books did you read this week?", "Why is the sky so bright today?"],
  },

  // ============ PARAGRAPHS ============
  {
    id: "pg-1", unit: "Paragraphs", title: "35. Steady Pace",
    keys: [],
    lines: [
      "Good typing is built on a calm, steady rhythm.",
      "Reach with the right finger and return home.",
      "Speed follows accuracy, so aim to be precise first.",
      "With daily practice, smooth typing becomes natural.",
    ],
  },
  {
    id: "pg-2", unit: "Paragraphs", title: "36. A Short Story",
    keys: [],
    lines: [
      "A small boat sailed across the calm blue bay.",
      "The wind was gentle, and the sun felt warm.",
      "Two birds followed the boat for a little while.",
      "By noon, the boat reached a quiet sandy shore.",
    ],
  },
  {
    id: "pg-3", unit: "Paragraphs", title: "37. Keep Going",
    keys: [],
    lines: [
      "Learning to type well takes time and patience.",
      "Do not look down at the keys while you type.",
      "Trust your fingers to find each key on their own.",
      "Each lesson makes your hands a little bit faster.",
    ],
  },
];

// Maps every key to the finger that should press it (for the guide).
export const FINGER_MAP = {
  "`": "lp", "1": "lp", "2": "lr", "3": "lm", "4": "li", "5": "li",
  "6": "ri", "7": "ri", "8": "rm", "9": "rr", "0": "rp", "-": "rp", "=": "rp",
  q: "lp", w: "lr", e: "lm", r: "li", t: "li",
  y: "ri", u: "ri", i: "rm", o: "rr", p: "rp", "[": "rp", "]": "rp", "\\": "rp",
  a: "lp", s: "lr", d: "lm", f: "li", g: "li",
  h: "ri", j: "ri", k: "rm", l: "rr", ";": "rp", "'": "rp",
  z: "lp", x: "lr", c: "lm", v: "li", b: "li",
  n: "ri", m: "ri", ",": "rm", ".": "rr", "/": "rp",
  " ": "thumb",
};

// Visual keyboard layout (rows of key labels).
export const KEYBOARD_ROWS = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
  ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  [" "],
];
