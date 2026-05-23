import { archetypes } from './archetypes';
import { Observer, getKundli, getPanchangamDetails, nakshatraNames } from '@ishubhamx/panchangam-js';

// Get coordinates based on a simple city match, or fallback to GMT
const getCoordinates = (locationStr) => {
  const loc = locationStr.toLowerCase();
  if (loc.includes('new york')) return new Observer(40.7128, -74.0060, 0);
  if (loc.includes('london')) return new Observer(51.5074, -0.1278, 0);
  if (loc.includes('tokyo')) return new Observer(35.6762, 139.6503, 0);
  if (loc.includes('sydney')) return new Observer(-33.8688, 151.2093, 0);
  if (loc.includes('paris')) return new Observer(48.8566, 2.3522, 0);
  if (loc.includes('mumbai')) return new Observer(19.0760, 72.8777, 0);
  if (loc.includes('delhi')) return new Observer(28.7041, 77.1025, 0);
  if (loc.includes('los angeles') || loc.includes('la')) return new Observer(34.0522, -118.2437, 0);
  return new Observer(0, 0, 0);
};

const getDayOfWeek = (dateObj) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dateObj.getUTCDay()];
};

export const generateInitialAstrology = (dateStr, timeStr, locationStr) => {
  if (!dateStr) return null;
  
  const datetimeStr = `${dateStr}T${timeStr}:00.000Z`;
  const dateObj = new Date(datetimeStr);
  const observer = getCoordinates(locationStr);
  
  const kundli = getKundli(dateObj, observer);
  const panchangam = getPanchangamDetails(dateObj, observer);
  
  const moonRashi = kundli.planets.Moon.rashiName;
  const sunRashi = kundli.planets.Sun.rashiName;
  const sunDegree = kundli.planets.Sun.longitude.toFixed(2);
  const moonDegree = kundli.planets.Moon.longitude.toFixed(2);
  
  const nakshatraIndex = typeof panchangam.nakshatra === 'object' ? panchangam.nakshatra.index : panchangam.nakshatra;
  const nakshatraName = nakshatraNames[nakshatraIndex];

  return {
    dayOfWeek: getDayOfWeek(dateObj),
    rashi: moonRashi,
    nakshatra: nakshatraName,
    sunLocation: `${sunDegree}° (${sunRashi})`,
    moonLocation: `${moonDegree}° (${moonRashi})`,
    fullDateObj: dateObj
  };
};

export const generateCorporateProfile = (rashi) => {
  // Map Rashi back to Element, then to Corporate Archetype
  // Fire: Aries, Leo, Sagittarius
  // Earth: Taurus, Virgo, Capricorn
  // Air: Gemini, Libra, Aquarius
  // Water: Cancer, Scorpio, Pisces
  
  let element = 'Fire';
  if (['Aries', 'Leo', 'Sagittarius'].includes(rashi)) element = 'Fire';
  if (['Taurus', 'Virgo', 'Capricorn'].includes(rashi)) element = 'Earth';
  if (['Gemini', 'Libra', 'Aquarius'].includes(rashi)) element = 'Air';
  if (['Cancer', 'Scorpio', 'Pisces'].includes(rashi)) element = 'Water';
  
  let archetypeKey = 'Pioneer';
  if (element === 'Fire') archetypeKey = 'Pioneer';
  if (element === 'Earth') archetypeKey = 'Guardian';
  if (element === 'Air') archetypeKey = 'Driver';
  if (element === 'Water') archetypeKey = 'Integrator';

  return archetypes[archetypeKey];
};

export const generateCurrentDayDetails = (archetypeKey, targetDateInput = new Date()) => {
  const targetDate = typeof targetDateInput === 'string' ? new Date(targetDateInput) : targetDateInput;
  const dateString = `${targetDate.getUTCFullYear()}-${targetDate.getUTCMonth()}-${targetDate.getUTCDate()}-${archetypeKey}`;
  
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const colors = ["Navy Blue", "Charcoal Grey", "Emerald Green", "Crimson", "Onyx", "Sapphire", "Warm Terracotta", "Steel Blue"];
  
  const dressAdviceMap = {
    "Navy Blue": "Navy blue blazer or structured shirt. Projects professionalism, wisdom, and logical alignment.",
    "Charcoal Grey": "Charcoal suit or knit top. Signals grounded authority, reliability, and executive poise.",
    "Emerald Green": "Emerald green accents or shirt. Represents growth, visual balance, and composed energy.",
    "Crimson": "Crimson tie, dress, or sweater. Commands attention, showing courage, passion, and decisiveness.",
    "Onyx": "Sleek onyx/black trousers or blazer. Projects focus, structure, and protective boundaries.",
    "Sapphire": "Sapphire blue dress shirt or scarf. Enhances communication clarity, logic, and trusted leadership.",
    "Warm Terracotta": "Terracotta blazer or warm earth-toned top. Fosters collaboration, empathy, and visual warmth.",
    "Steel Blue": "Steel blue top or suit jacket. Promotes cool logic, task execution, and sharp problem-solving."
  };

  const strategies = [
    "Prioritize high-leverage asynchronous tasks before noon. Protect your calendar from ad-hoc meetings.",
    "Focus on cross-functional alignment today. Stakeholder buy-in will be more critical than individual execution.",
    "A chaotic operational environment requires your grounding. Implement structured frameworks to resolve today's key bottleneck.",
    "Deploy your energy towards macro-level vision planning. Delegate tactical execution to preserve cognitive bandwidth.",
    "Data-driven decision making is your best asset today. Question assumptions and demand empirical evidence before committing.",
    "Emotional intelligence will unlock a critical negotiation today. Read the room and adapt your communication style."
  ];

  const behaviorStrategies = {
    Pioneer: [
      "Act as the catalyst for speed. Encourage team members to make decisions quickly and pivot if assumptions fail.",
      "Lead brainstorming sessions with optimism. Do not let operational constraints restrict your team's creative horizon.",
      "Speak with bold agency today. Share your visionary outline early in meetings to set the pace for others.",
      "Focus on dynamic delegating. Assign tactical tasks to detail-oriented partners so you can clear larger roadblocks."
    ],
    Guardian: [
      "Serve as the stabilizing anchor. Keep meetings focused on timelines, quality standards, and budget constraints.",
      "Document key agreements. Create structured notes and share action items immediately to align team execution.",
      "Conduct a thorough check of high-impact spreadsheets or code. Look for systemic inefficiencies and fix them.",
      "Be the voice of caution. Challenge overly optimistic plans with historical data and logical workflow limits."
    ],
    Driver: [
      "Demand empirical data in discussions. Cut through subjective arguments and prioritize logic over consensus.",
      "Solve a complex technical bottleneck. Devote uninterrupted hours to deep analytical work.",
      "Be direct and goal-oriented. Keep communications concise and challenge the team to justify resource allocation.",
      "Prioritize high-ROI decisions. Terminate redundant workflows or low-value alignments to speed up project velocity."
    ],
    Integrator: [
      "Leverage empathy to heal project friction. Connect individually with partners to ensure psychological safety.",
      "Lead through consensus-building. Ensure everyone's perspective is heard and integrated into the daily roadmap.",
      "Address team morale directly. Celebrate micro-wins and reinforce the human purpose behind your project.",
      "Facilitate open dialogue. Break down organizational silos by establishing direct communication channels."
    ]
  };

  const luckyNumber = (hash % 9) + 1; // 1-9
  const luckyColor = colors[hash % colors.length];
  const strategy = strategies[hash % strategies.length];
  
  const behaviors = behaviorStrategies[archetypeKey] || behaviorStrategies.Pioneer;
  const behaviorAdvice = behaviors[hash % behaviors.length];
  
  const dressAdvice = dressAdviceMap[luckyColor] || "Wear professional attire in comfortable colors.";

  // We also generate current day Rashi/Nakshatra for targetDate
  const currentObserver = new Observer(0, 0, 0);
  const currentKundli = getKundli(targetDate, currentObserver);
  const currentPanchangam = getPanchangamDetails(targetDate, currentObserver);
  
  const currentRashi = currentKundli.planets.Moon.rashiName;
  const nIndex = typeof currentPanchangam.nakshatra === 'object' ? currentPanchangam.nakshatra.index : currentPanchangam.nakshatra;
  const currentNakshatra = nakshatraNames[nIndex];

  return {
    date: targetDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    dayOfWeek: getDayOfWeek(targetDate),
    rashi: currentRashi,
    nakshatra: currentNakshatra,
    luckyNumber,
    luckyColor,
    dressAdvice,
    strategy,
    behavior: behaviorAdvice
  };
};

export const generateFuturePlan = (archetypeKey) => {
  let plan1Day = "";
  let plan30Days = "";
  
  if (archetypeKey === 'Pioneer') {
    plan1Day = "Tomorrow's Objective: Validate one high-risk assumption. Launch a prototype or draft a bold proposal and solicit immediate feedback.";
    plan30Days = "30-Day Trajectory: Focus on '0-to-1' creation. Phase out of legacy maintenance. Identify a stagnant process and completely reinvent it by the end of the month.";
  } else if (archetypeKey === 'Guardian') {
    plan1Day = "Tomorrow's Objective: Audit and optimize your immediate workflow. Find one recurring friction point and implement a standard operating procedure to eliminate it.";
    plan30Days = "30-Day Trajectory: Focus on 'Risk Mitigation and Scale'. Review team operations for vulnerabilities. Standardize core processes to ensure the team can scale without quality degradation.";
  } else if (archetypeKey === 'Driver') {
    plan1Day = "Tomorrow's Objective: Aggressively clear operational blockers. Use data to shut down a low-value initiative or redirect resources to a high-yield project.";
    plan30Days = "30-Day Trajectory: Focus on 'System Optimization'. Conduct a rigorous ROI analysis of your department's tech stack or workflow. Propose a data-backed restructuring to management.";
  } else if (archetypeKey === 'Integrator') {
    plan1Day = "Tomorrow's Objective: Mend a fractured communication loop. Schedule a 1-on-1 with a cross-functional partner where there has been recent friction.";
    plan30Days = "30-Day Trajectory: Focus on 'Cultural Cohesion'. Design and lead a workshop or initiative that breaks down silos and aligns disparate teams towards a unified goal.";
  }

  return {
    day1: plan1Day,
    day30: plan30Days
  };
};
