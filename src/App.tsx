import { useState, useMemo } from 'react';
import {
  Users, Building2, Clock,
  GraduationCap, Landmark, HeartHandshake,
  LineChart, Wallet, LayoutDashboard, ChevronRight, Menu,
  MessageSquare, Quote, Info, LogOut, ThumbsUp, ThumbsDown, Minus, Lock, Eye, EyeOff
} from 'lucide-react';
import BalamandLogo from './assets/University_of_Balamand_logo.svg';

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
  positive: ['#10b981', '#10b981', '#94a3b8', '#f87171', '#ef4444'], // Green, Green, Gray, Light Red, Red
  negative: ['#ef4444', '#ef4444', '#94a3b8', '#34d399', '#10b981'], // Red to Green (for negative questions like "Leave")
  neutral: ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#e0e7ff'], // Blues
  extent: ['#10b981', '#94a3b8', '#ef4444'], // Green, Gray, Red
  yesno: ['#10b981', '#ef4444'], // Green, Red
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
const surveyComments = [
  { id: 1, text: `I have several concerns regarding my career future at UOB, summarized as follows: ' Insufficient communication between the administration and faculty members. Information often circulates as rumors rather than official updates. It would be beneficial to have at least one annual town hall meeting with the President. ' Receiving salary payments in interrupted, partial installments ' Erosion of the indemnity fund for faculty members appointed before 2020, as neither UOB nor the faculty are actively investing or protecting its value. ' Not providing faculty members the option to independently decide whether they want to collectively invest their post-2020 indemnity, without the administration's involvement. ' Slow response to maintenance requests for lab spaces. ' Lack of a faculty syndicate, which could help regulate and formalize the relationship between faculty members and the administration.`, sentiment: 'negative' as const },
  { id: 2, text: `No questions are being raised regarding transparency! There is a lack of transparency across all departments, starting from the president to the Provost, HR, and Comptroller's offices, when it comes to salaries, promotions, and rankings. The 'when, why, and how' remain unanswered.`, sentiment: 'negative' as const },
  { id: 3, text: `I have accomplished most of my academic career at Balamand. I am very proud for the opportunities to write 4 books and many articles and for the participation and the organisation of many international conferences. During my teaching time I was very happy to communicate useful knowledge and culture to new generation. I am very thankful for the trust I get to work with the valuable cultural heritage of our church.`, sentiment: 'positive' as const },
  { id: 4, text: `Strengthen the university's public image, media presence, and communication strategy, ensuring consistent and positive exposure across all platforms. Establish a clearer and more structured advancement track for part-time and full-time faculty, with transparent promotion criteria ' especially for cases where professional experience or terminal creative degrees should count comparably to a PhD in an art faculty context. Improve facilities and resources at the ALBA Koura campus to match the needs of design, art, and architecture programs. Provide more opportunities, incentives, and institutional support for research, publications, and creative outputs, especially those that go beyond traditional written research (e.g., artistic production, exhibitions, digital projects, applied design work).`, sentiment: 'neutral' as const },
  { id: 5, text: `In a summary, I would like to resume my experience at UOB as excellent, as it is not only our job location , indeed, it is our second home, despite all the social and economic difficulties that we are passing through.`, sentiment: 'positive' as const },
  { id: 7, text: `Transparency is lacking. Financial matters are unclear, chaotic and could be run in much more effective and respectful ways. No other university of equal or even lower standing suffer from the kind of ambiguities and inequities in its handling of our financial rights. We are always left in the dark when it comes to our salaries. Our end-of-service indemnities are being diluted by inflationary pressures. These remarks are facts and not opinions, and are widely shared by both faculty and staff.`, sentiment: 'negative' as const },
  { id: 8, text: `I am satisfied being a Balamandian and working with my colleagues at the Career Services Center, the Office of Data and Institutional Research, and my colleagues at the Faculty, as we truly operate as one family. I also appreciate the collaboration with faculty members across other faculties. My sense of organizational citizenship is what keeps me committed and motivated to continue working. However, most other aspects of my work environment are not satisfactory. Thank you for conducting this survey; it is the first time someone has asked for our input. I hope it leads to meaningful change, although I must honestly say that my expectations remain low.`, sentiment: 'neutral' as const },
  { id: 9, text: `More COMMUNICATION is needed with the President. Decisions are taken and we know everything in the last minute. BALAMAND is our HOME. We need to feel a Family again.`, sentiment: 'positive' as const },
  { id: 10, text: `During the forum, you asked whether faculty members are fully aware of university policies. While these policies certainly exist, true understanding requires more than receiving an email or seeing them posted on the website. There is a real need for a policy briefing session'a clear, structured space where these policies are explained, contextualized, and discussed so that everyone can genuinely grasp them. Although I remain at UOB, it is neither because of the salary'far from satisfying'nor because of the promotion system, which, while I would not call it unfair, often feels misaligned with the true value of our professional work. I genuinely wish it would recognize more strongly the dual pillars that define many of us: our academic research and our professional accomplishments, especially for those who contribute significantly to the field beyond the classroom. What keeps us here is something much deeper: our long-standing love for UOB, our passion for teaching, our attachment to our department, and the meaningful bonds we build with our students'our 'kids.' Yet it feels disheartening that the university does not always see or value these efforts. In my case, although I meet my formal teaching load like everyone else, I dedicate at least 15 to 20 extra hours every week to students' practical projects outside the university'hours not required by the department, yet essential for their growth, confidence, and readiness for the market. These efforts remain invisible, uncounted, and unacknowledged in the university's communication or evaluation systems. Another point concerns the possibility of requesting a reduced teaching load. Although our workload is extremely demanding, the only path to reduced load is through research. I am actively engaged in research and equally committed to my professional responsibilities; however, none of the extensive professional work I do'despite its direct benefit to our students and to the university's visibility'can be counted toward eligibility. This is understandable from a procedural standpoint, yet it creates an impossible condition: to request a reduced load, I must be on campus four days a week, while in reality I am dedicating 15 to 20 hours weekly outside the classroom supervising students in hands-on practical projects outside the university. These efforts, which perfectly align with UOB's mission of experiential learning and its promise to the market, ironically make me ineligible under the current criteria. What is also strongly needed is the establishment of a dedicated, professional office that supports faculty with their publications. Such an office would guide researchers in selecting journals that match their field, their topic, and the university's academic scope. This type of structured support is essential and would significantly increase the number and quality of publications produced by our faculty. Researchers would no longer have to navigate alone the complexity of journal legitimacy, indexing, evaluation, and scope. Instead, they could focus entirely on producing meaningful research, trusting that the institution is walking beside them throughout the publication journey. What I feel'and what so many colleagues share privately'is that the university simply does not see us. We do not feel seen. Decisions are made from top to bottom, and while I fully respect institutional hierarchy, many of these decisions are not communicated. Semesters begin and sometimes end without faculty members knowing about their salary, how their salary is calculated or what their compensation will be, if any. This constant uncertainty, this quiet but heavy worry about something as fundamental as our livelihood, weighs deeply on us. And what hurts most is that the university does not reach out to reassure its own family that things are in progress, that we are taken care of, that there is no need to fear the unknown. What is important to emphasize is that in any institution, the internal public'its own people'must come first. Transparent, consistent, and caring communication with the internal public is not only necessary, it is more important than external communication. When faculty and staff feel informed, valued, and spoken to with respect and genuine consideration, they naturally become the university's strongest ambassadors. A satisfied internal public reflects a positive image outwardly, speaks well of the institution, elevates its reputation, and stands by it with pride. This is why investing in internal communication'clarity, empathy, and AUTHENTIC HUMAN CONNECTION 'is absolutely crucial for trust, loyalty, and institutional credibility.`, sentiment: 'neutral' as const },
  { id: 11, text: `Make place for the young doctors, enough with the old unqualified doctors especially the ones with no degree`, sentiment: 'neutral' as const },
  { id: 12, text: `UOB's reputation as a respected university has been spiraling down. It lost its ability to recruit competitive students and maintain expert faculty members among its ranks. This is partly to to the absence of expert academicians and faculty members who have extensive experience in academic life, building an academic culture and in academic administration (not business administration). UOB needs to return to being a university not a cash generator. UOB needs to go back to its roots and stop following the business model.`, sentiment: 'negative' as const },
  { id: 13, text: `Maternity leave of 30 days is unacceptable.`, sentiment: 'negative' as const },
  { id: 14, text: `Although the University bylaws include clear procedures for demotion, these procedures are not being implemented. Moreover, there are no effective accountability measures in place for staff and faculty members who commit serious misconducts.`, sentiment: 'negative' as const },
  { id: 15, text: `The biggest issue that has led to my feelings of dissatisfaction are the lack of communication from the upper administration. In addition, and connected obviously to the lack of communication, is the very low salary. It is completely inadequate compared to the amount of work I perform for UOB - and we have yet to be informed of if and when our salaries will be increased. Furthermore, there has been no expression of appreciation or encouragement regarding the fact that we are working at such a high level despite the fact that we are not being compensated appropriately. There is also a lack of progress in the development of our facilities - we have to almost beg the support staff to get projectors fixed. We should be able to walk into a classroom that is fully equipped and not have to pick up and drop off a remote that sometimes doesn't even work. Similarly, the ACs should be turned on in the mornings on hot days - we should not have to go searching for the remote.`, sentiment: 'negative' as const },
  { id: 16, text: `Very bad experience, unprofessional, dishonest, will send an email to the President explaining everything that is going on!`, sentiment: 'negative' as const },
  { id: 17, text: `Faculty members recruitment before 2019 was based on: Salary in UD dollars, almost full paid tuition for schools, excellent transportation from and to UOB, a pension plan and an indemnity program in US dollars. Now almost all these benefits are cancelled. Why should any qualified faculty member join UOB'`, sentiment: 'neutral' as const },
  { id: 18, text: `I am hopeful that our university will be able to improve its administrative, academic and economic situation for the benefit of all.`, sentiment: 'positive' as const },
  { id: 19, text: `Some questions are not applicable with no NA possible answer. many questions are binary (yes or no) while there must be other answers. Most of the questions are mentioning the relationship between the faculty member and his/her department and/or Faculty. no questions about the relationship between the faculty member and the higher administration. Questions are questioning our satisfaction/dissatisfaction without any serious attemot to know the reasons behind our answers.`, sentiment: 'neutral' as const },
  { id: 20, text: `I am an alumnus of the UOB. My sense of belonging to UOB is extreme. I am gladly serving the university by trying to make a positive impact and influence students to see the marvellous things I experienced during my undergraduate and graduate studies. A small suggestion is to increase the university's lucidity among its faculty and staff, for example, and from what I heard in other universities: -UC meetings minutes are being shared to provide transparency among the faculties and show the unity of decisions throughout the university -Clear communications are used for salaries and updates regarding schooling benefits and insurance as of the beginning of the academic year. We are a University that other universities should consider as an example, but we are always trying to compare ourselves to AUB and LAU.`, sentiment: 'neutral' as const },
  { id: 21, text: `I have been a faculty member at UOB for 15 years, and in my opinion, the past two years at our faculty (Faculty of Engineering) have been the most difficult. The faculty administration is no longer transparent, does not treat everyone equitably, and often interacts with us on a personal rather than a professional basis. We used to be able to express our opinions freely, but now any viewpoint that differs from theirs is not accepted. There are also several conflicts of interest between the administration and certain staff/"faculty members", which result in unfair privileges for some over others. We don't hold regular faculty meetings anymore (except prior to the ABET visit). In addition, it feels like the faculty administration is intentionally creating divisions among us. Most faculty members are unhappy with this environment but are afraid to express their opinions, fearing negative consequences from the faculty administration, including possible non-renewal of their contracts. Overall, the work environment and our relationship with the faculty administration have become very toxic. I believe the entire administrative structure of the faculty needs to be reviewed and changed before the situation deteriorates further.`, sentiment: 'neutral' as const },
  { id: 22, text: `I love the university because I feel at home here. I work with great passion for my students, and that is what makes me happy to be part of this university`, sentiment: 'positive' as const },
  { id: 23, text: `Performance and research productivity are unfortunately not taken into account for salary advancement despite the fact that it has been mentioned many times by the highest authorities.`, sentiment: 'negative' as const },
  { id: 24, text: `Over my 16 years as a faculty member at UOB, I have never seen a period as difficult as the last two years within our Faculty of Engineering. In my role as chairperson, I have grown increasingly troubled by the direction of the current faculty administration. Transparency has diminished, fairness in the treatment of faculty members has eroded, and communication has become personal rather than professional. While we once had the freedom to express differing opinions openly, any perspective that does not align with the administration's views is now quickly disregarded. The Dean in particular deals with faculty in an unprofessional and personal manner. For example, last year he explicitly advised me not to apply for promotion to full professor, even though I met all the promotion criteria. He justified this by saying that other faculty members applying for associate professor had 'more points,' a comparison that is irrelevant and inappropriate. Meanwhile, a staff member who recently completed her PhD was suddenly appointed as an assistant professor, which, to my knowledge, is unprecedented. This inconsistency reinforces my fear that this year he may deliberately create obstacles to block my promotion. Transparency has deteriorated significantly. I cannot even recall the last time minutes of a Faculty Council meeting were circulated. Regular faculty meetings have essentially disappeared and there is a noticeable effort to divide faculty members. These practices have created an unhealthy environment and have damaged the working relationship between faculty and the administration. Communication is minimal and typically limited to email, with no open dialogue or proper channels for discussion. Furthermore, critical decisions such as recruitment lack clarity and follow-through. We have a severe shortage in the labs, and after conducting several interviews in August, during which we collectively agreed to hire two candidates, no appointments have been made to date. We have received no explanation for this delay, leaving us unable to plan or support students properly. Many faculty members are dissatisfied with the current environment, yet they hesitate to voice their concerns out of fear of potential repercussions, including the risk of non-renewal of their contracts. The work climate, and our interactions with the faculty administration, has grown increasingly dysfunctional. I am convinced that the faculty's administrative framework needs an immediate and thorough evaluation to prevent the situation from worsening any further.`, sentiment: 'neutral' as const },
  { id: 25, text: `As a faculty member at the University of Balamand, one of the frustrating aspects we have experienced over the past years'through our spontaneous interactions as faculty members and some staff'is the lack of clear and transparent communication from the Board of Administration. When the administration (and I do not mean the faculty) shares expectations, and decisions openly and transparently, it helps build an atmosphere of trust and mutual respect. Such communication not only provides faculty and staff with the information and support they need, but also strengthens the spirit of collaboration and belonging, giving everyone a genuine sense of appreciation as essential members of the institution.`, sentiment: 'negative' as const },
  { id: 26, text: `Being a faculty member at the University of Balamand has been one of the best professional opportunities I've had. I have experiencedcareer growth in an encouraging and supportive environment, with valuable opportunities for advancement and research. I would also appreciate consideration of adjusting the salary payment schedule to a monthly basis, as this would provide greater financial stability. Before joining UOB, I held the rank of Associate Professor, and I am actively working to regain my academic rank through my teaching, research, and service.`, sentiment: 'positive' as const },
  { id: 27, text: `I am more into community development work. Not all questions apply to me.`, sentiment: 'neutral' as const },
  { id: 28, text: `While I am deeply committed to my role, the initial workload for a new faculty member has been overwhelming. Developing three new courses from scratch, with a full 12-credit teaching load in the first semester, leaves absolutely no time for research and creates immense pressure that risks burnout. This is made even more challenging by the requirement to commute between two campuses, which is time-consuming and exhausting. To truly support new faculty in providing high-quality education and a strong student experience, I believe the university should consider a reduced teaching load for the first semester and allow lecturers to be based at a single campus.`, sentiment: 'neutral' as const },
  { id: 29, text: `I think this survey is misleading and does not allow for a comprehensive answering scheme. A lot of things are dependent on certain contexts and so yes or no answers are vague. What is the most frustrating is the lack of value that is given to faculty members who are working solely for the purpose of bettering the university. The promotion criteria is extremely unfair, especially if faculty are serving on multiple administrative roles. placing such a high value on research when 1. there is a heavy course load 2. heavy administration load 3. Lack of assistance and guidance 4. lack of resources means that we are being set up to fail.`, sentiment: 'negative' as const },
  { id: 30, text: `I truly value my experience at UOB. I greatly enjoy the courses I teach, the colleagues I work with, and the students I have the privilege of guiding. These aspects are the core of my professional satisfaction. However, I am increasingly discouraged by certain administrative practices'particularly those related to rank assignment, promotion, and compensation. After completing my PhD, I had a reasonable expectation of being promoted to the rank of Assistant Professor, especially since peers who submitted their dissertations only months before I did were granted this rank immediately. Instead, I was assigned the title of Senior Lecturer, a designation that is uncommon in most Lebanese institutions and inconsistent with practices I see across the sector. Additionally, it is disheartening to see newly recruited faculty members holding only an MA degree receive higher compensation than I do. This raises concerns about equity, transparency, and faculty retention. I strongly believe the university would benefit from establishing two clear promotion tracks'Teaching and Research'similar to the systems adopted at LAU, AUB, and many international universities. This would ensure fairness, acknowledge different types of academic contributions, and align UOB with global best practices. I remain committed to my work and to UOB as an institution, and I hope future administrative reforms will address these issues and support faculty members' growth and morale.`, sentiment: 'positive' as const },
  { id: 31, text: `My satisfaction could be significantly enhanced through three strategic institutional improvements: First, by fostering enhanced leadership engagement via more frequent and direct consultation sessions with the President and Executive Board; second, by implementing social activities designed to revitalize and promote genuine faculty cohesion and collegial networking; and third, by accelerating our digital transformation strategy through the provision of professional AI tools and the establishment of an urgent, institution-wide (transversal) training program on AI proficiency for all members of the university community (faculty, staff, and students).`, sentiment: 'neutral' as const },
  { id: 32, text: `I truly feel that I belong to this institution, and it is the place where I believe I can give my maximum potential and efforts. I genuinely wish to remain working at UOB until my retirement while continuing to develop myself professionally and academically. During the crisis period, I received several offers from other institutions, yet I chose to stay at UOB to support it through difficult times. However, at this stage, I strongly believe that salaries and benefits need to be reconsidered and improved to allow faculty members to live with dignity, especially given the significant inflation and drastic increase in living costs over the past years. Aligning compensation with current economic realities is essential. Additionally, our workload is considerably higher compared to other American institutions, and addressing this issue would contribute greatly to maintaining a healthy, motivating, and sustainable work environment. I sincerely hope these concerns can be tackled so we can continue progressing and contributing effectively to the university's mission.`, sentiment: 'neutral' as const },
  { id: 33, text: `There is a growing sense of unfairness among faculty members regarding the clear discrimination in our compensation structure and the persistent lack of transparency within the comptroller's office. Despite our continuous efforts, academic workload, and commitment to the institution, many of us still face unexplained disparities in pay and irregularities in processing. Requests for clarification often go unanswered, and decisions appear arbitrary rather than grounded in objective criteria. This situation undermines morale, damages trust, and contradicts the standards of fairness and professionalism that a university should uphold. Clear communication, transparent guidelines, and equal treatment are urgently needed to restore confidence in the system.`, sentiment: 'negative' as const },
  { id: 34, text: `I would like to see better and more frequent communication from the university regarding matters that relate to us individually and more strategically regarding plans for the future as an institution. At the individual level, I am thinking more specificially about timely communication regarding compensation and salary adjustments. I understand the challenges posed by the crisis and the highly challenging task of planning ahead in a constantly changing environment; however, not knowing where we stand financially at the beginning of each new academic year is very frustrating and impairs our budgeting and financial planning abilities. Furthermore, I am worried about the depletion of the purchasing power of the pre-2020 indemnity and the absence of a plan to mitigate these effects. At the institutional level, I see many initiatives and partnerships being signed, and faculties getting accredited, which is amazing and makes me feel proud; however, we would benefit from better communication regarding strategic decisions and initiatives on a regular basis.`, sentiment: 'neutral' as const },
  { id: 35, text: `This is now my 22nd year of employment at UOB, and I truly love my work. I am specialized in aviation, which is something unique to UOB. I live far away and drive 150 km every day. This is to say that I am not ready to leave UOB any time soon. I understand the challenges we have all faced given the country's situation. However, the lack of transparency and communication between upper management and staff, the feeling that we are not valued and can be replaced at any moment, the issues around indemnities, the salaries that have not reached even 100% of their value from six years ago, the inflation, the envelopes every two months, etc.'all of these have created obstacles to building trust and to fostering a sense of peace and belonging at UOB. Thank you for giving us the opportunity to express our concerns`, sentiment: 'neutral' as const },
  { id: 36, text: `The current UOB administration (including ALL its members) does not value its people. You abuse people's loyalty. You abuse people's situations and the country's situation. You do not care about your people's well-being. You do not care about doing the right thing. You allow unethical practices. You give your people no security and no chance to better their situations. You keep people in powerful positions when you know that they are absolutely incompetent You also don't care about the UOB's reputation at all. Go listen to what people around you are saying, how bad your reputation has become. As someone who loves UOB and loves my colleagues, and adores my students, this is beyond saddening and disappointing. I also believe that this survey is probably because you want to window-dress some shortcomings or fulfil some accreditation requirements - we (collectively) do not believe that you care enough to actually listen to what we say in this survey and do anything about it. If you cared, you would have taken at least some actions a long long time ago. And finally, who are you fooling' This is absolutely not an anonymous survey when you ask for all those demographic details. You actually want to identify responders and then probably get back at them.`, sentiment: 'neutral' as const },
  { id: 37, text: `Keep the good work, and god bless you.`, sentiment: 'neutral' as const },
  { id: 38, text: `I would appreciate clear and transparent communication concerning salaries. We sometimes feel insecure and not well informed about our payments/raise. All other academic institutions provide clear information in advance.`, sentiment: 'positive' as const },
  { id: 39, text: `in addition to the above and more importantly, to re-build trust between all UOB stakeholders and the surrounding community. if done, I am sure everything will be okay.`, sentiment: 'neutral' as const },
  { id: 40, text: `I would suggest ensuring more opportunities for faculty development relying on local and international resources. This would enhance the quality of teaching and learning, as well as research activities and community services.`, sentiment: 'neutral' as const },
  { id: 41, text: `As a faculty member at UOB, I genuinely appreciate the exceptional working environment within my department and the wider faculty. The collaboration, support, and collegial spirit here are truly remarkable, and they are a major reason why I have never considered leaving. At the same time, I feel that the broader university's communication with its faculty members is often insufficient, and this lack of transparency can come across as insufficiently attentive to faculty. Strengthening communication would not only improve our sense of inclusion but also reinforce the strong foundation that already exists within our academic community.`, sentiment: 'neutral' as const },
  { id: 42, text: `Implementing a rotation system for appointing department chairs, assistant and associate deans ' with a specific, fixed term ' ensures a healthier and more balanced administrative structure.`, sentiment: 'neutral' as const },
  { id: 43, text: `As a UOB alumnus and current faculty member, I have witnessed the University's continuous growth over the years, and I am proud to be part of this institution. I have only one suggestion: many universities offer certificates or awards for outstanding teachers, researchers, and staff. I would recommend that UOB introduce similar recognitions along with appropriate prizes.`, sentiment: 'positive' as const },
  { id: 44, text: `I am new to the faculty and still in the process of learning the rules, procedures, and how things are done, so I wasn't able to answer all the questions.`, sentiment: 'neutral' as const },
  { id: 45, text: `There is a need for more equity and more recognition of efforts at least with an allocation of credit load which will show the need to hire and additional FTE and will allow a betterment of our department with a focus on the UOB's vision`, sentiment: 'neutral' as const },
  { id: 46, text: `I genuinely enjoy working at UOB. I appreciate the environment, the students, the diversity, and my fellow faculty members. Everyone is supportive, and you truly feel as if you are interacting with family rather than functioning within a rigid work setting. However, the main concern lies in the remuneration. The salary is quite low, and the benefits are essentially nonexistent. Considering UOB's strong reputation and well-established name, I truly expected a different level of support, and I am disappointed. Additionally, I believe that faculty members teaching across multiple campuses should receive appropriate recognition or compensation for the added workload and travel.`, sentiment: 'neutral' as const },
  { id: 47, text: `I am generally very happy at the university and feel a strong sense of belonging. However, I would like to highlight a few concerns: ' Salary discrepancies among faculty members. ' My initial appointment as Senior Lecturer, while colleagues started as Assistant Professors. ' A heavy workload that limits my ability to conduct research. ' The need for free medical insurance, as I currently pay for it externally. ' An increase in the schooling allowance to match rising costs. These points are shared with respect and in the hope of improving fairness and faculty wellbeing.`, sentiment: 'neutral' as const },
  { id: 48, text: `Since day one of joining UOB, I knew this was my second home! I've had many opportunities elsewhere including abroad (knowing that I have a foreign citizenship) but refused to leave the country that I love for many reasons. The atmosphere as a whole gave me the sense of strong belonging where the benefits were always mutual and still are. We passed through extremely rough times (revolution, COVID, financial crisis, etc.) but we stayed united, unbroken and still continuing...with this said, I believe that I have summarized my experience as a faculty member without the addition of any other details! Thank you.`, sentiment: 'positive' as const },
  { id: 49, text: `More transparency from the senior administration is desired. Faculty should be informed about every decision and action the senior administration takes. When it comes to decisions that impact the faculty specifically, such as changing the academic by-laws and adjusting salary dollar rates etc., the faculty needs to be informed by the president. Regular communication is needed in the form of emails and faculty meetings.`, sentiment: 'neutral' as const },
  { id: 50, text: `After twenty years of employment at UOB, Iwould like to highlight the subject of human relations between the faculty members themselves and the all the Staff in general. These relations can be qualified as excellent.`, sentiment: 'positive' as const },
  { id: 51, text: `-It seems to me that more effort will be needed regarding the onboarding of new students. A clear procedure could help them feel less lost during the first semester. -Course Evaluation Survey (CES)It will be more efficient if it is done online: Students will have more freedom, more time, and it will reduce the university's administrative costs; moreover, the responses can be archived and analyzed.`, sentiment: 'neutral' as const },
  { id: 52, text: `The University of Balamand holds valuable internal expertise ' made and flourished within UOB ' yet it remains underutilized, as preference is often given to foreign expertise despite the strong local potential.`, sentiment: 'neutral' as const },
  { id: 53, text: `no clear vision nor transparency regarding salaries and indemnities.`, sentiment: 'negative' as const },
  { id: 54, text: `Thank you for providing an opportunity to share feedback. I am committed to supporting the university and contributing to its mission, yet several issues have increasingly affected faculty morale, the working environment, and our sense of stability. - Access to the Dean has become limited, making it difficult to receive guidance or collaborate effectively. - 'The current environment at the faculty lacks transparency, is unclear, and creates an unhealthy atmosphere. It feels restrictive and discouraging rather than supportive. For a faculty that focuses on sustainability, the current situation is not sustainable. - Many faculty members feel hesitant to express concerns openly due to fears about potential consequences related to job security or contract renewal. This caution undermines trust which makes faculty members feel unsafe, unheard, and unsupported. - The current structure of the Dean's Office has made routine processes less efficient. Faculty often feel monitored and supervised rather than feeling assisted. Simple academic needs such as having a printer in the office or even requesting basic teaching materials like board markers have become uncomfortable tasks. - At the recent celebration of ABET BS reaccreditation, the emphasis appeared to be solely on sustainability initiatives, overlooking all contributions of other faculty members. This made faculty efforts feel undervalued. - During the last ABET accreditation process of our BE programs, we were accused of being unprofessional for answering questions from the evaluator, while the Dean positioned himself as the individual who saved the accreditation. This created resentment amongst faculty members who worked collaboratively towards the same goals. - 'While I am Associate Dean, and on several occasions, I wasn't kept in the loop on key initiatives that are in the scope of my work. To avoid such situations, I repeatedly requested a detailed job description for my role which till date has not been provided, leaving administrative responsibilities unclear. - At the university level, more transparency is needed. Faculty are not informed about salary adjustments and indemnity, and there is limited clarity. The children's schooling allowance is significantly lower compared to other universities, and there is a general sense of uncertainty and vagueness about the university. Clear communication and stronger engagement with faculty would greatly improve trust and morale. I share these comments respectfully and constructively, with the hope that they lead to meaningful improvements, greater transparency, and a healthier overall academic environment.`, sentiment: 'neutral' as const },
  { id: 55, text: `Balamand places a lot of importance on student evaluations; most of the times these evaluations are written by failing students or students who are not happy with their grades and they create falsified stories to get the administration to support them. I believe that departments place too much emphasis on what students write in their evaluations and as a result end up weakening a teacher's position. Not enough support is given to back up teachers when they are in such a situation. It should be the teacher's say of what should take place when they are the person in the classroom working with the students. Weak and failing students are given too much attention and credibility. Also, heads of departments should have more accountability as teachers do. In many cases, there are biases, harassment, unfair judgment, singling out, unfair decision making, all done by one person. No one double checks to see if such decision making is accurate and justifiable. Teachers are afraid to speak up because they are afraid of losing their jobs. There must be some sort of system of quality assurance where discrimination is not allowed to take place. Teachers should be protected; their rights should be protected. This creates a hostile environment where one person can take any action they want and they are not held accountable by anyone. It is a system of dictatorship when it is one person that makes all decisions about an entire department and all faculty members are afraid to speak up. This is very unhealthy and creates a toxic environment. There must be a committee or a hierarchy where a group of people and administrators are involved in taking decisions which end up changing the lives of faculty members who are dedicated and committed to improving the educational standards of their institution. Favoritism does not adhere to equal opportunity. Not only is it not professional but it is a form of bias and discrimination. Nepotism is also a form of discrimination. Family members whose rights are preserved and protected at all times (days off, vacation time, skipping class) is not professional. It is harassment when other faculty are severely reprimanded for requesting similar treatment. Abuse of teachers at an educational institute does not promote the standing and reputation of a university. Harassment of teachers because they are fearful of losing their jobs should not take place and must be investigated. Universities like AUB and LAU do not have similar incidences happen because they do apply quality assurance. One person cannot function as they please when an entire faculty is involved without any investigation, accountability putting an end to unprofessional behavior. This should not continue from semester to semester. Falsifying incidences and making up false allegations by heads of departments or colleagues should be investigated and must not be accepted as truth by the administration. Balamand must apply a form of quality assurance and ensure that teachers' rights are preserved and not abused.`, sentiment: 'neutral' as const },
  { id: 56, text: `I am proud to belong to faculty UOB because I get the opportunity to write 4 books and many articles .I have had the opportunity to organize and to participate to many international conferences in Balamand and outside Lebanon. I am specially proud for the confidence I get to work on the valuable heritage of our Antiochian Church on unpublished sources of archives and manuscripts. I wiish that our students could also be more interested by this patrimony and heritage`, sentiment: 'positive' as const },
  { id: 57, text: `I am very satisfied at UOB; however, securing a tenure track is essential for ensuring long-term stability for faculty members.`, sentiment: 'positive' as const },
  { id: 58, text: `As a committed faculty member who deeply considers Balamand my home, I feel increasingly discouraged by the absence of transparency and consistency in key institutional processes. Communication between faculty and the Comptrollers, as well as higher administration, is almost nonexistent, leaving us uninformed and undervalued. The HR department remains ineffective. Basic matters such as salary distribution lack professionalism and clarity ' we still receive our payment by hand, without a clear schedule or notification, constantly waiting the day of distribution and hoping someone will notify us that we can go now to the glass room to get our enveloppe. As a faculty member who teaches professionalism to our students, this situation is deeply discouraging to us. The internal rules concerning promotion, teaching loads, and workload distribution exist on paper but are neither standardized nor applied fairly across the board. Teaching credit loads urgently need revision: they should align clearly with academic rank, and research-active faculty must be genuinely supported ' not only relieved of 6 credits ' especially when some produce more than seven peer-reviewed papers per academic year. The current system fails to reward excellence or encourage productivity. Appraisals and leave requests are applied inconsistently in Faculties, when they should be required for all, ensuring fairness and accountability. Research, one of the university's strongest pillars, suffers unfortunately from insufficient support, unclear grant allocation, and an environment in which collaboration is too often seen as a burden rather than a strategic necessity. Funding to initiate MoUs, exchanges, and international partnerships is inaccessible, limiting growth and visibility locally and abroad. There is also a painful imbalance in how faculty are treated. Salaries do not reflect qualifications, specialization, or years of service. As an Engineer with a PhD working at the Faculty of Health Sciences, my compensation does not match that of peers at the Faculty of Engineering, or Faculty of Medicine, even though many of these Faculty are not Engineers or MDs but holding a PhD in Science. New recruits frequently receive better terms than long-standing academics, while many of us remain unaware of our basic rights. Even communication and visibility reflect inequity. Featuring on social media is slow, selective, and lacks a transparent system. The same faces appear repeatedly, while others ' despite significant achievements ' remain invisible. Major milestones such as accreditations, which strengthen our reputation and support recruitment, are not highlighted promptly or consistently. We urgently need a fair communication strategy that gives every member of this academic community an equal chance to be seen and valued, Faculties are not treated equally. We are a highly qualified, hardworking community that wants to shine for Balamand. Yet our motivation is fading because transparency, fairness, ethical governance, and recognition are not applied consistently. It is painful to feel that if one expresses disappointment or seeks answers, they may be met with discomfort or reprimand rather than open dialogue. Home should be a place where every member feels respected, supported, and safe to speak. I sincerely thank you for giving me the opportunity to voice these concerns ' all in the best interest of our beloved University, which deserves to regain the leadership and ranking it once proudly held. By valorizing the talented faculty and resources we already have, and by investing in them rather than clipping their wings, we can all fly higher together. Please consider my concerns and experience at UOB in a positive spirit ' not as criticism, but as a genuine call for action to nurture the excellence our institution is capable of. I allow myself to sign my name because I believe there is no reason for this message to remain anonymous. We should be able to express our concerns openly, work collectively, and find solutions together, without fear, without hesitation, and without hiding our voice. This University belongs to all of us, and our courage to speak for its improvement is part of our loyalty to it. Mireille Serhan`, sentiment: 'neutral' as const },
  { id: 59, text: `I am deeply satisfied with my work at UOB, a place that has become an essential part of my life and identity. My connection to the university began in 1996 during my years as a student, continued as I proudly joined the faculty in 2002, and now extends to the next generation as my daughter pursues her medical studies at UOB. This long-standing relationship has strengthened my commitment and sense of belonging to the institution. I genuinely wish to complete my professional journey here, contributing to its mission and witnessing its continued growth. It is my sincere hope to see the University of Balamand flourish and secure its place among the leading universities in Lebanon.`, sentiment: 'positive' as const },
  { id: 60, text: `Thank you for giving us the opportunity to share our perspectives. As an engineer whose health insurance is provided through the Order of engineers, I would appreciate if UOB could contribute its share of the coverage, as it does for other employees and faculty members whose insurance is managed directly through the university.`, sentiment: 'positive' as const },
  { id: 61, text: `I would like to sincerely thank the Provost, Dr. Georges Bahr, for his outstanding professionalism and leadership. His efforts have led to improvements accross many levels, particularly in strengthening research grants, advancing academic excellence, and establishing a supportive environment for faculty and students. His dedication and hard work has had and continues to have a positive impact on our institution.`, sentiment: 'positive' as const },
  { id: 62, text: `More transparency is needed, as well as clearer communication regarding important matters (Salary, schooling, etc.). In many cases, a simple email would do the job. Currently, we often find ourselves dealing with rumors instead of reliable information. The issue of promotions and demotions, combined with a 24'credit load, is inappropriate. This is not a personal matter but a structural one. I urge the administration to restore the sense of belonging and unity that once defined the Balamandian family. Additionally, the promotion policy (point system) should be flexible and aligned with each field of expertise, rather than applied uniformly across all disciplines. The fast'track option has become too fast and too unfair, encouraging non'ethical behavior. In general, faculty and staff should not feel that they are being disrespected and not involved.`, sentiment: 'neutral' as const },
  { id: 63, text: `I love UOB as I love Lebanon. Unfortunately, at UOB as in Lebanon... no clear authority, no clear responsibility... so no clear decision making and decision makers... University must be a tornado of thoughts, avant-garde people sharing their thoughts and experience with soon to be Avant-garde innovators, leaders, entrepreneurs, public figures...CITIZENS... It is a long way.. . I hope we are on it.`, sentiment: 'neutral' as const }
];

// --- Complete 100+ Question Database ---

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


// --- Summary Grouping & Bar Color Helpers ---

const SUMMARY_GROUPS: Record<string, { labels: string[]; indices: number[][] }> = {
  satisfaction: {
    labels: ['SATISFIED', 'NEUTRAL', 'NOT SAT.'],
    indices: [[0, 1], [2], [3, 4]]
  },
  frequency: {
    labels: ['OFTEN', 'SOMETIMES', 'RARELY'],
    indices: [[0, 1], [2], [3, 4]]
  },
  likelihood: {
    labels: ['LIKELY', 'NEUTRAL', 'UNLIKELY'],
    indices: [[0, 1], [2], [3, 4]]
  },
  extent: {
    labels: ['GREAT', 'SOME', 'NOT AT ALL'],
    indices: [[0], [1], [2]]
  },
  yesno: {
    labels: ['YES', 'NO'],
    indices: [[0], [1]]
  },
  workload_rating: {
    labels: ['RIGHT', 'HEAVY', 'LIGHT'],
    indices: [[0], [1, 2], [3]]
  },
  workload_hours: {
    labels: ['40-50h', '25-35h', '10-20h'],
    indices: [[2], [1], [0]]
  }
};

const getBarColor = (index: number, scaleType: string, questionText?: string) => {
  if (questionText === 'Marital Status') {
    if (index === 0) return '#2563eb'; // Married -> Blue
    if (index === 1) return '#10b981'; // Single -> Green
    if (index === 2) return '#ef4444'; // Divorced -> Red
  }
  if (scaleType === 'pie' || scaleType === 'bar') {
    // Demographics: vibrant distinct colors
    const palette = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
    return palette[index % palette.length];
  }
  if (scaleType === 'yesno') {
    return COLORS.yesno[index % COLORS.yesno.length];
  }
  if (scaleType === 'extent') {
    return COLORS.extent[index % COLORS.extent.length];
  }

  // 5-item scales: first 2 green, middle gray, last 2 red
  return COLORS.positive[index % COLORS.positive.length];
};

const getSummaryColors = (groupIndex: number, totalGroups: number) => {
  if (totalGroups === 2) {
    return groupIndex === 0
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-red-50 text-red-700 border-red-200';
  }
  if (groupIndex === 0) return 'bg-green-50 text-green-700 border-green-200';
  if (groupIndex === totalGroups - 1) return 'bg-red-50 text-red-700 border-red-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
};

// --- Visualizer Component for Individual Questions ---

const QuestionCard = ({ question, index }: { question: any; index: number }) => {
  const chartData = useMemo(() => {
    const baseData = question.data || generateData(question.type, question.sentiment);
    return baseData.map((item: any) => ({
      ...item,
      faculties: item.faculties || generateFacultyBreakdown(item.count)
    }));
  }, [question]);

  const total = useMemo(() => chartData.reduce((sum: number, item: any) => sum + item.count, 0), [chartData]);

  const scaleType = question.type as string;
  const summaryType = question.summaryType;

  // Determine summary configuration: Explicit or default based on scaleType
  let summaryGroup = SUMMARY_GROUPS[summaryType] || SUMMARY_GROUPS[scaleType];

  // Dynamic summary generation for nominal data (demographics)
  if (!summaryGroup && (summaryType === 'nominal_all' || summaryType === 'nominal_top3')) {
    // Sort by count descending to find top items
    const sortedIndices = chartData
      .map((item: any, idx: number) => ({ count: item.count, idx }))
      .sort((a: any, b: any) => b.count - a.count);

    // Determine how many items to show
    const countToShow = summaryType === 'nominal_all' ? chartData.length : 3;
    const topIndices = sortedIndices.slice(0, countToShow);

    summaryGroup = {
      labels: topIndices.map((item: any) => chartData[item.idx].name.toUpperCase()),
      indices: topIndices.map((item: any) => [item.idx])
    };
  }

  const hasSummary = !!summaryGroup;
  const maxCount = Math.max(...chartData.map((d: any) => d.count));

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col w-full">
      {/* Title */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center shrink-0 w-7 h-7 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
            {index + 1}
          </span>
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide leading-tight">
            {question.text}
          </h3>
        </div>
        <Info size={16} className="text-slate-400 shrink-0 ml-2" />
      </div>

      {/* Summary Row */}
      {hasSummary && (
        <div className={`grid gap-2 mb-5 ${summaryGroup.labels.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
          {summaryGroup.labels.map((label, gi) => {
            const groupCount = summaryGroup.indices[gi].reduce((sum, idx) => sum + (chartData[idx]?.count || 0), 0);
            const pct = total > 0 ? Math.round((groupCount / total) * 100) : 0;
            return (
              <div
                key={label}
                className={`border rounded-lg py-2.5 px-3 text-center ${getSummaryColors(gi, summaryGroup.labels.length)}`}
              >
                <div className="text-[10px] font-bold tracking-wider mb-0.5">{label}</div>
                <div className="text-lg font-extrabold">{groupCount} <span className="text-xs font-semibold opacity-70">({pct}%)</span></div>
              </div>
            );
          })}
        </div>
      )}

      {/* Response Breakdown */}
      <div>
        <p className="text-sm font-semibold text-slate-600 mb-3">
          Response Breakdown <span className="text-slate-400 font-normal">(Total: {total})</span>
        </p>
        <div className="space-y-2.5">
          {chartData.map((item: any, i: number) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            const barWidth = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
            const color = getBarColor(i, scaleType, question.text);
            return (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">{item.name}</span>
                  <span className="text-sm font-semibold text-slate-600">{item.count} ({pct}%)</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5">
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${barWidth}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};


// --- Special Comments View Component ---
const SENTIMENT_STYLES = {
  positive: { bg: 'bg-green-50 border-green-200', tag: 'bg-green-100 text-green-700', label: 'Positive' },
  negative: { bg: 'bg-red-50 border-red-200', tag: 'bg-red-100 text-red-700', label: 'Negative' },
  neutral: { bg: 'bg-slate-50 border-slate-200', tag: 'bg-amber-100 text-amber-700', label: 'Neutral' }
};

const CommentsDashboard = () => {
  const counts = useMemo(() => {
    const c = { positive: 0, negative: 0, neutral: 0 };
    surveyComments.forEach(comment => { c[comment.sentiment]++; });
    return c;
  }, []);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
          <Quote className="text-blue-500 shrink-0" size={28} />
          <div>
            <p className="text-2xl font-extrabold text-slate-800">{surveyComments.length}</p>
            <p className="text-slate-500 text-xs">Total Responses</p>
          </div>
        </div>
        <div className="bg-green-50 p-5 rounded-2xl shadow-sm border border-green-200 flex items-center gap-4">
          <ThumbsUp className="text-green-600 shrink-0" size={24} />
          <div>
            <p className="text-2xl font-extrabold text-green-700">{counts.positive}</p>
            <p className="text-green-600 text-xs">Positive</p>
          </div>
        </div>
        <div className="bg-amber-50 p-5 rounded-2xl shadow-sm border border-amber-200 flex items-center gap-4">
          <Minus className="text-amber-600 shrink-0" size={24} />
          <div>
            <p className="text-2xl font-extrabold text-amber-700">{counts.neutral}</p>
            <p className="text-amber-600 text-xs">Neutral / Mixed</p>
          </div>
        </div>
        <div className="bg-red-50 p-5 rounded-2xl shadow-sm border border-red-200 flex items-center gap-4">
          <ThumbsDown className="text-red-600 shrink-0" size={24} />
          <div>
            <p className="text-2xl font-extrabold text-red-700">{counts.negative}</p>
            <p className="text-red-600 text-xs">Negative</p>
          </div>
        </div>
      </div>

      {/* All Comments Feed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {surveyComments.map((comment) => {
          const style = SENTIMENT_STYLES[comment.sentiment];
          return (
            <div key={comment.id} className={`p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${style.bg}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">
                  #{comment.id}
                </span>
                <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${style.tag}`}>
                  {style.label}
                </span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed italic">"{comment.text}"</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// --- Main Dashboard Application ---

// --- Login Page Component ---
const LoginPage = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '356687') {
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans">
      <div className="w-full max-w-sm mx-4">
        <div className="text-center mb-8">
          <img src={BalamandLogo} alt="UOB" className="w-20 h-20 rounded-full object-contain bg-white p-1 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white">Provost Office</h1>
          <p className="text-slate-400 text-sm mt-1">Faculty Survey Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={20} className="text-slate-400" />
            <h2 className="text-lg font-bold text-slate-800">Secure Access</h2>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter access code"
                className={`w-full px-4 py-3 rounded-lg border text-sm outline-none transition-colors ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 focus:border-blue-500'
                  }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-xs mt-2 font-medium">Incorrect password. Please try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold text-sm hover:bg-slate-800 transition-colors"
          >
            Access Dashboard
          </button>

          <p className="text-center text-xs text-slate-400 mt-4">CONFIDENTIAL — 2025-2026 Academic Year</p>
        </form>
      </div>
    </div>
  );
};


export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTabId, setActiveTabId] = useState('demographics');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const activeCategory = useMemo(() =>
    surveyCategories.find(c => c.id === activeTabId)!,
    [activeTabId]);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900 flex flex-col overflow-hidden">

      {/* Top Header Bar */}
      <header className="bg-slate-900 text-white shrink-0 z-20">
        <div className="flex items-center justify-between px-6 py-3">
          {/* Left: Logo + Title */}
          <div className="flex items-center gap-4">
            <img src={BalamandLogo} alt="UOB" className="w-10 h-10 rounded-full object-contain bg-white p-0.5" />
            <div>
              <h1 className="text-lg font-bold leading-tight">Provost Office</h1>
              <p className="text-slate-400 text-xs">Faculty Survey Comprehensive Dashboard</p>
            </div>
          </div>

          {/* Right: Logout + Confidential */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsAuthenticated(false)}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm"
            >
              Logout <LogOut size={16} />
            </button>
            <div className="text-right">
              <p className="text-xs font-bold tracking-wider">CONFIDENTIAL</p>
              <p className="text-slate-400 text-xs">2025 - 2026 Academic Year</p>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-6 px-6 py-2 border-t border-slate-800 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            Total
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            150 Respondents
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            62 Comments
          </span>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

        {/* Sidebar Navigation */}
        <aside
          className={`bg-white border-r border-slate-200 shrink-0 md:h-full flex flex-col z-10 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 ${isSidebarCollapsed ? 'w-full md:w-20' : 'w-full md:w-72'}`}
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
        <main className="flex-1 overflow-y-auto bg-slate-50 relative w-full">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {activeCategory.questions.map((q, idx) => (
                  <QuestionCard key={`${activeCategory.id}-${idx}`} question={q} index={idx} />
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
