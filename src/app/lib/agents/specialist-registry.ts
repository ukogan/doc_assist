export interface SpecialistInfo {
  id: string;
  name: string;
  department: string;
  scope: string[];
  model: 'opus' | 'sonnet' | 'haiku';
  skillPath: string;
}

/**
 * Registry of all available specialists
 */
export const SPECIALIST_REGISTRY: Record<string, SpecialistInfo> = {
  // Internal Medicine
  cardiology: {
    id: 'cardiology',
    name: 'Cardiology',
    department: 'internal-medicine',
    scope: [
      'chest pain',
      'heart failure',
      'arrhythmias',
      'atrial fibrillation',
      'heart attack',
      'valve disease',
      'hypertension',
      'pacemaker',
      'coronary artery disease',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/cardiology.md',
  },
  pulmonology: {
    id: 'pulmonology',
    name: 'Pulmonology',
    department: 'internal-medicine',
    scope: [
      'shortness of breath',
      'COPD',
      'asthma',
      'pneumonia',
      'respiratory failure',
      'oxygen therapy',
      'ventilator',
      'lung disease',
      'cough',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/pulmonology.md',
  },
  gastroenterology: {
    id: 'gastroenterology',
    name: 'Gastroenterology',
    department: 'internal-medicine',
    scope: [
      'abdominal pain',
      'GI bleeding',
      'liver disease',
      'cirrhosis',
      'IBD',
      'Crohns',
      'ulcerative colitis',
      'reflux',
      'GERD',
      'pancreatitis',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/gastroenterology.md',
  },
  nephrology: {
    id: 'nephrology',
    name: 'Nephrology',
    department: 'internal-medicine',
    scope: [
      'kidney disease',
      'dialysis',
      'electrolyte disorders',
      'acute kidney injury',
      'chronic kidney disease',
      'creatinine',
      'GFR',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/nephrology.md',
  },
  endocrinology: {
    id: 'endocrinology',
    name: 'Endocrinology',
    department: 'internal-medicine',
    scope: [
      'diabetes',
      'thyroid',
      'blood sugar',
      'insulin',
      'adrenal',
      'pituitary',
      'osteoporosis',
      'hormone',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/endocrinology.md',
  },
  rheumatology: {
    id: 'rheumatology',
    name: 'Rheumatology',
    department: 'internal-medicine',
    scope: [
      'arthritis',
      'lupus',
      'autoimmune',
      'joint pain',
      'rheumatoid',
      'vasculitis',
      'gout',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/rheumatology.md',
  },
  'infectious-disease': {
    id: 'infectious-disease',
    name: 'Infectious Disease',
    department: 'internal-medicine',
    scope: [
      'infection',
      'fever',
      'sepsis',
      'antibiotics',
      'HIV',
      'hepatitis',
      'tuberculosis',
      'COVID',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/infectious-disease.md',
  },
  'hematology-oncology': {
    id: 'hematology-oncology',
    name: 'Hematology/Oncology',
    department: 'internal-medicine',
    scope: [
      'cancer',
      'chemotherapy',
      'blood disorder',
      'anemia',
      'clotting',
      'leukemia',
      'lymphoma',
      'tumor',
    ],
    model: 'opus',
    skillPath: 'internal-medicine/hematology-oncology.md',
  },

  // Neurology
  neurology: {
    id: 'neurology',
    name: 'Neurology',
    department: 'neurology',
    scope: [
      'stroke',
      'seizure',
      'headache',
      'dementia',
      'Parkinsons',
      'multiple sclerosis',
      'neuropathy',
      'confusion',
      'weakness',
      'numbness',
    ],
    model: 'opus',
    skillPath: 'neurology/neurology.md',
  },

  // Surgery
  'general-surgery': {
    id: 'general-surgery',
    name: 'General Surgery',
    department: 'surgery',
    scope: [
      'appendicitis',
      'gallbladder',
      'hernia',
      'bowel obstruction',
      'surgical wound',
      'abscess',
    ],
    model: 'opus',
    skillPath: 'surgery/general-surgery.md',
  },
  'cardiac-surgery': {
    id: 'cardiac-surgery',
    name: 'Cardiac Surgery',
    department: 'surgery',
    scope: [
      'bypass surgery',
      'CABG',
      'valve replacement',
      'heart surgery',
      'aortic surgery',
    ],
    model: 'opus',
    skillPath: 'surgery/cardiac-surgery.md',
  },
  neurosurgery: {
    id: 'neurosurgery',
    name: 'Neurosurgery',
    department: 'surgery',
    scope: [
      'brain surgery',
      'brain tumor',
      'spine surgery',
      'brain hemorrhage',
      'hydrocephalus',
    ],
    model: 'opus',
    skillPath: 'surgery/neurosurgery.md',
  },
  'orthopedic-surgery': {
    id: 'orthopedic-surgery',
    name: 'Orthopedic Surgery',
    department: 'surgery',
    scope: [
      'fracture',
      'broken bone',
      'joint replacement',
      'hip replacement',
      'knee replacement',
      'spine',
    ],
    model: 'opus',
    skillPath: 'surgery/orthopedic-surgery.md',
  },
  'vascular-surgery': {
    id: 'vascular-surgery',
    name: 'Vascular Surgery',
    department: 'surgery',
    scope: [
      'peripheral artery disease',
      'PAD',
      'aneurysm',
      'carotid',
      'blood vessel',
    ],
    model: 'opus',
    skillPath: 'surgery/vascular-surgery.md',
  },

  // Critical Care
  icu: {
    id: 'icu',
    name: 'Critical Care/ICU',
    department: 'critical-care',
    scope: [
      'ICU',
      'intensive care',
      'ventilator',
      'shock',
      'multi-organ failure',
      'sedation',
      'critically ill',
    ],
    model: 'opus',
    skillPath: 'critical-care/icu.md',
  },

  // Psychiatry
  psychiatry: {
    id: 'psychiatry',
    name: 'Psychiatry',
    department: 'psychiatry',
    scope: [
      'depression',
      'anxiety',
      'psychosis',
      'delirium',
      'substance abuse',
      'mental health',
      'suicidal',
    ],
    model: 'opus',
    skillPath: 'psychiatry/psychiatry.md',
  },

  // Nursing (use sonnet for faster responses)
  'nursing-general': {
    id: 'nursing-general',
    name: 'General Nursing',
    department: 'nursing',
    scope: [
      'medications',
      'daily care',
      'comfort',
      'pain management',
      'hospital routine',
    ],
    model: 'sonnet',
    skillPath: 'nursing/nursing-general.md',
  },
  'nursing-icu': {
    id: 'nursing-icu',
    name: 'ICU Nursing',
    department: 'nursing',
    scope: [
      'ICU care',
      'ventilator care',
      'family visitation ICU',
      'monitoring',
    ],
    model: 'sonnet',
    skillPath: 'nursing/nursing-icu.md',
  },
  'nursing-oncology': {
    id: 'nursing-oncology',
    name: 'Oncology Nursing',
    department: 'nursing',
    scope: [
      'chemotherapy side effects',
      'cancer care',
      'palliative care',
      'end of life',
    ],
    model: 'sonnet',
    skillPath: 'nursing/nursing-oncology.md',
  },
};

/**
 * Find specialists that might be relevant to a given query
 */
export function findRelevantSpecialists(query: string): SpecialistInfo[] {
  const lowerQuery = query.toLowerCase();
  const relevant: SpecialistInfo[] = [];

  for (const specialist of Object.values(SPECIALIST_REGISTRY)) {
    const hasMatchingScope = specialist.scope.some((term) =>
      lowerQuery.includes(term.toLowerCase())
    );
    if (hasMatchingScope) {
      relevant.push(specialist);
    }
  }

  return relevant;
}

/**
 * Get specialists by department
 */
export function getSpecialistsByDepartment(
  department: string
): SpecialistInfo[] {
  return Object.values(SPECIALIST_REGISTRY).filter(
    (s) => s.department === department
  );
}

/**
 * Get all specialist IDs
 */
export function getAllSpecialistIds(): string[] {
  return Object.keys(SPECIALIST_REGISTRY);
}
