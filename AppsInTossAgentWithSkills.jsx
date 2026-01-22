/**
 * AppsInTossAgent - 스킬 시스템 통합 버전
 *
 * 앱인토스 미니앱 아이디어 생성 에이전트
 * 10개의 AI 스킬을 활용하여 아이디어부터 출시 계획까지 지원
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  MessageSquare,
  Shuffle,
  Tag,
  FileText,
  Users,
  Zap,
  TrendingUp,
  DollarSign,
  Heart,
  Brain,
  Send,
  Download,
  Code,
  Layers,
  BarChart3,
  Palette,
  Rocket,
  Settings,
  ChevronRight,
  Check,
  X,
  RefreshCw,
  Copy,
  ExternalLink,
} from 'lucide-react';

// 스킬 시스템 import
import {
  useSkills,
  useIdeaGenerator,
  useSpecWriter,
  useMarketAnalyzer,
  useTechStackAdvisor,
  useMonetizationPlanner,
  useUXDesigner,
  useCodeGenerator,
  useLaunchPlanner,
  useCompleteWorkflow,
} from './skills/useSkills';

export default function AppsInTossAgent() {
  // 모드 상태
  const [activeMode, setActiveMode] = useState('chat');
  const [activeTab, setActiveTab] = useState('ideas'); // ideas | analysis | dev | launch

  // 대화 상태
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '안녕하세요! 앱인토스용 앱 아이디어를 함께 만들어드리겠습니다.\n\n저는 10가지 AI 스킬을 활용해 도움을 드릴 수 있어요:\n• 아이디어 생성 & 기획서 작성\n• 시장 분석 & 수익화 전략\n• 기술 스택 추천 & 코드 생성\n• UI/UX 디자인 & 출시 계획\n\n어떤 앱을 만들고 싶으신가요?',
    },
  ]);
  const [input, setInput] = useState('');

  // 선택된 데이터
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [generatedIdeas, setGeneratedIdeas] = useState([]);

  // 모달 상태
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [activeAnalysisTab, setActiveAnalysisTab] = useState('market');

  // 스킬 Hooks
  const { executeFromText, recommendSkills, getStatistics } = useSkills();
  const { generateByCategory, generateByKeywords, generateByProblem, ideas, isLoading: ideaLoading } = useIdeaGenerator();
  const { generateSpec, spec, markdown, downloadMarkdown, copyJSON, isLoading: specLoading } = useSpecWriter();
  const { analyzeMarket, analysis: marketAnalysis, isLoading: marketLoading } = useMarketAnalyzer();
  const { getRecommendation, recommendation: techRecommendation, isLoading: techLoading } = useTechStackAdvisor();
  const { createPlan: createMonetizationPlan, plan: monetizationPlan, isLoading: monetizationLoading } = useMonetizationPlanner();
  const { generateDesign, design: uxDesign, isLoading: uxLoading } = useUXDesigner();
  const { generateCode, code: generatedCode, isLoading: codeLoading } = useCodeGenerator();
  const { createLaunchPlan, plan: launchPlan, isLoading: launchLoading } = useLaunchPlanner();

  // 통합 로딩 상태
  const isGenerating = ideaLoading || specLoading || marketLoading || techLoading || monetizationLoading || uxLoading || codeLoading || launchLoading;

  // 카테고리 정의
  const categories = [
    { id: 'finance', name: '금융/재테크', icon: DollarSign, color: 'bg-green-500' },
    { id: 'lifestyle', name: '라이프스타일', icon: Heart, color: 'bg-pink-500' },
    { id: 'productivity', name: '생산성', icon: Zap, color: 'bg-yellow-500' },
    { id: 'social', name: '소셜/커뮤니티', icon: Users, color: 'bg-blue-500' },
    { id: 'learning', name: '교육/학습', icon: Brain, color: 'bg-purple-500' },
    { id: 'commerce', name: '커머스/쇼핑', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  // 스킬 메뉴
  const skillMenuItems = [
    { id: 'ideas', label: '아이디어', icon: Sparkles, skills: ['ideaGenerator', 'specWriter'] },
    { id: 'analysis', label: '분석', icon: BarChart3, skills: ['marketAnalyzer', 'monetizationPlanner'] },
    { id: 'dev', label: '개발', icon: Code, skills: ['techStackAdvisor', 'uxDesigner', 'codeGenerator'] },
    { id: 'launch', label: '출시', icon: Rocket, skills: ['launchPlanner'] },
  ];

  // ideas가 업데이트되면 generatedIdeas 업데이트
  useEffect(() => {
    if (ideas && ideas.length > 0) {
      setGeneratedIdeas(ideas);
    }
  }, [ideas]);

  // 대화형 메시지 처리
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    // 스킬 추천 받기
    const recommendations = recommendSkills(currentInput);

    // AI 응답 생성
    try {
      const result = await executeFromText(currentInput);

      let responseContent = '';

      if (result.success && result.data) {
        const skillUsed = result.skillUsed;

        if (skillUsed === 'ideaGenerator' && result.data.ideas) {
          setGeneratedIdeas(result.data.ideas);
          responseContent = `${result.data.ideas.length}개의 아이디어를 생성했습니다!\n\n`;
          result.data.ideas.slice(0, 3).forEach((idea, idx) => {
            responseContent += `**${idx + 1}. ${idea.title}**\n${idea.description}\n\n`;
          });
          responseContent += '아이디어 카드를 클릭하면 상세 기획서를 생성할 수 있어요.';
        } else {
          responseContent = '요청하신 내용을 처리했습니다. 결과를 확인해주세요.';
        }
      } else {
        // 기본 응답
        responseContent = generateChatResponse(currentInput);
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: responseContent }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `죄송합니다. 오류가 발생했습니다: ${error.message}\n\n다시 시도해주시거나, 다른 방식으로 질문해주세요.`,
        },
      ]);
    }
  };

  // 기본 대화 응답 생성
  const generateChatResponse = (userInput) => {
    const lower = userInput.toLowerCase();

    if (lower.includes('금융') || lower.includes('돈') || lower.includes('재테크')) {
      return `금융/재테크 분야에 관심이 있으시군요! 💰\n\n'금융' 카테고리를 선택하시면 AI가 맞춤형 아이디어를 생성해드립니다.\n\n또는 더 구체적인 키워드를 알려주시면 (예: "20대를 위한 절약 앱") 더 정확한 아이디어를 제안해드릴게요!`;
    }

    if (lower.includes('생산성') || lower.includes('업무') || lower.includes('집중')) {
      return `생산성 향상 앱에 관심이 있으시군요! ⚡\n\n앱인토스의 장점은 토스 앱 내에서 바로 사용할 수 있다는 거예요.\n짧은 시간에 빠르게 목표를 달성할 수 있는 앱이 잘 맞습니다.\n\n'생산성' 카테고리에서 아이디어를 확인해보세요!`;
    }

    if (lower.includes('기획서') || lower.includes('스펙')) {
      return `기획서 작성을 도와드릴게요! 📋\n\n1. 먼저 아이디어를 선택해주세요\n2. '상세 기획서 생성' 버튼을 클릭하세요\n3. AI가 개발 가능한 수준의 상세 기획서를 자동 생성합니다\n\n기획서에는 기능 명세, API 설계, UI 가이드가 모두 포함됩니다.`;
    }

    return `좋은 질문입니다! 😊\n\n저는 다음과 같은 도움을 드릴 수 있어요:\n\n• **아이디어 탭**: 카테고리별/랜덤 아이디어 생성\n• **분석 탭**: 시장 분석, 수익화 전략\n• **개발 탭**: 기술 스택, UI/UX, 코드 생성\n• **출시 탭**: 마케팅, 런칭 계획\n\n구체적인 관심 분야를 말씀해주시면 맞춤형 아이디어를 제안해드릴게요!`;
  };

  // 카테고리별 아이디어 생성
  const handleCategorySelect = async (categoryId) => {
    setSelectedCategory(categoryId);
    await generateByCategory(categoryId);
  };

  // 랜덤 아이디어 생성
  const handleRandomGenerate = async () => {
    const randomCategory = categories[Math.floor(Math.random() * categories.length)].id;
    await generateByCategory(randomCategory);
  };

  // 아이디어 선택 및 기획서 생성
  const handleSelectIdea = async (idea) => {
    setSelectedIdea(idea);
    setShowSpecModal(true);
    await generateSpec(idea);
  };

  // 종합 분석 실행
  const handleFullAnalysis = async (idea) => {
    setSelectedIdea(idea);
    setShowAnalysisModal(true);

    // 병렬로 분석 실행
    await Promise.all([
      analyzeMarket(idea),
      getRecommendation(idea),
      createMonetizationPlan(idea),
      generateDesign(idea),
    ]);
  };

  // 개발 자료 생성
  const handleGenerateDevResources = async (idea) => {
    await Promise.all([
      getRecommendation(idea),
      generateDesign(idea),
      generateCode(idea, { spec }),
    ]);
  };

  // 출시 계획 생성
  const handleGenerateLaunchPlan = async (idea) => {
    await createLaunchPlan(idea);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">앱인토스 AI 에이전트</h1>
                <p className="text-sm text-gray-500">10가지 AI 스킬로 앱 개발 지원</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isGenerating && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full">
                  <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm text-blue-600">처리 중...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Skill Menu Tabs */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1">
            {skillMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all border-b-2 ${
                    activeTab === item.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Ideas Tab */}
        {activeTab === 'ideas' && (
          <div className="space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
              <button
                onClick={() => setActiveMode('chat')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeMode === 'chat' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageSquare className="w-5 h-5" />
                대화형 추천
              </button>
              <button
                onClick={() => setActiveMode('category')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeMode === 'category' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Tag className="w-5 h-5" />
                카테고리별
              </button>
              <button
                onClick={() => setActiveMode('random')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                  activeMode === 'random' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Shuffle className="w-5 h-5" />
                랜덤 생성
              </button>
            </div>

            {/* Chat Mode */}
            {activeMode === 'chat' && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                  {isGenerating && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="어떤 앱을 만들고 싶으세요? (예: 직장인을 위한 점심 추천 앱)"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!input.trim() || isGenerating}
                      className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Category Mode */}
            {activeMode === 'category' && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        disabled={ideaLoading}
                        className={`p-6 rounded-2xl border-2 transition-all hover:shadow-lg disabled:opacity-50 ${
                          selectedCategory === cat.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 bg-white hover:border-blue-300'
                        }`}
                      >
                        <div className={`w-12 h-12 ${cat.color} rounded-xl flex items-center justify-center mb-3`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                      </button>
                    );
                  })}
                </div>

                {/* Generated Ideas */}
                {generatedIdeas.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">생성된 아이디어</h3>
                    {generatedIdeas.map((idea, idx) => (
                      <IdeaCard
                        key={idx}
                        idea={idea}
                        onGenerateSpec={() => handleSelectIdea(idea)}
                        onFullAnalysis={() => handleFullAnalysis(idea)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Random Mode */}
            {activeMode === 'random' && (
              <div>
                <div className="text-center mb-8">
                  <button
                    onClick={handleRandomGenerate}
                    disabled={ideaLoading}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {ideaLoading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Shuffle className="w-5 h-5" />
                    )}
                    {ideaLoading ? '생성 중...' : '랜덤 아이디어 생성'}
                  </button>
                  <p className="mt-3 text-gray-600">클릭할 때마다 새로운 아이디어를 추천해드립니다</p>
                </div>

                {generatedIdeas.length > 0 && (
                  <div className="space-y-4">
                    {generatedIdeas.slice(0, 3).map((idea, idx) => (
                      <IdeaCard
                        key={idx}
                        idea={idea}
                        onGenerateSpec={() => handleSelectIdea(idea)}
                        onFullAnalysis={() => handleFullAnalysis(idea)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-blue-500" />
                시장 및 수익화 분석
              </h2>

              {selectedIdea ? (
                <div className="space-y-6">
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <p className="text-sm text-blue-600 font-medium">선택된 아이디어</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedIdea.title}</p>
                  </div>

                  {/* Analysis Results */}
                  {marketAnalysis && (
                    <AnalysisResultCard
                      title="시장 분석"
                      icon={<TrendingUp className="w-5 h-5" />}
                      data={marketAnalysis}
                      isLoading={marketLoading}
                    />
                  )}

                  {monetizationPlan && (
                    <AnalysisResultCard
                      title="수익화 전략"
                      icon={<DollarSign className="w-5 h-5" />}
                      data={monetizationPlan}
                      isLoading={monetizationLoading}
                    />
                  )}

                  <button
                    onClick={() => handleFullAnalysis(selectedIdea)}
                    disabled={marketLoading || monetizationLoading}
                    className="w-full py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 disabled:opacity-50"
                  >
                    {marketLoading || monetizationLoading ? '분석 중...' : '종합 분석 다시 실행'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📊</div>
                  <p className="text-gray-600">아이디어 탭에서 분석할 아이디어를 선택해주세요</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dev Tab */}
        {activeTab === 'dev' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Code className="w-6 h-6 text-purple-500" />
                개발 자료 생성
              </h2>

              {selectedIdea ? (
                <div className="space-y-6">
                  <div className="p-4 bg-purple-50 rounded-xl">
                    <p className="text-sm text-purple-600 font-medium">선택된 아이디어</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedIdea.title}</p>
                  </div>

                  {/* Tech Stack */}
                  {techRecommendation && (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        추천 기술 스택
                      </h3>
                      <div className="space-y-2 text-sm">
                        {techRecommendation.recommended?.core && (
                          <>
                            <p><strong>Framework:</strong> {techRecommendation.recommended.core.framework?.name}</p>
                            <p><strong>State:</strong> {techRecommendation.recommended.core.stateManagement?.name}</p>
                            <p><strong>Styling:</strong> {techRecommendation.recommended.core.styling?.name}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* UX Design */}
                  {uxDesign && (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        UI/UX 가이드
                      </h3>
                      <p className="text-sm text-gray-600">
                        {uxDesign.wireframes?.length || 0}개의 화면 설계, {uxDesign.componentLibrary?.length || 0}개의 컴포넌트
                      </p>
                    </div>
                  )}

                  {/* Generated Code */}
                  {generatedCode && (
                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        생성된 코드
                      </h3>
                      <p className="text-sm text-gray-600">
                        {generatedCode.coreFiles?.length || 0}개의 파일 생성됨
                      </p>
                    </div>
                  )}

                  <button
                    onClick={() => handleGenerateDevResources(selectedIdea)}
                    disabled={techLoading || uxLoading || codeLoading}
                    className="w-full py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 disabled:opacity-50"
                  >
                    {techLoading || uxLoading || codeLoading ? '생성 중...' : '개발 자료 생성'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">💻</div>
                  <p className="text-gray-600">아이디어 탭에서 개발할 아이디어를 선택해주세요</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Launch Tab */}
        {activeTab === 'launch' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Rocket className="w-6 h-6 text-orange-500" />
                출시 계획
              </h2>

              {selectedIdea ? (
                <div className="space-y-6">
                  <div className="p-4 bg-orange-50 rounded-xl">
                    <p className="text-sm text-orange-600 font-medium">선택된 아이디어</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedIdea.title}</p>
                  </div>

                  {launchPlan && (
                    <>
                      {/* Schedule */}
                      <div className="border border-gray-200 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">출시 일정</h3>
                        <div className="space-y-2">
                          {launchPlan.schedule?.phases?.map((phase, idx) => (
                            <div key={idx} className="flex items-center gap-3 text-sm">
                              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-medium">
                                {idx + 1}
                              </div>
                              <span className="font-medium">{phase.name}</span>
                              <span className="text-gray-500">{phase.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Goals */}
                      <div className="border border-gray-200 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-900 mb-3">목표 지표</h3>
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <p className="text-2xl font-bold text-blue-500">{launchPlan.goals?.week1?.dau}</p>
                            <p className="text-xs text-gray-500">Week 1 DAU</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-green-500">{launchPlan.goals?.month1?.mau}</p>
                            <p className="text-xs text-gray-500">Month 1 MAU</p>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-purple-500">{launchPlan.goals?.month3?.mau}</p>
                            <p className="text-xs text-gray-500">Month 3 MAU</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <button
                    onClick={() => handleGenerateLaunchPlan(selectedIdea)}
                    disabled={launchLoading}
                    className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50"
                  >
                    {launchLoading ? '생성 중...' : '출시 계획 생성'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🚀</div>
                  <p className="text-gray-600">아이디어 탭에서 출시할 아이디어를 선택해주세요</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            앱인토스 성공 팁
          </h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="font-semibold mb-1">🎯 단순하게</div>
              <div className="opacity-90">한 가지 기능에 집중하여 명확한 가치 제공</div>
            </div>
            <div>
              <div className="font-semibold mb-1">⚡ 빠르게</div>
              <div className="opacity-90">5초 안에 핵심 기능 사용 가능하도록</div>
            </div>
            <div>
              <div className="font-semibold mb-1">🔄 습관화</div>
              <div className="opacity-90">매일 돌아오고 싶게 만드는 리텐션 설계</div>
            </div>
          </div>
        </div>
      </div>

      {/* Spec Modal */}
      {showSpecModal && selectedIdea && (
        <SpecModal
          idea={selectedIdea}
          spec={spec}
          markdown={markdown}
          isLoading={specLoading}
          onClose={() => setShowSpecModal(false)}
          onDownload={downloadMarkdown}
          onCopy={copyJSON}
        />
      )}
    </div>
  );
}

// ===== 하위 컴포넌트들 =====

function IdeaCard({ idea, onGenerateSpec, onFullAnalysis }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{idea.title}</h3>
          <p className="text-gray-600">{idea.description}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6 text-blue-500" />
        </div>
      </div>

      <div className="space-y-4">
        {/* Features */}
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
            <FileText className="w-4 h-4" />
            핵심 기능
          </div>
          <div className="flex flex-wrap gap-2">
            {(idea.features || []).slice(0, 4).map((feature, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Target & Revenue */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">타겟:</span>
            <span className="ml-1 text-gray-700">{idea.target}</span>
          </div>
          <div>
            <span className="text-gray-500">수익화:</span>
            <span className="ml-1 text-gray-700">{idea.revenue}</span>
          </div>
        </div>

        {/* Score Badge */}
        {idea.score && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-500">적합도:</div>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                style={{ width: `${idea.score * 100}%` }}
              />
            </div>
            <span className="text-sm font-medium text-blue-600">{Math.round(idea.score * 100)}%</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={onGenerateSpec}
          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-medium flex items-center justify-center gap-2"
        >
          <Code className="w-4 h-4" />
          상세 기획서
        </button>
        <button
          onClick={onFullAnalysis}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all flex items-center gap-2"
        >
          <BarChart3 className="w-4 h-4" />
          분석
        </button>
      </div>
    </div>
  );
}

function AnalysisResultCard({ title, icon, data, isLoading }) {
  if (isLoading) {
    return (
      <div className="border border-gray-200 rounded-xl p-4 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
        {icon}
        {title}
      </h3>
      <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-auto max-h-40">
        {JSON.stringify(data, null, 2).slice(0, 500)}...
      </pre>
    </div>
  );
}

function SpecModal({ idea, spec, markdown, isLoading, onClose, onDownload, onCopy }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">{idea.title}</h2>
                <p className="text-blue-100 text-sm">상세 개발 기획서</p>
              </div>
            </div>
            <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-all">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <RefreshCw className="w-12 h-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">기획서를 생성하고 있습니다...</p>
              <p className="text-sm text-gray-400 mt-2">잠시만 기다려주세요</p>
            </div>
          ) : spec ? (
            <div className="space-y-6">
              {/* Overview */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  개요
                </h3>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <p><strong>설명:</strong> {spec.overview?.description}</p>
                  <p><strong>타겟:</strong> {spec.overview?.targetUsers}</p>
                  <p><strong>수익화:</strong> {spec.overview?.businessModel}</p>
                </div>
              </section>

              {/* Features */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  기능 명세
                </h3>
                <div className="space-y-3">
                  {spec.features?.map((feature) => (
                    <div key={feature.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-gray-200 px-2 py-1 rounded">{feature.id}</span>
                          <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          feature.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {feature.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tech Stack */}
              <section>
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />
                  기술 스택
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-purple-50 rounded-xl p-4">
                    <div className="font-semibold text-purple-900 mb-2">Frontend</div>
                    <div className="text-purple-700">
                      {spec.technicalRequirements?.techStack?.frontend?.join(', ')}
                    </div>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="font-semibold text-blue-900 mb-2">성능 목표</div>
                    <div className="text-blue-700">
                      로딩: {spec.technicalRequirements?.performance?.initialLoadTime}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">기획서를 불러오는 중 오류가 발생했습니다.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onDownload}
              disabled={!markdown}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all font-medium disabled:opacity-50"
            >
              <Download className="w-5 h-5" />
              Markdown 다운로드
            </button>
            <button
              onClick={onCopy}
              disabled={!spec}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition-all font-medium disabled:opacity-50"
            >
              <Copy className="w-5 h-5" />
              JSON 복사
            </button>
          </div>
          <p className="text-xs text-gray-600 text-center mt-3">
            💡 Claude Code 또는 다른 코딩 에이전트에게 이 기획서를 전달하여 개발을 시작하세요
          </p>
        </div>
      </div>
    </div>
  );
}
