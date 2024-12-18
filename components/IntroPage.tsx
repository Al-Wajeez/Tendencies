import React from 'react';
import Image from 'next/image';

interface IntroPageProps {
  onStart: () => void;
}

export const IntroPage: React.FC<IntroPageProps> = ({ onStart }) => {
  return (
    <div className="container mt-5">
      <div className="quiz-card p-4 text-center animate-fade-in">
        <div className="mb-4 d-flex justify-content-center">
          <Image src="/placeholder.svg?height=100&width=200" alt="Logo" width={200} height={100} />
        </div>
        <h1 className="h2 mb-4 text-primary">استبيان الميول والاهتمامات</h1>
        <h2 className="h4 mb-4">السنة الرابعة متوسط</h2>
        <div className="mb-4">
          <div className="alert alert-info" role="alert">
            <h3 className="h5 mb-3">تعليمات وتوجيهات:</h3>
            <p className="mb-1">أيها التلميذ نتقدم إليك بهذا الاستبيان قصد التعرف بشكل عام على رغباتك ، ميولاتك واهتماماتك .</p>
            <p className="mb-1">إجابتك ستحظى بالسرية التامة من طرف مستشار(ة) التوجيه، لذا نرجو منك الإجابة بصدق و موضوعية.</p>
            <p className="mb-0">بعض الاسئلة تتطلب إنتاجا أدبيا</p>
          </div>
        </div>
        <button onClick={onStart} className="btn btn-primary btn-lg quiz-button">
          ابدأ الاستبيان
        </button>
      </div>
    </div>
  );
};

