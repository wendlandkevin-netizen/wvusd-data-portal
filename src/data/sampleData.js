// src/data/sampleData.js

export const WVUSD_ELEMENTARY_SCHOOLS = [
  "Collegewood Elementary",
  "Maple Hill Elementary",
  "Vejar Elementary",
  "Castle Rock Elementary",
  "Evergreen Elementary",
  "Quail Summit Elementary",
  "Westhoff Elementary",
  "CJ Morris Elementary",
  "Walnut Elementary"
];

export const TEACHERS_BY_SCHOOL_AND_GRADE = {
  "Collegewood Elementary": {
    1: ["Mrs. Adams", "Mr. Garcia"],
    2: ["Ms. Chen", "Mrs. Roberts"],
    3: ["Mrs. Chang", "Mr. O'Connor", "Ms. Alvarez"],
    4: ["Mr. Tanaka", "Mrs. Miller"],
    5: ["Mrs. Henderson", "Mr. Bradley"]
  },
  "Maple Hill Elementary": {
    1: ["Mrs. Kim", "Ms. Baker"],
    2: ["Mr. Hernandez", "Mrs. Scott"],
    3: ["Mrs. Ramirez", "Ms. Patel", "Mr. Evans"],
    4: ["Ms. Wong", "Mr. Larson"],
    5: ["Mrs. Cooper", "Mr. Diaz"]
  },
  "Vejar Elementary": {
    1: ["Mrs. Flores", "Ms. Hughes"],
    2: ["Mr. Gomez", "Mrs. Brooks"],
    3: ["Mrs. Davis", "Mr. Nguyen", "Ms. Martinez"],
    4: ["Mrs. Watson", "Mr. Kelly"],
    5: ["Ms. Torres", "Mr. Reed"]
  },
  "Castle Rock Elementary": {
    1: ["Mrs. Lee", "Mr. Sanders"],
    2: ["Ms. Ward", "Mrs. Price"],
    3: ["Mr. Foster", "Mrs. Jenkins", "Ms. Bailey"],
    4: ["Mrs. Bell", "Mr. Murphy"],
    5: ["Ms. Rivera", "Mr. Cox"]
  },
  "Evergreen Elementary": {
    1: ["Mrs. Bennett", "Ms. Wood"],
    2: ["Mr. Barnes", "Mrs. Ross"],
    3: ["Mrs. Henderson", "Mr. Sullivan", "Ms. Coleman"],
    4: ["Ms. Jenkins", "Mr. Perry"],
    5: ["Mrs. Powell", "Mr. Long"]
  },
  "Quail Summit Elementary": {
    1: ["Mrs. Patterson", "Ms. Hughes"],
    2: ["Mr. Simmons", "Mrs. Foster"],
    3: ["Ms. Brooks", "Mr. Bryant", "Mrs. Alexander"],
    4: ["Mrs. Griffin", "Mr. Hayes"],
    5: ["Ms. Myers", "Mr. Ford"]
  },
  "Westhoff Elementary": {
    1: ["Mrs. Hamilton", "Ms. Graham"],
    2: ["Mr. Wallace", "Mrs. Woods"],
    3: ["Mrs. Cole", "Mr. West", "Ms. Jordan"],
    4: ["Ms. Owens", "Mr. Reynolds"],
    5: ["Mrs. Ellis", "Mr. Harrison"]
  },
  "CJ Morris Elementary": {
    1: ["Mrs. Gibson", "Ms. McDonald"],
    2: ["Mr. Cruz", "Mrs. Marshall"],
    3: ["Mrs. Ortiz", "Mr. Gomez", "Ms. Murray"],
    4: ["Ms. Freeman", "Mr. Wells"],
    5: ["Mrs. Webb", "Mr. Simpson"]
  },
  "Walnut Elementary": {
    1: ["Mrs. Tucker", "Ms. Porter"],
    2: ["Mr. Hunter", "Mrs. Hicks"],
    3: ["Mrs. Crawford", "Mr. Henry", "Ms. Boyd"],
    4: ["Ms. Mason", "Mr. Morales"],
    5: ["Mrs. Kennedy", "Mr. Warren"]
  }
};

/**
 * 85+ realistic elementary student records across WVUSD schools and grades,
 * heavily populated in Grade 3 across all 9 elementary schools.
 */
export const RAW_SAMPLE_STUDENTS = [
  // --- Collegewood Elementary Grade 3 ---
  {
    studentId: "1083421",
    studentName: "Ethan Lin",
    school: "Collegewood Elementary",
    grade: 3,
    teacher: "Mrs. Chang",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "1.8, 2.1, 2.4",
    currAmiraArm: "2.6, 2.9, 3.2",
    prevStarReading: "2.3, 2.5",
    currStarReading: "2.8, 3.1",
    prevOrrLevel: "M, N",
    currOrrLevel: "O, P",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 14,
      isolatingSounds: 15,
      soundSegmentation: 14,
      removingManipulating: 13,
      decodingWords: 78,
      firstGradeWordList: 54
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 3,
      informationalConventions: 3
    }
  },
  {
    studentId: "1083422",
    studentName: "Sophia Hernandez",
    school: "Collegewood Elementary",
    grade: 3,
    teacher: "Mrs. Chang",
    isEL: false,
    isSpEd: true,
    spedType: "IEP - RSP Reading Specialist",
    is504: false,
    isFosterHomeless: false,
    // YoY Regression / Decline example
    prevAmiraArm: "2.3, 2.5, 2.7",
    currAmiraArm: "2.1, 2.2",
    prevStarReading: "2.6, 2.8",
    currStarReading: "2.1, 2.3",
    prevOrrLevel: "L, M",
    currOrrLevel: "K",
    phonics: {
      oralBlending: 10,
      digraphsVowels: 8,
      isolatingSounds: 11,
      soundSegmentation: 7,
      removingManipulating: 6,
      decodingWords: 42,
      firstGradeWordList: 38
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 1,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 1
    }
  },
  {
    studentId: "1083423",
    studentName: "Lucas Chen",
    school: "Collegewood Elementary",
    grade: 3,
    teacher: "Mrs. Chang",
    isEL: false,
    isSpEd: false,
    is504: true,
    isFosterHomeless: false,
    prevAmiraArm: "3.2, 3.5",
    currAmiraArm: "3.8, 4.1",
    prevStarReading: "3.4, 3.7",
    currStarReading: "4.0, 4.3",
    prevOrrLevel: "P, Q",
    currOrrLevel: "R, S",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 15,
      removingManipulating: 15,
      decodingWords: 84,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 3,
      informationalContent: 4,
      informationalConventions: 4
    }
  },
  {
    studentId: "1083424",
    studentName: "Jayden Morales",
    school: "Collegewood Elementary",
    grade: 3,
    teacher: "Mr. O'Connor",
    isEL: true,
    elLevel: "Emerging (Level 1)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: true,
    prevAmiraArm: "1.1, 1.3",
    currAmiraArm: "1.4, 1.5",
    prevStarReading: "1.2",
    currStarReading: "1.4, 1.6",
    prevOrrLevel: "PP, P, C",
    currOrrLevel: "D, E",
    phonics: {
      oralBlending: 7,
      digraphsVowels: 6,
      isolatingSounds: 8,
      soundSegmentation: 5,
      removingManipulating: 4,
      decodingWords: 31,
      firstGradeWordList: 26
    },
    writing: {
      narrativeContent: 1,
      narrativeConventions: 1,
      opinionContent: 1,
      opinionConventions: 1,
      informationalContent: 1,
      informationalConventions: 1
    }
  },
  {
    studentId: "1083425",
    studentName: "Aaliyah Washington",
    school: "Collegewood Elementary",
    grade: 3,
    teacher: "Mr. O'Connor",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.8, 3.0",
    currAmiraArm: "3.1, 3.3",
    prevStarReading: "2.9",
    currStarReading: "3.2, 3.4",
    prevOrrLevel: "N, O",
    currOrrLevel: "P, Q",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 13,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 12,
      decodingWords: 72,
      firstGradeWordList: 51
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 3,
      informationalConventions: 3
    }
  },
  {
    studentId: "1083426",
    studentName: "Brandon Park",
    school: "Collegewood Elementary",
    grade: 3,
    teacher: "Ms. Alvarez",
    isEL: true,
    elLevel: "Bridging (Level 4)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.5, 2.7",
    currAmiraArm: "2.6",
    prevStarReading: "2.7",
    currStarReading: "2.7",
    prevOrrLevel: "M",
    currOrrLevel: "M, N",
    phonics: {
      oralBlending: 13,
      digraphsVowels: 12,
      isolatingSounds: 13,
      soundSegmentation: 11,
      removingManipulating: 11,
      decodingWords: 68,
      firstGradeWordList: 48
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 2,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 2,
      informationalConventions: 2
    }
  },

  // --- Maple Hill Elementary Grade 3 ---
  {
    studentId: "1084501",
    studentName: "Chloe Zhang",
    school: "Maple Hill Elementary",
    grade: 3,
    teacher: "Mrs. Ramirez",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.1, 3.4",
    currAmiraArm: "3.7, 4.0",
    prevStarReading: "3.3, 3.6",
    currStarReading: "3.9, 4.2",
    prevOrrLevel: "O, P",
    currOrrLevel: "Q, R",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 14,
      removingManipulating: 14,
      decodingWords: 82,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 3,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 3
    }
  },
  {
    studentId: "1084502",
    studentName: "Mateo Alvarez",
    school: "Maple Hill Elementary",
    grade: 3,
    teacher: "Mrs. Ramirez",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    // Decline / Regression example
    prevAmiraArm: "2.6, 2.9",
    currAmiraArm: "2.3, 2.4",
    prevStarReading: "2.8, 3.0",
    currStarReading: "2.4, 2.5",
    prevOrrLevel: "M, N",
    currOrrLevel: "L",
    phonics: {
      oralBlending: 11,
      digraphsVowels: 9,
      isolatingSounds: 10,
      soundSegmentation: 8,
      removingManipulating: 7,
      decodingWords: 48,
      firstGradeWordList: 40
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 1,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1084503",
    studentName: "Isabella Wu",
    school: "Maple Hill Elementary",
    grade: 3,
    teacher: "Mrs. Ramirez",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.9, 3.1",
    currAmiraArm: "3.3, 3.6",
    prevStarReading: "3.0",
    currStarReading: "3.4",
    prevOrrLevel: "N",
    currOrrLevel: "P",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 14,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 13,
      decodingWords: 76,
      firstGradeWordList: 52
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 4,
      opinionConventions: 3,
      informationalContent: 3,
      informationalConventions: 3
    }
  },
  {
    studentId: "1084504",
    studentName: "Noah Kim",
    school: "Maple Hill Elementary",
    grade: 3,
    teacher: "Ms. Patel",
    isEL: false,
    isSpEd: true,
    spedType: "IEP - Speech & Language",
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "1.9, 2.2",
    currAmiraArm: "2.5, 2.8",
    prevStarReading: "2.1, 2.4",
    currStarReading: "2.7, 3.0",
    prevOrrLevel: "K, L",
    currOrrLevel: "M, N",
    phonics: {
      oralBlending: 12,
      digraphsVowels: 11,
      isolatingSounds: 12,
      soundSegmentation: 10,
      removingManipulating: 10,
      decodingWords: 64,
      firstGradeWordList: 46
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1084505",
    studentName: "Maya Johnson",
    school: "Maple Hill Elementary",
    grade: 3,
    teacher: "Ms. Patel",
    isEL: false,
    isSpEd: false,
    is504: true,
    isFosterHomeless: true,
    prevAmiraArm: "1.4, 1.7",
    currAmiraArm: "1.6",
    prevStarReading: "1.5",
    currStarReading: "1.7",
    prevOrrLevel: "G, H",
    currOrrLevel: "I",
    phonics: {
      oralBlending: 8,
      digraphsVowels: 7,
      isolatingSounds: 9,
      soundSegmentation: 6,
      removingManipulating: 5,
      decodingWords: 39,
      firstGradeWordList: 33
    },
    writing: {
      narrativeContent: 1,
      narrativeConventions: 2,
      opinionContent: 1,
      opinionConventions: 1,
      informationalContent: 2,
      informationalConventions: 1
    }
  },
  {
    studentId: "1084506",
    studentName: "Austin Yeh",
    school: "Maple Hill Elementary",
    grade: 3,
    teacher: "Mr. Evans",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.4, 2.7",
    currAmiraArm: "3.0, 3.2",
    prevStarReading: "2.5",
    currStarReading: "3.1",
    prevOrrLevel: "L, M",
    currOrrLevel: "N, O",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 13,
      isolatingSounds: 14,
      soundSegmentation: 12,
      removingManipulating: 12,
      decodingWords: 74,
      firstGradeWordList: 50
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 2,
      informationalContent: 3,
      informationalConventions: 3
    }
  },

  // --- Vejar Elementary Grade 3 ---
  {
    studentId: "1085601",
    studentName: "Alexander Diaz",
    school: "Vejar Elementary",
    grade: 3,
    teacher: "Mrs. Davis",
    isEL: true,
    elLevel: "Emerging (Level 2)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "1.3, 1.5",
    currAmiraArm: "1.8, 2.0",
    prevStarReading: "1.4",
    currStarReading: "1.9",
    prevOrrLevel: "F, G",
    currOrrLevel: "H, I",
    phonics: {
      oralBlending: 9,
      digraphsVowels: 8,
      isolatingSounds: 9,
      soundSegmentation: 7,
      removingManipulating: 6,
      decodingWords: 44,
      firstGradeWordList: 36
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 1,
      opinionContent: 2,
      opinionConventions: 1,
      informationalContent: 1,
      informationalConventions: 1
    }
  },
  {
    studentId: "1085602",
    studentName: "Emily Tanaka",
    school: "Vejar Elementary",
    grade: 3,
    teacher: "Mrs. Davis",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.0, 3.3",
    currAmiraArm: "3.6, 3.9",
    prevStarReading: "3.2",
    currStarReading: "3.8",
    prevOrrLevel: "N, O",
    currOrrLevel: "P, Q",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 14,
      removingManipulating: 14,
      decodingWords: 80,
      firstGradeWordList: 54
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 3,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 3
    }
  },
  {
    studentId: "1085603",
    studentName: "Gabriel Ramos",
    school: "Vejar Elementary",
    grade: 3,
    teacher: "Mr. Nguyen",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: true,
    spedType: "IEP - RSP",
    is504: false,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "2.1, 2.4",
    currAmiraArm: "1.9",
    prevStarReading: "2.2",
    currStarReading: "1.8",
    prevOrrLevel: "J, K",
    currOrrLevel: "I",
    phonics: {
      oralBlending: 8,
      digraphsVowels: 6,
      isolatingSounds: 8,
      soundSegmentation: 5,
      removingManipulating: 4,
      decodingWords: 35,
      firstGradeWordList: 30
    },
    writing: {
      narrativeContent: 1,
      narrativeConventions: 1,
      opinionContent: 1,
      opinionConventions: 1,
      informationalContent: 1,
      informationalConventions: 1
    }
  },
  {
    studentId: "1085604",
    studentName: "Hannah Song",
    school: "Vejar Elementary",
    grade: 3,
    teacher: "Mr. Nguyen",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.7, 3.0",
    currAmiraArm: "3.2, 3.5",
    prevStarReading: "2.9",
    currStarReading: "3.4",
    prevOrrLevel: "M, N",
    currOrrLevel: "O, P",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 13,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 12,
      decodingWords: 75,
      firstGradeWordList: 51
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 3,
      informationalConventions: 3
    }
  },
  {
    studentId: "1085605",
    studentName: "Damian Ortiz",
    school: "Vejar Elementary",
    grade: 3,
    teacher: "Ms. Martinez",
    isEL: true,
    elLevel: "Bridging (Level 4)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.2, 2.5",
    currAmiraArm: "2.7, 3.0",
    prevStarReading: "2.3",
    currStarReading: "2.8",
    prevOrrLevel: "K, L",
    currOrrLevel: "M, N",
    phonics: {
      oralBlending: 13,
      digraphsVowels: 12,
      isolatingSounds: 13,
      soundSegmentation: 11,
      removingManipulating: 11,
      decodingWords: 67,
      firstGradeWordList: 47
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 2,
      opinionContent: 3,
      opinionConventions: 2,
      informationalContent: 3,
      informationalConventions: 2
    }
  },

  // --- Castle Rock Elementary Grade 3 ---
  {
    studentId: "1086701",
    studentName: "Mia Chen",
    school: "Castle Rock Elementary",
    grade: 3,
    teacher: "Mr. Foster",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.2, 3.6",
    currAmiraArm: "4.0, 4.3",
    prevStarReading: "3.5",
    currStarReading: "4.2",
    prevOrrLevel: "P, Q",
    currOrrLevel: "R, S",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 15,
      removingManipulating: 15,
      decodingWords: 85,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 4
    }
  },
  {
    studentId: "1086702",
    studentName: "Caleb Vance",
    school: "Castle Rock Elementary",
    grade: 3,
    teacher: "Mr. Foster",
    isEL: false,
    isSpEd: false,
    is504: true,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "2.8, 3.1",
    currAmiraArm: "2.5, 2.6",
    prevStarReading: "3.0",
    currStarReading: "2.5",
    prevOrrLevel: "N, O",
    currOrrLevel: "M",
    phonics: {
      oralBlending: 11,
      digraphsVowels: 9,
      isolatingSounds: 10,
      soundSegmentation: 8,
      removingManipulating: 7,
      decodingWords: 52,
      firstGradeWordList: 41
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1086703",
    studentName: "Daniel Mendoza",
    school: "Castle Rock Elementary",
    grade: 3,
    teacher: "Mrs. Jenkins",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.0, 2.3",
    currAmiraArm: "2.6, 2.9",
    prevStarReading: "2.2",
    currStarReading: "2.7",
    prevOrrLevel: "J, K",
    currOrrLevel: "L, M",
    phonics: {
      oralBlending: 13,
      digraphsVowels: 12,
      isolatingSounds: 13,
      soundSegmentation: 11,
      removingManipulating: 10,
      decodingWords: 66,
      firstGradeWordList: 48
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 2,
      opinionContent: 3,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1086704",
    studentName: "Avery Wong",
    school: "Castle Rock Elementary",
    grade: 3,
    teacher: "Ms. Bailey",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.6, 2.9",
    currAmiraArm: "3.1, 3.4",
    prevStarReading: "2.8",
    currStarReading: "3.3",
    prevOrrLevel: "M",
    currOrrLevel: "O",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 14,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 13,
      decodingWords: 76,
      firstGradeWordList: 52
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 4,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 4,
      informationalConventions: 3
    }
  },

  // --- Evergreen Elementary Grade 3 ---
  {
    studentId: "1087801",
    studentName: "Kayla Chang",
    school: "Evergreen Elementary",
    grade: 3,
    teacher: "Mrs. Henderson",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.0, 3.4",
    currAmiraArm: "3.8, 4.1",
    prevStarReading: "3.2",
    currStarReading: "4.0",
    prevOrrLevel: "O, P",
    currOrrLevel: "Q, R",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 14,
      removingManipulating: 14,
      decodingWords: 82,
      firstGradeWordList: 54
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 3,
      opinionContent: 4,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 3
    }
  },
  {
    studentId: "1087802",
    studentName: "Logan Miller",
    school: "Evergreen Elementary",
    grade: 3,
    teacher: "Mrs. Henderson",
    isEL: false,
    isSpEd: true,
    spedType: "IEP - RSP",
    is504: false,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "2.4, 2.7",
    currAmiraArm: "2.1",
    prevStarReading: "2.5",
    currStarReading: "2.0",
    prevOrrLevel: "L, M",
    currOrrLevel: "K",
    phonics: {
      oralBlending: 9,
      digraphsVowels: 8,
      isolatingSounds: 9,
      soundSegmentation: 6,
      removingManipulating: 5,
      decodingWords: 40,
      firstGradeWordList: 34
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 1,
      opinionContent: 1,
      opinionConventions: 1,
      informationalContent: 2,
      informationalConventions: 1
    }
  },
  {
    studentId: "1087803",
    studentName: "Siddharth Rao",
    school: "Evergreen Elementary",
    grade: 3,
    teacher: "Mr. Sullivan",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.3, 2.6",
    currAmiraArm: "3.0, 3.3",
    prevStarReading: "2.4",
    currStarReading: "3.1",
    prevOrrLevel: "K, L",
    currOrrLevel: "M, N",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 13,
      isolatingSounds: 14,
      soundSegmentation: 12,
      removingManipulating: 12,
      decodingWords: 73,
      firstGradeWordList: 49
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 3,
      informationalConventions: 3
    }
  },
  {
    studentId: "1087804",
    studentName: "Alyssa Castillo",
    school: "Evergreen Elementary",
    grade: 3,
    teacher: "Ms. Coleman",
    isEL: true,
    elLevel: "Emerging (Level 2)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: true,
    prevAmiraArm: "1.2, 1.4",
    currAmiraArm: "1.7, 1.9",
    prevStarReading: "1.3",
    currStarReading: "1.8",
    prevOrrLevel: "PP, P, D",
    currOrrLevel: "E, F",
    phonics: {
      oralBlending: 8,
      digraphsVowels: 7,
      isolatingSounds: 8,
      soundSegmentation: 6,
      removingManipulating: 5,
      decodingWords: 38,
      firstGradeWordList: 31
    },
    writing: {
      narrativeContent: 1,
      narrativeConventions: 1,
      opinionContent: 1,
      opinionConventions: 1,
      informationalContent: 2,
      informationalConventions: 1
    }
  },

  // --- Quail Summit Elementary Grade 3 ---
  {
    studentId: "1088901",
    studentName: "Olivia Zhang",
    school: "Quail Summit Elementary",
    grade: 3,
    teacher: "Ms. Brooks",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.4, 3.8",
    currAmiraArm: "4.2, 4.5",
    prevStarReading: "3.6",
    currStarReading: "4.4",
    prevOrrLevel: "Q, R",
    currOrrLevel: "S, T",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 15,
      removingManipulating: 15,
      decodingWords: 85,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 4
    }
  },
  {
    studentId: "1088902",
    studentName: "Joshua Delgado",
    school: "Quail Summit Elementary",
    grade: 3,
    teacher: "Ms. Brooks",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: true,
    isFosterHomeless: false,
    prevAmiraArm: "2.1, 2.4",
    currAmiraArm: "2.7, 3.0",
    prevStarReading: "2.2",
    currStarReading: "2.8",
    prevOrrLevel: "J, K",
    currOrrLevel: "L, M",
    phonics: {
      oralBlending: 13,
      digraphsVowels: 11,
      isolatingSounds: 12,
      soundSegmentation: 10,
      removingManipulating: 10,
      decodingWords: 65,
      firstGradeWordList: 47
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 2,
      opinionContent: 3,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1088903",
    studentName: "Samantha Kuo",
    school: "Quail Summit Elementary",
    grade: 3,
    teacher: "Mr. Bryant",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "2.9, 3.2",
    currAmiraArm: "2.6, 2.7",
    prevStarReading: "3.1",
    currStarReading: "2.6",
    prevOrrLevel: "N, O",
    currOrrLevel: "M",
    phonics: {
      oralBlending: 11,
      digraphsVowels: 10,
      isolatingSounds: 11,
      soundSegmentation: 8,
      removingManipulating: 7,
      decodingWords: 54,
      firstGradeWordList: 42
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 3,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1088904",
    studentName: "Benjamin Lee",
    school: "Quail Summit Elementary",
    grade: 3,
    teacher: "Mrs. Alexander",
    isEL: true,
    elLevel: "Bridging (Level 4)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.7, 3.0",
    currAmiraArm: "3.3, 3.6",
    prevStarReading: "2.8",
    currStarReading: "3.5",
    prevOrrLevel: "M, N",
    currOrrLevel: "O, P",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 14,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 13,
      decodingWords: 77,
      firstGradeWordList: 53
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 4,
      opinionConventions: 3,
      informationalContent: 3,
      informationalConventions: 3
    }
  },

  // --- Westhoff Elementary Grade 3 ---
  {
    studentId: "1089101",
    studentName: "Marcus Thorne",
    school: "Westhoff Elementary",
    grade: 3,
    teacher: "Mrs. Cole",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.8, 3.1",
    currAmiraArm: "3.4, 3.7",
    prevStarReading: "2.9",
    currStarReading: "3.5",
    prevOrrLevel: "N",
    currOrrLevel: "P, Q",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 14,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 13,
      decodingWords: 78,
      firstGradeWordList: 53
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 4,
      informationalContent: 3,
      informationalConventions: 3
    }
  },
  {
    studentId: "1089102",
    studentName: "Valeria Gutierrez",
    school: "Westhoff Elementary",
    grade: 3,
    teacher: "Mrs. Cole",
    isEL: true,
    elLevel: "Emerging (Level 1)",
    isSpEd: true,
    spedType: "IEP - RSP Special Ed",
    is504: false,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "1.7, 1.9",
    currAmiraArm: "1.5",
    prevStarReading: "1.8",
    currStarReading: "1.4",
    prevOrrLevel: "H, I",
    currOrrLevel: "G",
    phonics: {
      oralBlending: 7,
      digraphsVowels: 5,
      isolatingSounds: 7,
      soundSegmentation: 4,
      removingManipulating: 3,
      decodingWords: 28,
      firstGradeWordList: 24
    },
    writing: {
      narrativeContent: 1,
      narrativeConventions: 1,
      opinionContent: 1,
      opinionConventions: 1,
      informationalContent: 1,
      informationalConventions: 1
    }
  },
  {
    studentId: "1089103",
    studentName: "Jacob Tsai",
    school: "Westhoff Elementary",
    grade: 3,
    teacher: "Mr. West",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.1, 3.4",
    currAmiraArm: "3.7, 4.0",
    prevStarReading: "3.2",
    currStarReading: "3.9",
    prevOrrLevel: "O",
    currOrrLevel: "R",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 14,
      removingManipulating: 14,
      decodingWords: 81,
      firstGradeWordList: 54
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 3,
      informationalContent: 4,
      informationalConventions: 4
    }
  },
  {
    studentId: "1089104",
    studentName: "Ella Vasquez",
    school: "Westhoff Elementary",
    grade: 3,
    teacher: "Ms. Jordan",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.2, 2.5",
    currAmiraArm: "2.8, 3.1",
    prevStarReading: "2.4",
    currStarReading: "3.0",
    prevOrrLevel: "K, L",
    currOrrLevel: "M, N",
    phonics: {
      oralBlending: 13,
      digraphsVowels: 12,
      isolatingSounds: 13,
      soundSegmentation: 11,
      removingManipulating: 11,
      decodingWords: 68,
      firstGradeWordList: 48
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 2,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 2,
      informationalConventions: 2
    }
  },

  // --- CJ Morris Elementary Grade 3 ---
  {
    studentId: "1089201",
    studentName: "Zoe Liang",
    school: "CJ Morris Elementary",
    grade: 3,
    teacher: "Mrs. Ortiz",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.3, 3.7",
    currAmiraArm: "4.1, 4.4",
    prevStarReading: "3.5",
    currStarReading: "4.3",
    prevOrrLevel: "P, Q",
    currOrrLevel: "R, S",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 15,
      removingManipulating: 15,
      decodingWords: 84,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 3
    }
  },
  {
    studentId: "1089202",
    studentName: "Diego Romero",
    school: "CJ Morris Elementary",
    grade: 3,
    teacher: "Mrs. Ortiz",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "2.6, 2.9",
    currAmiraArm: "2.4, 2.5",
    prevStarReading: "2.8",
    currStarReading: "2.4",
    prevOrrLevel: "M, N",
    currOrrLevel: "L",
    phonics: {
      oralBlending: 11,
      digraphsVowels: 9,
      isolatingSounds: 10,
      soundSegmentation: 8,
      removingManipulating: 7,
      decodingWords: 50,
      firstGradeWordList: 39
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 1
    }
  },
  {
    studentId: "1089203",
    studentName: "Lucas Garza",
    school: "CJ Morris Elementary",
    grade: 3,
    teacher: "Mr. Gomez",
    isEL: false,
    isSpEd: true,
    spedType: "IEP - RSP",
    is504: false,
    isFosterHomeless: true,
    prevAmiraArm: "1.4, 1.7",
    currAmiraArm: "2.0, 2.2",
    prevStarReading: "1.5",
    currStarReading: "2.1",
    prevOrrLevel: "G, H",
    currOrrLevel: "I, J",
    phonics: {
      oralBlending: 10,
      digraphsVowels: 8,
      isolatingSounds: 9,
      soundSegmentation: 7,
      removingManipulating: 6,
      decodingWords: 43,
      firstGradeWordList: 35
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 1,
      opinionContent: 1,
      opinionConventions: 2,
      informationalContent: 1,
      informationalConventions: 1
    }
  },
  {
    studentId: "1089204",
    studentName: "Isabella Huang",
    school: "CJ Morris Elementary",
    grade: 3,
    teacher: "Ms. Murray",
    isEL: true,
    elLevel: "Bridging (Level 4)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.8, 3.1",
    currAmiraArm: "3.4, 3.7",
    prevStarReading: "3.0",
    currStarReading: "3.6",
    prevOrrLevel: "N, O",
    currOrrLevel: "P, Q",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 14,
      isolatingSounds: 14,
      soundSegmentation: 14,
      removingManipulating: 13,
      decodingWords: 79,
      firstGradeWordList: 53
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 4,
      informationalConventions: 3
    }
  },

  // --- Walnut Elementary Grade 3 ---
  {
    studentId: "1089301",
    studentName: "Aiden Scott",
    school: "Walnut Elementary",
    grade: 3,
    teacher: "Mrs. Crawford",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.1, 3.5",
    currAmiraArm: "3.9, 4.2",
    prevStarReading: "3.3",
    currStarReading: "4.1",
    prevOrrLevel: "O, P",
    currOrrLevel: "R, S",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 15,
      removingManipulating: 14,
      decodingWords: 83,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 3,
      informationalContent: 4,
      informationalConventions: 4
    }
  },
  {
    studentId: "1089302",
    studentName: "Camila Navarro",
    school: "Walnut Elementary",
    grade: 3,
    teacher: "Mrs. Crawford",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: true,
    isFosterHomeless: false,
    // Steady
    prevAmiraArm: "2.5, 2.8",
    currAmiraArm: "2.8, 2.9",
    prevStarReading: "2.6",
    currStarReading: "2.7",
    prevOrrLevel: "L, M",
    currOrrLevel: "M",
    phonics: {
      oralBlending: 12,
      digraphsVowels: 11,
      isolatingSounds: 12,
      soundSegmentation: 10,
      removingManipulating: 9,
      decodingWords: 62,
      firstGradeWordList: 44
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1089303",
    studentName: "Leo Fernandez",
    school: "Walnut Elementary",
    grade: 3,
    teacher: "Mr. Henry",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "2.7, 3.0",
    currAmiraArm: "2.4, 2.5",
    prevStarReading: "2.9",
    currStarReading: "2.4",
    prevOrrLevel: "M, N",
    currOrrLevel: "L",
    phonics: {
      oralBlending: 10,
      digraphsVowels: 9,
      isolatingSounds: 10,
      soundSegmentation: 7,
      removingManipulating: 6,
      decodingWords: 49,
      firstGradeWordList: 38
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 1,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  {
    studentId: "1089304",
    studentName: "Grace Cho",
    school: "Walnut Elementary",
    grade: 3,
    teacher: "Ms. Boyd",
    isEL: true,
    elLevel: "Bridging (Level 4)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "2.6, 2.9",
    currAmiraArm: "3.2, 3.5",
    prevStarReading: "2.8",
    currStarReading: "3.4",
    prevOrrLevel: "M, N",
    currOrrLevel: "P, Q",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 14,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 13,
      decodingWords: 77,
      firstGradeWordList: 52
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 3,
      informationalContent: 3,
      informationalConventions: 3
    }
  },

  // --- Grade 1, 2, 4, 5 Records Across Schools for Matrix ---
  // Collegewood Grade 1
  {
    studentId: "1081101",
    studentName: "Liam Johnson",
    school: "Collegewood Elementary",
    grade: 1,
    teacher: "Mrs. Adams",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "PP, P",
    currAmiraArm: "0.8, 1.1",
    prevStarReading: "0.5",
    currStarReading: "1.0",
    prevOrrLevel: "AA, A",
    currOrrLevel: "C, D",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 13,
      isolatingSounds: 14,
      soundSegmentation: 13,
      removingManipulating: 11,
      decodingWords: 60,
      firstGradeWordList: 45
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 2,
      informationalContent: 3,
      informationalConventions: 2
    }
  },
  // Collegewood Grade 2
  {
    studentId: "1082201",
    studentName: "Emma Zhang",
    school: "Collegewood Elementary",
    grade: 2,
    teacher: "Ms. Chen",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "1.4, 1.7",
    currAmiraArm: "2.1, 2.3",
    prevStarReading: "1.6",
    currStarReading: "2.2",
    prevOrrLevel: "G, H",
    currOrrLevel: "J, K",
    phonics: {
      oralBlending: 14,
      digraphsVowels: 13,
      isolatingSounds: 14,
      soundSegmentation: 12,
      removingManipulating: 12,
      decodingWords: 70,
      firstGradeWordList: 50
    },
    writing: {
      narrativeContent: 3,
      narrativeConventions: 3,
      opinionContent: 3,
      opinionConventions: 2,
      informationalContent: 3,
      informationalConventions: 3
    }
  },
  // Collegewood Grade 4
  {
    studentId: "1084401",
    studentName: "William Parker",
    school: "Collegewood Elementary",
    grade: 4,
    teacher: "Mr. Tanaka",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "3.8, 4.1",
    currAmiraArm: "4.5, 4.8",
    prevStarReading: "4.0",
    currStarReading: "4.7",
    prevOrrLevel: "R, S",
    currOrrLevel: "U, V",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 15,
      removingManipulating: 15,
      decodingWords: 85,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 4
    }
  },
  // Collegewood Grade 5
  {
    studentId: "1085501",
    studentName: "Madison Clark",
    school: "Collegewood Elementary",
    grade: 5,
    teacher: "Mrs. Henderson",
    isEL: false,
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "4.9, 5.2",
    currAmiraArm: "5.6, 5.9",
    prevStarReading: "5.1",
    currStarReading: "5.8",
    prevOrrLevel: "V, W",
    currOrrLevel: "Y, Z",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 15,
      removingManipulating: 15,
      decodingWords: 85,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 4,
      opinionContent: 4,
      opinionConventions: 4,
      informationalContent: 4,
      informationalConventions: 4
    }
  },

  // Maple Hill Grade 1
  {
    studentId: "1081102",
    studentName: "Harper Lee",
    school: "Maple Hill Elementary",
    grade: 1,
    teacher: "Mrs. Kim",
    isEL: true,
    elLevel: "Expanding (Level 3)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "0.4",
    currAmiraArm: "0.9, 1.2",
    prevStarReading: "0.6",
    currStarReading: "1.1",
    prevOrrLevel: "B",
    currOrrLevel: "D, E",
    phonics: {
      oralBlending: 13,
      digraphsVowels: 12,
      isolatingSounds: 13,
      soundSegmentation: 11,
      removingManipulating: 10,
      decodingWords: 58,
      firstGradeWordList: 44
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 2,
      informationalContent: 3,
      informationalConventions: 2
    }
  },
  // Maple Hill Grade 4
  {
    studentId: "1084402",
    studentName: "Mason Rivera",
    school: "Maple Hill Elementary",
    grade: 4,
    teacher: "Ms. Wong",
    isEL: false,
    isSpEd: true,
    spedType: "IEP - RSP",
    is504: false,
    isFosterHomeless: false,
    // Decline
    prevAmiraArm: "3.4, 3.7",
    currAmiraArm: "3.1",
    prevStarReading: "3.5",
    currStarReading: "3.0",
    prevOrrLevel: "P, Q",
    currOrrLevel: "O",
    phonics: {
      oralBlending: 12,
      digraphsVowels: 10,
      isolatingSounds: 11,
      soundSegmentation: 9,
      removingManipulating: 8,
      decodingWords: 55,
      firstGradeWordList: 43
    },
    writing: {
      narrativeContent: 2,
      narrativeConventions: 2,
      opinionContent: 2,
      opinionConventions: 2,
      informationalContent: 2,
      informationalConventions: 2
    }
  },
  // Vejar Grade 5
  {
    studentId: "1085502",
    studentName: "Ava Mendoza",
    school: "Vejar Elementary",
    grade: 5,
    teacher: "Ms. Torres",
    isEL: true,
    elLevel: "Bridging (Level 4)",
    isSpEd: false,
    is504: false,
    isFosterHomeless: false,
    prevAmiraArm: "4.7, 5.0",
    currAmiraArm: "5.4, 5.7",
    prevStarReading: "4.8",
    currStarReading: "5.5",
    prevOrrLevel: "U, V",
    currOrrLevel: "X, Y",
    phonics: {
      oralBlending: 15,
      digraphsVowels: 15,
      isolatingSounds: 15,
      soundSegmentation: 14,
      removingManipulating: 14,
      decodingWords: 84,
      firstGradeWordList: 55
    },
    writing: {
      narrativeContent: 4,
      narrativeConventions: 3,
      opinionContent: 4,
      opinionConventions: 4,
      informationalContent: 3,
      informationalConventions: 4
    }
  }
];
