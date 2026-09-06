import type { Resource } from '../types';

export const resourcesData: Resource[] = [
  {
    id: 'res-1',
    title: 'UGC NET Home Science (Code 12) 5-Branch Master Mindmap & Formula Book',
    category: 'Home Science',
    type: 'Mindmap',
    fileSize: '8.4 MB',
    pageCount: 52,
    downloadCount: '21,400+ Downloads',
    isPopular: true,
    description: 'Complete high-yield revision capsule covering all 5 branches: Food & Nutrition, Textiles, Resource Management, Human Development & Extension Education.',
    topicsCovered: [
      'RDA 2020 Nutritional Nutrient Requirements Table',
      'Textile Fibers, Weaving & Chemical Finishing Comparison Matrix',
      'Human Development Lifespan Stages & Developmental Milestones',
      'Extension Education Models, PRA Tools & SHG Frameworks'
    ],
    previewSnippet: 'RDA 2020 Reference: Reference Man (65 kg) & Reference Woman (55 kg). Moderate work energy requirement for adult woman = 2130 kcal/day, Protein = 46 g/day (0.83 g/kg/day). ICMR-NIN 2020 latest guidelines.'
  },
  {
    id: 'res-2',
    title: 'Research Methodology & SPSS Statistical Tests Decision Tree',
    category: 'Research Methodology',
    type: 'Formula Sheet',
    fileSize: '4.6 MB',
    pageCount: 34,
    downloadCount: '19,800+ Downloads',
    isPopular: true,
    description: 'Visual step-by-step flowchart to choose between t-test, ANOVA, Chi-Square, Pearson r, Mann-Whitney U, and Regression in SPSS with APA 7th reporting.',
    topicsCovered: [
      'Parametric vs Non-Parametric Test Selection Matrix',
      'SPSS Output Interpretation: p-value, F-ratio, t-value, Effect Size',
      'Formulating Null (H0) vs Alternative (H1) Hypotheses',
      'UGC Plagiarism Regulations 2018 (Levels 0-3 Penalties)'
    ],
    previewSnippet: 'SPSS Decision Rule: If p-value (Sig. 2-tailed) < 0.05, reject the Null Hypothesis (H0) and conclude a statistically significant difference/relationship exists between the study groups at 95% confidence level.'
  },
  {
    id: 'res-3',
    title: 'Child / Human Development & Pedagogy (CDP) 100 Theorists Mindmap',
    category: 'CDP & Pedagogy',
    type: 'PDF Notes',
    fileSize: '6.2 MB',
    pageCount: 30,
    downloadCount: '26,500+ Downloads',
    isPopular: true,
    description: 'Visual color-coded mindmaps for Piaget’s 4 stages, Vygotsky’s ZPD & Scaffolding, Kohlberg’s moral stages, Erikson’s psychosocial crises, and RPWD Act 2016.',
    topicsCovered: [
      'Piagetian concepts: Assimilation, Accommodation, Schema, Conservation',
      'Vygotsky Socio-Cultural Theory vs Piaget Comparative Table',
      'Howard Gardner 8 Multiple Intelligences with classroom applications',
      'RPWD Act 2016 (21 Disability Conditions & Pedagogical Adaptations)'
    ],
    previewSnippet: 'Vygotsky\'s Zone of Proximal Development (ZPD): The distance between the actual developmental level determined by independent problem solving and the potential developmental level achieved under adult guidance or with more capable peers (MKO).'
  },
  {
    id: 'res-4',
    title: 'UGC NET Paper 1 Solved PYQ Compilation (2020-2024)',
    category: 'Paper 1 General',
    type: 'PYQ Solved',
    fileSize: '12.4 MB',
    pageCount: 140,
    downloadCount: '28,200+ Downloads',
    isPopular: true,
    description: 'Unit-wise sorted Previous Year Questions with step-by-step detailed explanations, option elimination rationale, and trend analysis for upcoming NTA CBT exams.',
    topicsCovered: [
      'Unit 1 Teaching Aptitude (120+ Solved PYQs)',
      'Unit 2 Research Aptitude (110+ Solved PYQs)',
      'Unit 6 Logical Reasoning & Indian Logic (100+ Solved PYQs)',
      'Unit 9 People & Environment (85+ Solved PYQs)'
    ],
    previewSnippet: 'Question: In the Classical Square of Opposition, if statement "All swans are white" (A) is true, what is the truth value of "Some swans are not white" (O)? Answer: Contradictory proposition — therefore "O" is definitely FALSE.'
  },
  {
    id: 'res-5',
    title: 'Food Science & Therapeutic Nutrition Clinical Diets Handbook',
    category: 'Nutrition & Health',
    type: 'E-Book',
    fileSize: '7.8 MB',
    pageCount: 48,
    downloadCount: '14,300+ Downloads',
    isPopular: false,
    description: 'In-depth nutritional manual covering Dietary Management of Diabetes, Hypertension, Renal diseases, Maternal Nutrition programs & POSHAN 2.0 metrics.',
    topicsCovered: [
      'Glycemic Index & Glycemic Load of Indian Foods Table',
      'Dietary Modifications for Renal & Cardiovascular Patients',
      'Assessment of Nutritional Status (Anthropometry, Biochemical, ABCD)',
      'National Nutrition Programs (ICDS, Mid-Day Meal, PMMVY, Anemia Mukt Bharat)'
    ],
    previewSnippet: 'Therapeutic Diet for Chronic Kidney Disease (CKD): Protein intake restricted to 0.6-0.8 g/kg body weight with high biological value (HBV) proteins, alongside controlled Potassium and Phosphorus levels.'
  },
  {
    id: 'res-6',
    title: 'Self-Help Groups (SHGs) & Extension Education Field Guide',
    category: 'Extension & Women Studies',
    type: 'Field Guide',
    fileSize: '5.2 MB',
    pageCount: 36,
    downloadCount: '11,100+ Downloads',
    isPopular: false,
    description: 'Key insights from Dr. Ankita Bisht’s published book on Self-Help Groups in Uttarakhand, Women Empowerment, PRA Tools, and Rural Development Schemes.',
    topicsCovered: [
      'Structure, Functioning & Microfinance of SHGs in India',
      'Participatory Rural Appraisal (PRA) Techniques & Mapping',
      'Audio-Visual Media Classification & Communication Models',
      'DAY-NRLM, PMKVY, and Rural Women Entrepreneurship Models'
    ],
    previewSnippet: 'Self-Help Groups (SHGs): Affinity-based homogenous groups of 10-20 rural women practicing voluntary small savings, internal lending, and collective decision making for sustainable socio-economic empowerment.'
  }
];
