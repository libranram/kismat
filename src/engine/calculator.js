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

  // Use a fully unique date string including year, zero-padded month, and day
  const yyyy = targetDate.getUTCFullYear();
  const mm = String(targetDate.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(targetDate.getUTCDate()).padStart(2, '0');
  const dateString = `${yyyy}-${mm}-${dd}-${archetypeKey}`;
  
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    hash = dateString.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  // --- Compute today's planetary environment first ---
  const currentObserver = new Observer(0, 0, 0);
  const currentKundli = getKundli(targetDate, currentObserver);
  const currentPanchangam = getPanchangamDetails(targetDate, currentObserver);
  
  const currentRashi = currentKundli.planets.Moon.rashiName;
  const nIndex = typeof currentPanchangam.nakshatra === 'object' ? currentPanchangam.nakshatra.index : currentPanchangam.nakshatra;
  const currentNakshatra = nakshatraNames[nIndex];

  // Map today's Moon Rashi to its element for contextual characterization
  const rashiElementMap = {
    Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
    Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
    Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
    Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
  };
  const dayElement = rashiElementMap[currentRashi] || 'Fire';

  // Planetary influence note — contextual to the day's Moon Rashi
  const rashiInfluenceMap = {
    Aries:       "Moon in Aries ignites bold initiative. Channel this assertive energy into decisive leadership moments.",
    Taurus:      "Moon in Taurus anchors the day in patience and practicality. Favor steady, tangible progress over rapid pivots.",
    Gemini:      "Moon in Gemini sharpens mental agility. Leverage this for networking, negotiations, and communication-heavy tasks.",
    Cancer:      "Moon in Cancer heightens emotional awareness. Attend carefully to team dynamics and interpersonal relationships.",
    Leo:         "Moon in Leo amplifies confidence and creative expression. Step forward as a visible leader and inspire those around you.",
    Virgo:       "Moon in Virgo favors meticulous review and refinement. Ideal for quality audits, detailed analysis, and process improvement.",
    Libra:       "Moon in Libra drives harmonious collaboration. Focus on consensus-building, diplomacy, and balanced decision-making.",
    Scorpio:     "Moon in Scorpio deepens focus and strategic intuition. Tackle complex, hidden challenges that require penetrating insight.",
    Sagittarius: "Moon in Sagittarius expands the horizon. Ideal for strategic planning, big-picture thinking, and inspiring the wider team.",
    Capricorn:   "Moon in Capricorn reinforces discipline and ambition. Push toward long-term goals and demonstrate executive accountability.",
    Aquarius:    "Moon in Aquarius sparks original thinking. Innovate, challenge conventions, and seek solutions that break the mold.",
    Pisces:      "Moon in Pisces enhances empathy and creative intuition. Rely on your instincts and foster a supportive, open environment."
  };
  const planetaryInfluence = rashiInfluenceMap[currentRashi] || `The Moon transits ${currentRashi} today — align your actions with its elemental energy.`;

  // Element-archetype alignment characterization
  const archetypeElement = { Pioneer: 'Fire', Guardian: 'Earth', Driver: 'Air', Integrator: 'Water' };
  const myElement = archetypeElement[archetypeKey] || 'Fire';

  const alignmentNoteMap = {
    same: "Your elemental energy aligns strongly with today's planetary environment — a high-resonance day for maximum impact.",
    complementary: "Today's planetary energy complements your nature — expect smooth flow and productive cross-functional momentum.",
    challenging: "Today's planetary field creates constructive friction with your archetype. Use this tension to stretch beyond your comfort zone."
  };

  const complementaryPairs = {
    Fire: ['Air'],
    Air: ['Fire'],
    Earth: ['Water'],
    Water: ['Earth']
  };

  let alignmentType = 'challenging';
  if (dayElement === myElement) alignmentType = 'same';
  else if ((complementaryPairs[myElement] || []).includes(dayElement)) alignmentType = 'complementary';
  const alignmentNote = alignmentNoteMap[alignmentType];

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

  // Strategies enriched with Nakshatra-specific tone variations
  const strategies = [
    "Prioritize high-leverage asynchronous tasks before noon. Protect your calendar from ad-hoc meetings.",
    "Focus on cross-functional alignment today. Stakeholder buy-in will be more critical than individual execution.",
    "A chaotic operational environment requires your grounding. Implement structured frameworks to resolve today's key bottleneck.",
    "Deploy your energy towards macro-level vision planning. Delegate tactical execution to preserve cognitive bandwidth.",
    "Data-driven decision making is your best asset today. Question assumptions and demand empirical evidence before committing.",
    "Emotional intelligence will unlock a critical negotiation today. Read the room and adapt your communication style.",
    "Channel today's lunar energy into relationship-building. Reach out to dormant stakeholders and reactivate key alliances.",
    "Consolidate unfinished initiatives. The planetary climate today rewards completion over initiation — wrap up open loops."
  ];

  const behaviorStrategies = {
    Pioneer: [
      "Act as the catalyst for speed. Encourage team members to make decisions quickly and pivot if assumptions fail.",
      "Lead brainstorming sessions with optimism. Do not let operational constraints restrict your team's creative horizon.",
      "Speak with bold agency today. Share your visionary outline early in meetings to set the pace for others.",
      "Focus on dynamic delegating. Assign tactical tasks to detail-oriented partners so you can clear larger roadblocks.",
      "Challenge a long-held assumption in your current project. Today's energy supports disruptive, original thinking.",
      "Pursue one high-risk, high-reward conversation. Your archetype thrives when it pushes past comfortable boundaries."
    ],
    Guardian: [
      "Serve as the stabilizing anchor. Keep meetings focused on timelines, quality standards, and budget constraints.",
      "Document key agreements. Create structured notes and share action items immediately to align team execution.",
      "Conduct a thorough check of high-impact spreadsheets or code. Look for systemic inefficiencies and fix them.",
      "Be the voice of caution. Challenge overly optimistic plans with historical data and logical workflow limits.",
      "Build or review a risk register for your current project. Proactive risk mapping is your competitive advantage today.",
      "Formalize an informal process that has been running on assumptions. Structure creates the repeatability your team needs."
    ],
    Driver: [
      "Demand empirical data in discussions. Cut through subjective arguments and prioritize logic over consensus.",
      "Solve a complex technical bottleneck. Devote uninterrupted hours to deep analytical work.",
      "Be direct and goal-oriented. Keep communications concise and challenge the team to justify resource allocation.",
      "Prioritize high-ROI decisions. Terminate redundant workflows or low-value alignments to speed up project velocity.",
      "Model a scenario analysis for a pending decision. Today's planetary clarity supports sharp, multi-variable thinking.",
      "Redesign one broken workflow end-to-end. Your analytical eye will spot the systemic root cause others have missed."
    ],
    Integrator: [
      "Leverage empathy to heal project friction. Connect individually with partners to ensure psychological safety.",
      "Lead through consensus-building. Ensure everyone's perspective is heard and integrated into the daily roadmap.",
      "Address team morale directly. Celebrate micro-wins and reinforce the human purpose behind your project.",
      "Facilitate open dialogue. Break down organizational silos by establishing direct communication channels.",
      "Identify one person on your team who feels unheard and create deliberate space for their perspective today.",
      "Design a team ritual — even a brief one — that reinforces shared purpose and elevates collective energy."
    ]
  };

  const healthTips = {
    Pioneer: [
      "Protect your physical stamina: Take a brisk 10-minute walk after lunch to reset your mental baseline.",
      "Unwind your high-octane energy: Dedicate 5 minutes to deep breathing exercises before a high-stakes call.",
      "High physical activation today: Swap your afternoon espresso for green tea to prevent late-day energy crashes.",
      "Focus on ergonomic posture: Set a reminder to roll your shoulders and stretch your wrists every 90 minutes."
    ],
    Guardian: [
      "Combat sedentary fatigue: Stand and do light stretching during your routine status meetings.",
      "Alleviate eye strain: Practice the 20-20-20 rule—every 20 minutes, look at something 20 feet away for 20 seconds.",
      "Ground your nervous system: Step away from all screens during your lunch break to enjoy mindful eating.",
      "Recharge your focus: Take a micro-break every hour to stretch your back and hydrate."
    ],
    Driver: [
      "Prevent burnout: Schedule a hard stop for your workday and wind down with non-screen activity.",
      "Release physical tension: Focus on relaxing your jaw and shoulders, which hold most of your execution stress.",
      "Sustain cognitive performance: Drink a glass of water for every hour of deep analytical work.",
      "Boost circulatory health: Take 5 minutes to do light leg stretches or walk in place between project sprints."
    ],
    Integrator: [
      "Replenish social energy: Plan 15 minutes of quiet solitude or a walk in nature to recharge.",
      "Establish energetic boundaries: Practice a brief mindfulness check-in before entering team discussions.",
      "Nurture physical wellness: Step outside to get natural sunlight for at least 10 minutes in the morning.",
      "Reduce cognitive overload: Take short, silent breathing pauses between high-empathy meetings."
    ]
  };

  const funnyTips = {
    Pioneer: [
      "Challenge: Try to explain your next big idea using only sound effects and hand gestures to yourself first.",
      "Joy tip: High-five the next green plant you see to congratulate it on its excellent oxygen production.",
      "Playful action: Sketch a quick caricature of your main project blocker as a cartoon villain.",
      "Life hack: Sing your project status report to the tune of your favorite pop song in the shower."
    ],
    Guardian: [
      "Challenge: Organize your desk drawer by color, then mess it up slightly to build emotional resilience.",
      "Joy tip: Wear mismatched socks tomorrow as a secret, silent rebellion against corporate uniformity.",
      "Playful action: Give your favorite office chair a formal performance review.",
      "Life hack: Make a spreadsheet tracking the number of times someone says 'circle back' or 'synergy' today."
    ],
    Driver: [
      "Challenge: Write a draft email entirely in emojis, laugh at it, and then delete it forever.",
      "Joy tip: Celebrate a successful spreadsheet formula with a 5-second victory dance.",
      "Playful action: Name your primary computer screen 'The Oracle' and consult it with dramatic bowing.",
      "Life hack: Read your next action item out loud in a dramatic movie trailer voice."
    ],
    Integrator: [
      "Challenge: Draw a tiny smiley face on your thumb and look at it when someone goes off-topic in a meeting.",
      "Joy tip: Dedicate 20 seconds to making a ridiculous face in the mirror to reset your emotional energy.",
      "Playful action: Start a rumor in your head that your office plant is plotting a friendly takeover.",
      "Life hack: Send a mental high-five to a coworker you haven't spoken to in a while."
    ]
  };

  const luckyNumber = (hash % 9) + 1; // 1-9
  const luckyColor = colors[hash % colors.length];
  const strategy = strategies[hash % strategies.length];
  
  const behaviors = behaviorStrategies[archetypeKey] || behaviorStrategies.Pioneer;
  const behaviorAdvice = behaviors[hash % behaviors.length];
  
  const dressAdvice = dressAdviceMap[luckyColor] || "Wear professional attire in comfortable colors.";

  const healthTipList = healthTips[archetypeKey] || healthTips.Pioneer;
  const healthTip = healthTipList[hash % healthTipList.length];

  const funnyTipList = funnyTips[archetypeKey] || funnyTips.Pioneer;
  const funnyTip = funnyTipList[hash % funnyTipList.length];

  return {
    date: targetDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
    dayOfWeek: getDayOfWeek(targetDate),
    rashi: currentRashi,
    nakshatra: currentNakshatra,
    dayElement,
    planetaryInfluence,
    alignmentNote,
    alignmentType,
    luckyNumber,
    luckyColor,
    dressAdvice,
    strategy,
    behavior: behaviorAdvice,
    healthTip,
    funnyTip
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
