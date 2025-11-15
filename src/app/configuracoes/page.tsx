'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Calendar,
  BookOpen,
  Brain,
  Target,
  Save,
  Trash2
} from 'lucide-react';
import { getUserProfile, saveUserProfile, getUserStats } from '@/lib/storage';
import { UserProfile, LearningStyle, EducationLevel, Difficulty } from '@/lib/types';
import { subjects } from '@/lib/subjects';

export default function ConfiguracoesPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
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

  useEffect(() => {
    setMounted(true);
    const userProfile = getUserProfile();
    
    if (!userProfile) {
      router.push('/cadastro');
      return;
    }

    setProfile(userProfile);
    setFormData({
      name: userProfile.name,
      email: userProfile.email,
      age: userProfile.age.toString(),
      educationLevel: userProfile.educationLevel,
      learningStyles: userProfile.learningStyle,
      difficulties: userProfile.difficulties,
      otherDifficulty: userProfile.otherDifficulty || '',
      favoriteSubjects: userProfile.favoriteSubjects,
      studyGoals: userProfile.studyGoals,
    });
  }, [router]);

  if (!mounted || !profile) return null;

  const handleSave = () => {
    const updatedProfile: UserProfile = {
      ...profile,
      name: formData.name,
      email: formData.email,
      age: parseInt(formData.age),
      educationLevel: formData.educationLevel,
      learningStyle: formData.learningStyles,
      difficulties: formData.difficulties,
      otherDifficulty: formData.otherDifficulty,
      favoriteSubjects: formData.favoriteSubjects,
      studyGoals: formData.studyGoals,
    };

    saveUserProfile(updatedProfile);
    setProfile(updatedProfile);
    alert('Configurações salvas com sucesso! ✅');
  };

  const handleDeleteAccount = () => {
    if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
      localStorage.clear();
      router.push('/');
    }
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie suas informações e preferências
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        {/* Account Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <h3 className="text-lg font-semibold mb-4">Resumo da Conta</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-purple-100 text-sm">Nível</p>
              <p className="text-2xl font-bold">{stats?.level || 1}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Pontos</p>
              <p className="text-2xl font-bold">{stats?.totalPoints || 0}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Sequência</p>
              <p className="text-2xl font-bold">{stats?.streak || 0} dias</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">Amigos</p>
              <p className="text-2xl font-bold">{stats?.friendsInvited || 0}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="w-6 h-6 text-purple-600" />
            Informações Pessoais
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Education Level */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Nível de Ensino
          </h3>

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
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                }`}
              >
                <span className="font-medium text-gray-900 dark:text-white">{level.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Styles */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-green-600" />
            Estilos de Aprendizado
          </h3>

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
                    ? 'border-green-600 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
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

        {/* Difficulties */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Dificuldades de Aprendizado
          </h3>

          <div className="space-y-3">
            {[
              { value: 'tdah', label: 'TDAH', desc: 'Dificuldade de atenção e concentração' },
              { value: 'dislexia', label: 'Dislexia', desc: 'Dificuldade com leitura e escrita' },
              { value: 'ansiedade', label: 'Ansiedade', desc: 'Ansiedade em situações de aprendizado' },
              { value: 'nenhuma', label: 'Nenhuma', desc: 'Não tenho dificuldades específicas' },
              { value: 'outra', label: 'Outra', desc: 'Outra dificuldade não listada' },
            ].map((difficulty) => (
              <div key={difficulty.value}>
                <div
                  onClick={() => {
                    const difficulties = formData.difficulties.includes(difficulty.value as Difficulty)
                      ? formData.difficulties.filter(d => d !== difficulty.value)
                      : [...formData.difficulties, difficulty.value as Difficulty];
                    setFormData({ ...formData, difficulties });
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    formData.difficulties.includes(difficulty.value as Difficulty)
                      ? 'border-orange-600 bg-orange-50 dark:bg-orange-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
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

                {difficulty.value === 'outra' && formData.difficulties.includes('outra') && (
                  <Input
                    value={formData.otherDifficulty}
                    onChange={(e) => setFormData({ ...formData, otherDifficulty: e.target.value })}
                    placeholder="Descreva sua dificuldade..."
                    className="mt-2"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Favorite Subjects */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Matérias Favoritas
          </h3>

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

        {/* Study Goals */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-600" />
            Objetivos de Estudo
          </h3>

          <Textarea
            value={formData.studyGoals}
            onChange={(e) => setFormData({ ...formData, studyGoals: e.target.value })}
            placeholder="Ex: Passar no vestibular, melhorar minhas notas, aprender por curiosidade..."
            className="min-h-[120px]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleSave}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>

          <Button
            onClick={handleDeleteAccount}
            variant="destructive"
            className="sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir Conta
          </Button>
        </div>
      </div>
    </div>
  );
}
