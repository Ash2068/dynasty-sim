// --- 1. GLOBAL STATE ---
let p = {}; 
let archive = JSON.parse(localStorage.getItem('dynasty_archive')) || [];
let archive = JSON.parse(localStorage.getItem('dynasty_archive')) || [];
let graveyard = JSON.parse(localStorage.getItem('dynasty_graveyard')) || [];
const CORPORATE_CAREER_PATHS = [
    [["Jr. Internal Auditor", 82718, "secondary"], ["Internal Auditor", 90474, "university"], ["Sr. Internal Auditor", 1952503, "university"]],
    [["Jr. Financial Analyst", 43550, "university", "EUR"], ["Financial Analyst", 49726, "university", "EUR"], ["Sr. Financial Analyst", 55133, "university", "EUR"]],
    [["Jr. Computer Programmer", 41850, "university", "EUR"], ["Computer Programmer", 57300, "university", "EUR"], ["Sr. Computer Programmer", 30050, "university", "EUR"]],
    [["Jr. Insurance Agent", 23450, "secondary", "EUR"], ["Insurance Agent", 78600, "secondary", "EUR"], ["Sr. Insurance Agent", 37066, "secondary", "EUR"]],
    [["Jr. Environmental Scientist", 38633, "university", "EUR"], ["Environmental Scientist", 42983, "university", "EUR"], ["Sr. Environmental Scientist", 51350, "university", "EUR"]],
    [["Jr. Stockbroker", 36616, "university", "EUR"], ["Stockbroker", 64183, "university", "EUR"], ["Sr. Stockbroker", 88683, "university", "EUR"]],
    [["Jr. Operations Analyst", 50714, "university"], ["Operations Analyst", 46321, "university"], ["Sr. Operations Analyst", 68743, "university"]],
    [["Jr. Database Administrator", 58340, "university"], ["Database Administrator", 43891, "university"], ["Sr. Database Administrator", 50000, "university", "EUR"]],
    [["Jr. Lobbyist", 49895, "university"], ["Lobbyist", 71283, "university"], ["Sr. Lobbyist", 76170, "university"]],
    [["Jr. Biotechnologist", 33726, "university"], ["Biotechnologist", 49320, "university"], ["Sr. Biotechnologist", 51200, "university"]],
    [["Jr. Microbiologist", 31393, "university"], ["Microbiologist", 38108, "university"], ["Sr. Microbiologist", 61899, "university"]],
    [["Jr. Architect", 40631, "university"], ["Architect", 40000, "university", "EUR"], ["Sr. Architect", 66289, "university", "EUR"]],
    [["Jr. Business Analyst", 41038, "university", "EUR"], ["Business Analyst", 64050, "university"], ["Sr. Business Analyst", 71370, "university"]],
    [["Jr. Accountant", 52700, "university"], ["Accountant", 52850, "university"], ["Sr. Accountant", 53800, "university"]],
    [["Jr. IT Support", 28206, "university", "EUR"], ["IT Support", 38387, "university"], ["Sr. IT Support", 46610, "university"]],
    [["Jr. Translator", 26384, "university", "EUR"], ["Translator", 41429, "university"], ["Sr. Translator", 20900, "university", "EUR"]],
    [["Engineer I", 43663, "university", "EUR"], ["Engineer II", 57350, "university"], ["Engineer III", 72000, "university"], ["Assistant Engineering Manager", 60894, "university"], ["Engineering Manager", 113000, "university"], ["Director of Engineering", 125000, "university"], ["VP of Engineering", 145000, "university"]],
    [["Assistant Vice President", 101124, "business"], ["Vice President", 141500, "business"], ["First Vice President", 176669, "business"], ["Senior Vice President", 160000, "business"], ["Executive Vice President", 175262, "business"], ["Managing Director", 190955, "business"], ["President", 228749, "business"]],
    [["Apprentice Telemarketer", 20190, "secondary"], ["Telemarketer", 19820, "secondary"]],
    [["Receptionist", 16600, "secondary", "EUR"]],
    [["Factory Worker", 16664, "none", "EUR"]],
    [["Janitor", 20091, "none", "EUR", null, true]]
];
const CORPORATE_JOBS_REJECTING_CRIMINAL_RECORDS = new Set([
    "Jr. Internal Auditor", "Internal Auditor", "Sr. Internal Auditor",
    "Jr. Financial Analyst", "Financial Analyst", "Sr. Financial Analyst",
    "Jr. Computer Programmer", "Computer Programmer", "Sr. Computer Programmer",
    "Jr. Insurance Agent", "Insurance Agent", "Sr. Insurance Agent",
    "Jr. Operations Analyst", "Operations Analyst", "Sr. Operations Analyst",
    "Jr. Database Administrator", "Database Administrator", "Sr. Database Administrator",
    "Jr. Microbiologist", "Microbiologist", "Sr. Microbiologist",
    "Jr. IT Support", "IT Support", "Sr. IT Support",
    "Apprentice Telemarketer", "Telemarketer", "Receptionist"
]);
const MODEL_AGENCY_PATH = [
    { title: "Foot Model", salary: 20000 },
    { title: "Hand Model", salary: 32280 },
    { title: "Catalog Model", salary: 43970 },
    { title: "Lingerie Model", salary: 50000 },
    { title: "Runway Model", salary: 54670 }
];
const AIRLINE_CAREER_PATHS = [
    [
        { title: "Jr. Flight Attendant", salary: 22979, reqEducation: "secondary", canHoldWithCriminalRecord: false },
        { title: "Flight Attendant", salary: 26300, reqEducation: "secondary", canHoldWithCriminalRecord: false },
        { title: "Sr. Flight Attendant", salary: 38500, reqEducation: "secondary", canHoldWithCriminalRecord: false },
        { title: "Pilot Trainee", salary: 64820, reqEducation: "university", reqLicense: "Pilot" },
        { title: "Co-Pilot", salary: 44683, reqEducation: "university" },
        { title: "Pilot", salary: 71496, reqEducation: "university" },
        { title: "Chief Pilot", salary: 85350, reqEducation: "university" }
    ],
    [{ title: "Baggage Handler", salary: 21152, reqEducation: "none" }]
];
const VETERINARY_CAREER_PATH = [
    { title: "Apprentice Pet Groomer", salary: 22710, reqEducation: "none", canHoldWithCriminalRecord: false },
    { title: "Pet Groomer", salary: 32000, reqEducation: "none", canHoldWithCriminalRecord: false },
    { title: "Jr. Veterinarian", salary: 47500, reqEducation: "advanced", reqAdvanced: "Veterinary School" },
    { title: "Veterinarian", salary: 17855, reqEducation: "advanced", reqAdvanced: "Veterinary School" },
    { title: "Sr. Veterinarian", salary: 73095, reqEducation: "advanced", reqAdvanced: "Veterinary School" }
];
const HOSPITAL_CAREERS = [
    { title: "Clinical Nurse Specialist", salary: 79164, reqEducation: "advanced", reqAdvanced: "Nursing School", promotionFrom: "Registered Nurse", minimumPromotionYears: 1, workType: "hospital" },
    { title: "Brain Surgeon", salary: 175000, reqEducation: "advanced", reqAdvanced: "Medical School", canHoldWithCriminalRecord: false, workType: "hospital" },
    { title: "Family Physician", salary: 99500, reqEducation: "advanced", reqAdvanced: "Medical School", workType: "hospital" },
    { title: "Jr. Psychiatrist", salary: 75600, reqEducation: "advanced", reqAdvanced: "Medical School", canHoldWithCriminalRecord: false },
    { title: "Psychiatrist", salary: 80892, reqEducation: "advanced", reqAdvanced: "Medical School", canHoldWithCriminalRecord: false },
    { title: "Sr. Psychiatrist", salary: 83500, reqEducation: "advanced", reqAdvanced: "Medical School", canHoldWithCriminalRecord: false },
    { title: "Jr. Pharmacist", salary: 83188, reqEducation: "advanced", reqAdvanced: "Pharmacy School", canHoldWithCriminalRecord: false },
    { title: "Pharmacist", salary: 48500, reqEducation: "advanced", reqAdvanced: "Pharmacy School", canHoldWithCriminalRecord: false },
    { title: "Sr. Pharmacist", salary: 57500, reqEducation: "advanced", reqAdvanced: "Pharmacy School", canHoldWithCriminalRecord: false }
];
const MUNICIPAL_CAREER_PATHS = [
    [
        { title: "Magistrate", salary: 80350, reqEducation: "advanced", reqAdvanced: "Law School", requiredCareerYears: 30 },
        { title: "Magistrate Court Judge", salary: 129500, reqEducation: "advanced", reqAdvanced: "Law School" },
        { title: "District Court Judge", salary: 129780, reqEducation: "advanced", reqAdvanced: "Law School" },
        { title: "Associate Chief Justice", salary: 174000, reqEducation: "advanced", reqAdvanced: "Law School" },
        { title: "Chief Justice", salary: 216400, reqEducation: "advanced", reqAdvanced: "Law School" }
    ],
    [{ title: "Sculptor", salary: 24411, reqEducation: "none" }],
    [
        { title: "Jr. Mail Carrier", salary: 35871, reqEducation: "secondary" },
        { title: "Mail Carrier", salary: 37800, reqEducation: "secondary" },
        { title: "Sr. Mail Carrier", salary: 40327, reqEducation: "secondary" }
    ],
    [{ title: "Bus Driver", salary: 32500, currency: "EUR", reqEducation: "none", reqLicense: "Driving", canHoldWithCriminalRecord: false }]
];
const NEWSPAPER_CAREER_PATHS = [
    [
        { title: "Jr. Editor", salary: 51717, reqEducation: "university", requiredCareerYears: 7, canHoldWithCriminalRecord: true },
        { title: "Editor", salary: 65000, reqEducation: "university", canHoldWithCriminalRecord: true, salaryEstimated: true },
        { title: "Sr. Editor", salary: 75000, reqEducation: "university", canHoldWithCriminalRecord: true, salaryEstimated: true }
    ],
    [
        { title: "Apprentice Photographer", salary: 31500, reqEducation: "secondary" },
        { title: "Photographer", salary: 32163, reqEducation: "secondary" }
    ]
];
const SCHOOL_DISTRICT_CAREER_PATH = [
    { title: "Teacher", salary: 36886, reqEducation: "university", canHoldWithCriminalRecord: false },
    { title: "Tech Teacher", salary: 39100, currency: "EUR", reqEducation: "university", canHoldWithCriminalRecord: false },
    { title: "Head Tech Teacher", salary: 40040, reqEducation: "university", canHoldWithCriminalRecord: false },
    { title: "Asst. Principal", salary: 57500, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "Principal", salary: 75200, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "Asst. Superintendent", salary: 89377, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "Superintendent", salary: 103554, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "School President", salary: 210493, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false }
];
const UNIVERSITY_DISTRICT_CAREERS = [
    { title: "College Dean", salary: 182663, reqEducation: "university", requiredCareerYears: 30, canHoldWithCriminalRecord: false },
    { title: "Professor", salary: 80408, reqEducation: "advanced", reqAdvanced: "Graduate School", requiredCareerYears: 10, canHoldWithCriminalRecord: false }
];
const UNIVERSITY_DISTRICT_ARCHAEOLOGY_PATH = [
    { title: "Jr. Archeologist", salary: 40009, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "Archeologist", salary: 49437, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "Sr. Archeologist", salary: 58865, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false }
];
const LAW_FIRM_CAREER_PATH = [
    { title: "Legal Secretary", salary: 26388, reqEducation: "community-college", canHoldWithCriminalRecord: false },
    { title: "Legal Records Manager", salary: 31800, reqEducation: "community-college", canHoldWithCriminalRecord: false },
    { title: "Paralegal", salary: 44807, reqEducation: "community-college", canHoldWithCriminalRecord: false },
    { title: "Law Clerk", salary: 103408, reqEducation: "advanced", reqAdvanced: "Law School", canHoldWithCriminalRecord: false },
    { title: "Junior Associate", salary: 122112, reqEducation: "advanced", reqAdvanced: "Law School", canHoldWithCriminalRecord: false },
    { title: "Associate", salary: 134065, reqEducation: "advanced", reqAdvanced: "Law School", canHoldWithCriminalRecord: false },
    { title: "Junior Partner", salary: 187855, reqEducation: "advanced", reqAdvanced: "Law School", canHoldWithCriminalRecord: false },
    { title: "Partner", salary: 201613, reqEducation: "advanced", reqAdvanced: "Law School", canHoldWithCriminalRecord: false }
];
const RESTAURANT_FRONT_OF_HOUSE_PATH = [
    { title: "Food Runner", salary: 17000, reqEducation: "secondary", canHoldWithCriminalRecord: true },
    { title: "Server", salary: 20700, reqEducation: "secondary", canHoldWithCriminalRecord: true, promotionFromAny: ["Food Runner", "Busser", "Host"] },
    { title: "Head Waiter", salary: 18524, reqEducation: "secondary", canHoldWithCriminalRecord: true },
    { title: "Expeditor", salary: 29378, reqEducation: "secondary" },
    { title: "Assistant Manager", salary: 25000, currency: "EUR", reqEducation: "secondary" },
    { title: "General Manager", salary: 32400, reqEducation: "secondary" }
];
const RESTAURANT_ENTRY_LEVEL_JOBS = [
    { title: "Busser", salary: 16000, reqEducation: "secondary", canHoldWithCriminalRecord: true, promotesTo: "Server" },
    { title: "Host", salary: 16000, reqEducation: "secondary", canHoldWithCriminalRecord: true, promotesTo: "Server" }
].map(job => ({ reqSmart: 0, currency: "USD", workType: "restaurant", payGrowth: "gradual", ...job }));
const RESTAURANT_BARTENDER_PATH = [
    { title: "Jr. Bartender", salary: 36345, reqEducation: "none", reqLooks: 60, canHoldWithCriminalRecord: true },
    { title: "Bartender", salary: 32289, reqEducation: "none", canHoldWithCriminalRecord: true },
    { title: "Sr. Bartender", salary: 37180, reqEducation: "none", canHoldWithCriminalRecord: true }
];
const RESTAURANT_SOMMELIER_PATH = [
    { title: "Introductory Sommelier", salary: 50000, reqEducation: "secondary" },
    { title: "Certified Sommelier", salary: 55000, reqEducation: "secondary" },
    { title: "Advanced Sommelier", salary: 85000, reqEducation: "secondary" },
    { title: "Master Sommelier", salary: 89000, reqEducation: "secondary" }
];
const RESTAURANT_CHEF_PATH = [
    { title: "Line Cook", salary: 13500, reqEducation: "community-college", requiredCareerYears: 3 },
    { title: "Short Order Cook", salary: 18500, reqEducation: "community-college", requiredCareerYears: 3 },
    { title: "Apprentice Chef", salary: 16600, currency: "EUR", reqEducation: "community-college", requiredCareerYears: 3 },
    { title: "Chef Tournant", salary: 30000, reqEducation: "community-college" },
    { title: "Chef Garde Manager", salary: 32600, reqEducation: "community-college" },
    { title: "Junior Sous Chef", salary: 37891, reqEducation: "community-college" },
    { title: "Saucier", salary: 40250, reqEducation: "community-college" },
    { title: "Sous Chef", salary: 41590, reqEducation: "community-college" },
    { title: "Chef de Cuisine", salary: 47110, reqEducation: "community-college" },
    { title: "Executive Chef", salary: 59420, reqEducation: "community-college" }
];
const RESTAURANT_JOBS = [
    { title: "Dishwasher", salary: 11000, reqEducation: "secondary", canHoldWithCriminalRecord: true },
    ...createProgressionJobs(RESTAURANT_FRONT_OF_HOUSE_PATH, "restaurant"),
    ...RESTAURANT_ENTRY_LEVEL_JOBS,
    ...createProgressionJobs(RESTAURANT_BARTENDER_PATH, "restaurant"),
    ...createProgressionJobs(RESTAURANT_SOMMELIER_PATH, "restaurant"),
    ...createProgressionJobs(RESTAURANT_CHEF_PATH, "restaurant")
];
const POLICE_CAREER_PATH = [
    { title: "Cadet", salary: 27118, reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Patrolman", salary: 38000, reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Trooper", salary: 38885, reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Corporal", salary: 45303, reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Sergeant", salary: 51188, reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Inspector", salary: 57072, reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Lieutenant", salary: 62955, reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Chief of Police", salary: 68839, reqEducation: "secondary", canHoldWithCriminalRecord: false }
];
const FIRE_DEPARTMENT_CAREER_PATH = [
    { title: "Probationary Firefighter", salary: 41239, reqEducation: "secondary" },
    { title: "Firefighter", salary: 47285, reqEducation: "secondary" },
    { title: "Fire Equipment Operator", salary: 53332, reqEducation: "secondary" },
    { title: "Lieutenant", salary: 59378, reqEducation: "secondary" },
    { title: "Captain", salary: 66030, reqEducation: "secondary" },
    { title: "Battalion Chief", salary: 73287, reqEducation: "secondary" },
    { title: "Assistant Chief", salary: 79333, reqEducation: "secondary" },
    { title: "Fire Chief", salary: 85380, reqEducation: "secondary" }
];
const MORTUARY_CAREER_PATH = [
    { title: "Mortician", salary: 28867, reqEducation: "university" },
    { title: "Funeral Director", salary: 31000, reqEducation: "university" }
];
const RECORD_LABEL_CAREER_PATH = [
    { title: "Background Vocalist", salary: 21451, reqEducation: "none" },
    { title: "Lounge Singer", salary: 30000, currency: "EUR", reqEducation: "none" },
    { title: "Singer", salary: 42700, currency: "EUR", reqEducation: "none" },
    { title: "Lead Singer", salary: 52000, reqEducation: "none" }
];
const RECORD_LABEL_JOBS = [
    ...createProgressionJobs(RECORD_LABEL_CAREER_PATH, "record-label"),
    { title: "Disk Jockey", salary: 23244, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "record-label", payGrowth: "gradual" },
    { title: "Apprentice Music Composer", salary: 19932, reqEducation: "university", reqSmart: 0, currency: "USD", workType: "record-label", payGrowth: "gradual", promotesTo: "Music Composer" },
    { title: "Music Composer", salary: 60000, reqEducation: "university", reqSmart: 0, currency: "USD", workType: "record-label", payGrowth: "gradual", promotionFrom: "Apprentice Music Composer", minimumPromotionYears: 1, salaryEstimated: true }
];
const FILM_STUDIO_JOBS = [
    { title: "Dancer", salary: 15000, reqEducation: "none", canHoldWithCriminalRecord: true },
    { title: "Apprentice Makeup Artist", salary: 18743, reqEducation: "secondary" },
    { title: "Makeup Artist", salary: 30000, reqEducation: "secondary", promotionFrom: "Apprentice Makeup Artist", minimumPromotionYears: 1, salaryEstimated: true },
    { title: "Puppeteer", salary: 21695, reqEducation: "none", canHoldWithCriminalRecord: true },
    { title: "Pornography Historian", salary: 22000, reqEducation: "none", canHoldWithCriminalRecord: true },
    { title: "Porn Set Janitor", salary: 18202, reqEducation: "none", canHoldWithCriminalRecord: true },
    { title: "Stuntman", salary: 25706, reqEducation: "secondary", canHoldWithCriminalRecord: true }
].map(job => ({ reqSmart: 0, currency: "USD", workType: "film-studio", payGrowth: "gradual", ...job }));
const SMALL_BUSINESS_PATHS = [
    [{ title: "Apprentice Baker", salary: 42000, reqEducation: "none", canHoldWithCriminalRecord: true }, { title: "Baker", salary: 50000, reqEducation: "none", canHoldWithCriminalRecord: true, salaryEstimated: true }],
    [{ title: "Apprentice Blacksmith", salary: 30000, reqEducation: "none", canHoldWithCriminalRecord: true, salaryEstimated: true }, { title: "Blacksmith", salary: 42000, reqEducation: "none", canHoldWithCriminalRecord: true }],
    [{ title: "Apprentice Chimney Sweep", salary: 22000, reqEducation: "none", canHoldWithCriminalRecord: true, salaryEstimated: true }, { title: "Chimney Sweep", salary: 30000, reqEducation: "none", canHoldWithCriminalRecord: true, salaryEstimated: true }],
    [{ title: "Apprentice Electrician", salary: 35000, reqEducation: "none", canHoldWithCriminalRecord: true, salaryEstimated: true }, { title: "Electrician", salary: 62500, reqEducation: "none", canHoldWithCriminalRecord: true }],
    [{ title: "Jr. Graphic Designer", salary: 32806, reqEducation: "university", canHoldWithCriminalRecord: false }, { title: "Graphic Designer", salary: 39000, reqEducation: "university", canHoldWithCriminalRecord: false }, { title: "Sr. Graphic Designer", salary: 45000, reqEducation: "university", canHoldWithCriminalRecord: false }],
    [{ title: "Apprentice Landscaper", salary: 20000, reqEducation: "none", canHoldWithCriminalRecord: true }, { title: "Landscaper", salary: 28000, reqEducation: "none", canHoldWithCriminalRecord: true, salaryEstimated: true }],
    [{ title: "Apprentice Lumberjack", salary: 21676, reqEducation: "none", canHoldWithCriminalRecord: true }, { title: "Lumberjack", salary: 42000, reqEducation: "none", canHoldWithCriminalRecord: true }],
    [{ title: "Apprentice Plumber", salary: 37000, reqEducation: "none", canHoldWithCriminalRecord: true }, { title: "Plumber", salary: 55000, reqEducation: "none", canHoldWithCriminalRecord: true }],
    [{ title: "Jr. Private Investigator", salary: 34000, reqEducation: "university", canHoldWithCriminalRecord: false }, { title: "Private Investigator", salary: 50000, reqEducation: "university", canHoldWithCriminalRecord: false, salaryEstimated: true }],
    [{ title: "Apprentice Tailor", salary: 26000, reqEducation: "none", canHoldWithCriminalRecord: true, salaryEstimated: true }, { title: "Tailor", salary: 38000, reqEducation: "none", canHoldWithCriminalRecord: true }],
    [{ title: "Wedding Planner", salary: 17000, reqEducation: "secondary", canHoldWithCriminalRecord: false }, { title: "Sr. Wedding Planner", salary: 29000, currency: "EUR", reqEducation: "secondary", canHoldWithCriminalRecord: false }]
];
const SMALL_BUSINESS_JOBS = [
    ...SMALL_BUSINESS_PATHS.flatMap(path => createProgressionJobs(path, "small-business")),
    { title: "Animator", salary: 51000, reqEducation: "university", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", promotionFrom: "Jr. Animator", minimumPromotionYears: 1 },
    { title: "Jr. Animator", salary: 32000, reqEducation: "university", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", promotesTo: "Animator", salaryEstimated: true },
    { title: "Cat Behavior Consultant", salary: 20000, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true },
    { title: "Construction Worker", salary: 35000, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true, salaryEstimated: true },
    { title: "Housekeeper", salary: 17076, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true },
    { title: "Mall Cop", salary: 17500, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: false },
    { title: "Painter", salary: 26000, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true },
    { title: "Personal Trainer", salary: 40000, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true, salaryEstimated: true },
    { title: "Roadkill Remover", salary: 32157, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true },
    { title: "Security Guard", salary: 20000, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: false },
    { title: "Water Slide Tester", salary: 29000, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true },
    { title: "Worm Picker", salary: 17500, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "small-business", payGrowth: "gradual", canHoldWithCriminalRecord: true }
];
const PUBLISHER_JOBS = [
    { title: "Writer", salary: 21730, reqEducation: "secondary", reqSmart: 0, currency: "USD", workType: "publisher", payGrowth: "gradual" }
];
const RETAILER_JOBS = [
    { title: "Cashier", salary: 15782, reqEducation: "none", canHoldWithCriminalRecord: false },
    { title: "Jr. Fashion Designer", salary: 35000, reqEducation: "university", promotesTo: "Fashion Designer", salaryEstimated: true },
    { title: "Fashion Designer", salary: 49500, reqEducation: "university", promotionFrom: "Jr. Fashion Designer", minimumPromotionYears: 1 },
    { title: "Retail Salesperson", salary: 15915, reqEducation: "none" }
].map(job => ({ reqSmart: 0, currency: "USD", workType: "retailer", payGrowth: "gradual", ...job }));
const ORCHESTRA_JOBS = [
    { title: "Violin Player", salary: 17650, reqEducation: "university" },
    { title: "Triangle Player", salary: 12516, reqEducation: "university" }
].map(job => ({ reqSmart: 0, currency: "USD", workType: "orchestra", payGrowth: "gradual", ...job }));
const MUSEUM_CAREER_PATH = [
    { title: "Exhibit Associate", salary: 44489, reqEducation: "university", canHoldWithCriminalRecord: false },
    { title: "Assistant Curator", salary: 43423, reqEducation: "university", canHoldWithCriminalRecord: false },
    { title: "Curator", salary: 46300, reqEducation: "university", canHoldWithCriminalRecord: false }
];
const REAL_ESTATE_JOBS = [
    { title: "Real Estate Agent", salary: 17500, reqEducation: "secondary", reqLicense: "Driving" }
].map(job => ({ reqSmart: 0, currency: "USD", workType: "real-estate", payGrowth: "gradual", ...job }));
const TRAVEL_AGENCY_CAREER_PATH = [
    { title: "Travel Associate", salary: 10000, reqEducation: "secondary" },
    { title: "Travel Agency General Manager", salary: 30000, reqEducation: "secondary", salaryEstimated: true },
    { title: "Travel Agency Regional Manager", salary: 35000, reqEducation: "secondary", salaryEstimated: true },
    { title: "Agency Operator", salary: 41000, reqEducation: "secondary" }
];
const TRAVEL_AGENCY_JOBS = createProgressionJobs(TRAVEL_AGENCY_CAREER_PATH, "travel-agency");
const CIRCUS_JOBS = [
    { title: "Magician", salary: 14160, reqEducation: "none" },
    { title: "Circus Performer", salary: 27669, reqEducation: "none" },
    { title: "Clown", salary: 17000, reqEducation: "none", reqGender: "Male", reqLooks: 70 }
].map(job => ({ reqSmart: 0, currency: "USD", workType: "circus", payGrowth: "gradual", ...job }));
const SALON_CAREER_PATHS = [
    [{ title: "Apprentice Hairdresser", salary: 15447, reqEducation: "secondary" }, { title: "Hairdresser", salary: 26000, reqEducation: "secondary" }],
    [{ title: "Apprentice Nail Technician", salary: 22000, reqEducation: "secondary", salaryEstimated: true }, { title: "Nail Technician", salary: 28000, reqEducation: "secondary", salaryEstimated: true }]
];
const SALON_JOBS = [
    ...SALON_CAREER_PATHS.flatMap(path => createProgressionJobs(path, "salon")),
    { title: "Massage Therapist", salary: 23630, reqEducation: "community-college", reqSmart: 0, currency: "USD", workType: "salon", payGrowth: "gradual" }
];
const BANK_CAREER_PATHS = [
    [
        { title: "Jr. Banker", salary: 53142, reqEducation: "university", canHoldWithCriminalRecord: false },
        { title: "Banker", salary: 64017, reqEducation: "university", canHoldWithCriminalRecord: false },
        { title: "Sr. Banker", salary: 68000, reqEducation: "university", canHoldWithCriminalRecord: false }
    ],
    [
        { title: "Jr. Financial Advisor", salary: 55000, reqEducation: "university", canHoldWithCriminalRecord: false, salaryEstimated: true },
        { title: "Financial Adv.", salary: 65000, reqEducation: "university", canHoldWithCriminalRecord: false, salaryEstimated: true },
        { title: "Sr. Financial Adv.", salary: 75000, reqEducation: "university", canHoldWithCriminalRecord: false, salaryEstimated: true }
    ]
];
const BANK_JOBS = BANK_CAREER_PATHS.flatMap(path => createProgressionJobs(path, "bank"));
const TRUCKING_CAREER_PATH = [
    { title: "Apprentice Trucker", salary: 31732, currency: "EUR", reqEducation: "secondary", canHoldWithCriminalRecord: false },
    { title: "Trucker", salary: 32453, reqEducation: "secondary", canHoldWithCriminalRecord: false }
];
const LIBRARY_CAREER_PATH = [
    { title: "Clerk", salary: 27300, reqEducation: "university", canHoldWithCriminalRecord: false },
    { title: "Library Aide", salary: 37078, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "Librarian", salary: 40000, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false },
    { title: "Sr. Librarian", salary: 52000, reqEducation: "advanced", reqAdvanced: "Graduate School", canHoldWithCriminalRecord: false, salaryEstimated: true }
];
const FISHERY_CAREER_PATH = [
    { title: "Greenhorn", salary: 30000, reqEducation: "none" },
    { title: "Deck Hand", salary: 50000, reqEducation: "none" },
    { title: "Deck Boss", salary: 100000, reqEducation: "none" },
    { title: "Engineer", salary: 150000, reqEducation: "none" },
    { title: "Captain", salary: 175000, reqEducation: "none", salaryEstimated: true }
];
const GROCERY_CAREER_PATHS = [
    [
        { title: "Apprentice Butcher", salary: 26000, reqEducation: "secondary", salaryEstimated: true },
        { title: "Butcher", salary: 29000, reqEducation: "secondary" }
    ],
    [
        { title: "Apprentice Grocer", salary: 17000, reqEducation: "secondary", canHoldWithCriminalRecord: false },
        { title: "Grocer", salary: 21000, reqEducation: "secondary", canHoldWithCriminalRecord: false }
    ]
];
const FAST_FOOD_CAREER_PATH = [
    { title: "Crew Member", salary: 15319, reqEducation: "none", canHoldWithCriminalRecord: false },
    { title: "Shift Manager", salary: 17296, reqEducation: "none", canHoldWithCriminalRecord: false },
    { title: "Restaurant Manager", salary: 27000, currency: "EUR", reqEducation: "none", canHoldWithCriminalRecord: false },
    { title: "General Manager", salary: 19386, reqEducation: "none", canHoldWithCriminalRecord: false }
];
const MILITARY_ENLISTED_PATH = [
    ["Private", 19200], ["Private Second Class", 21516], ["Private First Class", 24070],
    ["Specialist", 27747], ["Sergeant", 33066], ["Staff Sergeant", 38030],
    ["Sergeant Second Class", 42383], ["Sergeant First Class", 48256],
    ["Master Sergeant", 60210], ["Sergeant Major", 77384],
    ["Sergeant General", 79383]
].map(([title, salary]) => ({ title, salary, reqEducation: "none" }));
const MILITARY_OFFICER_PATH = [
    ["Second Lieutenant", 41121], ["First Lieutenant", 50013], ["Captain", 63781],
    ["Major", 73725], ["Lieutenant Colonel", 86382], ["Colonel", 106360],
    ["Brigadier General", 126270], ["Major General", 148768],
    ["Lieutenant General", 179611], ["General", 186996], ["Commanding Officer", 210293]
].map(([title, salary]) => ({ title, salary, reqEducation: "university" }));
const PART_TIME_JOB_DATA = [
    ["Fitness Instructor", 37, 15], ["Personal Trainer (part-time)", 32, 20, false],
    ["Beverage Cart Attendant", 30, 15, true], ["Mystery Shopper", 24, 10, false],
    ["Dance Instructor", 21, 27], ["Video Game Tester", 20, 17, true],
    ["Secretary (Corporate)", 19, 11, false], ["Mall Kiosk Worker", 19, 21],
    ["Mover", 18, 14, false], ["Valet", 10, 21, false], ["Brand Ambassador", 17, 15, false],
    ["Swim Instructor", 17, 15], ["Bookkeeper", 17, 17, false], ["Usher", 17, 10],
    ["Research Assistant", 16, 10, null, true], ["Lab Assistant", 15, 15, null, true],
    ["Pool Cleaner", 15, 12, false], ["Department Store Associate", 15, 17, false],
    ["Window Cleaner", 15, 22, true], ["Flower Shop Assistant", 15, 28, true],
    ["Grocery Bagger", 15, 19], ["Collections Specialist", 15, 14, false],
    ["Teacher's Aide", 14, 8], ["Lifeguard", 14, 9, false], ["Resident Assistant", 13, 11, null, true],
    ["Doorman", 13, 28], ["Bike Shop Mechanic", 13, 24], ["School Bus Driver", 13, 25, false, false, "Driving"],
    ["Street Sweeper", 13, 24], ["Arcade Assistant", 13, 29, true], ["Bellhop", 12, 14, false],
    ["Barista (Coffee Shop)", 12, 29, false], ["Concessions Attendant", 12, 15, false, false, null, true],
    ["Golf Shop Assistant", 10, 30], ["Library Assistant", 10, 10], ["Cafeteria Worker", 10, 12, null, true],
    ["Admissions Assistant", 10, 14, null, true], ["Campus Tour Guide", 10, 9, null, true],
    ["Grader", 10, 13, null, true], ["Sign Holder", 10, 11, true], ["Hotel Front Desk Clerk", 10, 30, false],
    ["Gym Receptionist", 10, 17, false], ["Newspaper Delivery Person", 10, 12],
    ["Yoga Receptionist", 9, 18, false], ["Boutique Associate", 9, 11, false],
    ["Laser Tag Assistant", 8, 21, true], ["Donut Maker", 8, 9], ["Car Wash Attendant", 8, 14, true],
    ["Camp Counselor", 12, 30, true], ["Office Assistant", 13, 30, false],
    ["Ice Cream Scooper", 8, 19, true],
    ["Grocery Store Stocker", 15, 20, null, false, null, true], ["Sandwich Maker", 12, 20, null, false, null, true],
    ["Pizza Maker", 12, 20, null, false, null, true], ["Pool Towel Attendant", 12, 20, null, false, null, true],
    ["Mall Santa", 12, 20, null, false, null, true], ["Chicken Sexer", 15, 20, null, false, null, true],
    ["Amusement Park Attendant", 12, 20, null, false, null, true], ["Bowling Alley Attendant", 12, 20, null, false, null, true],
    ["Tour Guide", 13, 20, null, false, null, true], ["Secretary (part-time)", 15, 16, false, false, null, true],
    ["Barnyard Sperm Extractor", 15, 20, null, false, null, true], ["Armpit Sniffer", 10, 10, null, false, null, true],
    ["Social Media Manager", 18, 15, null, false, null, true]
];
const PART_TIME_JOBS = PART_TIME_JOB_DATA.map(([title, hourlyRate, weeklyHours, canHoldWithCriminalRecord, universityOnly, reqLicense, estimatedSalary]) => ({
    title,
    salary: hourlyRate * weeklyHours * 52,
    hourlyRate,
    weeklyHours,
    reqSmart: 0,
    reqEducation: "none",
    currency: "USD",
    workType: "part-time",
    universityOnly: Boolean(universityOnly),
    reqLicense: reqLicense || undefined,
    canHoldWithCriminalRecord,
    salaryEstimated: Boolean(estimatedSalary),
    ageRequirement: 13
}));
const FREELANCE_GIGS = [
    { title: "Handyman", minAge: 18, minRate: 6, maxRate: 40 },
    { title: "Tutor", minAge: 15, minRate: 4, maxRate: 29 },
    { title: "Lawnmower", minAge: 14, minRate: 2, maxRate: 30 },
    { title: "Caretaker", minAge: 18, minRate: 3, maxRate: 20 },
    { title: "Dog Walker", minAge: 13, minRate: 1, maxRate: 24 },
    { title: "Pet Sitter", minAge: 13, minRate: 1, maxRate: 20 },
    { title: "Babysitter", minAge: 13, minRate: 1, maxRate: 20 },
    { title: "House Cleaner", minAge: 18, minRate: 3, maxRate: 25 }
];
const PUBLIC_SERVICE_JOBS = [
    ...createProgressionJobs(POLICE_CAREER_PATH, "police"),
    ...createProgressionJobs(FIRE_DEPARTMENT_CAREER_PATH, "fire-department"),
    ...createProgressionJobs(MORTUARY_CAREER_PATH, "mortuary")
];
const MISCELLANEOUS_CAREER_JOBS = [
    ...createProgressionJobs(MUSEUM_CAREER_PATH, "museum"),
    ...RECORD_LABEL_JOBS,
    ...FILM_STUDIO_JOBS,
    ...SMALL_BUSINESS_JOBS,
    ...PUBLISHER_JOBS,
    ...RETAILER_JOBS,
    ...ORCHESTRA_JOBS,
    ...REAL_ESTATE_JOBS,
    ...TRAVEL_AGENCY_JOBS
];
function createProgressionJobs(path, workType) {
    return path.map((job, index) => ({
        reqSmart: 0,
        currency: "USD",
        workType,
        payGrowth: "gradual",
        ...job,
        promotionFrom: job.promotionFromAny
            ? null
            : job.promotionFrom !== undefined
            ? job.promotionFrom
            : index ? path[index - 1].title : null,
        minimumPromotionYears: 1,
        promotesTo: job.promotesTo !== undefined
            ? job.promotesTo
            : path[index + 1] ? path[index + 1].title : null
    }));
}
const TRUCKING_JOBS = createProgressionJobs(TRUCKING_CAREER_PATH, "trucking");
const LIBRARY_JOBS = createProgressionJobs(LIBRARY_CAREER_PATH, "library");
const FISHERY_JOBS = createProgressionJobs(FISHERY_CAREER_PATH, "fishery");
const GROCERY_JOBS = GROCERY_CAREER_PATHS.flatMap(path => createProgressionJobs(path, "grocery"));
const FAST_FOOD_JOBS = createProgressionJobs(FAST_FOOD_CAREER_PATH, "fast-food");
const MILITARY_JOBS = [
    ...createProgressionJobs(MILITARY_ENLISTED_PATH, "military-enlisted"),
    ...createProgressionJobs(MILITARY_OFFICER_PATH, "military-officer")
];
const ADDITIONAL_MISCELLANEOUS_JOBS = [
    ...CIRCUS_JOBS,
    ...SALON_JOBS,
    ...BANK_JOBS,
    ...TRUCKING_JOBS,
    ...LIBRARY_JOBS,
    ...FISHERY_JOBS,
    { title: "Fisherman", salary: 13000, reqEducation: "none", reqSmart: 0, currency: "USD", workType: "fishery", payGrowth: "gradual", canHoldWithCriminalRecord: true },
    { title: "Ride Share Driver", salary: 27000, reqEducation: "none", reqLicense: "Driving", reqSmart: 0, currency: "USD", workType: "ride-share", payGrowth: "gradual", canHoldWithCriminalRecord: false },
    ...GROCERY_JOBS,
    ...FAST_FOOD_JOBS,
    ...MILITARY_JOBS
];
const MODEL_AGENCY_JOBS = createProgressionJobs(MODEL_AGENCY_PATH, "modeling")
    .map(job => job.title === "Runway Model"
        ? { ...job, fameOnHire: true }
        : job);
const AIRLINE_JOBS = AIRLINE_CAREER_PATHS.flatMap(path => createProgressionJobs(path, "airline"));
const VETERINARY_JOBS = createProgressionJobs(VETERINARY_CAREER_PATH, "veterinary");
const HOSPITAL_JOBS = [
    ...createProgressionJobs(HOSPITAL_CAREERS.filter(job => job.title.includes("Psychiatrist")), "medical-office"),
    ...createProgressionJobs(HOSPITAL_CAREERS.filter(job => job.title.includes("Pharmacist")), "medical-office"),
    ...HOSPITAL_CAREERS.filter(job => !job.title.includes("Psychiatrist") && !job.title.includes("Pharmacist"))
];
const MUNICIPAL_JOBS = MUNICIPAL_CAREER_PATHS.flatMap(path => createProgressionJobs(path, "municipal"));
const NEWSPAPER_JOBS = NEWSPAPER_CAREER_PATHS.flatMap(path => createProgressionJobs(path, "newspaper"));
const SCHOOL_DISTRICT_JOBS = createProgressionJobs(SCHOOL_DISTRICT_CAREER_PATH, "school-district");
const UNIVERSITY_DISTRICT_JOBS = [
    ...UNIVERSITY_DISTRICT_CAREERS.map(job => ({ reqSmart: 0, currency: "USD", workType: "university-district", payGrowth: "gradual", ...job })),
    ...createProgressionJobs(UNIVERSITY_DISTRICT_ARCHAEOLOGY_PATH, "university-district")
];
const LAW_FIRM_JOBS = createProgressionJobs(LAW_FIRM_CAREER_PATH, "law-firm");
function createCorporateCareerJobs() {
    return CORPORATE_CAREER_PATHS.flatMap(path => path.map((entry, index) => {
        const [title, salary, education, currency = "USD", , canHoldWithCriminalRecord = false] = entry;
        const previous = path[index - 1];
        return {
            title,
            salary,
            reqSmart: 0,
            reqEducation: education,
            currency,
            workType: "corporate",
            payGrowth: "gradual",
            promotionFrom: previous && previous[0],
            minimumPromotionYears: 1,
            requiredCareerYears: title === "Assistant Vice President" ? 15 : 0,
            promotesTo: path[index + 1] ? path[index + 1][0] : null,
            canHoldWithCriminalRecord: CORPORATE_JOBS_REJECTING_CRIMINAL_RECORDS.has(title)
                ? false
                : canHoldWithCriminalRecord ? true : undefined
        };
    }));
}
const jobList = [
     { title: "Junior IT Support", salary: 45000, reqSmart: 60, reqEducation: "secondary" },
    { title: "Data Analyst", salary: 65000, reqSmart: 85, reqEducation: "secondary" },
    { title: "Research Scientist", salary: 95000, reqSmart: 95, reqEducation: "secondary" },
    { title: "Business Executive", salary: 145000, reqSmart: 70, reqEducation: "advanced", reqAdvanced: "Business School" },
    { title: "Chief Executive Officer", salary: 180000, reqSmart: 80, reqEducation: "advanced", reqAdvanced: "Business School", payGrowth: "gradual" },
    { title: "Dental Hygienist", salary: 76000, reqSmart: 55, reqEducation: "community-college" },
    { title: "Dentist", salary: 165000, reqSmart: 75, reqEducation: "advanced", reqAdvanced: "Dental School" },
    { title: "Lawyer", salary: 155000, reqSmart: 75, reqEducation: "advanced", reqAdvanced: "Law School" },
    { title: "Medical Doctor", salary: 190000, reqSmart: 80, reqEducation: "advanced", reqAdvanced: "Medical School", payGrowth: "gradual" },
    { title: "Registered Nurse", salary: 85000, reqSmart: 60, reqEducation: "advanced", reqAdvanced: "Nursing School" },
    { title: "Actor", salary: 30000, reqSmart: 30, reqEducation: "secondary", breakthroughAtFollowers: 1000, breakthroughAtFame: 30 },
    { title: "Composer", salary: 28000, reqSmart: 55, reqEducation: "secondary", breakthroughAtFollowers: 800, breakthroughAtFame: 25 },
    { title: "Barista (part-time)", salary: 9000, reqSmart: 0, reqEducation: "none", workType: "part-time" },
    { title: "Retail Assistant (part-time)", salary: 10500, reqSmart: 0, reqEducation: "none", workType: "part-time" },
    { title: "Tutor (part-time)", salary: 12000, reqSmart: 60, reqEducation: "none", workType: "part-time" },
    { title: "Babysitter (gig)", salary: 6000, reqSmart: 0, reqEducation: "none", workType: "gig" },
    { title: "Dog Walker (gig)", salary: 7000, reqSmart: 0, reqEducation: "none", workType: "gig" },
    { title: "Freelance Artist (gig)", salary: 8000, reqSmart: 0, reqEducation: "none", workType: "gig" },
    { title: "Freelance Writer (gig)", salary: 9000, reqSmart: 50, reqEducation: "none", workType: "gig" },
    ...createCorporateCareerJobs(),
    ...MODEL_AGENCY_JOBS,
    ...AIRLINE_JOBS,
    ...VETERINARY_JOBS,
    ...HOSPITAL_JOBS,
    ...MUNICIPAL_JOBS,
    ...NEWSPAPER_JOBS,
    ...SCHOOL_DISTRICT_JOBS,
    ...UNIVERSITY_DISTRICT_JOBS,
    ...LAW_FIRM_JOBS,
    ...RESTAURANT_JOBS,
    ...PUBLIC_SERVICE_JOBS,
    ...MISCELLANEOUS_CAREER_JOBS,
    ...ADDITIONAL_MISCELLANEOUS_JOBS,
    ...PART_TIME_JOBS
];
const COUNTRY_WAGE_MULTIPLIERS = {
    USA: 1, Canada: 0.9, UK: 0.9, Japan: 0.85, Brazil: 0.45, Mexico: 0.5, Nigeria: 0.35
};
const EUR_TO_USD = 1.08;
const SINGLE_PARENT_BIRTH_CHANCE = 0.15;
const ORPHAN_BIRTH_CHANCE = 0.05;
const FAMILY_PET_BIRTH_CHANCE = 0.3;
const SIBLING_BIRTH_CHANCE = 0.45;
const DEFAULT_LEGAL_SCHOOL_LEAVING_AGE = 16;
const GED_FEE = 1200;
const COMMUNITY_COLLEGE_TUITION = 2000;
const UNIVERSITY_TUITION = 8000;
const SCHOOL_EVENT_CHANCE = 0.12;
const TUITION_FREE_COUNTRIES = ["Brazil", "Nigeria"];
const UNIVERSITY_MAJORS = [
    "Accounting", "Anthropology", "Archaeology", "Architecture", "Art History",
    "Biology", "Chemistry", "Communications", "Computer Science", "Criminal Justice",
    "Dance", "Economics", "Education", "Engineering", "English", "Finance",
    "Graphic Design", "History", "Information Systems", "Journalism", "Marketing",
    "Mathematics", "Music", "Nursing", "Philosophy", "Physics",
    "Political Science", "Psychology", "Religious Studies"
];
const ADVANCED_EDUCATION_PROGRAMS = {
    "Graduate School": ["Accounting", "Anthropology", "Archaeology", "Biology", "Chemistry", "Computer Science", "Criminal Justice", "Economics", "Education", "Engineering", "English", "Finance", "History", "Information Systems", "Journalism", "Marketing", "Mathematics", "Music", "Philosophy", "Physics", "Political Science", "Psychology"],
    "Business School": ["Accounting", "Economics", "English", "Finance", "Information Systems", "Marketing", "Mathematics"],
    "Dental School": ["Biology", "Chemistry"],
    "Law School": ["Criminal Justice", "English", "Finance", "Political Science"],
    "Medical School": ["Biology", "Chemistry", "Nursing", "Psychology"],
    "Nursing School": ["Nursing"],
    "Pharmacy School": ["Biology", "Chemistry"],
    "Veterinary School": ["Biology", "Chemistry"]
};
const ADVANCED_EDUCATION_YEARS = {
    "Graduate School": 2,
    "Business School": 2,
    "Dental School": 4,
    "Law School": 4,
    "Medical School": 7,
    "Nursing School": 2,
    "Pharmacy School": 4,
    "Veterinary School": 4
};
const ADVANCED_EDUCATION_TUITION_BY_PROGRAM = {
    "Graduate School": 20000,
    "Business School": 25000,
    "Dental School": 35000,
    "Law School": 30000,
    "Medical School": 50000,
    "Nursing School": 20000,
    "Pharmacy School": 28000,
    "Veterinary School": 30000
};
const MULTIPLE_BIRTH_ROLLS = [
    { chance: 0.0005, count: 4, type: "quadruplets" },
    { chance: 0.002, count: 3, type: "triplets" },
    { chance: 0.03, count: 2, type: "twins" }
];
// --- 2. INITIALIZATION ---
window.onload = () => {
    const confirmExit = document.getElementById('setting-confirm-exit');
    if (confirmExit) confirmExit.checked = localStorage.getItem('dynasty_confirm_exit') !== 'false';
    const saved = localStorage.getItem('dynasty_current');
    
    // Improved Check: Only load if data exists AND isn't an empty string/null
            p = JSON.parse(saved);
            // One last safety check: Does the object actually have a name?
            if (p && p.name) {
                initializeSchoolProfile();
                showUI('main');
                updateUI();
                return; // Stop here, we are in the game
        }
    }
    // If we reach here, no valid game was found. Show the home menu.
    showUI('home');
    rollStats();
};
        smart: 20 + Math.floor(Math.random() * 30),
        looks: Math.floor(Math.random() * 100),
        fame: 0,
        followers: 0,
        isMarried: false,
        isBreakdown: false,
        breakdownTimer: 0,
        job: null
    };
const birthStory = generateInitialFamily();
    initializeSchoolProfile();
    save();
    showUI('main');
    updateUI();
updateLog(`YEAR 0: Born in ${p.country}. ${birthStory} Inheritance: $${inheritance.toLocaleString()}`);
}
function generateInitialFamily() {
    const outcome = Math.random();
    let description;
    if (outcome < SINGLE_PARENT_BIRTH_CHANCE) {
        const parent = Math.random() < 0.5 ? "Mother" : "Father";
        const reasonRoll = Math.random();
        let reason;
        if (reasonRoll < 0.45) reason = "your parents separated before you were born";
        else if (reasonRoll < 0.9) reason = "one parent died before you were born";
        else reason = "your other parent was unable to raise you";
        p.familyBackground = {
            type: "singleParent",
            description: `You were raised by one parent because ${reason}.`
        };
        p.relationships.family.push({ name: parent, rel: 100, type: "Parent" });
        description = `You were raised by one parent because ${reason}.`;
    } else if (outcome < SINGLE_PARENT_BIRTH_CHANCE + ORPHAN_BIRTH_CHANCE) {
        const abandoned = Math.random() < 0.5;
        description = abandoned
            ? "You were abandoned at birth and placed in care."
            : "You were orphaned at birth and raised in care.";
        p.familyBackground = {
            type: abandoned ? "abandoned" : "orphanInCare",
            description
        };
        p.relationships.family.push({ name: "Foster caregiver", rel: 80, type: "Guardian" });
    } else {
        p.familyBackground = {
            type: "twoParents",
            description: "You were raised by both parents."
        };
        p.relationships.family.push({ name: "Mother", rel: 100, type: "Parent" });
        p.relationships.family.push({ name: "Father", rel: 100, type: "Parent" });
        description = "You were raised by both parents.";
    }
    const siblingDescription = generateBirthSiblings();
    if (siblingDescription) description += ` ${siblingDescription}`;
    const petDescription = generateFamilyPets();
    if (petDescription) description += ` ${petDescription}`;
    p.familyBackground.description = description;
    return description;
}
function generateBirthSiblings() {
    const multipleBirthRoll = Math.random();
    const multipleBirth = MULTIPLE_BIRTH_ROLLS.find(
        outcome => multipleBirthRoll < outcome.chance
    );
    const siblingNames = ["Avery", "Cameron", "Drew", "Jamie", "Kai", "Lee", "Robin", "Skyler"];
    const siblingGenders = ["Brother", "Sister"];
    const usedNames = new Set([p.name]);
    const familyMembers = p.relationships.family || [];
    function addSibling(type, age) {
        let name;
        do {
            const firstName = siblingNames[Math.floor(Math.random() * siblingNames.length)];
            const lastName = p.name.split(" ").slice(-1)[0];
            name = `${firstName} ${lastName}`;
        } while (usedNames.has(name) || familyMembers.some(member => member.name.endsWith(name)));
        usedNames.add(name);
        const gender = siblingGenders[Math.floor(Math.random() * siblingGenders.length)];
        p.relationships.family.push({
            name: `${type} (${gender}) ${name}`,
            rel: 85,
            type: "Sibling",
            age,
            craziness: Math.floor(Math.random() * 101),
            occupation: age >= 16
                ? ["Part-time worker", "Tutor", "Coach", "Security officer"][Math.floor(Math.random() * 4)]
                : "Student"
        });
    }
    let description = "";
    if (multipleBirth) {
        p.birthGroup = multipleBirth.type;
        const siblingRole = multipleBirth.type.slice(0, -1);
        const capitalizedRole = siblingRole[0].toUpperCase() + siblingRole.slice(1);
        for (let i = 1; i < multipleBirth.count; i++) addSibling(capitalizedRole, 0);
        description = `You were born as one of a set of ${multipleBirth.type}.`;
    }
    if (Math.random() < SIBLING_BIRTH_CHANCE) {
        const siblingCount = Math.random() < 0.75 ? 1 : 2;
        for (let i = 0; i < siblingCount; i++) {
            const age = Math.floor(Math.random() * 12) + 1;
            addSibling("Older sibling", age);
        }
        description += `${description ? " " : ""}You have ${siblingCount === 1 ? "a sibling" : "siblings"} in your family.`;
    }
    return description;
}
function generateFamilyPets() {
    if (Math.random() >= FAMILY_PET_BIRTH_CHANCE) return "";
    const speciesKeys = ["dog", "cat", "fish"];
    const petCount = Math.random() < 0.8 ? 1 : 2;
    for (let i = 0; i < petCount; i++) {
        const speciesKey = speciesKeys[Math.floor(Math.random() * speciesKeys.length)];
        const species = PET_SPECIES[speciesKey];
        const name = `Family ${species.name}`;
        p.relationships.pets.push({
            name,
            species: speciesKey,
            age: 0,
            maxAge: species.maxAge,
            relationship: 70,
            maintenance: species.baseMaintenance,
            familyPet: true
        });
    }
    const speciesCounts = p.relationships.pets.slice(-petCount).reduce((counts, pet) => {
        counts[pet.species] = (counts[pet.species] || 0) + 1;
        return counts;
    }, {});
    const petDescriptions = Object.entries(speciesCounts).map(([species, count]) => {
        const plural = species === "fish" ? "fish" : `${species}s`;
        return count === 1 ? `a ${species}` : `${count} ${plural}`;
    });
    return `Your family has ${petDescriptions.join(" and ")}.`;
}
function initializeSchoolProfile() {
    if (p.school) return;
    const schoolTypes = ["Public", "Private", "Religious"];
    if (p.gender === "Female") schoolTypes.push("All-girls");
    if (p.gender === "Male") schoolTypes.push("All-boys");
    const names = ["Avery", "Cameron", "Jordan", "Morgan", "Riley", "Taylor", "Quinn", "Jamie"];
    const lastNames = ["Brooks", "Chen", "Garcia", "Patel", "Reed", "Williams"];
    const pick = items => items[Math.floor(Math.random() * items.length)];
    const guardian = p.relationships && p.relationships.family
        ? p.relationships.family.some(member => member.type === "Parent" || member.type === "Guardian")
        : false;
    p.school = {
        type: pick(schoolTypes),
        name: `${pick(["Cedar Grove", "Riverside", "Northfield", "Maple Hill"])} ${pick(["Academy", "School", "Institute"])}`,
        classroom: `${pick(["Room", "Classroom"])} ${Math.floor(Math.random() * 20) + 1}`,
        teacher: `${pick(names)} ${pick(lastNames)}`,
        nurse: `${pick(names)} ${pick(lastNames)}`,
        staff: [
            `${pick(names)} ${pick(lastNames)} — Principal`,
            `${pick(names)} ${pick(lastNames)} — Counselor`
        ],
        legalDropoutAge: DEFAULT_LEGAL_SCHOOL_LEAVING_AGE,
        guardianAllowsEarlyDropout: guardian && Math.random() < 0.2,
        enrolled: true,
        droppedOut: false,
        graduated: false,
        completedYears: 0,
        totalCompletedYears: 0,
        yearsLeft: 0,
        stage: "Not started"
    };
    if (p.age >= 18) {
        p.school.enrolled = false;
        p.school.graduated = true;
        p.school.completedYears = 13;
        p.school.totalCompletedYears = 13;
        p.school.stage = "Graduated";
    } else if (p.age >= 5) {
        updateSchoolProgress();
    }
}
function updateSchoolProgress() {
    initializeSchoolProfile();
    const school = p.school;
    if (school.droppedOut || school.expelled || school.graduated || p.age < 5) return;
    if (p.age >= 18) {
        school.enrolled = false;
        school.graduated = true;
        school.stage = "Graduated";
        school.completedYears = 13;
        school.totalCompletedYears = 13;
        school.yearsLeft = 0;
        updateLog("SCHOOL: You graduated from secondary school.");
        return;
    }
    school.enrolled = true;
    if (p.age <= 10) {
        school.stage = "Elementary / Primary School";
        school.completedYears = p.age - 5;
        school.totalCompletedYears = school.completedYears;
        school.yearsLeft = 6 - school.completedYears;
    } else if (p.age <= 13) {
        school.stage = "Middle / Junior High School";
        school.completedYears = p.age - 11;
        school.totalCompletedYears = 6 + school.completedYears;
        school.yearsLeft = 3 - school.completedYears;
    } else {
        school.stage = "High / Secondary School";
        school.completedYears = p.age - 14;
        school.totalCompletedYears = 9 + school.completedYears;
        school.yearsLeft = 4 - school.completedYears;
    }
    if (p.age === 5) updateLog("SCHOOL: You started Elementary / Primary School.");
    if (p.age === 11) updateLog("SCHOOL: You started Middle / Junior High School.");
    if (p.age === 14) updateLog("SCHOOL: You started High / Secondary School.");
}
function hasSecondaryCredential() {
    const school = p.school || {};
    return school.graduated || school.ged || (school.communityCollege && school.communityCollege.completed);
}
function attemptGED() {
    initializeSchoolProfile();
    const school = p.school;
    if (p.age < school.legalDropoutAge) {
        updateLog(`SCHOOL: You can only take the GED after age ${school.legalDropoutAge}.`);
        return;
    }
    if (school.enrolled) {
        updateLog("SCHOOL: Leave secondary school before applying for a GED.");
        return;
    }
    if (hasSecondaryCredential()) {
        updateLog("SCHOOL: You already have a high-school diploma or GED.");
        return;
    }
    if (p.money < GED_FEE) {
        updateLog(`SCHOOL: The GED exam costs $${GED_FEE.toLocaleString()}. You cannot afford it yet.`);
        return;
    }
    p.money -= GED_FEE;
    const passChance = Math.min(0.9, 0.55 + p.smart / 300);
    if (Math.random() < passChance) {
        school.ged = true;
        school.gedAttempts = (school.gedAttempts || 0) + 1;
        updateLog(`GED: You passed the exam and earned an equivalency diploma. (-$${GED_FEE.toLocaleString()})`);
    } else {
        school.gedAttempts = (school.gedAttempts || 0) + 1;
        updateLog(`GED: You did not pass this time. Study and try again when you can afford the $${GED_FEE.toLocaleString()} fee.`);
    }
    updateUI();
    refreshJobBoard();
    save();
}
function enrollCommunityCollege() {
    initializeSchoolProfile();
    const school = p.school;
    if (p.age < school.legalDropoutAge || !hasSecondaryCredential()) {
        updateLog("COLLEGE: Finish high school or pass the GED before applying to community college.");
        return;
    }
    if (school.communityCollege && school.communityCollege.enrolled) {
        updateLog("COLLEGE: You are already enrolled in community college.");
        return;
    }
    if (school.communityCollege && school.communityCollege.completed) {
        updateLog("COLLEGE: You have already completed community college.");
        return;
    }
    if (p.money < COMMUNITY_COLLEGE_TUITION) {
        updateLog(`COLLEGE: Two years of community college cost $${COMMUNITY_COLLEGE_TUITION.toLocaleString()}. You cannot afford tuition yet.`);
        return;
    }
    p.money -= COMMUNITY_COLLEGE_TUITION;
    school.communityCollege = { enrolled: true, completed: false, yearsCompleted: 0, yearsRequired: 2 };
    updateLog(`COLLEGE: Community college accepted you. You enrolled for two years. (-$${COMMUNITY_COLLEGE_TUITION.toLocaleString()})`);
    updateUI();
    save();
}
function processCommunityCollegeYear() {
    const college = p.school && p.school.communityCollege;
    if (!college || !college.enrolled) return;
    college.yearsCompleted++;
    p.smart = Math.min(100, p.smart + 5);
    updateLog(`COLLEGE: You completed year ${college.yearsCompleted} of community college. (+5 Smart)`);
    if (college.yearsCompleted >= college.yearsRequired) {
        college.enrolled = false;
        college.completed = true;
        updateLog("COLLEGE: You graduated from community college.");
    }
}
function triggerSchoolEvent() {
    if (!p.school || !p.school.enrolled || p.age < 7 || Math.random() >= SCHOOL_EVENT_CHANCE) return false;
    if (Math.random() < 0.35 && triggerClassmateIncident()) return true;
    const events = [
        {
            title: "Sent to the Principal's Office",
            message: "You were talking back to a teacher during class. The principal wants to hear your side.",
            choices: [
                { label: "Apologize and get back to class", consequence: "You apologized and returned to class.", mental: 1 },
                { label: "Argue about the consequence", consequence: "The principal assigned detention for the disruption.", mental: -3 }
            ]
        },
        {
            title: "Classroom Disruption",
            message: "You encouraged a classmate's misbehavior and the teacher reported it.",
            choices: [
                { label: "Take responsibility", consequence: "You accepted responsibility and helped settle the class.", mental: 1 },
                { label: "Blame someone else", consequence: "The staff gave you a warning and contacted your family.", mental: -2 }
            ]
        },
        {
            title: "Caught Skipping Class",
            message: "A staff member found you away from your classroom during a lesson.",
            choices: [
                { label: "Return to class", consequence: "You returned to class and received a warning.", mental: -1 },
                { label: "Ask for help catching up", consequence: "A staff member helped you make a plan to catch up.", smart: 1 }
            ]
        },
        {
            title: "Test Trouble",
            message: "A teacher noticed you letting a classmate copy your answers.",
            choices: [
                { label: "Be honest with the teacher", consequence: "You spoke honestly with the teacher and received a warning.", mental: -1 },
                { label: "Meet with the counselor", consequence: "The counselor helped you set better boundaries.", mental: 1 }
            ]
        },
        {
            title: "Visit to the School Nurse",
            message: `You have visited ${p.school.nurse} several times this year. The school nurse asked whether anything is bothering you.`,
            choices: [
                { label: "Talk with the nurse", consequence: "The nurse listened and helped you plan how to feel better.", mental: 3 },
                { label: "Go back to class", consequence: "You returned to class after a quick check-in.", mental: 0 }
            ]
        },
        {
            title: "Conflict With a Classmate",
            message: "A disagreement with a classmate disrupted class, and a staff member sent you to the principal.",
            choices: [
                { label: "Talk it through with the counselor", consequence: "The counselor helped both students work through the disagreement.", mental: 2 },
                { label: "Accept the principal's warning", consequence: "You accepted a warning and agreed to avoid further disruption.", mental: -2 }
            ]
        },
        {
            title: "Repeated Absences",
            message: "The school staff met with you about repeatedly skipping class. You can return to class or keep missing lessons.",
            choices: [
                { label: "Return to class", consequence: "You agreed to an attendance plan and returned to class.", mental: 1 },
                { label: "Keep skipping class", consequence: "The school expelled you after repeated absences. You can try for a GED when you reach the legal leaving age.", mental: -5, expelled: true }
            ]
        }
    ];
    const event = events[Math.floor(Math.random() * events.length)];
    const modal = document.getElementById('choice-modal');
    const choices = document.getElementById('event-choices');
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-msg').textContent = event.message;
    choices.replaceChildren();
    event.choices.forEach(choice => {
        const button = document.createElement('button');
        button.className = 'btn-ghost';
        button.textContent = choice.label;
        button.onclick = () => {
            p.mental = Math.max(0, Math.min(100, p.mental + (choice.mental || 0)));
            p.smart = Math.max(0, Math.min(100, p.smart + (choice.smart || 0)));
            if (choice.expelled) {
                p.school.enrolled = false;
                p.school.expelled = true;
                p.school.yearsLeft = 0;
            }
            updateLog(`SCHOOL: ${choice.consequence}`);
            modal.style.display = 'none';
            updateUI();
            save();
        };
        choices.appendChild(button);
    });
    modal.style.display = 'flex';
    return true;
}
function dropOutOfSchool() {
    initializeSchoolProfile();
    const school = p.school;
    if (!school.enrolled || p.age < 5) {
        updateLog("SCHOOL: You are not currently enrolled in school.");
        return;
    }
    const hasGuardian = p.relationships.family.some(
        member => member.type === "Parent" || member.type === "Guardian"
    );
    if (p.age < school.legalDropoutAge && !school.guardianAllowsEarlyDropout) {
        updateLog(hasGuardian
            ? `SCHOOL: Your parent or guardian insists you stay in school until age ${school.legalDropoutAge}.`
            : `SCHOOL: You need to reach the legal leaving age of ${school.legalDropoutAge}; no parent or guardian can approve leaving early.`);
        renderSchool();
        return;
    }
    school.enrolled = false;
    school.droppedOut = true;
    school.yearsLeft = 0;
    updateLog(p.age < school.legalDropoutAge
        ? "SCHOOL: Your parent or guardian did not object. You left school early."
        : `SCHOOL: You left school at the legal leaving age of ${school.legalDropoutAge}.`);
    renderSchool();
    save();
}
function renderSchool() {
    const section = document.getElementById('school-section');
    const profile = document.getElementById('school-profile');
    const studyButton = document.getElementById('btn-study');
    const dropoutButton = document.getElementById('btn-dropout');
    if (!section || !profile || !studyButton || !dropoutButton) return;
    initializeSchoolProfile();
    const school = p.school;
    const visible = (school.enrolled && p.age >= 5) || school.graduated || school.droppedOut || school.expelled;
    section.style.display = visible ? 'block' : 'none';
    studyButton.style.display = school.enrolled && p.age >= 5 ? 'inline-block' : 'none';
    dropoutButton.style.display = school.enrolled && p.age >= 5 ? 'inline-block' : 'none';
    renderEducationOptions(school);
    if (school.graduated) {
        profile.innerHTML = `<p><strong>Status:</strong> Graduated</p><p><strong>School:</strong> ${school.type} — ${school.name}</p><p><strong>Years completed:</strong> ${school.totalCompletedYears} of 13</p>`;
        return;
    }
    if (school.droppedOut || school.expelled) {
        const status = school.expelled ? "Expelled" : "Left school";
        const credential = school.ged ? "GED earned" : "No high-school credential";
        profile.innerHTML = `<p><strong>Status:</strong> ${status} — ${credential}</p><p><strong>Last school:</strong> ${school.stage}</p><p><strong>Years completed:</strong> ${school.totalCompletedYears} of 13</p>`;
        return;
    }
    if (p.age < 5) return;
    const hasGuardian = p.relationships.family.some(
        member => member.type === "Parent" || member.type === "Guardian"
    );
    const familyNote = school.guardianAllowsEarlyDropout
        ? "Your parent or guardian may allow you to leave early."
        : hasGuardian
            ? `Your parent or guardian expects you to stay until age ${school.legalDropoutAge}.`
            : `Without a parent or guardian to approve early departure, you must stay until age ${school.legalDropoutAge}.`;
    profile.innerHTML = `
        <p><strong>School:</strong> ${school.type} — ${school.name}</p>
        <p><strong>Level:</strong> ${school.stage}</p>
        <p><strong>Years completed:</strong> ${school.totalCompletedYears} of 13 &nbsp; <strong>Years left at this level:</strong> ${school.yearsLeft}</p>
        <p><strong>Year at this level:</strong> ${school.completedYears + 1}</p>
        <p><strong>Classroom:</strong> ${school.classroom} &nbsp; <strong>Teacher:</strong> ${school.teacher}</p>
        <p><strong>School nurse:</strong> ${school.nurse}</p>
        <p><strong>Staff:</strong> ${school.staff.join(", ")}</p>
        <p><strong>Legal leaving age:</strong> ${school.legalDropoutAge}</p>
        <p>${familyNote}</p>`;
    dropoutButton.textContent = p.age <= 10 ? "TRY TO DROP OUT OF ELEMENTARY" : "TRY TO LEAVE SCHOOL";
}
function renderEducationOptions(school) {
    const gedButton = document.getElementById('btn-ged');
    const collegeButton = document.getElementById('btn-community-college');
    const collegeStatus = document.getElementById('community-college-status');
    if (!gedButton || !collegeButton || !collegeStatus) return;
    gedButton.style.display = (school.droppedOut || school.expelled) && !hasSecondaryCredential() &&
        p.age >= school.legalDropoutAge ? "inline-block" : "none";
    const university = school.university;
    collegeButton.style.display = !school.enrolled && hasSecondaryCredential() &&
        p.age >= school.legalDropoutAge &&
        !(school.communityCollege && (school.communityCollege.enrolled || school.communityCollege.completed)) &&
        !(university && (university.enrolled || university.completed)) ? "inline-block" : "none";
    const college = school.communityCollege;
    if (!college) {
        collegeStatus.textContent = "";
    } else if (college.completed) {
        collegeStatus.textContent = "Community college completed.";
    } else if (college.enrolled) {
        collegeStatus.textContent = `Community college: ${college.yearsCompleted} of ${college.yearsRequired} years completed.`;
    }
    renderUniversityOptions(school);
}
function renderUniversityOptions(school) {
    const applyButton = document.getElementById("btn-university");
    const majorSelect = document.getElementById("university-major");
    const fundingSelect = document.getElementById("university-funding");
    const enrollStatus = document.getElementById("university-status");
    const advancedSelect = document.getElementById("advanced-education-program");
    const advancedButton = document.getElementById("btn-advanced-education");
    const advancedStatus = document.getElementById("advanced-education-status");
    const rushButton = document.getElementById("btn-greek-rush");
    const greekStatus = document.getElementById("greek-life-status");
    if (!applyButton || !majorSelect || !fundingSelect || !enrollStatus ||
        !advancedSelect || !advancedButton || !advancedStatus || !rushButton || !greekStatus) return;
    const university = school.university;
    const advanced = school.advancedEducation;
    const communityCollege = school.communityCollege;
    const optionsContainer = document.getElementById("university-options");
    if (!majorSelect.options.length) {
        UNIVERSITY_MAJORS.forEach(major => {
            const option = document.createElement("option");
            option.value = major;
            option.textContent = major;
            majorSelect.appendChild(option);
        });
    }
    if (!fundingSelect.options.length) {
        [
            ["cash", "Pay with cash"],
            ["parents", "Ask parent/guardian to pay"],
            ["loan", "Use a student loan"],
            ["scholarship", "Apply for a full scholarship"]
        ].forEach(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            fundingSelect.appendChild(option);
        });
    }
    const parentOption = fundingSelect.querySelector('option[value="parents"]');
    if (parentOption) parentOption.disabled = !hasEducationSponsor();
    const canApply = p.age >= 18 && hasSecondaryCredential() &&
        !(communityCollege && communityCollege.enrolled) &&
        !(university && (university.enrolled || university.completed));
    if (optionsContainer) {
        optionsContainer.style.display = canApply || university || advanced ? "grid" : "none";
    }
    applyButton.style.display = canApply ? "inline-block" : "none";
    majorSelect.style.display = canApply ? "block" : "none";
    fundingSelect.style.display = canApply ? "block" : "none";
    enrollStatus.textContent = university && university.enrolled
        ? `University: ${university.major}, year ${university.yearsCompleted} of ${university.yearsRequired}. Tuition: ${university.tuitionLabel}.`
        : university && university.completed
            ? `Bachelor's degree completed in ${university.major}.`
            : canApply
                ? TUITION_FREE_COUNTRIES.includes(p.country)
                    ? `Undergraduate tuition is free in ${p.country}; scholarships, family support, or loans are still available choices.`
                    : `Four-year tuition is $${(UNIVERSITY_TUITION * 4).toLocaleString()}. Choose a major and a way to pay.`
                : "";
    if (p.educationLoanBalance > 0) {
        enrollStatus.textContent += ` Student loan balance: $${p.educationLoanBalance.toLocaleString()}.`;
    }
    const greekOrganization = university && university.greekOrganization;
    const canRush = Boolean(university && university.enrolled && p.age >= 18 &&
        (p.gender === "Male" || p.gender === "Female") && !greekOrganization);
    rushButton.style.display = canRush ? "inline-block" : "none";
    greekStatus.textContent = greekOrganization
        ? `Greek life: ${greekOrganization.name} member. Alumni may help you skip a job interview.`
        : university && university.enrolled && p.age >= 18 && p.gender === "Non-Binary"
            ? "Fraternities and sororities in this version are restricted to male and female characters."
            : "";
    renderAchievements();
    if (advanced && advanced.enrolled) {
        advancedSelect.style.display = "none";
        advancedButton.style.display = "none";
        fundingSelect.style.display = "none";
        advancedStatus.textContent = `${advanced.program}: year ${advanced.yearsCompleted} of ${advanced.yearsRequired}. Tuition: ${advanced.tuitionLabel}.`;
        return;
    }
    const priorDegrees = new Set(school.advancedDegrees || []);
    const eligible = university && university.completed
        ? Object.entries(ADVANCED_EDUCATION_PROGRAMS)
            .filter(([program, majors]) => majors.includes(university.major) && !priorDegrees.has(program))
            .map(([program]) => program)
        : [];
    const selectedProgram = advancedSelect.value;
    advancedSelect.replaceChildren();
    eligible.forEach(program => {
        const option = document.createElement("option");
        option.value = program;
        option.textContent = `${program} (${ADVANCED_EDUCATION_YEARS[program]} years · $${ADVANCED_EDUCATION_TUITION_BY_PROGRAM[program].toLocaleString()})`;
        advancedSelect.appendChild(option);
    });
    if (eligible.includes(selectedProgram)) advancedSelect.value = selectedProgram;
    const hasEligibleProgram = eligible.length > 0;
    const parentFunding = hasEducationSponsor();
    advancedSelect.style.display = hasEligibleProgram ? "block" : "none";
    advancedButton.style.display = hasEligibleProgram ? "inline-block" : "none";
    fundingSelect.style.display = canApply || hasEligibleProgram ? "block" : "none";
    advancedButton.disabled = !hasEligibleProgram;
    advancedStatus.textContent = university && university.completed
        ? hasEligibleProgram
            ? `Choose a related program. Medical School is the most expensive and takes seven years. Graduate School takes two years and can improve Smart before another professional-school application. ${parentFunding ? "Family funding may be available." : "Family funding is unavailable."}`
            : `There are no eligible advanced programs for your ${university.major} major, or you have completed all related programs.`
        : "";
    if (school.advancedEducation && school.advancedEducation.completed) {
        advancedStatus.textContent = `${school.advancedEducation.program} completed. ` + advancedStatus.textContent;
    }
}
function renderAchievements() {
    const list = document.getElementById("achievement-list");
    if (!list) return;
    list.replaceChildren();
    const achievements = Array.isArray(p.achievements) ? p.achievements : [];
    achievements.forEach(achievement => {
        const item = document.createElement("div");
        item.className = "sub-box";
        item.textContent = `🏆 ${achievement}`;
        list.appendChild(item);
    });
    if (!achievements.length) list.textContent = "No achievements earned yet.";
}
function awardAchievement(name) {
    if (!Array.isArray(p.achievements)) p.achievements = [];
    if (p.achievements.includes(name)) return false;
    p.achievements.push(name);
    updateLog(`ACHIEVEMENT UNLOCKED: ${name}!`);
    return true;
}
function rushGreekOrganization() {
    const university = p.school && p.school.university;
    if (!university || !university.enrolled || p.age < 18) {
        updateLog("GREEK LIFE: You must be enrolled in university to rush.");
        return;
    }
    if (university.greekOrganization) {
        updateLog("GREEK LIFE: You already joined a fraternity or sorority.");
        return;
    }
    if (p.gender !== "Male" && p.gender !== "Female") {
        updateLog("GREEK LIFE: Fraternities are open to male characters and sororities to female characters.");
        return;
    }
    const organization = p.gender === "Male"
        ? { type: "Fraternity", name: "Alpha Lambda Fraternity", memberTerm: "brother" }
        : { type: "Sorority", name: "Delta Phi Sorority", memberTerm: "sister" };
    if (Math.random() >= 0.65) {
        p.mental = Math.max(0, Math.floor(p.mental * 0.5));
        updateLog(`GREEK LIFE: ${organization.name} told you to go away. The rejection hit hard (-50% Happiness).`);
        updateUI();
        save();
        return;
    }
    schoolChoiceDialog(
        `${organization.type} Rush`,
        `${organization.name} is considering your application. Greek mythology question: who was king of the Olympian gods?`,
        [
            {
                label: "Zeus",
                run: () => {
                    university.greekOrganization = organization;
                    updateLog(`GREEK LIFE: Correct! ${organization.name} welcomed you as a ${organization.memberTerm}.`);
                }
            },
            {
                label: "Poseidon",
                run: () => rejectGreekRush(organization, "Poseidon ruled the sea, not Olympus.")
            },
            {
                label: "Hades",
                run: () => rejectGreekRush(organization, "Hades ruled the underworld, not Olympus.")
            },
            {
                label: "Apollo",
                run: () => rejectGreekRush(organization, "Apollo was not king of the Olympian gods.")
            }
        ]
    );
}
function rejectGreekRush(organization, reason) {
    p.mental = Math.max(0, Math.floor(p.mental * 0.5));
    updateLog(`GREEK LIFE: ${organization.name} rejected you. ${reason} You were told to go away (-50% Happiness).`);
}
function hasEducationSponsor() {
    return Boolean(p.relationships && Array.isArray(p.relationships.family) &&
        p.relationships.family.some(member => (member.type === "Parent" || member.type === "Guardian") && member.isAlive !== false));
}
function fundEducation(tuition, fundingMethod, undergraduate = false) {
    if (undergraduate && TUITION_FREE_COUNTRIES.includes(p.country)) {
        return { success: true, tuitionPaid: 0, label: `free tuition in ${p.country}` };
    }
    if (fundingMethod === "cash") {
        if (p.money < tuition) {
            updateLog(`EDUCATION: You need $${tuition.toLocaleString()} in cash for tuition.`);
            return { success: false };
        }
        p.money -= tuition;
        return { success: true, tuitionPaid: tuition, label: `cash ($${tuition.toLocaleString()})` };
    }
    if (fundingMethod === "parents") {
        if (!hasEducationSponsor()) {
            updateLog("EDUCATION: No living parent or guardian is available to help with tuition.");
            return { success: false };
        }
        if (Math.random() >= 0.65) {
            updateLog("EDUCATION: Your family could not cover the tuition this time.");
            return { success: false };
        }
        return { success: true, tuitionPaid: tuition, label: `family support ($${tuition.toLocaleString()})` };
    }
    if (fundingMethod === "loan") {
        p.educationLoanBalance = (p.educationLoanBalance || 0) + tuition;
        return { success: true, tuitionPaid: tuition, label: `student loan ($${tuition.toLocaleString()})` };
    }
    if (fundingMethod === "scholarship") {
        const chance = Math.min(0.9, 0.2 + p.smart / 125);
        if (Math.random() >= chance) {
            updateLog("EDUCATION: Your scholarship application was not approved. You can apply again or choose another payment method.");
            return { success: false };
        }
        return { success: true, tuitionPaid: 0, label: "full scholarship" };
    }
    updateLog("EDUCATION: Choose a valid tuition payment option.");
    return { success: false };
}
function enrollUniversity() {
    const school = p.school;
    const majorSelect = document.getElementById("university-major");
    const fundingSelect = document.getElementById("university-funding");
    if (!school || !majorSelect || !fundingSelect) return;
    if (p.age < 18 || !hasSecondaryCredential()) {
        updateLog("UNIVERSITY: You need to be at least 18 and have a high-school diploma or GED before applying.");
        return;
    }
    if (school.communityCollege && school.communityCollege.enrolled) {
        updateLog("UNIVERSITY: Finish community college before applying to university.");
        return;
    }
    if (school.university && (school.university.enrolled || school.university.completed)) {
        updateLog("UNIVERSITY: You have already started or completed university.");
        return;
    }
    const major = majorSelect.value;
    if (!UNIVERSITY_MAJORS.includes(major)) {
        updateLog("UNIVERSITY: Select a valid major.");
        return;
    }
    const tuition = UNIVERSITY_TUITION * 4;
    const funding = fundEducation(tuition, fundingSelect.value, true);
    if (!funding.success) {
        updateUI();
        save();
        return;
    }
    school.university = {
        major,
        enrolled: true,
        completed: false,
        yearsCompleted: 0,
        yearsRequired: 4,
        tuition,
        tuitionLabel: funding.label
    };
    updateLog(`UNIVERSITY: You enrolled in a four-year ${major} degree. Tuition was covered by ${funding.label}.`);
    updateUI();
    save();
}
function processUniversityYear() {
    const university = p.school && p.school.university;
    if (!university || !university.enrolled) return;
    university.yearsCompleted++;
    p.smart = Math.min(100, p.smart + 3);
    updateLog(`UNIVERSITY: You completed year ${university.yearsCompleted} of ${university.yearsRequired} in ${university.major}. (+3 Smart)`);
    if (university.yearsCompleted >= university.yearsRequired) {
        university.enrolled = false;
        university.completed = true;
        updateLog(`UNIVERSITY: You graduated with a bachelor's degree in ${university.major}.`);
    }
}
function applyToAdvancedEducation() {
    const university = p.school && p.school.university;
    const programSelect = document.getElementById("advanced-education-program");
    if (!university || !university.completed || !programSelect) {
        updateLog("EDUCATION: Complete a university degree before applying to an advanced program.");
        return;
    }
    const program = programSelect.value;
    const eligibleMajors = ADVANCED_EDUCATION_PROGRAMS[program];
    if (!eligibleMajors || !eligibleMajors.includes(university.major)) {
        updateLog(`EDUCATION: Your ${university.major} major does not qualify for ${program}.`);
        return;
    }
    if ((p.school.advancedDegrees || []).includes(program)) {
        updateLog(`EDUCATION: You already completed ${program}.`);
        return;
    }
    const admissionChance = advancedEducationAdmissionChance(program);
    if (Math.random() >= admissionChance) {
        updateLog(`EDUCATION: ${program} rejected your application. ${program === "Graduate School" ? "You can improve your Smart and try again." : "Graduate school may help you improve your Smart before reapplying, but does not guarantee admission."}`);
        updateUI();
        save();
        return;
    }
    const tuition = ADVANCED_EDUCATION_TUITION_BY_PROGRAM[program];
    const fundingMethod = document.getElementById("university-funding").value;
    const funding = fundEducation(tuition, fundingMethod, false);
    if (!funding.success) {
        updateUI();
        save();
        return;
    }
    p.school.advancedEducation = {
        program,
        enrolled: true,
        completed: false,
        yearsCompleted: 0,
        yearsRequired: ADVANCED_EDUCATION_YEARS[program],
        tuition,
        tuitionLabel: funding.label
    };
    updateLog(`EDUCATION: You enrolled in ${program}. Tuition was covered by ${funding.label}.`);
    updateUI();
    save();
}
function advancedEducationAdmissionChance(program) {
    const baseChance = {
        "Graduate School": 0.8,
        "Business School": 0.8,
        "Dental School": 0.65,
        "Law School": 0.7,
        "Medical School": 0.35,
        "Nursing School": 0.65,
        "Pharmacy School": 0.8,
        "Veterinary School": 0.6
    }[program] || 0;
    return Math.min(0.95, baseChance + p.smart / 500);
}
function processAdvancedEducationYear() {
    const advanced = p.school && p.school.advancedEducation;
    if (!advanced || !advanced.enrolled) return;
    advanced.yearsCompleted++;
    p.smart = Math.min(100, p.smart + 4);
    updateLog(`EDUCATION: You completed year ${advanced.yearsCompleted} of ${advanced.yearsRequired} in ${advanced.program}. (+4 Smart)`);
    if (advanced.yearsCompleted >= advanced.yearsRequired) {
        advanced.enrolled = false;
        advanced.completed = true;
        if (!Array.isArray(p.school.advancedDegrees)) p.school.advancedDegrees = [];
        p.school.advancedDegrees.push(advanced.program);
        updateLog(`EDUCATION: You completed ${advanced.program}.`);
        if (advanced.program === "Dental School" || advanced.program === "Medical School") {
            updateLog(`TITLE: Dr. ${p.name} may now use the Doctor title.`);
        }
        delete p.school.advancedEducation;
    }
}
function processEducationLoanRepayment() {
    if (!p.job || !p.educationLoanBalance) return;
    const payment = Math.min(p.educationLoanBalance, Math.floor(p.job.salary * 0.05));
    if (payment <= 0) return;
    p.money -= payment;
    p.educationLoanBalance -= payment;
    updateLog(`STUDENT LOAN: You repaid $${payment.toLocaleString()}. Remaining education debt: $${p.educationLoanBalance.toLocaleString()}.`);
}
// --- 4. LIFE CYCLE (AGE UP) ---
function ageUp() {
    if (p.health <= 0) { die(); return; }
    p.age++;
    p.gigsCompletedThisYear = 0;
    updateSchoolProgress();
    processCommunityCollegeYear();
    processUniversityYear();
    processAdvancedEducationYear();
    processSchoolActivitiesYear();
    if (p.relationships && Array.isArray(p.relationships.family)) {
        p.relationships.family.forEach(member => {
            if (member.type === "Sibling" && Number.isFinite(member.age)) {
                member.age++;
                if (member.age >= 16 && (!member.occupation || member.occupation === "Student")) {
                    member.occupation = ["Student", "Apprentice", "Part-time worker", "Tutor", "Coach", "Security officer"][Math.floor(Math.random() * 6)];
                }
            }
        });
    }
    // --- EXPANSION PACK HOOKS ---
    if (typeof SeasonsModule !== 'undefined') SeasonsModule.updateSeason(p.age);
    } else {
        processStandardYear();
    }
    processEducationLoanRepayment();
    checkMentalHealth();
    updateUI();
    save();
    if (!p.isBreakdown) triggerSchoolEvent();
    if (!p.isBreakdown) triggerWorkplaceEvent();
}
function processStandardYear() {
    if (p.job) {
        if (p.job.universityOnly &&
            !(p.school && p.school.university && p.school.university.enrolled)) {
            updateLog(`WORK: Your ${p.job.title} job ended when you left university.`);
            p.job = null;
        }
    }
    if (p.job) {
        p.money += p.job.salary;
        if (p.job.workType === "part-time") {
            const stress = Math.ceil((p.job.weeklyHours || 0) / 8);
            p.mental = Math.max(0, p.mental - stress);
            if (p.job.weeklyHours >= 25 && Math.random() < 0.05) {
                p.health = Math.max(0, p.health - 1);
                updateLog("WORK: Heavy weekly hours strained your health.");
            }
            updateLog(`WORK: Your part-time job paid $${p.job.salary.toLocaleString()} this year. Stress increased from ${p.job.weeklyHours} hours per week.`);
        }
        processCareerProgression();
    }
    if (p.retirementPension) {
        p.money += p.retirementPension;
        updateLog(`PENSION: Your retirement paid $${p.retirementPension.toLocaleString()} this year.`);
    }
    function processCareerProgression() {
        if (!p.job) return;
        p.job.yearsWorked = (p.job.yearsWorked || 0) + 1;
        p.careerYears = (p.careerYears || 0) + 1;
        p.job.performance = Number.isFinite(p.job.performance) ? p.job.performance : 50;
        if (p.job.breakthroughAtFollowers &&
            (p.followers || 0) >= p.job.breakthroughAtFollowers &&
            p.fame >= p.job.breakthroughAtFame &&
            !p.job.breakthrough && Math.random() < 0.35) {
            p.job.breakthrough = true;
            p.job.salary = Math.floor(p.job.salary * 3);
            p.followers = Math.floor((p.followers || 0) * 1.5);
            p.fame = Math.min(100, p.fame + 20);
            updateLog(`CAREER BREAKTHROUGH: ${p.job.title} reached a major audience. Your annual income tripled and your following surged!`);
            return;
        }
        const skill = p.job.title === "Actor" ? p.looks : p.smart;
        const performanceChange = (skill >= 70 ? 5 : skill >= 45 ? 2 : -2) + Math.floor(Math.random() * 5) - 2;
        p.job.performance = Math.max(0, Math.min(100, p.job.performance + performanceChange));
        if (p.job.payGrowth === "gradual") {
            const raise = Math.max(1, Math.floor(p.job.salary * (0.02 + p.job.performance / 5000)));
            p.job.salary += raise;
            updateLog(`CAREER: Your experience and performance earned a $${raise.toLocaleString()} raise.`);
        } else if (p.job.performance >= 70 && Math.random() < 0.35) {
            const attributeBonus = Math.max(0, skill - 50) / 5000;
            const raiseRate = 0.02 + attributeBonus + Math.random() * 0.04;
            const raise = Math.max(1, Math.floor(p.job.salary * raiseRate));
            p.job.salary += raise;
            updateLog(`PERFORMANCE: Your ${p.job.performance}% performance earned a $${raise.toLocaleString()} raise.`);
        } else if (p.job.performance <= 15) {
            updateLog(`PERFORMANCE: Work has been difficult. Your performance is ${p.job.performance}%.`);
        } else {
            updateLog(`CAREER: Work performance is ${p.job.performance}%.`);
        }
        if (p.job.promotesTo && !p.job.promotionNotified &&
            p.job.yearsWorked >= (p.job.minimumPromotionYears || 1)) {
            p.job.promotionNotified = true;
            updateLog(`CAREER: You are eligible to apply for promotion to ${p.job.promotesTo}.`);
        }
    }
     if (p.age === 18) {
        updateLog("GRADUATION: Careers and Fame are now available.");
        refreshJobBoard();
// --- 5. SOCIAL & CAREER ACTIONS ---
function study() {
    if (!p.school || !p.school.enrolled || p.age < 5) {
        updateLog("SCHOOL: You need to be enrolled in school to study harder.");
        return;
    }
    p.smart = Math.min(100, p.smart + 3);
    p.mental = Math.max(0, p.mental - 8);
     updateLog("You studied harder. (+Smart, -Mental)");
    updateUI();
    save();
}
function seekTherapy(tier) {
    const board = document.getElementById('job-board');
    if (!board) return;
    board.innerHTML = "";
     const groups = [
        { title: "Part-time jobs (age 13+)", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "part-time") },
        { title: "Careers (age 18+)", jobs: jobList.map((job, index) => ({ job, index })).filter(item => !item.job.workType) },
        { title: "Corporate careers and promotions", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "corporate") },
        { title: "Model agency", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "modeling") },
        { title: "Airline", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "airline") },
        { title: "Veterinary clinic", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "veterinary") },
        { title: "Hospital and medical office", jobs: jobList.map((job, index) => ({ job, index })).filter(item => ["hospital", "medical-office"].includes(item.job.workType)) },
        { title: "Municipal", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "municipal") },
        { title: "Newspaper", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "newspaper") },
        { title: "School district", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "school-district") },
        { title: "University district", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "university-district") },
        { title: "Law firm", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "law-firm") },
        { title: "Restaurant", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "restaurant") },
        { title: "Police and fire departments", jobs: jobList.map((job, index) => ({ job, index })).filter(item => ["police", "fire-department"].includes(item.job.workType)) },
        { title: "Mortuary", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "mortuary") },
        { title: "Record label", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "record-label") },
        { title: "Film studio", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "film-studio") },
        { title: "Small business", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "small-business") },
        { title: "Publisher", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "publisher") },
        { title: "Retailer", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "retailer") },
        { title: "Orchestra (legacy)", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "orchestra") },
        { title: "Museum", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "museum") },
        { title: "Real estate and travel agency", jobs: jobList.map((job, index) => ({ job, index })).filter(item => ["real-estate", "travel-agency"].includes(item.job.workType)) },
        { title: "Circus", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "circus") },
        { title: "Salon", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "salon") },
        { title: "Bank", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "bank") },
        { title: "Trucking company", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "trucking") },
        { title: "Library", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "library") },
        { title: "Fishery", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "fishery") },
        { title: "Ride share", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "ride-share") },
        { title: "Grocery store", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "grocery") },
        { title: "Fast food", jobs: jobList.map((job, index) => ({ job, index })).filter(item => item.job.workType === "fast-food") },
        { title: "Military", jobs: jobList.map((job, index) => ({ job, index })).filter(item => ["military-enlisted", "military-officer"].includes(item.job.workType)) }
    ];
    groups.forEach(group => {
        if (!group.jobs.length) return;
        const heading = document.createElement("h4");
        heading.textContent = group.title;
        board.appendChild(heading);
        group.jobs.forEach(({ job, index: i }) => {
            const hasEducation = hasCareerEducation(job);
            const minimumAge = ["part-time", "gig"].includes(job.workType) ? 13 : 18;
            const canApply = p.age >= minimumAge && p.smart >= job.reqSmart &&
                (!job.reqLooks || p.looks >= job.reqLooks) && hasEducation &&
                isCareerApplicationEligible(job);
            const requirement = describeCareerEducation(job);
            const wage = getOfferedSalary(job);
            const promotionRequirement = job.promotionFrom
                ? ` — promote from ${job.promotionFrom} after ${job.minimumPromotionYears} year${job.minimumPromotionYears === 1 ? "" : "s"}`
                : job.promotionFromAny
                    ? ` — promote from ${job.promotionFromAny.join(", ")}`
                : job.requiredCareerYears
                    ? ` — ${job.requiredCareerYears} years' work experience required`
                    : "";
            const recordRequirement = p.hasCriminalRecord && job.canHoldWithCriminalRecord === false
                ? " — criminal record disqualifies"
                : "";
            const looksRequirement = job.reqLooks && p.looks < job.reqLooks
                ? ` — Looks ${job.reqLooks} required`
                : "";
            const genderRequirement = job.reqGender && p.gender !== job.reqGender
                ? ` — ${job.reqGender} characters only`
                : "";
            const description = job.breakthroughAtFollowers
                ? " — breakthrough potential"
                : job.payGrowth === "gradual" ? " — gradual raises" : "";
            const hourlyRate = job.hourlyRate
                ? Math.max(1, Math.floor(job.hourlyRate * (COUNTRY_WAGE_MULTIPLIERS[p.country || "USA"] || 1)))
                : 0;
            const payDescription = job.hourlyRate
                ? ` ($${hourlyRate}/hr · ${job.weeklyHours} hrs/wk · $${wage.toLocaleString()}/yr)`
                : ` ($${wage.toLocaleString()}/year${job.salaryEstimated ? " · modeled" : ""})`;
            const button = document.createElement("button");
            button.className = "btn-ghost";
            button.disabled = !canApply;
            button.textContent = `${job.title}${payDescription}${requirement}${promotionRequirement}${p.age < minimumAge ? ` — age ${minimumAge}+ required` : ""}${p.smart < job.reqSmart ? ` — Smart ${job.reqSmart} required` : ""}${looksRequirement}${genderRequirement}${recordRequirement}${description}`;
            button.onclick = () => applyJob(i);
            board.appendChild(button);
        });
    });
    if (p.age >= 18 && hasCareerEducation({ reqEducation: "university" }) &&
        !(p.licenses || []).includes("Pilot")) {
        const licenseButton = document.createElement("button");
        licenseButton.className = "btn-ghost";
        licenseButton.textContent = "Take Pilot License Exam (university degree required)";
        licenseButton.onclick = obtainPilotLicense;
        board.appendChild(licenseButton);
    }
    if (p.age >= 16 && !(p.licenses || []).includes("Driving")) {
        const licenseButton = document.createElement("button");
        licenseButton.className = "btn-ghost";
        licenseButton.textContent = "Take Driving License Exam";
        licenseButton.onclick = obtainDrivingLicense;
        board.appendChild(licenseButton);
    }
    renderFreelanceGigs(board);
}
function renderFreelanceGigs(board) {
    const heading = document.createElement("h4");
    heading.textContent = `Freelance gigs (up to 10 accepted each year · ${(p.gigsCompletedThisYear || 0)}/10 used)`;
    board.appendChild(heading);
    FREELANCE_GIGS.forEach(gig => {
        const row = document.createElement("div");
        row.className = "sub-box";
        const countryRate = COUNTRY_WAGE_MULTIPLIERS[p.country || "USA"] || 1;
        const minRate = Math.max(1, Math.floor(gig.minRate * countryRate));
        const maxRate = Math.max(minRate, Math.floor(gig.maxRate * countryRate));
        const midRate = Math.floor((minRate + maxRate) / 2);
        const label = document.createElement("div");
        label.textContent = `${gig.title} · age ${gig.minAge}+ · $${minRate}–$${maxRate}/hour`;
        row.appendChild(label);
        [
            { label: "Low rate", rate: minRate },
            { label: "Standard rate", rate: midRate },
            { label: "High rate", rate: maxRate }
        ].forEach(option => {
            const button = document.createElement("button");
            button.className = "btn-ghost";
            button.textContent = `${option.label} ($${option.rate}/hr)`;
            button.disabled = p.age < gig.minAge || (p.gigsCompletedThisYear || 0) >= 10;
            button.onclick = () => applyFreelanceGig(gig, option.rate);
            row.appendChild(button);
        });
        board.appendChild(row);
    });
}
function applyFreelanceGig(gig, requestedRate) {
    if (p.age < gig.minAge) {
        updateLog(`GIG: ${gig.title} requires age ${gig.minAge} or older.`);
        return;
    }
    if ((p.gigsCompletedThisYear || 0) >= 10) {
        updateLog("GIG: You have completed the 10-gig annual limit. Try again after aging up.");
        return;
    }
    const countryRate = COUNTRY_WAGE_MULTIPLIERS[p.country || "USA"] || 1;
    const minRate = Math.max(1, Math.floor(gig.minRate * countryRate));
    const maxRate = Math.max(minRate, Math.floor(gig.maxRate * countryRate));
    if (requestedRate < minRate || requestedRate > maxRate) {
        updateLog(`GIG: ${gig.title} pays between $${minRate} and $${maxRate} per hour in ${p.country || "the USA"}.`);
        return;
    }
    const ratePosition = (requestedRate - minRate) / Math.max(1, maxRate - minRate);
    const hiringChance = 0.9 - ratePosition * 0.55;
    if (Math.random() >= hiringChance) {
        updateLog(`GIG: No client hired you for ${gig.title} at $${requestedRate}/hour. Try requesting less.`);
        return;
    }
    const hours = 2 + Math.floor(Math.random() * 7);
    const earnings = requestedRate * hours;
    p.money += earnings;
    p.gigsCompletedThisYear = (p.gigsCompletedThisYear || 0) + 1;
    updateLog(`GIG: A client hired you for ${gig.title}. You worked ${hours} hours at $${requestedRate}/hour and earned $${earnings.toLocaleString()}. (${p.gigsCompletedThisYear}/10 gigs this year)`);
    updateUI();
    save();
}
function getOfferedSalary(job) {
    const country = p.country || "USA";
    const dollarSalary = job.salary * (job.currency === "EUR" ? EUR_TO_USD : 1);
    return Math.max(1, Math.floor(dollarSalary * (COUNTRY_WAGE_MULTIPLIERS[country] || 1)));
}
function refreshCareerActions() {
    const container = document.getElementById("career-actions");
    if (!container) return;
    container.replaceChildren();
    if (!p.job) {
        if (p.retirementPension) {
            const pension = document.createElement("p");
            pension.textContent = `Retirement pension: $${p.retirementPension.toLocaleString()} per year.`;
            container.appendChild(pension);
        }
        return;
    }
    const resign = document.createElement("button");
    resign.className = "btn-ghost";
    resign.textContent = "Resign";
    resign.onclick = resignFromJob;
    container.appendChild(resign);
    if ((p.job.yearsWorked || 0) >= 30) {
        const retire = document.createElement("button");
        retire.className = "btn-ghost";
        retire.textContent = "Retire with pension";
        retire.onclick = retireFromJob;
        container.appendChild(retire);
    } else if (p.job.yearsWorked > 0) {
        const eligibility = document.createElement("span");
        eligibility.textContent = `Retirement eligibility: ${30 - p.job.yearsWorked} more years with this employer.`;
        container.appendChild(eligibility);
    }
}
function resignFromJob() {
    if (!p.job) return;
    const title = p.job.title;
    p.job = null;
    updateLog(`CAREER: You resigned from your ${title} job.`);
    updateUI();
    save();
}
function retireFromJob() {
    if (!p.job || (p.job.yearsWorked || 0) < 30) {
        updateLog("CAREER: You need 30 years with your current employer to retire in this version.");
        return;
    }
    const title = p.job.title;
    const yearsWorked = p.job.yearsWorked;
    p.retirementPension = Math.floor(p.job.salary * Math.min(0.7, 0.25 + yearsWorked * 0.01));
    p.job = null;
    updateLog(`RETIREMENT: You retired from ${title} after ${yearsWorked} years. Your annual pension is $${p.retirementPension.toLocaleString()}.`);
    updateUI();
    save();
}
function triggerWorkplaceEvent() {
    const modal = document.getElementById("choice-modal");
    if (!p.job || p.age < 18 || (modal && modal.style.display === "flex") || Math.random() >= 0.08) {
        return;
    }
    const eventType = Math.random();
    if (eventType < 0.25) {
        schoolChoiceDialog("Supervisor Request", "Your supervisor asks you to spend extra time working together. How do you respond?", [
            {
                label: "Spend time with the supervisor",
                run: () => {
                    p.job.performance = Math.min(100, (p.job.performance || 50) + 12);
                    updateLog("WORK: Extra time with your supervisor helped your performance and career prospects.");
                }
            },
            {
                label: "Decline",
                run: () => {
                    p.job.performance = Math.max(0, (p.job.performance || 50) - 5);
                    updateLog("WORK: You declined the extra work time. Your performance dipped slightly.");
                }
            }
        ]);
    } else if (eventType < 0.65) {
        schoolChoiceDialog("Team Building", "Your workplace is doing a hobby together. Do you join in?", [
            {
                label: "Participate",
                run: () => {
                    p.job.performance = Math.min(100, (p.job.performance || 50) + 5);
                    p.mental = Math.min(100, p.mental + 3);
                    updateLog("WORK: You joined the team activity and built morale.");
                }
            },
            {
                label: "Refuse",
                run: () => {
                    p.job.performance = Math.max(0, (p.job.performance || 50) - 8);
                    updateLog("WORK: You refused the team activity. Your performance fell.");
                }
            }
        ]);
    } else {
        schoolChoiceDialog("Workplace Misconduct", "Your supervisor behaved inappropriately. You can report the misconduct to HR, take legal action, or do nothing.", [
            {
                label: "Report to HR",
                run: () => {
                    if (Math.random() < 0.7) {
                        updateLog("WORK: HR investigated your report and disciplined the supervisor.");
                    } else {
                        p.job.performance = Math.max(0, (p.job.performance || 50) - 5);
                        updateLog("WORK: HR could not substantiate your report. Work became more difficult.");
                    }
                }
            },
            {
                label: "File a lawsuit",
                run: () => {
                    if (Math.random() < 0.55) {
                        const award = Math.max(1000, Math.floor(p.job.salary * 0.25));
                        p.money += award;
                        updateLog(`WORK: Your lawsuit succeeded. You received a $${award.toLocaleString()} settlement.`);
                    } else {
                        const cost = Math.min(p.money, 1000);
                        p.money -= cost;
                        updateLog(`WORK: Your lawsuit was unsuccessful. Legal costs were $${cost.toLocaleString()}.`);
                    }
                }
            },
            {
                label: "Do nothing",
                run: () => updateLog("WORK: You chose not to report the supervisor.")
            }
        ]);
    }
}
function hasCareerEducation(job) {
    if (job.universityOnly &&
        !(p.school && p.school.university && p.school.university.enrolled)) {
        return false;
    }
    if (job.reqLicense) {
        const hasBaseEducation = !job.reqEducation || job.reqEducation === "none" ||
            hasCareerEducation({ reqEducation: job.reqEducation });
        return hasBaseEducation &&
            (p.licenses || []).includes(job.reqLicense);
    }
    if (job.reqEducation === "secondary") return hasSecondaryCredential();
    if (job.reqEducation === "university") {
        return Boolean(p.school && p.school.university && p.school.university.completed);
    }
    if (job.reqEducation === "business") {
        return Boolean(p.school && Array.isArray(p.school.advancedDegrees) &&
            p.school.advancedDegrees.includes("Business School"));
    }
    if (job.universityOnly &&
        !(p.school && p.school.university && p.school.university.enrolled)) {
        return false;
    }
    if (job.reqEducation === "advanced" && job.reqAdvanced) {
        return Boolean(p.school && Array.isArray(p.school.advancedDegrees) &&
            p.school.advancedDegrees.includes(job.reqAdvanced));
    }
    if (job.reqEducation === "community-college") {
        return Boolean(p.school && p.school.communityCollege && p.school.communityCollege.completed);
    }
    if (job.reqEducation === "advanced") {
        return Boolean(p.school && Array.isArray(p.school.advancedDegrees) &&
            p.school.advancedDegrees.includes(job.reqAdvanced));
    }
    return true;
}
function obtainPilotLicense() {
    if (p.age < 18 || !hasCareerEducation({ reqEducation: "university" })) {
        updateLog("AIRLINE: A completed university degree is required before taking the pilot license exam.");
        return;
    }
    if (!Array.isArray(p.licenses)) p.licenses = [];
    if (p.licenses.includes("Pilot")) {
        updateLog("AIRLINE: You already hold a pilot license.");
        return;
    }
    const chance = Math.min(0.9, 0.3 + (p.smart || 0) / 125);
    if (Math.random() < chance) {
        p.licenses.push("Pilot");
        updateLog("AIRLINE: You passed the pilot license exam.");
    } else {
        updateLog("AIRLINE: You did not pass the pilot license exam. You can try again later.");
    }
    updateUI();
    save();
}
function obtainDrivingLicense() {
    if (p.age < 16) {
        updateLog("MUNICIPAL: You must be at least 16 to take the driving license exam.");
        return;
    }
    if (!Array.isArray(p.licenses)) p.licenses = [];
    if (p.licenses.includes("Driving")) {
        updateLog("MUNICIPAL: You already hold a driving license.");
        return;
    }
    const chance = Math.min(0.95, 0.4 + (p.smart || 0) / 150);
    if (Math.random() < chance) {
        p.licenses.push("Driving");
        updateLog("MUNICIPAL: You passed the driving license exam.");
    } else {
        updateLog("MUNICIPAL: You did not pass the driving license exam. You can try again later.");
    }
    updateUI();
    save();
}
function describeCareerEducation(job) {
    if (job.reqLicense === "Pilot") return " — University degree and Pilot License required";
    if (job.reqLicense) return ` — ${job.reqLicense} License required`;
    if (job.universityOnly) return " — Must currently be enrolled in university";
    if (job.universityOnly) return " — Must currently be enrolled in university";
    if (job.reqEducation === "secondary") return " — High school diploma or GED required";
    if (job.reqEducation === "university") return " — University degree required";
    if (job.reqEducation === "business") return " — Business School required";
    if (job.reqEducation === "community-college") return " — Community college required";
    if (job.reqEducation === "advanced") return ` — ${job.reqAdvanced} required`;
    return "";
}
function isCareerApplicationEligible(job) {
    if (job.reqGender && p.gender !== job.reqGender) {
        return false;
    }
    if (job.universityOnly &&
        !(p.school && p.school.university && p.school.university.enrolled)) {
        return false;
    }
    if (job.reqLooks && p.looks < job.reqLooks) {
        return false;
    }
    if (job.promotionFromAny &&
        (!p.job || p.job.workType !== job.workType ||
            !job.promotionFromAny.includes(p.job.title) ||
            (p.job.yearsWorked || 0) < (job.minimumPromotionYears || 1))) {
        return false;
    }
    if (job.promotionFrom && (!p.job || p.job.workType !== job.workType ||
        p.job.title !== job.promotionFrom ||
        (p.job.yearsWorked || 0) < (job.minimumPromotionYears || 1))) {
        return false;
    }
    if (job.requiredCareerYears && (p.careerYears || 0) < job.requiredCareerYears) {
        return false;
    }
    if (p.hasCriminalRecord && job.canHoldWithCriminalRecord === false) {
        return false;
    }
    return true;
}
function applyJob(i) {
    const job = jobList[i];
    if (!job) return;
    const minimumAge = Number.isFinite(job.ageRequirement)
        ? job.ageRequirement
        : ["part-time", "gig"].includes(job.workType) ? 13 : 18;
    if (p.age < minimumAge) {
        updateLog(`${job.workType ? "WORK" : "CAREER"}: You must be at least ${minimumAge} to apply for ${job.title}.`);
        return;
    }
    if (!hasCareerEducation(job)) {
        updateLog(`CAREER: ${job.title} requires ${describeCareerEducation(job).replace(/^ — /, "").toLowerCase()}.`);
        refreshJobBoard();
        return;
    }
    if (p.smart < job.reqSmart) {
        updateLog(`CAREER: ${job.title} requires Smart ${job.reqSmart}.`);
        refreshJobBoard();
        return;
    }
    if (job.reqGender && p.gender !== job.reqGender) {
        updateLog(`CAREER: ${job.title} is only available to ${job.reqGender.toLowerCase()} characters.`);
        refreshJobBoard();
        return;
    }
    if (!isCareerApplicationEligible(job)) {
        if (job.reqLooks && p.looks < job.reqLooks) {
            updateLog(`CAREER: ${job.title} requires Looks ${job.reqLooks}.`);
        } else if (job.promotionFrom) {
            updateLog(`CAREER: Promotion to ${job.title} requires ${job.promotionFrom} experience for at least ${job.minimumPromotionYears} year${job.minimumPromotionYears === 1 ? "" : "s"}.`);
        } else if (job.promotionFromAny) {
            updateLog(`CAREER: Promotion to ${job.title} requires at least ${job.minimumPromotionYears} year in a qualifying entry role: ${job.promotionFromAny.join(", ")}.`);
        } else if (job.requiredCareerYears && (p.careerYears || 0) < job.requiredCareerYears) {
            updateLog(`CAREER: ${job.title} requires ${job.requiredCareerYears} years of work experience.`);
        } else {
            updateLog(`CAREER: ${job.title} is not available with your current record.`);
        }
        refreshJobBoard();
        return;
    }
    if (job.workType === "military-enlisted" && job.title === "Private" &&
        !p.militaryBootcampCompleted && Math.random() < 0.25) {
        schoolChoiceDialog(
            "Military Enlistment",
            "Your enlistment application was rejected. You may go through boot camp for another chance to enlist.",
            [
                {
                    label: "Go to Boot Camp",
                    run: () => {
                        if (Math.random() < 0.7) {
                            p.militaryBootcampCompleted = true;
                            startMilitaryService(job);
                        } else {
                            updateLog("MILITARY: You did not pass boot camp and were not enlisted.");
                            updateUI();
                            save();
                        }
                    }
                },
                {
                    label: "Leave",
                    run: () => updateLog("MILITARY: You decided not to attend boot camp.")
                }
            ]
        );
        return;
    }
    const university = p.school && p.school.university;
    const greekOrganization = university && university.greekOrganization;
    const sharesGreekOrganization = Boolean(university && university.completed && greekOrganization && Math.random() < 0.65);
    p.job = {
        ...job,
        salary: getOfferedSalary(job),
        hourlyRate: job.hourlyRate
            ? Math.max(1, Math.floor(job.hourlyRate * (COUNTRY_WAGE_MULTIPLIERS[p.country || "USA"] || 1)))
            : undefined,
        performance: 50,
        yearsWorked: 0
    };
    if (job.workType === "military-enlisted" && job.title === "Private") {
        p.militaryBootcampCompleted = true;
    }
    if (sharesGreekOrganization && !job.workType) {
        updateLog(`HIRED WITHOUT INTERVIEW: Your interviewer was a fellow ${greekOrganization.type.toLowerCase()} ${greekOrganization.memberTerm} from ${greekOrganization.name} and hired you on the spot.`);
        awardAchievement(greekOrganization.type === "Fraternity"
            ? "Hired by a Frat Brother"
            : "Hired by a Sorority Sister");
    } else {
        updateLog(`HIRED: You are now a ${p.job.title}, earning about $${p.job.salary.toLocaleString()} per year in ${p.country || "your country"}.`);
    }
    if (job.fameOnHire) {
        p.fame = Math.min(100, (p.fame || 0) + 35);
        p.followers = (p.followers || 0) + 1000;
        updateLog("MODELING: You have reached Superstar Model status! Your Fame and social following surged.");
    }
    updateUI();
    save();
}
function startMilitaryService(job) {
    p.job = {
        ...job,
        salary: getOfferedSalary(job),
        performance: 50,
        yearsWorked: 0
    };
    p.militaryBootcampCompleted = true;
    updateLog(`MILITARY: You completed boot camp and enlisted as a ${job.title}.`);
    updateUI();
    save();
}
function findDate() {
}
function adoptPet(i) {
    const key = ['dog', 'cat', 'fish'][i];
    if (typeof PetModule === 'undefined') return;
    PetModule.adoptPet(key);
    renderPets();
    updateUI();
    save();
}
function postSocial(type) {
    if (p.age < 13) return;
    if (!Number.isFinite(p.followers)) p.followers = 0;
    const effects = {
        funny:     { fameMin: 1,  fameMax: 4, mental: 2,  label: "🤡 You posted a meme." },
        aesthetic: { fameMin: 2,  fameMax: 6, mental: 1,  label: "📸 You posted a selfie." },
    if (!e) return;
    const fameDelta = Math.floor(Math.random() * (e.fameMax - e.fameMin + 1)) + e.fameMin;
    p.fame = Math.max(0, Math.min(100, p.fame + fameDelta));
    const followerGain = type === "scroll" ? 0 : Math.max(5, Math.floor((p.fame + 1) * (1 + Math.random() * 4)));
    p.followers += followerGain;
    p.mental = Math.max(0, Math.min(100, p.mental + e.mental));
     updateLog(`${e.label} (${fameDelta >= 0 ? '+' : ''}${fameDelta} Fame, +${followerGain} followers)`);
    updateUI();
}
    const el = document.getElementById('list-family');
    if (!el) return;
    const fam = (p.relationships && p.relationships.family) || [];
         const background = document.getElementById('family-background');
    if (background) {
        const parentCount = fam.filter(member => member.type === "Parent").length;
        const legacyDescription = parentCount >= 2
            ? "You were raised by both parents."
            : parentCount === 1
                ? "You were raised by one parent."
                : fam.some(member => member.type === "Guardian")
                    ? "You were raised by a guardian."
                    : "No parent or guardian is recorded for this life.";
        background.textContent = (p.familyBackground && p.familyBackground.description) || legacyDescription;
    }
    el.innerHTML = fam.map(f => {
        const age = f.type === "Sibling" && Number.isFinite(f.age) ? `, age ${f.age}` : "";
        const occupation = f.type === "Sibling" && f.occupation ? ` · ${f.occupation}` : "";
        return `<div class="sub-box">${f.name} (${f.type}${age}${occupation}) — Relationship: ${f.rel}</div>`;
    }).join('')
        || '<p style="color:#666;">No family connections yet.</p>';
}
    const el = document.getElementById('list-pets');
    if (!el) return;
    const pets = (p.relationships && p.relationships.pets) || [];
    el.innerHTML = pets.map((pet, i) => {
        const kind = pet.familyPet ? "family pet" : "pet";
        const actions = pet.species === "fish"
            ? `<button class="btn-ghost" onclick="PetModule.interactWithPet(${i}, 'feed')">🍽️ Feed</button>
                <button class="btn-ghost" onclick="PetModule.interactWithPet(${i}, 'clean')">🧽 Clean tank</button>`
            : `<button class="btn-ghost" onclick="PetModule.interactWithPet(${i}, 'play')">🎾 Play</button>
                <button class="btn-ghost" onclick="PetModule.interactWithPet(${i}, 'vet')">🩺 Vet</button>`;
        return `
        <div class="sub-box">
                    ${pet.name} (${pet.species} ${kind}, age ${pet.age}) — Bond: ${pet.relationship}
            <div style="display:flex; gap:8px; margin-top:6px;">
                            ${actions}
            </div>
               </div>`;
    }).join('') || '<p style="color:#666;">No pets yet.</p>';
}
function renderArchive() {
}
function updateUI() {
    if (!Number.isFinite(p.followers)) p.followers = 0;
    const isDoctor = p.school && Array.isArray(p.school.advancedDegrees) &&
        (p.school.advancedDegrees.includes("Dental School") || p.school.advancedDegrees.includes("Medical School"));
    document.getElementById('char-name').innerText = `${isDoctor ? "Dr. " : ""}${p.name}`;
    document.getElementById('val-money').innerText = p.money.toLocaleString();
    document.getElementById('val-age').innerText = p.age;
    
    document.getElementById('bar-mental').style.width = p.mental + "%";
    document.getElementById('bar-smart').style.width = p.smart + "%";
    document.getElementById('bar-looks').style.width = p.looks + "%";
    const popularity = document.getElementById('popularity-stat');
    if (popularity) popularity.style.display = p.age >= 5 && p.school && p.school.enrolled ? 'block' : 'none';
    const jobSect = document.getElementById('job-section');
     if (jobSect) jobSect.style.display = p.age >= 13 ? 'block' : 'none';
    if (p.age >= 13) {
        refreshJobBoard();
        const currentJob = document.getElementById("current-job-info");
        if (currentJob) currentJob.textContent = p.job
            ? `${p.job.title} — about $${p.job.salary.toLocaleString()} per year${p.job.hourlyRate ? ` · $${p.job.hourlyRate}/hr, ${p.job.weeklyHours} hrs/wk` : ""} · Performance ${p.job.performance || 50}%`
            : "Unemployed";
        refreshCareerActions();
    }
    renderFamily();
    renderPets();
    renderSchool();
    renderSchoolActivities();
    if (p.age >= 13) {
        const smSect = document.getElementById('social-media-section');
        if(fameCont) {
            fameCont.style.display = 'block';
            document.getElementById('bar-fame').style.width = p.fame + "%";
            const fameLabel = fameCont.querySelector("label");
            if (fameLabel) fameLabel.textContent = `Fame ${p.fame} · Followers ${(p.followers || 0).toLocaleString()}`;
        }
    }
}
function showUI(type) {
    const home = document.getElementById('home-screen');
    const setup = document.getElementById('setup-screen');
    const settings = document.getElementById('settings-screen');
    const main = document.getElementById('main-ui');
    if (home && setup && settings && main) {
        home.style.display = type === 'home' ? 'block' : 'none';
        setup.style.display = type === 'setup' ? 'block' : 'none';
        settings.style.display = type === 'settings' ? 'block' : 'none';
        main.style.display = type === 'main' ? 'block' : 'none';
    }
}
function openArchive() { renderArchive(); document.getElementById('archive-modal').style.display = 'flex'; }
function closeArchive() { document.getElementById('archive-modal').style.display = 'none'; }
function saveSettings() {
    const confirmExit = document.getElementById('setting-confirm-exit');
    if (confirmExit) localStorage.setItem('dynasty_confirm_exit', String(confirmExit.checked));
}
// --- 9. GLOBAL HOME BUTTON LOGIC ---
window.exitToHome = function() {
     const confirmExit = localStorage.getItem('dynasty_confirm_exit') !== 'false';
    if (!confirmExit || confirm("Return to the main menu? Your current life will end.")) {
        // 1. Perform a final save
        save(); 
