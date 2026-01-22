/**
 * useSkills - React Hook for Skill System
 *
 * 앱인토스 에이전트 컴포넌트에서 스킬 시스템을 사용하기 위한 React Hook
 */

import { useState, useCallback, useMemo } from 'react';
import { skillManager } from './SkillManager';
import { promptEngine } from './PromptEngine';

/**
 * 스킬 시스템 메인 Hook
 */
export function useSkills() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);

  // 단일 스킬 실행
  const executeSkill = useCallback(async (skillName, input) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await skillManager.executeSkill(skillName, input);
      setLastResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 워크플로우 실행
  const executeWorkflow = useCallback(async (workflowName, input) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await skillManager.executeWorkflow(workflowName, input);
      setLastResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 스킬 목록
  const skills = useMemo(() => skillManager.listSkills(), []);

  // 워크플로우 목록
  const workflows = useMemo(() => skillManager.listWorkflows(), []);

  // 자연어 실행
  const executeFromText = useCallback(async (userInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await skillManager.executeFromNaturalLanguage(userInput);
      setLastResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 스킬 추천
  const recommendSkills = useCallback((userInput) => {
    return skillManager.recommendSkills(userInput);
  }, []);

  return {
    // 상태
    isLoading,
    error,
    lastResult,

    // 액션
    executeSkill,
    executeWorkflow,
    executeFromText,
    recommendSkills,

    // 데이터
    skills,
    workflows,

    // 통계
    getStatistics: skillManager.getStatistics.bind(skillManager),
    getExecutionLog: skillManager.getExecutionLog.bind(skillManager),
  };
}

/**
 * 아이디어 생성 전용 Hook
 */
export function useIdeaGenerator() {
  const { executeSkill, isLoading, error } = useSkills();
  const [ideas, setIdeas] = useState([]);

  const generateIdeas = useCallback(
    async (params) => {
      const result = await executeSkill('ideaGenerator', params);
      if (result.success) {
        setIdeas(result.data.ideas);
      }
      return result;
    },
    [executeSkill]
  );

  const generateByCategory = useCallback(
    (category) => generateIdeas({ category }),
    [generateIdeas]
  );

  const generateByKeywords = useCallback(
    (keywords) => generateIdeas({ keywords }),
    [generateIdeas]
  );

  const generateByProblem = useCallback(
    (problemToSolve) => generateIdeas({ problemToSolve }),
    [generateIdeas]
  );

  return {
    ideas,
    isLoading,
    error,
    generateIdeas,
    generateByCategory,
    generateByKeywords,
    generateByProblem,
  };
}

/**
 * 기획서 생성 전용 Hook
 */
export function useSpecWriter() {
  const { executeSkill, isLoading, error } = useSkills();
  const [spec, setSpec] = useState(null);
  const [markdown, setMarkdown] = useState('');

  const generateSpec = useCallback(
    async (idea, options = {}) => {
      const result = await executeSkill('specWriter', {
        idea,
        detailLevel: options.detailLevel || 'detailed',
        outputFormat: 'both',
        includeCode: options.includeCode !== false,
      });

      if (result.success) {
        setSpec(result.data.spec);
        setMarkdown(result.data.markdown);
      }

      return result;
    },
    [executeSkill]
  );

  const downloadMarkdown = useCallback(() => {
    if (!markdown) return;

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${spec?.metadata?.appName || 'spec'}_SPEC.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [markdown, spec]);

  const copyJSON = useCallback(async () => {
    if (!spec) return;
    await navigator.clipboard.writeText(JSON.stringify(spec, null, 2));
  }, [spec]);

  return {
    spec,
    markdown,
    isLoading,
    error,
    generateSpec,
    downloadMarkdown,
    copyJSON,
  };
}

/**
 * 시장 분석 전용 Hook
 */
export function useMarketAnalyzer() {
  const { executeSkill, isLoading, error } = useSkills();
  const [analysis, setAnalysis] = useState(null);

  const analyzeMarket = useCallback(
    async (idea, options = {}) => {
      const result = await executeSkill('marketAnalyzer', {
        idea,
        analysisDepth: options.depth || 'standard',
      });

      if (result.success) {
        setAnalysis(result.data);
      }

      return result;
    },
    [executeSkill]
  );

  return {
    analysis,
    isLoading,
    error,
    analyzeMarket,
    marketScore: analysis?.marketScore,
    recommendation: analysis?.recommendation,
  };
}

/**
 * 기술 스택 추천 전용 Hook
 */
export function useTechStackAdvisor() {
  const { executeSkill, isLoading, error } = useSkills();
  const [recommendation, setRecommendation] = useState(null);

  const getRecommendation = useCallback(
    async (idea, options = {}) => {
      const result = await executeSkill('techStackAdvisor', {
        idea,
        teamSize: options.teamSize || 1,
        timeline: options.timeline || 'standard',
        priorities: options.priorities || ['speed', 'quality'],
      });

      if (result.success) {
        setRecommendation(result.data);
      }

      return result;
    },
    [executeSkill]
  );

  return {
    recommendation,
    isLoading,
    error,
    getRecommendation,
    techStack: recommendation?.recommended,
    setupCommands: recommendation?.setupCommands,
  };
}

/**
 * 수익화 전략 전용 Hook
 */
export function useMonetizationPlanner() {
  const { executeSkill, isLoading, error } = useSkills();
  const [plan, setPlan] = useState(null);

  const createPlan = useCallback(
    async (idea, options = {}) => {
      const result = await executeSkill('monetizationPlanner', {
        idea,
        targetRevenue: options.targetRevenue || 'medium',
        userBase: options.userBase || 10000,
      });

      if (result.success) {
        setPlan(result.data);
      }

      return result;
    },
    [executeSkill]
  );

  return {
    plan,
    isLoading,
    error,
    createPlan,
    primaryModel: plan?.primaryModel,
    projections: plan?.projections,
    premiumFeatures: plan?.premiumFeatures,
  };
}

/**
 * UX 디자인 전용 Hook
 */
export function useUXDesigner() {
  const { executeSkill, isLoading, error } = useSkills();
  const [design, setDesign] = useState(null);

  const generateDesign = useCallback(
    async (idea, options = {}) => {
      const result = await executeSkill('uxDesigner', {
        idea,
        style: options.style || 'minimal',
      });

      if (result.success) {
        setDesign(result.data);
      }

      return result;
    },
    [executeSkill]
  );

  return {
    design,
    isLoading,
    error,
    generateDesign,
    designSystem: design?.designSystem,
    wireframes: design?.wireframes,
    componentLibrary: design?.componentLibrary,
    cssVariables: design?.cssVariables,
  };
}

/**
 * 코드 생성 전용 Hook
 */
export function useCodeGenerator() {
  const { executeSkill, isLoading, error } = useSkills();
  const [code, setCode] = useState(null);

  const generateCode = useCallback(
    async (idea, options = {}) => {
      const result = await executeSkill('codeGenerator', {
        idea,
        spec: options.spec,
        codeStyle: options.codeStyle || 'standard',
      });

      if (result.success) {
        setCode(result.data);
      }

      return result;
    },
    [executeSkill]
  );

  const downloadProject = useCallback(() => {
    if (!code) return;

    // 프로젝트 파일들을 ZIP으로 묶어서 다운로드하는 로직
    // 실제 구현에서는 JSZip 등 라이브러리 사용
    console.log('Project download not implemented yet');
  }, [code]);

  return {
    code,
    isLoading,
    error,
    generateCode,
    downloadProject,
    projectStructure: code?.projectStructure,
    coreFiles: code?.coreFiles,
    setupCommands: code?.setupCommands,
  };
}

/**
 * 출시 계획 전용 Hook
 */
export function useLaunchPlanner() {
  const { executeSkill, isLoading, error } = useSkills();
  const [plan, setPlan] = useState(null);

  const createLaunchPlan = useCallback(
    async (idea, options = {}) => {
      const result = await executeSkill('launchPlanner', {
        idea,
        resources: options.resources || {},
        timeline: options.timeline || '8주',
      });

      if (result.success) {
        setPlan(result.data);
      }

      return result;
    },
    [executeSkill]
  );

  return {
    plan,
    isLoading,
    error,
    createLaunchPlan,
    schedule: plan?.schedule,
    marketingPlan: plan?.marketingPlan,
    checklist: plan?.prelaunchChecklist,
    goals: plan?.goals,
  };
}

/**
 * 완전 워크플로우 Hook (아이디어 → 출시 계획까지)
 */
export function useCompleteWorkflow() {
  const { executeWorkflow, isLoading, error } = useSkills();
  const [results, setResults] = useState(null);

  const runCompleteWorkflow = useCallback(
    async (input) => {
      const result = await executeWorkflow('completePlanning', input);
      if (result.results) {
        setResults(result.results);
      }
      return result;
    },
    [executeWorkflow]
  );

  return {
    results,
    isLoading,
    error,
    runCompleteWorkflow,
    idea: results?.ideaGenerator?.ideas?.[0],
    spec: results?.specWriter?.spec,
    marketAnalysis: results?.marketAnalyzer,
    design: results?.uxDesigner,
    code: results?.codeGenerator,
    launchPlan: results?.launchPlanner,
  };
}

/**
 * 프롬프트 엔진 Hook
 */
export function usePromptEngine() {
  const [generatedPrompt, setGeneratedPrompt] = useState(null);

  const generatePrompt = useCallback((type, data, options = {}) => {
    const prompt = promptEngine.generatePrompt(type, data, options);
    setGeneratedPrompt(prompt);
    return prompt;
  }, []);

  const estimateTokens = useCallback((text) => {
    return promptEngine.estimateTokens(text);
  }, []);

  const parseResponse = useCallback((response, format) => {
    return promptEngine.parseResponse(response, format);
  }, []);

  return {
    generatedPrompt,
    generatePrompt,
    estimateTokens,
    parseResponse,
  };
}

export default useSkills;
