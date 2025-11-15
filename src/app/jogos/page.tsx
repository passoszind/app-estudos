'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Play, CheckCircle2, XCircle, Award } from 'lucide-react';
import { subjects } from '@/lib/subjects';
import { getUserStats, updateUserStats, saveGameScore } from '@/lib/storage';
import { UserStats } from '@/lib/types';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  subject: string;
}

export default function JogosPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  useEffect(() => {
    setMounted(true);
    const userStats = getUserStats();
    if (!userStats) {
      router.push('/cadastro');
      return;
    }
    setStats(userStats);
  }, [router]);

  if (!mounted || !stats) return null;

  const questions: Question[] = [
    // Matemática
    { id: 'm1', question: 'Quanto é 15 + 27?', options: ['40', '42', '43', '45'], correctAnswer: 1, subject: 'matematica' },
    { id: 'm2', question: 'Qual é a raiz quadrada de 64?', options: ['6', '7', '8', '9'], correctAnswer: 2, subject: 'matematica' },
    { id: 'm3', question: 'Quanto é 12 × 8?', options: ['84', '92', '96', '104'], correctAnswer: 2, subject: 'matematica' },
    
    // Português
    { id: 'p1', question: 'Qual é o plural de "cidadão"?', options: ['cidadões', 'cidadãos', 'cidadães', 'cidadans'], correctAnswer: 1, subject: 'portugues' },
    { id: 'p2', question: 'Qual palavra está correta?', options: ['excessão', 'exceção', 'exeção', 'essceção'], correctAnswer: 1, subject: 'portugues' },
    { id: 'p3', question: 'O que é um substantivo?', options: ['Ação', 'Qualidade', 'Nome', 'Lugar'], correctAnswer: 2, subject: 'portugues' },
    
    // Ciências
    { id: 'c1', question: 'Qual é o planeta mais próximo do Sol?', options: ['Vênus', 'Terra', 'Mercúrio', 'Marte'], correctAnswer: 2, subject: 'ciencias' },
    { id: 'c2', question: 'Quantos ossos tem o corpo humano adulto?', options: ['186', '206', '226', '246'], correctAnswer: 1, subject: 'ciencias' },
    { id: 'c3', question: 'O que é fotossíntese?', options: ['Respiração das plantas', 'Produção de alimento pelas plantas', 'Crescimento das plantas', 'Reprodução das plantas'], correctAnswer: 1, subject: 'ciencias' },
    
    // História
    { id: 'h1', question: 'Em que ano foi descoberto o Brasil?', options: ['1492', '1500', '1502', '1510'], correctAnswer: 1, subject: 'historia' },
    { id: 'h2', question: 'Quem foi o primeiro presidente do Brasil?', options: ['Dom Pedro I', 'Getúlio Vargas', 'Deodoro da Fonseca', 'Juscelino Kubitschek'], correctAnswer: 2, subject: 'historia' },
    { id: 'h3', question: 'Qual foi a capital do Brasil antes de Brasília?', options: ['São Paulo', 'Salvador', 'Rio de Janeiro', 'Recife'], correctAnswer: 2, subject: 'historia' },
    
    // Geografia
    { id: 'g1', question: 'Qual é o maior país do mundo em área?', options: ['Canadá', 'China', 'Estados Unidos', 'Rússia'], correctAnswer: 3, subject: 'geografia' },
    { id: 'g2', question: 'Qual é o rio mais extenso do mundo?', options: ['Nilo', 'Amazonas', 'Yangtzé', 'Mississippi'], correctAnswer: 1, subject: 'geografia' },
    { id: 'g3', question: 'Quantos continentes existem?', options: ['5', '6', '7', '8'], correctAnswer: 2, subject: 'geografia' },
    
    // Inglês
    { id: 'i1', question: 'Como se diz "obrigado" em inglês?', options: ['Please', 'Sorry', 'Thank you', 'Welcome'], correctAnswer: 2, subject: 'ingles' },
    { id: 'i2', question: 'Qual é o plural de "child"?', options: ['childs', 'childes', 'children', 'childs'], correctAnswer: 2, subject: 'ingles' },
    { id: 'i3', question: 'O que significa "book"?', options: ['Livro', 'Caderno', 'Lápis', 'Mesa'], correctAnswer: 0, subject: 'ingles' },
  ];

  const filteredQuestions = selectedSubject
    ? questions.filter(q => q.subject === selectedSubject).slice(0, 5)
    : [];

  const handleStartGame = (subjectId: string) => {
    setSelectedSubject(subjectId);
    setGameStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
    setGameFinished(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (answered) return;

    setSelectedAnswer(answerIndex);
    setAnswered(true);

    const isCorrect = answerIndex === filteredQuestions[currentQuestion].correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < filteredQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setAnswered(false);
        setSelectedAnswer(null);
      } else {
        finishGame(isCorrect ? score + 1 : score);
      }
    }, 1500);
  };

  const finishGame = (finalScore: number) => {
    setGameFinished(true);
    
    const points = finalScore * 10;
    const newStats = {
      ...stats,
      totalPoints: stats.totalPoints + points,
      level: Math.floor((stats.totalPoints + points) / 100),
    };
    
    updateUserStats(newStats);
    setStats(newStats);

    const subject = subjects.find(s => s.id === selectedSubject);
    if (subject) {
      saveGameScore({
        userId: stats.userId,
        gameId: `quiz-${selectedSubject}-${Date.now()}`,
        gameName: `Quiz de ${subject.name}`,
        score: finalScore,
        points: points,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handlePlayAgain = () => {
    setGameStarted(false);
    setSelectedSubject(null);
    setGameFinished(false);
  };

  if (gameStarted && !gameFinished) {
    const question = filteredQuestions[currentQuestion];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button
            variant="ghost"
            onClick={() => setGameStarted(false)}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Sair do Quiz
          </Button>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Pergunta {currentQuestion + 1} de {filteredQuestions.length}
              </span>
              <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                Pontuação: {score}/{filteredQuestions.length}
              </span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
              {question.question}
            </h2>

            <div className="space-y-3">
              {question.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === question.correctAnswer;
                const showResult = answered;

                let buttonClass = 'w-full p-4 rounded-xl border-2 text-left transition-all ';
                
                if (!showResult) {
                  buttonClass += 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20';
                } else if (isSelected && isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else if (isSelected && !isCorrect) {
                  buttonClass += 'border-red-500 bg-red-50 dark:bg-red-900/20';
                } else if (isCorrect) {
                  buttonClass += 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else {
                  buttonClass += 'border-gray-200 dark:border-gray-700 opacity-50';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={answered}
                    className={buttonClass}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {option}
                      </span>
                      {showResult && isSelected && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                      {showResult && isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                      {showResult && !isSelected && isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (gameFinished) {
    const percentage = (score / filteredQuestions.length) * 100;
    const subject = subjects.find(s => s.id === selectedSubject);

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
            <Award className="w-20 h-20 mx-auto mb-6 text-yellow-500" />
            
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Quiz Finalizado! 🎉
            </h2>
            
            <div className="mb-8">
              <div className="text-6xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {score}/{filteredQuestions.length}
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Você acertou {percentage.toFixed(0)}% das questões
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 mb-8">
              <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Você ganhou {score * 10} pontos! 🎯
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Continue jogando para subir de nível
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handlePlayAgain}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Jogar Novamente
              </Button>
              <Button
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="flex-1"
              >
                Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            Quiz de Conhecimentos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Teste seus conhecimentos e ganhe pontos
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">Seus Pontos</h3>
              <p className="text-3xl font-bold">{stats.totalPoints}</p>
            </div>
            <Trophy className="w-16 h-16 opacity-80" />
          </div>
        </div>

        {/* Subject Selection */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
          Escolha uma Matéria
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {subject.icon}
              </div>
              
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {subject.name}
              </h3>
              
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                5 perguntas • 50 pontos
              </p>

              <Button
                onClick={() => handleStartGame(subject.id)}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Play className="w-4 h-4 mr-2" />
                Começar Quiz
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
