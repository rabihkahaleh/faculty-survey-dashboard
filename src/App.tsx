import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LabelList
} from 'recharts';
import {
  Users, Building2, Clock,
  GraduationCap, Landmark, HeartHandshake,
  LineChart, Wallet, LayoutDashboard, ChevronRight, Menu,
  MessageSquare, Quote, ThumbsUp, ThumbsDown, Minus
} from 'lucide-react';

// --- Universal Chart Data Generator ---

const SCALES = {
  satisfaction: [
    { short: 'ES', full: 'Extremely satisfied' },
    { short: 'VS', full: 'Very satisfied' },
    { short: 'SS', full: 'Somewhat satisfied' },
    { short: 'LS', full: 'Little satisfied' },
    { short: 'NS', full: 'Not at all satisfied' }
  ],
  frequency: [
    { short: 'EO', full: 'Extremely often' },
    { short: 'VO', full: 'Very often' },
    { short: 'S', full: 'Sometimes' },
    { short: 'R', full: 'Rarely' },
    { short: 'N', full: 'Never' }
  ],
  extent: [
    { short: 'GE', full: 'To a great extent' },
    { short: 'SE', full: 'To some extent' },
    { short: 'NA', full: 'Not at all' }
  ],
  likelihood: [
    { short: 'VL', full: 'Very likely' },
    { short: 'SL', full: 'Somewhat likely' },
    { short: 'N', full: 'Neither' },
    { short: 'SU', full: 'Somewhat unlikely' },
    { short: 'VU', full: 'Very unlikely' }
  ],
  yesno: [
    { short: 'Yes', full: 'Yes' },
    { short: 'No', full: 'No' }
  ]
};

const COLORS = {
  positive: ['#10b981', '#34d399', '#94a3b8', '#f87171', '#ef4444'], // Green to Red
  negative: ['#ef4444', '#f87171', '#94a3b8', '#34d399', '#10b981'], // Red to Green (for negative questions like "Leave")
  neutral: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#e0e7ff'], // Blues
  extent: ['#8b5cf6', '#a78bfa', '#cbd5e1'], // Purples
  yesno: ['#3b82f6', '#f43f5e'],
  sentiment: {
    positive: '#10b981',
    neutral: '#f59e0b',
    negative: '#ef4444'
  }
};

// --- Faculty Breakdown Helper ---
const FACULTY_WEIGHTS = {
  'FAS': { weight: 0.35, full: 'Arts & Sciences' },
  'FOE': { weight: 0.19, full: 'Engineering' },
  'FOB': { weight: 0.11, full: 'Business & Mgt' },
  'FHS': { weight: 0.11, full: 'Health Sciences' },
  'FOT': { weight: 0.06, full: 'Technology' },
  'OTH': { weight: 0.18, full: 'Other' }
};

const generateFacultyBreakdown = (totalCount: number) => {
  let remaining = totalCount;
  const faculties: Record<string, { count: number; full: string }> = {};
  const keys = Object.keys(FACULTY_WEIGHTS) as Array<keyof typeof FACULTY_WEIGHTS>;

  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      faculties[key] = { count: Math.max(0, remaining), full: FACULTY_WEIGHTS[key].full };
    } else {
      const amount = Math.min(remaining, Math.round(totalCount * FACULTY_WEIGHTS[key].weight));
      faculties[key] = { count: amount, full: FACULTY_WEIGHTS[key].full };
      remaining -= amount;
    }
  });
  return faculties;
};

const generateData = (scaleType: string, sentiment = 'neutral') => {
  const scaleDefinition = SCALES[scaleType as keyof typeof SCALES] || SCALES.satisfaction;
  let weights;

  if (sentiment === 'positive') weights = [40, 50, 40, 15, 5];
  else if (sentiment === 'negative') weights = [5, 15, 30, 40, 60];
  else if (sentiment === 'mixed') weights = [20, 30, 50, 30, 20];
  else if (sentiment === 'yes_heavy') weights = [120, 30];
  else if (sentiment === 'no_heavy') weights = [30, 120];
  else weights = [30, 30, 30, 30, 30];

  weights = weights.slice(0, scaleDefinition.length);

  return scaleDefinition.map((labelObj: any, idx: number) => ({
    name: labelObj.full,
    shortName: labelObj.short,
    count: weights[idx] + Math.floor(Math.random() * 15) - 7
  }));
};

// --- Qualitative Data (Sentiment Analysis) ---
const sentimentData = {
  distribution: [
    { name: 'Negative', count: 85, color: '#ef4444' },
    { name: 'Neutral/Mixed', count: 40, color: '#f59e0b' },
    { name: 'Positive', count: 25, color: '#10b981' }
  ],
  topics: [
    { name: 'Salary & Pay', count: 92, sentiment: 'negative' },
    { name: 'Workload', count: 65, sentiment: 'negative' },
    { name: 'Colleagues', count: 45, sentiment: 'positive' },
    { name: 'Students', count: 38, sentiment: 'mixed' },
    { name: 'Administration', count: 35, sentiment: 'negative' },
    { name: 'Facilities', count: 20, sentiment: 'neutral' }
  ],
  comments: [
    { id: 1, text: "The university must be a tornado of thoughts, avant-garde people sharing their thoughts... It is a long way. I hope we are on it.", sentiment: 'mixed', faculty: 'Arts & Sciences' },
    { id: 2, text: "Unfortunately, at UOB as in Lebanon... no clear authority, no clear responsibility... so no clear decision making.", sentiment: 'negative', faculty: 'Engineering' },
    { id: 3, text: "The salary is simply not enough to survive. I am considering leaving if this does not change soon.", sentiment: 'negative', faculty: 'Business' },
    { id: 4, text: "I love my department and the spirit of my colleagues. We support each other.", sentiment: 'positive', faculty: 'Health Sciences' },
    { id: 5, text: "Workload is too heavy. I have no time for research because of the teaching load.", sentiment: 'negative', faculty: 'Technology' },
    { id: 6, text: "Great students, really motivated. They are the best part of the job.", sentiment: 'positive', faculty: 'Arts & Sciences' },
    { id: 7, text: "Parking is a nightmare every morning.", sentiment: 'negative', faculty: 'Engineering' },
    { id: 8, text: "The health insurance benefits are decent compared to other places.", sentiment: 'positive', faculty: 'Business' },
    { id: 9, text: "We need more transparency in how research funds are allocated.", sentiment: 'mixed', faculty: 'Health Sciences' },
    { id: 10, text: "The IT support is very slow to respond to tickets.", sentiment: 'negative', faculty: 'Technology' }
  ]
};

// --- Complete 100+ Question Database ---

const surveyCategories = [
  {
    id: 'demographics',
    label: 'Demographics Profile',
    icon: Users,
    description: 'Faculty background, tenure, and personal demographics.',
    questions: [
      { text: "Gender", type: "pie", data: [{ name: 'Male', count: 77 }, { name: 'Female', count: 73 }] },
      { text: "Marital Status", type: "pie", data: [{ name: 'Married', count: 126 }, { name: 'Single', count: 20 }, { name: 'Divorced', count: 4 }] },
      { text: "Faculty Affiliation", type: "bar", data: [{ name: 'Arts & Sciences', count: 52 }, { name: 'Engineering', count: 28 }, { name: 'Business & Mgt', count: 16 }, { name: 'Health Sciences', count: 16 }, { name: 'Technology', count: 10 }, { name: 'Other', count: 28 }] },
      { text: "Academic Rank", type: "bar", data: [{ name: 'Professor', count: 25 }, { name: 'Associate Prof', count: 35 }, { name: 'Assistant Prof', count: 45 }, { name: 'Lecturer', count: 30 }, { name: 'Instructor', count: 15 }] },
      { text: "Year of Employment", type: "bar", data: [{ name: '< 2000', count: 18 }, { name: '2000-2005', count: 27 }, { name: '2006-2010', count: 13 }, { name: '2011-2015', count: 35 }, { name: '2016-2020', count: 22 }, { name: '2021+', count: 35 }] },
      { text: "Campus", type: "pie", data: [{ name: 'Main Campus', count: 110 }, { name: 'Dekweneh', count: 25 }, { name: 'Akkar/Other', count: 15 }] },
      { text: "Number of Children", type: "bar", data: [{ name: 'None', count: 35 }, { name: '1 Child', count: 40 }, { name: '2 Children', count: 50 }, { name: '3+ Children', count: 25 }] },
    ]
  },
  {
    id: 'workload',
    label: 'Workload & Hours',
    icon: Clock,
    description: 'Assessment of working hours, teaching loads, and overall burden.',
    questions: [
      { text: "How would you rate your current workload?", type: "bar", data: [{ name: 'Just right', count: 68 }, { name: 'Too heavy', count: 52 }, { name: 'Much too heavy', count: 24 }, { name: 'Too light', count: 6 }] },
      { text: "About how many hours do you work in a typical week?", type: "bar", data: [{ name: '10-20 hrs', count: 12 }, { name: '25-35 hrs', count: 58 }, { name: '40-50 hrs', count: 80 }] },
      { text: "How satisfied are you with the distribution of the teaching workload in your department?", type: "satisfaction", sentiment: "mixed" },
      { text: "How satisfied are you with your teaching schedule?", type: "satisfaction", sentiment: "positive" },
      { text: "Are you satisfied with the ratios allocated by your Faculty to teaching, research and university service?", type: "satisfaction", sentiment: "negative" },
      { text: "Do you think the time allocated in your workload to conduct research is sufficient?", type: "yesno", sentiment: "no_heavy" },
      { text: "When you are at work, how often do you work other than your primary duty?", type: "frequency", sentiment: "positive" },
      { text: "When you are at work, how often do you do work that is not formally recognized by your department?", type: "frequency", sentiment: "positive" }
    ]
  },
  {
    id: 'teaching',
    label: 'Students & Teaching',
    icon: GraduationCap,
    description: 'Satisfaction with student quality and class sizes.',
    questions: [
      { text: "How satisfied are you with the qualifications of the students admitted to your departmental undergraduate programs?", type: "satisfaction", sentiment: "mixed" },
      { text: "How satisfied are you with the qualifications of the students admitted to your departmental graduate programs?", type: "satisfaction", sentiment: "positive" },
      { text: "How satisfied are you with the number of students in the classes you teach?", type: "satisfaction", sentiment: "positive" },
      { text: "How satisfied are you with the number of students admitted to your departmental graduate programs?", type: "satisfaction", sentiment: "mixed" }
    ]
  },
  {
    id: 'governance',
    label: 'Governance & Voice',
    icon: Landmark,
    description: 'Participation in administration and ability to express opinions.',
    questions: [
      { text: "Have you served in any administrative position at UOB?", type: "yesno", sentiment: "yes_heavy" },
      { text: "Did you receive credit load release for your administrative service?", type: "yesno", sentiment: "mixed" },
      { text: "How often do you express your voice in decisions that impact your department or Faculty?", type: "frequency", sentiment: "mixed" },
      { text: "How often do you think you could share your views in meetings?", type: "frequency", sentiment: "positive" },
      { text: "How satisfied are you in your interactions with your Faculty’s administration?", type: "satisfaction", sentiment: "mixed" },
      { text: "How satisfied are you in your interactions with your colleagues?", type: "satisfaction", sentiment: "positive" },
      { text: "How often do you express your voice in how departmental resources are distributed?", type: "frequency", sentiment: "negative" },
      { text: "How often do you feel that your Faculty or Department consistently informs you of important and new institutional policies?", type: "frequency", sentiment: "negative" },
      { text: "How often do you feel that the University Senate conveys your voice to the university administration?", type: "frequency", sentiment: "negative" }
    ]
  },
  {
    id: 'resources',
    label: 'Resources & Facilities',
    icon: Building2,
    description: 'Satisfaction with physical and technological infrastructure.',
    questions: [
      { text: "When you are at work, how often do you feel you have the academic resources you need to do your job well?", type: "frequency", sentiment: "mixed" },
      { text: "How satisfied are you with the teaching facilities at your Faculty?", type: "satisfaction", sentiment: "positive" },
      { text: "How satisfied are you with UOB’s provision of educational technology?", type: "satisfaction", sentiment: "mixed" },
      { text: "How satisfied are you with the student laboratory space?", type: "satisfaction", sentiment: "mixed" },
      { text: "How satisfied are you with the student laboratory equipment and technology?", type: "satisfaction", sentiment: "negative" },
      { text: "How satisfied are you with the Course Evaluation Survey (CES) as a course evaluation tool?", type: "satisfaction", sentiment: "negative" },
      { text: "How satisfied are you with your office space?", type: "satisfaction", sentiment: "positive" },
      { text: "How satisfied are you with the services and resources provided by the library?", type: "satisfaction", sentiment: "positive" },
      { text: "How satisfied are you with the availability of on campus parking?", type: "satisfaction", sentiment: "mixed" },
      { text: "Satisfaction with Admissions Office", type: "extent", sentiment: "positive" },
      { text: "Satisfaction with Registrar", type: "extent", sentiment: "positive" },
      { text: "Satisfaction with IT", type: "extent", sentiment: "mixed" },
      { text: "Satisfaction with Procurement", type: "extent", sentiment: "negative" },
      { text: "Satisfaction with HR", type: "extent", sentiment: "negative" },
      { text: "Satisfaction with Comptroller Office", type: "extent", sentiment: "negative" }
    ]
  },
  {
    id: 'growth',
    label: 'Growth & Research',
    icon: LineChart,
    description: 'Opportunities for professional development and research support.',
    questions: [
      { text: "How often do you feel you have the opportunities to learn and grow as a professional?", type: "frequency", sentiment: "mixed" },
      { text: "How often do you feel that UOB provides you with professional development opportunities?", type: "frequency", sentiment: "negative" },
      { text: "How often do you feel that your Faculty clearly communicates the expectations for your career advancement?", type: "frequency", sentiment: "negative" },
      { text: "Do you feel supported by your Faculty administration in your career growth?", type: "yesno", sentiment: "mixed" },
      { text: "How satisfied are you with the university policy and procedures for promotion?", type: "satisfaction", sentiment: "negative" },
      { text: "Do you feel that the process of obtaining UOB research funding is transparent?", type: "yesno", sentiment: "no_heavy" },
      { text: "Do you think that UOB allocation of funds for research is sufficient?", type: "yesno", sentiment: "no_heavy" },
      { text: "Do you think the physical resources/facilities to conduct research are adequate at UOB?", type: "yesno", sentiment: "mixed" }
    ]
  },
  {
    id: 'equity',
    label: 'Equity & Belonging',
    icon: HeartHandshake,
    description: 'Feelings of fairness, security, and departmental climate.',
    questions: [
      { text: "How satisfied are you with the climate in your department?", type: "satisfaction", sentiment: "positive" },
      { text: "How overall are you satisfied with your work?", type: "satisfaction", sentiment: "positive" },
      { text: "When you are at work, how often do you feel your work is meaningful?", type: "frequency", sentiment: "positive" },
      { text: "When you are at work, how often do you receive constructive feedback on your work performance?", type: "frequency", sentiment: "negative" },
      { text: "Do you feel valued and appreciated by your Faculty for your work?", type: "yesno", sentiment: "mixed" },
      { text: "Do you feel treated fairly by your Faculty?", type: "yesno", sentiment: "mixed" },
      { text: "Do you feel that you can express any complaint or grievance freely to your Faculty?", type: "yesno", sentiment: "no_heavy" },
      { text: "Are you satisfied with your social relationships with other faculty members?", type: "yesno", sentiment: "yes_heavy" },
      { text: "Do you feel your UOB employment is secure?", type: "yesno", sentiment: "mixed" },
      { text: "Are you aware of UOB policies on research ethics, EDI, sexual harassment, etc.?", type: "yesno", sentiment: "yes_heavy" }
    ]
  },
  {
    id: 'compensation',
    label: 'Compensation & Retention',
    icon: Wallet,
    description: 'Satisfaction with pay, benefits, and likelihood of leaving.',
    questions: [
      { text: "How satisfied are you with your current academic rank?", type: "satisfaction", sentiment: "mixed" },
      { text: "In general, how satisfied are you with your pay?", type: "satisfaction", sentiment: "negative" },
      { text: "In general, how satisfied are you with your benefits as an employee?", type: "satisfaction", sentiment: "negative" },
      { text: "How satisfied are you with the benefits for health insurance?", type: "satisfaction", sentiment: "negative" },
      { text: "How satisfied are you with the benefits for children schooling?", type: "satisfaction", sentiment: "negative" },
      { text: "How likely are you to leave UOB in the next 12 months?", type: "likelihood", sentiment: "negative" },
      { text: "Considered leaving due to: Salary increase", type: "extent", sentiment: "positive" },
      { text: "Considered leaving due to: Better work environment", type: "extent", sentiment: "mixed" },
      { text: "Considered leaving due to: Career advancement", type: "extent", sentiment: "mixed" },
      { text: "Would stay if: Salary Increase", type: "extent", sentiment: "positive" },
      { text: "Would stay if: Salary pay in USD", type: "extent", sentiment: "positive" },
      { text: "Would stay if: Free medical insurance", type: "extent", sentiment: "positive" },
      { text: "Would stay if: Better academic governance", type: "extent", sentiment: "positive" },
      { text: "How satisfied are you at UOB?", type: "satisfaction", sentiment: "mixed" },
      { text: "Would you encourage current young faculty recruits to renew their contracts at UOB?", type: "yesno", sentiment: "mixed" }
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


// --- Custom Tooltip Component ---
const CustomTooltip = ({ active, payload, total }: { active?: boolean; payload?: any[]; total: number }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = payload[0].value;
    const percent = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
    const title = data.name;

    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-slate-200 shadow-xl rounded-xl text-sm z-50 min-w-[220px]">
        <p className="font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">
          {title}
        </p>
        <div className="flex justify-between items-center mb-4 bg-slate-50 p-2 rounded-lg">
          <span className="text-slate-600 font-medium">Total:</span>
          <span className="font-bold text-blue-600 text-base">{value} <span className="text-xs text-slate-400 font-normal">({percent}%)</span></span>
        </div>

        {data.faculties && (
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Breakdown by Faculty</p>
            <div className="space-y-1.5">
              {Object.entries(data.faculties).map(([facultyShort, facultyData]: [string, any]) => (
                <div key={facultyShort} className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 truncate max-w-[140px]" title={facultyData.full}>
                    <span className="font-bold text-slate-700 mr-1">{facultyShort}</span>
                    <span className="text-[10px] text-slate-400 hidden sm:inline-block">({facultyData.full})</span>
                  </span>
                  <span className="font-medium text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded min-w-[24px] text-center">{facultyData.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

// --- Visualizer Component for Individual Questions ---

const QuestionCard = ({ question, index }: { question: any; index: number }) => {
  const chartData = useMemo(() => {
    const baseData = question.data || generateData(question.type, question.sentiment);
    // Map over data to ensure every point has a faculty breakdown
    return baseData.map((item: any) => ({
      ...item,
      faculties: item.faculties || generateFacultyBreakdown(item.count)
    }));
  }, [question]);

  // Calculate total respondents for this question to compute percentages
  const total = useMemo(() => chartData.reduce((sum: number, item: any) => sum + item.count, 0), [chartData]);

  const isPie = question.type === 'pie' || question.type === 'yesno';
  const colorPalette = isPie ? COLORS.yesno : (question.type === 'extent' ? COLORS.extent : COLORS.positive);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-[420px] w-full">
      <div className="flex gap-4 mb-6 items-start">
        <span className="flex items-center justify-center shrink-0 w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mt-0.5">
          {index + 1}
        </span>
        <h3 className="text-base font-semibold text-slate-800 leading-tight">
          {question.text}
        </h3>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {isPie ? (
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={75}
                paddingAngle={2}
                dataKey="count"
                label={({ value, percent }: any) => percent > 0 ? `${value} (${(percent * 100).toFixed(1)}%)` : ''}
                labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
              >
                {chartData.map((_entry: any, i: number) => (
                  <Cell key={`cell-${i}`} fill={colorPalette[i % colorPalette.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} cursor={{ fill: 'transparent' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#64748b' }} />
            </PieChart>
          ) : (
            <BarChart
              data={chartData}
              layout={question.type === 'bar' ? 'vertical' : 'horizontal'}
              margin={question.type === 'bar' ? { top: 15, right: 75, left: 5, bottom: 20 } : { top: 25, right: 20, left: -20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={question.type !== 'bar'} horizontal={question.type === 'bar'} stroke="#f1f5f9" />
              {question.type === 'bar' ? (
                <>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} width={155} />
                </>
              ) : (
                <>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b', fontWeight: 500 }} interval={0} angle={-35} textAnchor="end" height={90} />
                  <YAxis hide />
                </>
              )}
              <Tooltip content={<CustomTooltip total={total} />} cursor={{ fill: '#f8fafc' }} />
              <Bar
                dataKey="count"
                radius={question.type === 'bar' ? [0, 4, 4, 0] : [4, 4, 0, 0]}
              >
                {chartData.map((_entry: any, i: number) => (
                  <Cell key={`cell-${i}`} fill={colorPalette[i % colorPalette.length]} />
                ))}
                <LabelList
                  dataKey="count"
                  position={question.type === 'bar' ? 'right' : 'top'}
                  formatter={(value: any) => `${value} (${((value / total) * 100).toFixed(1)}%)`}
                  fill="#64748b"
                  fontSize={11}
                  fontWeight={600}
                />
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};


// --- Special Comments View Component ---
const CommentsDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Sentiment Distribution */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <HeartHandshake className="text-blue-500" size={20} />
            Sentiment Analysis Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentimentData.distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                >
                  {sentimentData.distribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <p className="text-sm text-slate-500 text-center mt-2 px-4">
            Analysis shows a <span className="text-red-500 font-bold">strong negative trend</span> regarding compensation and workload, balanced by positive sentiments towards colleagues and students.
          </p>
        </div>

        {/* Topic Frequency */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <MessageSquare className="text-blue-500" size={20} />
            Top Discussion Topics
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData.topics} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={100} tick={{ fontSize: 12, fill: '#475569' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {sentimentData.topics.map((entry, index) => {
                    const color = entry.sentiment === 'positive' ? COLORS.sentiment.positive : (entry.sentiment === 'negative' ? COLORS.sentiment.negative : COLORS.sentiment.neutral);
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                  <LabelList dataKey="count" position="right" fill="#64748b" fontSize={11} fontWeight={600} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Qualitative Comments Feed */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Quote className="text-blue-500" size={20} />
          Qualitative Feedback Feed
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sentimentData.comments.map((comment) => (
            <div key={comment.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${comment.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                  comment.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                  {comment.sentiment}
                </span>
                <span className="text-xs text-slate-400 font-medium">{comment.faculty}</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">"{comment.text}"</p>
              <div className="mt-3 flex gap-2 justify-end">
                {comment.sentiment === 'positive' && <ThumbsUp size={14} className="text-green-500" />}
                {comment.sentiment === 'negative' && <ThumbsDown size={14} className="text-red-500" />}
                {comment.sentiment === 'mixed' && <Minus size={14} className="text-amber-500" />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// --- Main Dashboard Application ---

export default function App() {
  const [activeTabId, setActiveTabId] = useState('demographics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeCategory = useMemo(() =>
    surveyCategories.find(c => c.id === activeTabId)!,
    [activeTabId]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row overflow-hidden">

      {/* Sidebar Navigation */}
      <aside
        className={`bg-white border-r border-slate-200 shrink-0 md:h-screen flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ${isSidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-72'}`}
      >
        <div className={`p-6 border-b border-slate-100 flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isSidebarCollapsed && (
            <div>
              <div className="flex items-center gap-2 text-blue-700 font-extrabold text-xl mb-1 tracking-tight">
                <LayoutDashboard size={24} className="text-blue-600" />
                Survey Matrix
              </div>
              <p className="text-xs text-slate-500 font-medium">100+ Visualizations</p>
            </div>
          )}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg transition-colors hidden md:block"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1 space-y-1.5 flex md:block overflow-x-auto md:overflow-x-visible hide-scrollbar">
          {surveyCategories.map(cat => {
            const Icon = cat.icon;
            const isActive = activeTabId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTabId(cat.id)}
                title={isSidebarCollapsed ? cat.label : ""}
                className={`w-full flex items-center px-4 py-3.5 rounded-xl text-left text-sm font-semibold transition-all whitespace-nowrap md:whitespace-normal shrink-0 md:shrink border ${isActive
                  ? 'bg-blue-50/80 text-blue-700 border-blue-200 shadow-sm'
                  : 'bg-transparent text-slate-600 border-transparent hover:bg-slate-100/50 hover:text-slate-900'
                  } ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={isSidebarCollapsed ? 24 : 18} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                  {!isSidebarCollapsed && <span>{cat.label}</span>}
                </div>
                {!isSidebarCollapsed && isActive && <ChevronRight size={16} className="text-blue-400 hidden md:block" />}
              </button>
            )
          })}
        </div>
      </aside>

      {/* Main Content Area (Full Width) */}
      <main className="flex-1 md:h-screen overflow-y-auto bg-slate-50 relative w-full">
        <div className="p-6 md:p-10 max-w-full mx-auto space-y-8 pb-24">

          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-3 text-blue-600 mb-2">
                <activeCategory.icon size={28} />
                <span className="text-sm font-bold uppercase tracking-wider">{activeCategory.id}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                {activeCategory.label}
              </h1>
              <p className="text-slate-500 mt-2 text-base md:text-lg max-w-2xl">
                {activeCategory.description} Showing {activeCategory.id === 'comments' ? 'qualitative feedback analysis' : `${activeCategory.questions.length} metric visualizations`}.
              </p>
            </div>
          </header>

          {/* Conditional Rendering: Grid of Questions OR Comments View */}
          {activeTabId === 'comments' ? (
            <CommentsDashboard />
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {activeCategory.questions.map((q, idx) => (
                <QuestionCard key={`${activeCategory.id}-${idx}`} question={q} index={idx} />
              ))}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
