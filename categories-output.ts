const surveyCategories = [
  {
    id: 'demographics',
    label: 'Demographics Profile',
    icon: Users,
    description: 'Faculty background, tenure, and personal demographics.',
    questions: [
      {
        text: "Gender",
        type: "pie",
        summaryType: "nominal_all",
        data: [
          { name: 'Female', count: 79 },
          { name: 'Male', count: 68 }
        ]
      },
      {
        text: "Marital Status",
        type: "pie",
        summaryType: "nominal_all",
        data: [
          { name: 'Married', count: 118 },
          { name: 'Single', count: 23 },
          { name: 'Divorced', count: 4 }
        ]
      },
      {
        text: "Faculty Affiliation",
        type: "bar",
        summaryType: "nominal_top3",
        data: [
          { name: 'Faculty of Arts and Sciences', count: 57 },
          { name: 'Faculty of Engineering', count: 30 },
          { name: 'Faculty of Health Sciences', count: 22 },
          { name: 'Faculty of Business and Management', count: 14 },
          { name: 'Issam Fares Faculty of Technology', count: 11 },
          { name: 'Acad\u00e9mie Libanaise des Beaux-Arts', count: 8 },
          { name: 'Faculty of Medicine and Medical Sciences', count: 6 },
          { name: 'Saint John of Damascus Institute of Theology', count: 2 }
        ]
      },
      {
        text: "Academic Rank",
        type: "bar",
        summaryType: "nominal_top3",
        data: [
          { name: 'Assistant Professor', count: 41 },
          { name: 'Associate Professor', count: 34 },
          { name: 'Professor', count: 30 },
          { name: 'Lecturer', count: 15 },
          { name: 'Senior Lecturer', count: 12 },
          { name: 'Instructor', count: 9 },
          { name: 'Post-doc Fellow', count: 2 }
        ]
      },
      {
        text: "Year of Employment",
        type: "bar",
        summaryType: "nominal_top3",
        data: [
          { name: '2011-2015', count: 35 },
          { name: '2021+', count: 38 },
          { name: '<2000', count: 21 },
          { name: '2000-2005', count: 19 },
          { name: '2006-2010', count: 17 },
          { name: '2016-2020', count: 14 }
        ]
      },
      {
        text: "Campus",
        type: "pie",
        summaryType: "nominal_all",
        data: [
          { name: 'Al Kurah', count: 119 },
          { name: 'Dekweneh', count: 17 },
          { name: 'Souk El Ghareb', count: 10 },
          { name: 'Akkar', count: 4 }
        ]
      },
      {
        text: "Number of Children",
        type: "bar",
        summaryType: "nominal_all",
        data: [
          { name: 'None', count: 6 },
          { name: '1 Child', count: 25 },
          { name: '2 Children', count: 53 },
          { name: '3 Children', count: 24 },
          { name: '4 Children', count: 5 },
          { name: '6+ Children', count: 1 }
        ]
      }
    ]
  },
  {
    id: 'workload',
    label: 'Workload & Hours',
    icon: Clock,
    description: 'Assessment of working hours, teaching loads, and overall burden.',
    questions: [
      {
        text: "How would you rate your current workload?",
        type: "bar",
        summaryType: "workload_rating",
        data: [
          { name: 'Just right', count: 67 },
          { name: 'Too heavy', count: 55 },
          { name: 'Much too heavy', count: 21 },
          { name: 'Too light', count: 3 },
          { name: 'Much too light', count: 1 }
        ]
      },
      {
        text: "About how many hours do you work in a typical week?",
        type: "bar",
        summaryType: "workload_hours",
        data: [
          { name: '10-20 hours', count: 12 },
          { name: '25-35 hours', count: 59 },
          { name: '40-50 hours', count: 76 }
        ]
      },
      {
        text: "How satisfied are you with the distribution of the teaching workload in your department?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 15 },
          { name: 'Very satisfied', count: 59 },
          { name: 'Somewhat satisfied', count: 42 },
          { name: 'Little satisfied', count: 18 },
          { name: 'Not at all satisfied', count: 10 }
        ]
      },
      {
        text: "How satisfied are you with your teaching schedule?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 20 },
          { name: 'Very satisfied', count: 71 },
          { name: 'Somewhat satisfied', count: 39 },
          { name: 'Little satisfied', count: 10 },
          { name: 'Not at all satisfied', count: 6 }
        ]
      },
      {
        text: "Are you satisfied with the ratios allocated by your Faculty to teaching, research and university service?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 15 },
          { name: 'Somewhat satisfied', count: 39 },
          { name: 'Neither satisfied nor dissatisfied', count: 32 },
          { name: 'Somewhat dissatisfied', count: 34 },
          { name: 'Very dissatisfied', count: 22 }
        ]
      },
      {
        text: "Do you think the time allocated in your workload to conduct research is sufficient?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 37 },
          { name: 'No', count: 89 }
        ]
      },
      {
        text: "When you are at work, how often do you work other than your primary duty?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 14 },
          { name: 'Very often', count: 41 },
          { name: 'Sometimes', count: 49 },
          { name: 'Rarely', count: 26 },
          { name: 'Never', count: 12 }
        ]
      },
      {
        text: "When you are at work, how often do you do work that is not formally recognized by your department?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 14 },
          { name: 'Very often', count: 26 },
          { name: 'Sometimes', count: 37 },
          { name: 'Rarely', count: 41 },
          { name: 'Never', count: 23 }
        ]
      }
    ]
  },
  {
    id: 'teaching',
    label: 'Students & Teaching',
    icon: GraduationCap,
    description: 'Satisfaction with student quality and class sizes.',
    questions: [
      {
        text: "How satisfied are you with the qualifications of the students admitted to your departmental undergraduate programs?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 2 },
          { name: 'Very satisfied', count: 32 },
          { name: 'Somewhat satisfied', count: 76 },
          { name: 'Little satisfied', count: 32 },
          { name: 'Not at all satisfied', count: 4 }
        ]
      },
      {
        text: "How satisfied are you with the qualifications of the students admitted to your departmental graduate programs?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 8 },
          { name: 'Very satisfied', count: 45 },
          { name: 'Somewhat satisfied', count: 68 },
          { name: 'Little satisfied', count: 9 },
          { name: 'Not at all satisfied', count: 2 }
        ]
      },
      {
        text: "How satisfied are you with the number of students in the classes you teach?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 10 },
          { name: 'Very satisfied', count: 59 },
          { name: 'Somewhat satisfied', count: 53 },
          { name: 'Little satisfied', count: 21 },
          { name: 'Not at all satisfied', count: 3 }
        ]
      },
      {
        text: "How satisfied are you with the number of students admitted to your departmental graduate programs?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 9 },
          { name: 'Very satisfied', count: 29 },
          { name: 'Somewhat satisfied', count: 50 },
          { name: 'Little satisfied', count: 26 },
          { name: 'Not at all satisfied', count: 23 }
        ]
      }
    ]
  },
  {
    id: 'governance',
    label: 'Governance & Voice',
    icon: Landmark,
    description: 'Participation in administration and ability to express opinions.',
    questions: [
      {
        text: "Have you served in any administrative position at UOB?",
        type: "bar",
        summaryType: "nominal_all",
        data: [
          { name: 'Never', count: 68 },
          { name: 'Yes. Serving currently.', count: 45 },
          { name: 'Yes. Served within the past 5 academic years.', count: 17 },
          { name: 'Yes. Served prior to the past 5 academic years.', count: 16 }
        ]
      },
      {
        text: "Did you receive credit load release for your administrative service?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 59 },
          { name: 'No', count: 21 }
        ]
      },
      {
        text: "How often do you express your voice in decisions that impact your department or Faculty?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 23 },
          { name: 'Very often', count: 76 },
          { name: 'Sometimes', count: 32 },
          { name: 'Rarely', count: 10 },
          { name: 'Never', count: 3 }
        ]
      },
      {
        text: "How often do you think you could share your views in meetings?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 32 },
          { name: 'Very satisfied', count: 66 },
          { name: 'Somewhat satisfied', count: 31 },
          { name: 'Little satisfied', count: 7 },
          { name: 'Not at all satisfied', count: 8 }
        ]
      },
      {
        text: "How satisfied are you in your interactions with your Faculty\u2019s administration?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 45 },
          { name: 'Very satisfied', count: 78 },
          { name: 'Somewhat satisfied', count: 18 },
          { name: 'Little satisfied', count: 3 },
          { name: 'Not at all satisfied', count: 0 }
        ]
      },
      {
        text: "How satisfied are you in your interactions with your colleagues?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 51 },
          { name: 'Very satisfied', count: 83 },
          { name: 'Somewhat satisfied', count: 8 },
          { name: 'Little satisfied', count: 2 },
          { name: 'Not at all satisfied', count: 0 }
        ]
      },
      {
        text: "How often do you express your voice in how departmental resources are distributed?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 8 },
          { name: 'Very often', count: 44 },
          { name: 'Sometimes', count: 45 },
          { name: 'Rarely', count: 31 },
          { name: 'Never', count: 11 }
        ]
      },
      {
        text: "How often do you feel that your Faculty or Department consistently informs you of important and new institutional policies?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 12 },
          { name: 'Very often', count: 44 },
          { name: 'Sometimes', count: 42 },
          { name: 'Rarely', count: 26 },
          { name: 'Never', count: 6 }
        ]
      },
      {
        text: "How often do you feel that the University Senate conveys your voice to the university administration?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 5 },
          { name: 'Very often', count: 38 },
          { name: 'Sometimes', count: 40 },
          { name: 'Rarely', count: 32 },
          { name: 'Never', count: 10 }
        ]
      }
    ]
  },
  {
    id: 'resources',
    label: 'Resources & Facilities',
    icon: Building2,
    description: 'Satisfaction with physical and technological infrastructure.',
    questions: [
      {
        text: "When you are at work, how often do you feel you have the academic resources you need to do your job well?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 14 },
          { name: 'Very often', count: 73 },
          { name: 'Sometimes', count: 42 },
          { name: 'Rarely', count: 11 },
          { name: 'Never', count: 3 }
        ]
      },
      {
        text: "How satisfied are you with the teaching facilities at your Faculty?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 12 },
          { name: 'Very satisfied', count: 55 },
          { name: 'Somewhat satisfied', count: 47 },
          { name: 'Little satisfied', count: 20 },
          { name: 'Not at all satisfied', count: 8 }
        ]
      },
      {
        text: "How satisfied are you with UOB\u2019s provision of educational technology?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 10 },
          { name: 'Very satisfied', count: 43 },
          { name: 'Somewhat satisfied', count: 58 },
          { name: 'Little satisfied', count: 18 },
          { name: 'Not at all satisfied', count: 9 }
        ]
      },
      {
        text: "How satisfied are you with the student laboratory space?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 9 },
          { name: 'Very satisfied', count: 51 },
          { name: 'Somewhat satisfied', count: 57 },
          { name: 'Little satisfied', count: 12 },
          { name: 'Not at all satisfied', count: 8 }
        ]
      },
      {
        text: "How satisfied are you with the student laboratory equipment and technology?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 9 },
          { name: 'Very satisfied', count: 41 },
          { name: 'Somewhat satisfied', count: 52 },
          { name: 'Little satisfied', count: 24 },
          { name: 'Not at all satisfied', count: 8 }
        ]
      },
      {
        text: "How satisfied are you with the Course Evaluation Survey (CES) as a course evaluation tool?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 6 },
          { name: 'Very satisfied', count: 43 },
          { name: 'Somewhat satisfied', count: 43 },
          { name: 'Little satisfied', count: 32 },
          { name: 'Not at all satisfied', count: 15 }
        ]
      },
      {
        text: "How satisfied are you with your office space?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 34 },
          { name: 'Very satisfied', count: 67 },
          { name: 'Somewhat satisfied', count: 23 },
          { name: 'Little satisfied', count: 12 },
          { name: 'Not at all satisfied', count: 6 }
        ]
      },
      {
        text: "How satisfied are you with the services and resources provided by the library?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 30 },
          { name: 'Very satisfied', count: 79 },
          { name: 'Somewhat satisfied', count: 24 },
          { name: 'Little satisfied', count: 5 },
          { name: 'Not at all satisfied', count: 1 }
        ]
      },
      {
        text: "If you reside on the main campus, how satisfied are you with the housing accommodations?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 2 },
          { name: 'Somewhat satisfied', count: 5 },
          { name: 'Neither satisfied nor dissatisfied', count: 27 },
          { name: 'Very dissatisfied', count: 2 }
        ]
      },
      {
        text: "How satisfied are you with the availability of on campus parking?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 83 },
          { name: 'Somewhat satisfied', count: 35 },
          { name: 'Neither satisfied nor dissatisfied', count: 7 },
          { name: 'Somewhat dissatisfied', count: 7 },
          { name: 'Very dissatisfied', count: 4 }
        ]
      },
      {
        text: "Satisfaction with Admissions Office",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 74 },
          { name: 'To some extent', count: 47 },
          { name: 'Not at all', count: 9 }
        ]
      },
      {
        text: "Satisfaction with Registrar",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 85 },
          { name: 'To some extent', count: 38 },
          { name: 'Not at all', count: 7 }
        ]
      },
      {
        text: "Satisfaction with IT",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 67 },
          { name: 'To some extent', count: 60 },
          { name: 'Not at all', count: 5 }
        ]
      },
      {
        text: "Satisfaction with Procurement",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 40 },
          { name: 'To some extent', count: 70 },
          { name: 'Not at all', count: 13 }
        ]
      },
      {
        text: "Satisfaction with Media & Communications",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 36 },
          { name: 'To some extent', count: 67 },
          { name: 'Not at all', count: 23 }
        ]
      },
      {
        text: "Satisfaction with HR",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 58 },
          { name: 'To some extent', count: 49 },
          { name: 'Not at all', count: 29 }
        ]
      },
      {
        text: "Satisfaction with Comptroller Office",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 41 },
          { name: 'To some extent', count: 58 },
          { name: 'Not at all', count: 34 }
        ]
      },
      {
        text: "Satisfaction with Health Center Infirmary",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 78 },
          { name: 'To some extent', count: 40 },
          { name: 'Not at all', count: 5 }
        ]
      },
      {
        text: "Satisfaction with Office of Student Affairs",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 73 },
          { name: 'To some extent', count: 46 },
          { name: 'Not at all', count: 8 }
        ]
      },
      {
        text: "Satisfaction with Fitness Center",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 50 },
          { name: 'To some extent', count: 47 },
          { name: 'Not at all', count: 15 }
        ]
      }
    ]
  },
  {
    id: 'growth',
    label: 'Growth & Research',
    icon: LineChart,
    description: 'Opportunities for professional development and research support.',
    questions: [
      {
        text: "How often do you feel you have the opportunities to learn and grow as a professional?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 12 },
          { name: 'Very often', count: 36 },
          { name: 'Sometimes', count: 54 },
          { name: 'Rarely', count: 30 },
          { name: 'Never', count: 6 }
        ]
      },
      {
        text: "How often do you feel that UOB provides you with professional development opportunities?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 6 },
          { name: 'Very often', count: 27 },
          { name: 'Sometimes', count: 59 },
          { name: 'Rarely', count: 30 },
          { name: 'Never', count: 15 }
        ]
      },
      {
        text: "How often do you feel that your Faculty or Department clearly communicates the expectations for your career advancement?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 6 },
          { name: 'Very often', count: 26 },
          { name: 'Sometimes', count: 50 },
          { name: 'Rarely', count: 31 },
          { name: 'Never', count: 20 }
        ]
      },
      {
        text: "Do you feel supported by your Faculty administration in your career growth?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 92 },
          { name: 'No', count: 40 }
        ]
      },
      {
        text: "How satisfied are you with the university policy and procedures for promotion?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 16 },
          { name: 'Somewhat satisfied', count: 35 },
          { name: 'Neither satisfied nor dissatisfied', count: 32 },
          { name: 'Somewhat dissatisfied', count: 30 },
          { name: 'Very dissatisfied', count: 20 }
        ]
      },
      {
        text: "Do you feel that the submission procedure for internal Research Grant Applications (RGAs) is clear?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 81 },
          { name: 'No', count: 39 }
        ]
      },
      {
        text: "Do you feel that the process of obtaining UOB research funding is transparent?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 86 },
          { name: 'No', count: 31 }
        ]
      },
      {
        text: "Do you think that UOB allocation of funds for research is sufficient?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 45 },
          { name: 'No', count: 72 }
        ]
      },
      {
        text: "Do you think the time allocated in your workload to conduct research is sufficient?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 37 },
          { name: 'No', count: 89 }
        ]
      },
      {
        text: "Do you think the physical resources/facilities to conduct research are adequate at UOB?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 58 },
          { name: 'No', count: 63 }
        ]
      }
    ]
  },
  {
    id: 'equity',
    label: 'Equity & Belonging',
    icon: HeartHandshake,
    description: 'Feelings of fairness, security, and departmental climate.',
    questions: [
      {
        text: "How satisfied are you with the climate in your department?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 20 },
          { name: 'Very satisfied', count: 79 },
          { name: 'Somewhat satisfied', count: 34 },
          { name: 'Little satisfied', count: 8 },
          { name: 'Not at all satisfied', count: 4 }
        ]
      },
      {
        text: "How overall are you satisfied with your work?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 55 },
          { name: 'Somewhat satisfied', count: 68 },
          { name: 'Neither satisfied nor dissatisfied', count: 10 },
          { name: 'Somewhat dissatisfied', count: 8 },
          { name: 'Very dissatisfied', count: 4 }
        ]
      },
      {
        text: "When you are at work, how often do you feel your work is meaningful?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 51 },
          { name: 'Very often', count: 83 },
          { name: 'Sometimes', count: 8 },
          { name: 'Rarely', count: 0 },
          { name: 'Never', count: 2 }
        ]
      },
      {
        text: "When you are at work, how often do you receive constructive feedback on your work performance?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 13 },
          { name: 'Very often', count: 42 },
          { name: 'Sometimes', count: 58 },
          { name: 'Rarely', count: 23 },
          { name: 'Never', count: 9 }
        ]
      },
      {
        text: "Do you feel valued and appreciated by your Faculty for your work?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 101 },
          { name: 'No', count: 29 }
        ]
      },
      {
        text: "Were you involved in the formulation of your Faculty Strategic Plan?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 69 },
          { name: 'No', count: 57 }
        ]
      },
      {
        text: "Are you a member of any Faculty Committee?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 86 },
          { name: 'No', count: 44 }
        ]
      },
      {
        text: "Are you aware of the accreditation initiatives at your Faculty?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 87 },
          { name: 'No', count: 20 }
        ]
      },
      {
        text: "Do you feel that your Faculty or Department does well in mentoring new faculty members?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 85 },
          { name: 'No', count: 39 }
        ]
      },
      {
        text: "Are you aware of your Faculty bylaws?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 97 },
          { name: 'No', count: 30 }
        ]
      },
      {
        text: "Do you feel treated fairly by your Faculty?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 94 },
          { name: 'No', count: 35 }
        ]
      },
      {
        text: "Do you feel treated with equity by your Department or Faculty?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 93 },
          { name: 'No', count: 33 }
        ]
      },
      {
        text: "Do you feel that you can express any complaint or grievance freely to your Faculty?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 98 },
          { name: 'No', count: 29 }
        ]
      },
      {
        text: "Are you satisfied with your social relationships with other faculty members?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 124 },
          { name: 'No', count: 7 }
        ]
      },
      {
        text: "Do you feel your UOB employment is secure?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 65 },
          { name: 'No', count: 57 }
        ]
      },
      {
        text: "How often do you feel that your Faculty or Department consistently informs you of important and new institutional policies?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 12 },
          { name: 'Very often', count: 44 },
          { name: 'Sometimes', count: 42 },
          { name: 'Rarely', count: 26 },
          { name: 'Never', count: 6 }
        ]
      },
      {
        text: "How often do you feel that the University Senate conveys your voice to the university administration?",
        type: "frequency",
        data: [
          { name: 'Extremely often', count: 5 },
          { name: 'Very often', count: 38 },
          { name: 'Sometimes', count: 40 },
          { name: 'Rarely', count: 32 },
          { name: 'Never', count: 10 }
        ]
      },
      {
        text: "Are you aware of UOB policies on research ethics, equity, diversity & inclusion, sexual harassment, ethical use of informational technology, and use of social media that are posted on the website?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 87 },
          { name: 'No', count: 36 }
        ]
      },
      {
        text: "If you answer by yes to question 59, do you feel that these policies are satisfactory?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 77 },
          { name: 'No', count: 9 }
        ]
      }
    ]
  },
  {
    id: 'compensation',
    label: 'Compensation & Retention',
    icon: Wallet,
    description: 'Satisfaction with pay, benefits, and likelihood of leaving.',
    questions: [
      {
        text: "How satisfied are you with your current academic rank?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 14 },
          { name: 'Very satisfied', count: 39 },
          { name: 'Somewhat satisfied', count: 39 },
          { name: 'Little satisfied', count: 28 },
          { name: 'Not at all satisfied', count: 13 }
        ]
      },
      {
        text: "How satisfied are you with the duration of your contract?",
        type: "satisfaction",
        data: [
          { name: 'Extremely satisfied', count: 3 },
          { name: 'Very satisfied', count: 30 },
          { name: 'Somewhat satisfied', count: 46 },
          { name: 'Little satisfied', count: 30 },
          { name: 'Not at all satisfied', count: 23 }
        ]
      },
      {
        text: "In general, how satisfied are you with your pay?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 12 },
          { name: 'Somewhat satisfied', count: 34 },
          { name: 'Little satisfied', count: 39 },
          { name: 'Not at all satisfied', count: 49 }
        ]
      },
      {
        text: "In general, how satisfied are you with your benefits as an employee?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 17 },
          { name: 'Somewhat satisfied', count: 31 },
          { name: 'Little satisfied', count: 42 },
          { name: 'Not at all satisfied', count: 43 }
        ]
      },
      {
        text: "How satisfied are you with the benefits for health insurance?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 33 },
          { name: 'Somewhat satisfied', count: 37 },
          { name: 'Somewhat dissatisfied', count: 19 },
          { name: 'Very dissatisfied', count: 15 }
        ]
      },
      {
        text: "How satisfied are you with the benefits for children schooling?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 6 },
          { name: 'Somewhat satisfied', count: 16 },
          { name: 'Somewhat dissatisfied', count: 16 },
          { name: 'Very dissatisfied', count: 47 }
        ]
      },
      {
        text: "Do you use UOB\u2019s transportation accommodations?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 19 },
          { name: 'No', count: 111 }
        ]
      },
      {
        text: "If you reply by yes to question 67, how satisfied are you with UOB\u2019s transportation system?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 2 },
          { name: 'Somewhat satisfied', count: 8 },
          { name: 'Neither satisfied nor dissatisfied', count: 3 },
          { name: 'Somewhat dissatisfied', count: 4 },
          { name: 'Very dissatisfied', count: 1 }
        ]
      },
      {
        text: "How likely are you to leave UOB in the next 12 months?",
        type: "likelihood",
        data: [
          { name: 'Very likely', count: 5 },
          { name: 'Somewhat likely', count: 8 },
          { name: 'Neither', count: 14 },
          { name: 'Somewhat unlikely', count: 32 },
          { name: 'Very unlikely', count: 70 }
        ]
      },
      {
        text: "Considered leaving due to: Salary increase",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 36 },
          { name: 'To some extent', count: 10 },
          { name: 'Not at all', count: 6 }
        ]
      },
      {
        text: "Considered leaving due to: Career advancement",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 25 },
          { name: 'To some extent', count: 15 },
          { name: 'Not at all', count: 10 }
        ]
      },
      {
        text: "Considered leaving due to: Seeking better benefits",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 27 },
          { name: 'To some extent', count: 11 },
          { name: 'Not at all', count: 11 }
        ]
      },
      {
        text: "Considered leaving due to: Non-academic job opportunity",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 2 },
          { name: 'To some extent', count: 11 },
          { name: 'Not at all', count: 35 }
        ]
      },
      {
        text: "Considered leaving due to: Family employment improvement",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 14 },
          { name: 'To some extent', count: 15 },
          { name: 'Not at all', count: 19 }
        ]
      },
      {
        text: "Considered leaving due to: Better work environment",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 17 },
          { name: 'To some extent', count: 9 },
          { name: 'Not at all', count: 24 }
        ]
      },
      {
        text: "Considered leaving due to: Planning for retirement",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 13 },
          { name: 'To some extent', count: 12 },
          { name: 'Not at all', count: 24 }
        ]
      },
      {
        text: "Considered leaving due to: Health issues",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 2 },
          { name: 'To some extent', count: 7 },
          { name: 'Not at all', count: 39 }
        ]
      },
      {
        text: "Considered leaving due to: Family relocation",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 4 },
          { name: 'To some extent', count: 8 },
          { name: 'Not at all', count: 38 }
        ]
      },
      {
        text: "Considered leaving due to: Travel abroad",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 4 },
          { name: 'To some extent', count: 8 },
          { name: 'Not at all', count: 37 }
        ]
      },
      {
        text: "Considered leaving due to: Better reputation institution",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 16 },
          { name: 'To some extent', count: 14 },
          { name: 'Not at all', count: 19 }
        ]
      },
      {
        text: "Would stay if: Salary Increase",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 97 },
          { name: 'To some extent', count: 9 },
          { name: 'Not at all', count: 1 }
        ]
      },
      {
        text: "Would stay if: Salary pay in USD",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 93 },
          { name: 'To some extent', count: 8 },
          { name: 'Not at all', count: 5 }
        ]
      },
      {
        text: "Would stay if: Increase in children schooling fees",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 73 },
          { name: 'To some extent', count: 10 },
          { name: 'Not at all', count: 16 }
        ]
      },
      {
        text: "Would stay if: Free medical insurance",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 80 },
          { name: 'To some extent', count: 15 },
          { name: 'Not at all', count: 8 }
        ]
      },
      {
        text: "Would stay if: Better academic governance",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 79 },
          { name: 'To some extent', count: 16 },
          { name: 'Not at all', count: 7 }
        ]
      },
      {
        text: "Would stay if: Timely university communications",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 73 },
          { name: 'To some extent', count: 21 },
          { name: 'Not at all', count: 8 }
        ]
      },
      {
        text: "Would stay if: Opportunities for career advancement",
        type: "extent",
        data: [
          { name: 'To a great extent', count: 81 },
          { name: 'To some extent', count: 18 },
          { name: 'Not at all', count: 6 }
        ]
      },
      {
        text: "How satisfied are you at UOB?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 31 },
          { name: 'Somewhat satisfied', count: 53 },
          { name: 'Neither satisfied nor dissatisfied', count: 19 },
          { name: 'Somewhat dissatisfied', count: 23 },
          { name: 'Very dissatisfied', count: 6 }
        ]
      },
      {
        text: "Would you encourage current young faculty recruits to renew their contracts at UOB?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 103 },
          { name: 'No', count: 17 }
        ]
      },
      {
        text: "Would you enroll your children as students at UOB?",
        type: "yesno",
        data: [
          { name: 'Yes', count: 107 },
          { name: 'No', count: 14 }
        ]
      },
      {
        text: "How satisfied are you with the academic qualifications of young faculty recruits at UOB?",
        type: "satisfaction",
        data: [
          { name: 'Very satisfied', count: 21 },
          { name: 'Somewhat satisfied', count: 36 },
          { name: 'Neither satisfied nor dissatisfied', count: 38 },
          { name: 'Somewhat dissatisfied', count: 23 },
          { name: 'Very dissatisfied', count: 6 }
        ]
      }
    ]
  },
  {
    id: 'comments',
    label: 'Qualitative Feedback',
    icon: MessageSquare,
    description: 'AI-driven sentiment analysis and qualitative open-ended responses.',
    questions: [] // handled via special view
  }
];
