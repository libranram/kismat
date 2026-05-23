// Business Chemistry mapping to elemental archetypes

export const archetypes = {
  Pioneer: {
    name: "The Strategic Visionary",
    code: "PNR-F",
    color: "#E63946", // Fiery red
    element: "Fire",
    summary: "The Strategic Visionary operates with high agency and velocity. Driven by big-picture innovation, they naturally challenge the status quo and push boundaries. They thrive in dynamic environments where rapid ideation and decisive action are prized over meticulous operational detail.",
    themes: [
      "**Strategic Execution**: Moves quickly from concept to prototype, preferring to iterate in motion rather than over-analyzing upfront.",
      "**Intent-Based Leadership**: Empowers teams by setting a clear, bold vision, trusting others to manage the tactical details.",
      "**Risk Tolerance**: Highly comfortable navigating ambiguity and processing abstract concepts under pressure."
    ],
    collaboration: {
      communicate: [
        "Focus on the 'why' and the future impact before diving into the 'how'.",
        "Keep updates high-level, concise, and focused on momentum and roadblocks."
      ],
      environment: "Requires a fast-paced, unrestrictive culture that champions bold ideas and tolerates calculated risk-taking.",
      blindSpots: [
        "May move too quickly into execution before aligning all stakeholders.",
        "Can become frustrated by bureaucratic processes or overly rigid frameworks."
      ]
    },
    partners: ["Guardian", "Integrator"]
  },
  Guardian: {
    name: "The Operations Stabilizer",
    code: "GRD-E",
    color: "#2A9D8F", // Earthy green
    element: "Earth",
    summary: "The Operations Stabilizer excels at creating order from chaos. They rely on structured frameworks, proven methodologies, and rigorous attention to detail. Motivated by stability and quality assurance, they are the architectural bedrock of high-performing, reliable teams.",
    themes: [
      "**Systems Thinking**: Approaches tasks by building scalable processes and ensuring strict adherence to quality standards.",
      "**Structured Leadership**: Manages teams through clear expectations, well-defined workflows, and consistent feedback loops.",
      "**Analytical Rigor**: Excels at processing detailed operational data and identifying systemic inefficiencies."
    ],
    collaboration: {
      communicate: [
        "Provide detailed, structured data and historical context for any proposed changes.",
        "Avoid ambiguous or overly optimistic projections; be grounded in reality."
      ],
      environment: "Thrives in a highly organized, predictable environment that values thoroughness, accuracy, and process integrity.",
      blindSpots: [
        "Might struggle with sudden pivots without clear, logical rationale.",
        "Can experience analysis paralysis if required to act on incomplete information."
      ]
    },
    partners: ["Pioneer", "Driver"]
  },
  Driver: {
    name: "The Analytical Architect",
    code: "DRV-A",
    color: "#457B9D", // Airy blue
    element: "Air",
    summary: "The Analytical Architect is intensely focused on logic, intellectual challenge, and objective problem-solving. They dissect complex systems with precision and drive towards the most efficient, data-backed solutions. They are decisive, independent, and intellectually rigorous.",
    themes: [
      "**Data-Driven Execution**: Relies heavily on empirical evidence and logic to drive decision-making and task prioritization.",
      "**Meritocratic Leadership**: Leads by intellectual example, valuing competence, efficiency, and sharp debate.",
      "**Complex Problem-Solving**: Effortlessly processes complex, multi-variable problems to find optimal solutions."
    ],
    collaboration: {
      communicate: [
        "Be direct and come with data-backed solutions; avoid emotional appeals.",
        "Challenge their ideas with logic and evidence to earn their respect."
      ],
      environment: "Flourishes in intellectually stimulating, fast-paced environments where competence and logic outweigh hierarchy.",
      blindSpots: [
        "May overlook the emotional or cultural impact of their decisions on the wider team.",
        "Can appear overly critical or blunt in the pursuit of the most logical outcome."
      ]
    },
    partners: ["Integrator", "Guardian"]
  },
  Integrator: {
    name: "The Harmonizing Catalyst",
    code: "INT-W",
    color: "#F4A261", // Warm/watery orange-gold
    element: "Water",
    summary: "The Harmonizing Catalyst operates with profound emotional intelligence and relationship-building acumen. They excel at bridging gaps, resolving conflict, and fostering cross-functional collaboration. They are deeply empathetic, intuitive, and driven by team cohesion.",
    themes: [
      "**Collaborative Execution**: Achieves goals by aligning stakeholders and building consensus across diverse teams.",
      "**Empathetic Leadership**: Leads through emotional intelligence, focusing on team morale, culture, and individual development.",
      "**Nuanced Problem-Solving**: Navigates complex interpersonal dynamics to resolve friction and build sustainable alliances."
    ],
    collaboration: {
      communicate: [
        "Frame goals in terms of team impact and cultural alignment.",
        "Engage in active dialogue and allow time to process the human element of decisions."
      ],
      environment: "Requires a highly collaborative, psychologically safe environment that prioritizes strong relationships and mutual support.",
      blindSpots: [
        "May avoid necessary conflict or delay tough decisions to preserve harmony.",
        "Can become emotionally drained in overly transactional or purely analytical environments."
      ]
    },
    partners: ["Driver", "Pioneer"]
  }
};
