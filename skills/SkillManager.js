/**
 * SkillManager - 스킬 통합 관리자
 *
 * 모든 스킬을 등록, 관리하고 워크플로우를 실행합니다.
 */

import IdeaGeneratorSkill from './ideaGenerator';
import SpecWriterSkill from './specWriter';
import MarketAnalyzerSkill from './marketAnalyzer';
import TechStackAdvisorSkill from './techStackAdvisor';
import MonetizationPlannerSkill from './monetizationPlanner';
import UXDesignerSkill from './uxDesigner';
import CodeGeneratorSkill from './codeGenerator';
import TossSdkHelperSkill from './tossSdkHelper';
import FeedbackAnalyzerSkill from './feedbackAnalyzer';
import LaunchPlannerSkill from './launchPlanner';

export default class SkillManager {
  constructor() {
    this.skills = new Map();
    this.workflows = new Map();
    this.executionLog = [];

    // 기본 스킬 등록
    this.registerDefaultSkills();

    // 기본 워크플로우 등록
    this.registerDefaultWorkflows();
  }

  /**
   * 기본 스킬 등록
   */
  registerDefaultSkills() {
    this.registerSkill('ideaGenerator', new IdeaGeneratorSkill());
    this.registerSkill('specWriter', new SpecWriterSkill());
    this.registerSkill('marketAnalyzer', new MarketAnalyzerSkill());
    this.registerSkill('techStackAdvisor', new TechStackAdvisorSkill());
    this.registerSkill('monetizationPlanner', new MonetizationPlannerSkill());
    this.registerSkill('uxDesigner', new UXDesignerSkill());
    this.registerSkill('codeGenerator', new CodeGeneratorSkill());
    this.registerSkill('tossSdkHelper', new TossSdkHelperSkill());
    this.registerSkill('feedbackAnalyzer', new FeedbackAnalyzerSkill());
    this.registerSkill('launchPlanner', new LaunchPlannerSkill());
  }

  /**
   * 스킬 등록
   */
  registerSkill(name, skill) {
    this.skills.set(name, skill);
    console.log(`Skill registered: ${name}`);
  }

  /**
   * 스킬 조회
   */
  getSkill(name) {
    return this.skills.get(name);
  }

  /**
   * 모든 스킬 목록 조회
   */
  listSkills() {
    return Array.from(this.skills.entries()).map(([name, skill]) => ({
      name,
      ...skill.getMetadata(),
    }));
  }

  /**
   * 카테고리별 스킬 조회
   */
  getSkillsByCategory(category) {
    return this.listSkills().filter((skill) => skill.category === category);
  }

  /**
   * 단일 스킬 실행
   */
  async executeSkill(skillName, input, context = {}) {
    const skill = this.skills.get(skillName);

    if (!skill) {
      throw new Error(`Skill not found: ${skillName}`);
    }

    if (!skill.isEnabled) {
      throw new Error(`Skill is disabled: ${skillName}`);
    }

    const startTime = Date.now();

    try {
      const result = await skill.run(input, context);

      this.executionLog.push({
        timestamp: new Date().toISOString(),
        skillName,
        input,
        result,
        duration: Date.now() - startTime,
        success: result.success,
      });

      return result;
    } catch (error) {
      this.executionLog.push({
        timestamp: new Date().toISOString(),
        skillName,
        input,
        error: error.message,
        duration: Date.now() - startTime,
        success: false,
      });

      throw error;
    }
  }

  /**
   * 기본 워크플로우 등록
   */
  registerDefaultWorkflows() {
    // 아이디어 → 기획서 워크플로우
    this.registerWorkflow('ideaToSpec', {
      name: '아이디어 → 기획서',
      description: '아이디어를 입력받아 완전한 기획서를 생성합니다.',
      steps: [
        { skill: 'ideaGenerator', inputMap: (input) => input },
        { skill: 'specWriter', inputMap: (input, prev) => ({ idea: prev.ideas[0] }) },
      ],
    });

    // 전체 분석 워크플로우
    this.registerWorkflow('fullAnalysis', {
      name: '종합 분석',
      description: '아이디어에 대한 종합적인 분석을 수행합니다.',
      steps: [
        { skill: 'marketAnalyzer', inputMap: (input) => ({ idea: input.idea }) },
        { skill: 'techStackAdvisor', inputMap: (input) => ({ idea: input.idea }) },
        { skill: 'monetizationPlanner', inputMap: (input) => ({ idea: input.idea }) },
      ],
      parallel: true,
    });

    // 완전 기획 워크플로우
    this.registerWorkflow('completePlanning', {
      name: '완전 기획',
      description: '아이디어부터 출시 계획까지 모든 기획을 생성합니다.',
      steps: [
        { skill: 'ideaGenerator', inputMap: (input) => input },
        {
          skill: 'specWriter',
          inputMap: (input, prev) => ({
            idea: prev.ideaGenerator?.ideas?.[0] || input.idea,
          }),
        },
        {
          skill: 'marketAnalyzer',
          inputMap: (input, prev) => ({
            idea: prev.ideaGenerator?.ideas?.[0] || input.idea,
          }),
        },
        {
          skill: 'uxDesigner',
          inputMap: (input, prev) => ({
            idea: prev.ideaGenerator?.ideas?.[0] || input.idea,
          }),
        },
        {
          skill: 'codeGenerator',
          inputMap: (input, prev) => ({
            idea: prev.ideaGenerator?.ideas?.[0] || input.idea,
            spec: prev.specWriter?.spec,
          }),
        },
        {
          skill: 'launchPlanner',
          inputMap: (input, prev) => ({
            idea: prev.ideaGenerator?.ideas?.[0] || input.idea,
          }),
        },
      ],
    });

    // 개발 준비 워크플로우
    this.registerWorkflow('devReady', {
      name: '개발 준비',
      description: '개발에 필요한 모든 자료를 생성합니다.',
      steps: [
        { skill: 'specWriter', inputMap: (input) => ({ idea: input.idea }) },
        { skill: 'techStackAdvisor', inputMap: (input) => ({ idea: input.idea }) },
        { skill: 'uxDesigner', inputMap: (input) => ({ idea: input.idea }) },
        {
          skill: 'codeGenerator',
          inputMap: (input, prev) => ({
            idea: input.idea,
            spec: prev.specWriter?.spec,
          }),
        },
        { skill: 'tossSdkHelper', inputMap: (input) => ({ idea: input.idea }) },
      ],
    });
  }

  /**
   * 워크플로우 등록
   */
  registerWorkflow(name, workflow) {
    this.workflows.set(name, workflow);
    console.log(`Workflow registered: ${name}`);
  }

  /**
   * 워크플로우 실행
   */
  async executeWorkflow(workflowName, input, context = {}) {
    const workflow = this.workflows.get(workflowName);

    if (!workflow) {
      throw new Error(`Workflow not found: ${workflowName}`);
    }

    const startTime = Date.now();
    const results = {};
    let previousResults = {};

    console.log(`Starting workflow: ${workflow.name}`);

    if (workflow.parallel) {
      // 병렬 실행
      const promises = workflow.steps.map(async (step) => {
        const stepInput = step.inputMap(input, previousResults);
        const result = await this.executeSkill(step.skill, stepInput, context);
        return { skill: step.skill, result };
      });

      const parallelResults = await Promise.all(promises);

      for (const { skill, result } of parallelResults) {
        results[skill] = result.data;
      }
    } else {
      // 순차 실행
      for (const step of workflow.steps) {
        console.log(`Executing step: ${step.skill}`);

        const stepInput = step.inputMap(input, previousResults);
        const result = await this.executeSkill(step.skill, stepInput, context);

        results[step.skill] = result.data;
        previousResults[step.skill] = result.data;
      }
    }

    const duration = Date.now() - startTime;
    console.log(`Workflow completed: ${workflow.name} (${duration}ms)`);

    return {
      workflow: workflowName,
      results,
      duration,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 워크플로우 목록 조회
   */
  listWorkflows() {
    return Array.from(this.workflows.entries()).map(([name, workflow]) => ({
      name,
      displayName: workflow.name,
      description: workflow.description,
      steps: workflow.steps.map((s) => s.skill),
    }));
  }

  /**
   * 실행 로그 조회
   */
  getExecutionLog(limit = 50) {
    return this.executionLog.slice(-limit);
  }

  /**
   * 스킬 추천
   */
  recommendSkills(userInput) {
    const recommendations = [];
    const inputLower = userInput.toLowerCase();

    const skillKeywords = {
      ideaGenerator: ['아이디어', '생각', '만들고 싶', '뭘 만들'],
      specWriter: ['기획서', '명세', '문서', '스펙'],
      marketAnalyzer: ['시장', '경쟁', '분석', '기회'],
      techStackAdvisor: ['기술', '스택', '프레임워크', '어떤 기술'],
      monetizationPlanner: ['수익', '돈', '비즈니스', '매출'],
      uxDesigner: ['디자인', 'UI', 'UX', '화면'],
      codeGenerator: ['코드', '개발', '구현', '만들어'],
      tossSdkHelper: ['토스', 'SDK', '연동', '인증'],
      feedbackAnalyzer: ['피드백', '리뷰', '사용자 의견'],
      launchPlanner: ['출시', '런칭', '마케팅', '배포'],
    };

    for (const [skillName, keywords] of Object.entries(skillKeywords)) {
      const matches = keywords.filter((k) => inputLower.includes(k));

      if (matches.length > 0) {
        const skill = this.skills.get(skillName);
        recommendations.push({
          skillName,
          skill: skill.getMetadata(),
          matchedKeywords: matches,
          confidence: matches.length / keywords.length,
        });
      }
    }

    return recommendations.sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * 대화형 스킬 실행 (자연어 입력)
   */
  async executeFromNaturalLanguage(userInput, context = {}) {
    const recommendations = this.recommendSkills(userInput);

    if (recommendations.length === 0) {
      return {
        success: false,
        message: '적합한 스킬을 찾지 못했습니다. 더 구체적으로 말씀해주세요.',
        suggestions: this.listSkills().map((s) => s.description),
      };
    }

    const topSkill = recommendations[0];

    // 입력에서 컨텍스트 추출
    const extractedInput = this.extractInputFromNaturalLanguage(userInput, topSkill.skillName);

    const result = await this.executeSkill(topSkill.skillName, extractedInput, context);

    return {
      success: result.success,
      skillUsed: topSkill.skillName,
      confidence: topSkill.confidence,
      data: result.data,
      error: result.error,
    };
  }

  /**
   * 자연어에서 입력 파라미터 추출
   */
  extractInputFromNaturalLanguage(userInput, skillName) {
    // 간단한 키워드 기반 추출 (실제로는 NLP 사용)
    const extracted = {};

    // 카테고리 추출
    const categoryKeywords = {
      finance: ['금융', '재테크', '돈', '저축', '투자'],
      lifestyle: ['라이프', '습관', '일상', '건강'],
      productivity: ['생산성', '업무', '집중', '시간'],
      social: ['소셜', '친구', '커뮤니티', '모임'],
      learning: ['학습', '교육', '공부', '강의'],
      commerce: ['쇼핑', '커머스', '구매', '판매'],
    };

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some((k) => userInput.includes(k))) {
        extracted.category = category;
        break;
      }
    }

    // 키워드 추출
    const words = userInput.split(/\s+/).filter((w) => w.length > 1);
    extracted.keywords = words.slice(0, 5);

    // 문제 추출
    if (userInput.includes('하고 싶') || userInput.includes('필요')) {
      extracted.problemToSolve = userInput;
    }

    return extracted;
  }

  /**
   * 통계 조회
   */
  getStatistics() {
    const totalExecutions = this.executionLog.length;
    const successfulExecutions = this.executionLog.filter((l) => l.success).length;

    const skillUsage = {};
    for (const log of this.executionLog) {
      skillUsage[log.skillName] = (skillUsage[log.skillName] || 0) + 1;
    }

    const avgDuration =
      totalExecutions > 0
        ? this.executionLog.reduce((sum, l) => sum + l.duration, 0) / totalExecutions
        : 0;

    return {
      totalExecutions,
      successfulExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
      skillUsage,
      averageDuration: Math.round(avgDuration),
      registeredSkills: this.skills.size,
      registeredWorkflows: this.workflows.size,
    };
  }
}

// 싱글톤 인스턴스 export
export const skillManager = new SkillManager();
