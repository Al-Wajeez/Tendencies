'use client'

import React, { useState } from 'react';
import { Quiz } from '../components/Quiz';
import { IntroPage } from '../components/IntroPage';
import { Question } from '../types/quiz';

const questions: Question[] = [
  {
    id: 'student_name',
    text: 'إسم و لقب التلميذ',
    type: 'text'
  },
  {
    id: 'class',
    text: 'الصف',
    type: 'text'
  },
  {
    id: 'birth_date',
    text: 'تاريخ الإزدياد',
    type: 'date'
  },
  {
    id: 'birth_place',
    text: 'مكان مكان',
    type: 'text'
  },
  {
    id: 'address',
    text: 'العنوان',
    type: 'text'
  },
  {
    id: 'repeat_year',
    text: 'الإعادة',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'num_brothers',
    text: 'عدد الإخوة الذكور',
    type: 'number'
  },
  {
    id: 'num_sisters',
    text: 'عدد الاخوة الاناث',
    type: 'number'
  },
  {
    id: 'family_rank',
    text: 'الرتبة في العائلة',
    type: 'number'
  },
  {
    id: 'father_job',
    text: 'مهنة الاب',
    type: 'dropdown',
    options: [
      { value: 'unemployed', label: 'بدون عمل' },
      { value: 'retired', label: 'متقاعد(ة)' },
      { value: 'employed', label: 'موظف(ة)' }
    ]
  },
  {
    id: 'father_education',
    text: 'المستوى الدراسي للأب',
    type: 'dropdown',
    options: [
      { value: 'illiterate', label: 'أمي' },
      { value: 'primary', label: 'إبتدائي' },
      { value: 'middle', label: 'متوسط' },
      { value: 'secondary', label: 'ثانوي' },
      { value: 'university', label: 'جامعي' }
    ]
  },
  {
    id: 'father_deceased',
    text: 'هل الأب متوفي',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'mother_job',
    text: 'مهنة الأم',
    type: 'dropdown',
    options: [
      { value: 'unemployed', label: 'بدون عمل' },
      { value: 'retired', label: 'متقاعد(ة)' },
      { value: 'employed', label: 'موظف(ة)' }
    ]
  },
  {
    id: 'mother_education',
    text: 'المستوى الدراسي للأم',
    type: 'dropdown',
    options: [
      { value: 'illiterate', label: 'أمي' },
      { value: 'primary', label: 'إبتدائي' },
      { value: 'middle', label: 'متوسط' },
      { value: 'secondary', label: 'ثانوي' },
      { value: 'university', label: 'جامعي' }
    ]
  },
  {
    id: 'mother_deceased',
    text: 'هل الأم متوفية',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'parents_separated',
    text: 'هل الأبوين منفصلان',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'has_guardian',
    text: 'هل لديك كفيل',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'parents_interest',
    text: 'هل الأولياء منشغلون بنتائجك المدرسية؟',
    type: 'group',
    subQuestions: [
      {
        id: 'father_interest',
        text: 'الأب',
        type: 'dropdown',
        options: [
          { value: 'always', label: 'بإستمرار' },
          { value: 'sometimes', label: 'أحيانا' },
          { value: 'rarely', label: 'نادرا' }
        ]
      },
      {
        id: 'mother_interest',
        text: 'الأم',
        type: 'dropdown',
        options: [
          { value: 'always', label: 'بإستمرار' },
          { value: 'sometimes', label: 'أحيانا' },
          { value: 'rarely', label: 'نادرا' }
        ]
      },
      {
        id: 'guardian_interest',
        text: 'الكفيل',
        type: 'dropdown',
        options: [
          { value: 'always', label: 'بإستمرار' },
          { value: 'sometimes', label: 'أحيانا' },
          { value: 'rarely', label: 'نادرا' }
        ]
      }
    ]
  },
  {
    id: 'preferred_subjects',
    text: 'ماهي المواد التي تفـــــــضلها؟',
    type: 'multiselect',
    options: [
      { value: 'math', label: 'الرياضيات' },
      { value: 'physics', label: 'العلوم الفيزيائية' },
      { value: 'biology', label: 'العلوم الطبيعية' },
      { value: 'arabic', label: 'اللغة العربية' },
      { value: 'french', label: 'اللغة الفرنسية' },
      { value: 'english', label: 'اللغة الإنجليزية' },
      { value: 'history_geography', label: 'التاريخ والجغرافيا' },
      { value: 'islamic_studies', label: 'العلوم الإسلامية' },
      { value: 'civic_education', label: 'التربية المدنية' }
    ],
    subQuestion: {
      id: 'preferred_subjects_reason',
      text: 'لماذا؟',
      type: 'text'
    }
  },
  {
    id: 'difficult_subjects',
    text: 'ماهي المواد التي المواد التي تتلقى فيها صعوبة؟',
    type: 'multiselect',
    options: [
      { value: 'math', label: 'الرياضيات' },
      { value: 'physics', label: 'العلوم الفيزيائية' },
      { value: 'biology', label: 'العلوم الطبيعية' },
      { value: 'arabic', label: 'اللغة العربية' },
      { value: 'french', label: 'اللغة الفرنسية' },
      { value: 'english', label: 'اللغة الإنجليزية' },
      { value: 'history_geography', label: 'التاريخ والجغرافيا' },
      { value: 'islamic_studies', label: 'العلوم الإسلامية' },
      { value: 'civic_education', label: 'التربية المدنية' }
    ],
    subQuestion: {
      id: 'difficult_subjects_reason',
      text: 'لماذا؟',
      type: 'text'
    }
  },
  {
    id: 'preferred_branch',
    text: 'ماهو الجذع المشترك الذي ترغب أن توجه إليه؟',
    type: 'dropdown',
    options: [
      { value: 'literature', label: 'جذع مشترك آداب' },
      { value: 'science_tech', label: 'جذع مشترك علوم وتكنولوجيا' }
    ]
  },
  {
    id: 'branch_subjects',
    text: 'ماهي المواد المميزة لهذا الجذع المشترك؟',
    type: 'multiselect',
    options: [
      { value: 'arabic_literature', label: 'اللغة العربية وآدابها' },
      { value: 'math', label: 'الرياضيات' },
      { value: 'physics', label: 'العلوم الفيزيائية' },
      { value: 'biology', label: 'علوم الطبيعة والحياة' },
      { value: 'islamic_studies', label: 'العلوم الإسلامية' },
      { value: 'history_geography', label: 'التاريخ والجغرافيا' },
      { value: 'french', label: 'اللغة الفرنسية' },
      { value: 'english', label: 'اللغة الإنجليزية' },
      { value: 'technology', label: 'تكنولوجيا' }
    ]
  },
  {
    id: 'study_interest_reason',
    text: 'هل إهتمامك بالدراسة راجع الى؟',
    type: 'multiselect',
    options: [
      { value: 'parents_encouragement', label: 'تشجيع الأولياء' },
      { value: 'teachers_encouragement', label: 'تشجيع الأساتذة' },
      { value: 'private_lessons', label: 'متابعة دروس خاصة' },
      { value: 'peer_competition', label: 'المنافسة مع الزملاء' }
    ]
  },
  {
    id: 'additional_info_source',
    text: 'عند إحساسك بعدم القدرة على فهم الدرس هل تطلب المزيد من المعلومات من؟',
    type: 'multiselect',
    options: [
      { value: 'classmates', label: 'زملاء القسم' },
      { value: 'teachers', label: 'الأساتذة' },
      { value: 'books', label: 'مطالعة الكتب' }
    ],
    subQuestion: {
      id: 'other_info_source',
      text: 'وسيلة أخرى أذكرها',
      type: 'text'
    }
  },
  {
    id: 'teacher_treatment',
    text: 'هل المعاملة الطيبة للأستاذ تشجعك على حب المادة و بذل المجهود فيها؟',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'parents_reward',
    text: 'هل مكافئة والديك لنجاحك الدارسي تجعلك أكثر إهتماما بالدراسة؟',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'future_project_discussion',
    text: 'هل تحاورت مع أوليائك حول مشروعك الدراسي المستقبلي المناسب لك؟',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ],
    subQuestion: {
      id: 'no_discussion_reason',
      text: 'في حالة الاجابة ب لا، أذكر السبب ؟',
      type: 'text'
    }
  },
  {
    id: 'study_interest_goal',
    text: 'هل اهتمامك بالدراسة راجع إلى رغبتك في الحصول على؟',
    type: 'multiselect',
    options: [
      { value: 'stable_job', label: 'مهنة مستقر' },
      { value: 'higher_education', label: 'دراسات عليا' },
      { value: 'general_culture', label: 'ثقافة عامة' }
    ],
    subQuestion: {
      id: 'other_study_interest_reasons',
      text: 'أسباب أخرى أذكرها',
      type: 'text'
    }
  },
  {
    id: 'future_profession',
    text: 'ما هي المهنة التي تتمناها في المستقبل؟',
    type: 'text',
    subQuestion: {
      id: 'future_profession_reason',
      text: 'لماذا؟',
      type: 'text'
    }
  },
  {
    id: 'required_education_level',
    text: 'حسب رأيك ما هو المستوى الدراسي الذي تتطلبه المهنة المرغوبة؟',
    type: 'multiselect',
    options: [
      { value: 'basic', label: 'تعليم أساسي' },
      { value: 'secondary', label: 'تعليم ثانوي' },
      { value: 'university', label: 'تعليم جامعي' },
      { value: 'vocational', label: 'تعليم أو تكوين مهنيين' }
    ]
  },
  {
    id: 'future_profession_sector',
    text: 'في أي قطاع تريد ممارسة مهنتك مستقبلا؟',
    type: 'multiselect',
    options: [
      { value: 'industry', label: 'الصناعة' },
      { value: 'agriculture', label: 'الفلاحة' },
      { value: 'education', label: 'التربية' },
      { value: 'health', label: 'الصحة' },
      { value: 'defense', label: 'الدفاع الوطني' },
      { value: 'administration', label: 'الإدارة' }
    ],
    subQuestion: {
      id: 'other_sector',
      text: 'قطاعات آخر : أذكره ؟',
      type: 'text'
    }
  },
  {
    id: 'recreational_activity',
    text: 'هل لك نشاط ترفيهي؟',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ]
  },
  {
    id: 'leisure_activities',
    text: 'فيما تقضي أوقات فراغك؟',
    type: 'multiselect',
    options: [
      { value: 'reading', label: 'مطالعة الكتب' },
      { value: 'studying', label: 'مراجعة الدروس' },
      { value: 'tv', label: 'مشاهدة التلفزة' },
      { value: 'sports', label: 'ممارسة الرياضة' },
      { value: 'walking', label: 'التنزه' }
    ],
    subQuestion: {
      id: 'other_leisure_activities',
      text: 'مجالات أخرى',
      type: 'text'
    }
  },
  {
    id: 'future_project_info',
    text: 'هل تعتقد أن لديك المعلومات الكافية حول مشروعك المستقبلي؟',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ],
    subQuestion: {
      id: 'desired_info',
      text: 'ما هي المعلومات التي ترغب في الحصول عليها لتحقيق ذلك؟',
      type: 'text'
    }
  },
  {
    id: 'study_difficulties',
    text: 'هل تعاني من صعوبات تعيق السير الحسن لدراستك؟',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ],
    subQuestion: {
      id: 'difficulties_description',
      text: 'في حالة الاجابة بنعم، أذكره ؟',
      type: 'text'
    }
  },
  {
    id: 'counselor_discussion',
    text: 'هل لديك إنشغال أو مشكل تريد مناقشته مع مستشار (ة) التوجيه؟',
    type: 'dropdown',
    options: [
      { value: 'yes', label: 'نعم' },
      { value: 'no', label: 'لا' }
    ],
    subQuestion: {
      id: 'counselor_discussion_topic',
      text: 'في حالة الاجابة بنعم، أذكره ؟',
      type: 'text'
    }
  }
];

export default function Home() {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStart = () => {
    setShowQuiz(true);
  };

  return (
    <main className="min-vh-100 bg-light py-5">
      {showQuiz ? (
        <Quiz questions={questions} />
      ) : (
        <IntroPage onStart={handleStart} />
      )}
    </main>
  );
}

