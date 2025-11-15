'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { UserProfile, LearningStyle, EducationLevel, Difficulty } from '@/lib/types';
import { saveUserProfile, setOnboardingCompleted, initializeUserStats, saveStudyProgress } from '@/lib/storage';
import { subjects } from '@/lib/subjects';

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    educationLevel: '' as EducationLevel,
    learningStyles: [] as LearningStyle[],
    difficulties: [] as Difficulty[],
    otherDifficulty: '',
    favoriteSubjects: [] as string[],
    studyGoals: '',
  });

  const totalSteps = 4;

  const handleSubmit = () => {
    const profile: UserProfile = {
      id: Date.now().toString(),
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      educationLevel: formData.educationLevel,
      learningStyle: formData.learningStyles,
      difficulties: formData.difficulties,
      otherDifficulty: formData.otherDifficulty,
      favoriteSubjects: formData.favoriteSubjects,
      studyGoals: formData.studyGoals,
      createdAt: new Date().toISOString(),
    };

    saveUserProfile(profile);
    initializeUserStats(profile.id);
    
    // Inicializa progresso para todas as matérias
    const initialProgress = subjects.map(subject => ({
      userId: profile.id,
      subjectId: subject.id,
      subjectName: subject.name,
      progress: 0,
      completedLessons: [],
      totalLessons: subject.totalLessons,
      lastAccessed: new Date().toISOString(),
    }));
    saveStudyProgress(initialProgress);
    
    setOnboardingCompleted(true);
    router.push('/dashboard');
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.age;
      case 2:
        return formData.educationLevel && formData.learningStyles.length > 0;
      case 3:
        return formData.difficulties.length > 0;
      case 4:
        return formData.favoriteSubjects.length > 0 && formData.studyGoals;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => step === 1 ? router.push('/') : setStep(step - 1)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Passo {step} de {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          {/* Step 1: Dados Básicos */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Vamos começar! 👋
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Conte-nos um pouco sobre você
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Seu nome"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    placeholder="Sua idade"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Nível e Estilo de Aprendizado */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Como você aprende melhor? 🎓
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Selecione seu nível de ensino e estilos de aprendizado
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Nível de Ensino</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: 'fundamental', label: 'Fundamental' },
                      { value: 'medio', label: 'Médio' },
                      { value: 'superior', label: 'Superior' },
                      { value: 'tecnico', label: 'Técnico' },
                    ].map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setFormData({ ...formData, educationLevel: level.value as EducationLevel })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.educationLevel === level.value
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{level.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Estilos de Aprendizado (pode escolher mais de um)</Label>
                  <div className="space-y-3">
                    {[
                      { value: 'visual', label: 'Visual', desc: 'Aprendo melhor com imagens e diagramas' },
                      { value: 'auditivo', label: 'Auditivo', desc: 'Aprendo melhor ouvindo' },
                      { value: 'cinestesico', label: 'Cinestésico', desc: 'Aprendo melhor fazendo e praticando' },
                      { value: 'leitura', label: 'Leitura/Escrita', desc: 'Aprendo melhor lendo e escrevendo' },
                    ].map((style) => (
                      <div
                        key={style.value}
                        onClick={() => {
                          const styles = formData.learningStyles.includes(style.value as LearningStyle)
                            ? formData.learningStyles.filter(s => s !== style.value)
                            : [...formData.learningStyles, style.value as LearningStyle];
                          setFormData({ ...formData, learningStyles: styles });
                        }}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          formData.learningStyles.includes(style.value as LearningStyle)
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={formData.learningStyles.includes(style.value as LearningStyle)}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{style.label}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{style.desc}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Dificuldades */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Vamos personalizar ainda mais 🎯
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Isso nos ajuda a adaptar o conteúdo para você
                </p>
              </div>

              <div className="space-y-3">
                <Label className="mb-3 block">Você tem alguma dessas características?</Label>
                {[
                  { value: 'tdah', label: 'TDAH', desc: 'Dificuldade de atenção e concentração' },
                  { value: 'dislexia', label: 'Dislexia', desc: 'Dificuldade com leitura e escrita' },
                  { value: 'ansiedade', label: 'Ansiedade', desc: 'Ansiedade em situações de aprendizado' },
                  { value: 'nenhuma', label: 'Nenhuma', desc: 'Não tenho dificuldades específicas' },
                  { value: 'outra', label: 'Outra', desc: 'Outra dificuldade não listada' },
                ].map((difficulty) => (
                  <div
                    key={difficulty.value}
                    onClick={() => {
                      const difficulties = formData.difficulties.includes(difficulty.value as Difficulty)
                        ? formData.difficulties.filter(d => d !== difficulty.value)
                        : [...formData.difficulties, difficulty.value as Difficulty];
                      setFormData({ ...formData, difficulties });
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      formData.difficulties.includes(difficulty.value as Difficulty)
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={formData.difficulties.includes(difficulty.value as Difficulty)}
                        className="mt-1"
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{difficulty.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{difficulty.desc}</div>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.difficulties.includes('outra') && (
                  <div className="mt-4">
                    <Label htmlFor="otherDifficulty">Descreva sua dificuldade</Label>
                    <Input
                      id="otherDifficulty"
                      value={formData.otherDifficulty}
                      onChange={(e) => setFormData({ ...formData, otherDifficulty: e.target.value })}
                      placeholder="Conte-nos mais..."
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Matérias e Objetivos */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Quase lá! 🎉
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Suas matérias favoritas e objetivos
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <Label className="mb-3 block">Matérias Favoritas (escolha pelo menos uma)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {subjects.map((subject) => (
                      <button
                        key={subject.id}
                        onClick={() => {
                          const favorites = formData.favoriteSubjects.includes(subject.id)
                            ? formData.favoriteSubjects.filter(s => s !== subject.id)
                            : [...formData.favoriteSubjects, subject.id];
                          setFormData({ ...formData, favoriteSubjects: favorites });
                        }}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.favoriteSubjects.includes(subject.id)
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{subject.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="studyGoals">Quais são seus objetivos de estudo?</Label>
                  <Textarea
                    id="studyGoals"
                    value={formData.studyGoals}
                    onChange={(e) => setFormData({ ...formData, studyGoals: e.target.value })}
                    placeholder="Ex: Passar no vestibular, melhorar minhas notas, aprender por curiosidade..."
                    className="mt-1 min-h-[120px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step < totalSteps ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!canProceed()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Finalizar
                <Check className="ml-2 w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
