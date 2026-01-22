/**
 * PromptEngine - AI 프롬프트 생성 엔진
 *
 * 스킬 실행 결과를 바탕으로 AI 모델에 전달할 프롬프트를 생성합니다.
 * Claude, GPT 등 다양한 LLM과 연동하여 더 풍부한 결과를 생성할 수 있습니다.
 */

export default class PromptEngine {
  constructor(config = {}) {
    this.config = {
      maxTokens: config.maxTokens || 4000,
      temperature: config.temperature || 0.7,
      model: config.model || 'claude',
      ...config,
    };

    // 프롬프트 템플릿
    this.templates = {
      ideaGeneration: this.getIdeaGenerationTemplate(),
      specWriting: this.getSpecWritingTemplate(),
      marketAnalysis: this.getMarketAnalysisTemplate(),
      codeGeneration: this.getCodeGenerationTemplate(),
      feedbackSummary: this.getFeedbackSummaryTemplate(),
      general: this.getGeneralTemplate(),
    };

    // 시스템 프롬프트
    this.systemPrompts = {
      default: this.getDefaultSystemPrompt(),
      creative: this.getCreativeSystemPrompt(),
      analytical: this.getAnalyticalSystemPrompt(),
      technical: this.getTechnicalSystemPrompt(),
    };
  }

  /**
   * 프롬프트 생성
   */
  generatePrompt(type, data, options = {}) {
    const template = this.templates[type] || this.templates.general;
    const systemPrompt = this.systemPrompts[options.mode || 'default'];

    const userPrompt = this.fillTemplate(template, data);

    return {
      system: systemPrompt,
      user: userPrompt,
      config: {
        maxTokens: options.maxTokens || this.config.maxTokens,
        temperature: options.temperature || this.config.temperature,
      },
    };
  }

  /**
   * 템플릿에 데이터 채우기
   */
  fillTemplate(template, data) {
    let result = template;

    for (const [key, value] of Object.entries(data)) {
      const placeholder = `{{${key}}}`;
      const stringValue = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);
      result = result.replace(new RegExp(placeholder, 'g'), stringValue);
    }

    // 남은 플레이스홀더 제거
    result = result.replace(/\{\{[^}]+\}\}/g, '');

    return result.trim();
  }

  // ===== 시스템 프롬프트 =====

  getDefaultSystemPrompt() {
    return `당신은 앱인토스(토스 미니앱) 전문 AI 어시스턴트입니다.

핵심 원칙:
- 토스 앱 내에서 실행되는 미니앱의 특성을 고려합니다
- 간단하고 직관적인 UX를 우선시합니다
- 2초 이내 로딩, 3탭 이내 목표 달성을 목표로 합니다
- MZ세대 사용자 경험에 최적화된 조언을 제공합니다

응답 스타일:
- 한국어로 친절하고 명확하게 답변합니다
- 실용적이고 실행 가능한 조언을 제공합니다
- 필요시 코드 예시를 포함합니다`;
  }

  getCreativeSystemPrompt() {
    return `당신은 창의적인 앱 아이디어 전문가입니다.

역할:
- 독창적이고 혁신적인 앱 아이디어를 제안합니다
- 트렌드와 사용자 니즈를 연결합니다
- 기존 서비스와 차별화된 관점을 제시합니다

창의성 원칙:
- "만약에...?" 질문으로 시작합니다
- 서로 다른 영역을 연결합니다
- 사용자의 숨겨진 니즈를 발굴합니다
- 단순하지만 강력한 아이디어를 선호합니다`;
  }

  getAnalyticalSystemPrompt() {
    return `당신은 데이터 기반 분석 전문가입니다.

분석 원칙:
- 객관적인 데이터와 근거를 기반으로 분석합니다
- 시장 규모, 경쟁 환경, 기회 요인을 체계적으로 분석합니다
- SWOT, Porter's Five Forces 등 프레임워크를 활용합니다
- 리스크와 기회를 균형있게 제시합니다

응답 형식:
- 구조화된 분석 결과를 제공합니다
- 핵심 인사이트를 명확히 도출합니다
- 실행 가능한 권장사항을 포함합니다`;
  }

  getTechnicalSystemPrompt() {
    return `당신은 프론트엔드 개발 전문가입니다.

기술 스택:
- React 18+, TypeScript, Vite
- Tailwind CSS, Zustand, TanStack Query
- 토스 SDK 연동 경험

코딩 원칙:
- 클린 코드와 모던 패턴을 따릅니다
- 성능 최적화를 고려합니다
- 타입 안정성을 보장합니다
- 앱인토스 환경에 최적화된 코드를 작성합니다

응답 형식:
- 실행 가능한 코드를 제공합니다
- 코드에 주석으로 설명을 포함합니다
- 모범 사례를 따릅니다`;
  }

  // ===== 프롬프트 템플릿 =====

  getIdeaGenerationTemplate() {
    return `## 앱 아이디어 생성 요청

### 입력 정보
- 카테고리: {{category}}
- 키워드: {{keywords}}
- 타겟 사용자: {{targetUsers}}
- 해결할 문제: {{problemToSolve}}

### 요청사항
위 정보를 바탕으로 앱인토스에 적합한 미니앱 아이디어 3개를 제안해주세요.

각 아이디어에 포함할 내용:
1. 앱 이름 (창의적이고 기억하기 쉬운)
2. 한 줄 설명
3. 핵심 기능 4개
4. 타겟 사용자
5. 수익화 방안
6. 앱인토스에서의 차별점

### 고려사항
- 토스 앱 내에서 빠르게 사용할 수 있는 가벼운 앱
- 설치 없이 바로 가치를 제공하는 앱
- MZ세대의 라이프스타일에 맞는 앱
- 습관적으로 재방문하게 만드는 앱`;
  }

  getSpecWritingTemplate() {
    return `## 상세 기획서 작성 요청

### 앱 정보
- 앱 이름: {{appName}}
- 설명: {{description}}
- 카테고리: {{category}}
- 핵심 기능: {{features}}
- 타겟 사용자: {{target}}

### 기존 분석 결과
{{existingAnalysis}}

### 요청사항
위 앱에 대한 상세 기획서를 작성해주세요.

포함할 섹션:
1. 개요 및 핵심 가치
2. 기능 명세 (User Story 형식)
3. 데이터 모델
4. API 설계
5. UI/UX 가이드라인
6. 개발 단계 및 마일스톤
7. 성공 지표 (KPI)

### 형식
마크다운 형식으로 작성하고, 개발자가 바로 구현할 수 있는 수준의 상세함을 유지해주세요.`;
  }

  getMarketAnalysisTemplate() {
    return `## 시장 분석 요청

### 앱 정보
- 앱 이름: {{appName}}
- 카테고리: {{category}}
- 설명: {{description}}
- 타겟 사용자: {{target}}

### 분석 요청 항목
1. **시장 규모**: TAM, SAM, SOM
2. **경쟁 환경**: 주요 경쟁사, 차별화 포인트
3. **SWOT 분석**: 강점, 약점, 기회, 위협
4. **진입 전략**: 시장 진입 방법
5. **리스크 분석**: 주요 리스크 및 대응 방안

### 토스 생태계 관점
- 앱인토스 플랫폼의 기회
- 토스 사용자 기반 활용 방안
- 토스 서비스 연동 가능성

### 출력 형식
각 분석 항목에 대해 구체적인 데이터와 근거를 포함해주세요.
점수나 등급을 매길 수 있는 항목은 정량화해주세요.`;
  }

  getCodeGenerationTemplate() {
    return `## 코드 생성 요청

### 앱 정보
- 앱 이름: {{appName}}
- 기능: {{features}}

### 기술 스택
- Framework: React 18+ with TypeScript
- State: Zustand + TanStack Query
- Styling: Tailwind CSS
- Build: Vite

### 생성 요청 코드
{{codeRequest}}

### 요구사항
1. TypeScript 타입 정의 포함
2. 에러 처리 포함
3. 로딩 상태 처리
4. 주석으로 설명 포함
5. 앱인토스 가이드라인 준수

### 파일 구조
각 파일의 경로와 함께 코드를 제공해주세요.`;
  }

  getFeedbackSummaryTemplate() {
    return `## 피드백 분석 요청

### 피드백 데이터
총 {{totalCount}}개의 피드백

### 감성 분포
- 긍정: {{positiveCount}}개
- 부정: {{negativeCount}}개
- 중립: {{neutralCount}}개

### 샘플 피드백
{{sampleFeedbacks}}

### 분석 요청
1. 주요 긍정적 피드백 패턴
2. 주요 부정적 피드백 패턴
3. 자주 언급되는 키워드
4. 개선이 필요한 영역
5. 우선순위가 높은 액션 아이템 5개

### 출력 형식
인사이트를 명확하게 정리하고, 실행 가능한 개선 방안을 제시해주세요.`;
  }

  getGeneralTemplate() {
    return `## 요청

{{prompt}}

### 컨텍스트
{{context}}

### 추가 정보
{{additionalInfo}}

### 응답 형식
명확하고 구조화된 형식으로 응답해주세요.`;
  }

  // ===== 프롬프트 체이닝 =====

  /**
   * 여러 프롬프트를 체이닝하여 복합 워크플로우 생성
   */
  createChainedPrompt(steps) {
    return {
      steps: steps.map((step, index) => ({
        order: index + 1,
        type: step.type,
        template: this.templates[step.type],
        dependsOn: step.dependsOn || (index > 0 ? index : null),
        outputKey: step.outputKey || `step${index + 1}`,
      })),
      execute: async (initialData, llmClient) => {
        const results = {};

        for (const step of this.createChainedPrompt(steps).steps) {
          const inputData = {
            ...initialData,
            ...results,
          };

          const prompt = this.generatePrompt(step.type, inputData);

          // LLM 클라이언트 호출 (실제 구현 필요)
          const response = await llmClient.complete(prompt);

          results[step.outputKey] = response;
        }

        return results;
      },
    };
  }

  // ===== 프롬프트 최적화 =====

  /**
   * 프롬프트 토큰 수 추정
   */
  estimateTokens(text) {
    // 한글: 대략 1.5자당 1토큰, 영어: 4자당 1토큰
    const koreanChars = (text.match(/[가-힣]/g) || []).length;
    const otherChars = text.length - koreanChars;

    return Math.ceil(koreanChars / 1.5 + otherChars / 4);
  }

  /**
   * 프롬프트 압축 (토큰 제한 대응)
   */
  compressPrompt(prompt, maxTokens) {
    const currentTokens = this.estimateTokens(prompt);

    if (currentTokens <= maxTokens) {
      return prompt;
    }

    // 압축 전략
    // 1. 예시 줄이기
    // 2. 반복 내용 제거
    // 3. 덜 중요한 섹션 축약

    let compressed = prompt;

    // JSON/배열 데이터 축약
    compressed = compressed.replace(/\[([^\]]{500,})\]/g, (match) => {
      const items = match.slice(1, -1).split(',');
      if (items.length > 5) {
        return `[${items.slice(0, 3).join(',')}... 외 ${items.length - 3}개]`;
      }
      return match;
    });

    // 긴 설명 축약
    compressed = compressed.replace(/([^.]{200,}\.)/g, (match) => {
      return match.slice(0, 150) + '...';
    });

    return compressed;
  }

  // ===== 응답 파싱 =====

  /**
   * LLM 응답에서 구조화된 데이터 추출
   */
  parseResponse(response, expectedFormat = 'text') {
    if (expectedFormat === 'json') {
      // JSON 블록 추출
      const jsonMatch = response.match(/```json\n?([\s\S]*?)\n?```/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1]);
        } catch {
          console.warn('JSON 파싱 실패, 텍스트로 반환');
        }
      }

      // JSON 객체 직접 추출 시도
      const directJson = response.match(/\{[\s\S]*\}/);
      if (directJson) {
        try {
          return JSON.parse(directJson[0]);
        } catch {
          // 파싱 실패
        }
      }
    }

    if (expectedFormat === 'markdown') {
      // 마크다운 구조 파싱
      return this.parseMarkdown(response);
    }

    if (expectedFormat === 'list') {
      // 리스트 항목 추출
      const items = response.match(/^[-*]\s+(.+)$/gm);
      return items ? items.map((item) => item.replace(/^[-*]\s+/, '')) : [];
    }

    return response;
  }

  /**
   * 마크다운 파싱
   */
  parseMarkdown(markdown) {
    const sections = {};
    let currentSection = 'intro';
    const lines = markdown.split('\n');

    for (const line of lines) {
      const headerMatch = line.match(/^(#{1,3})\s+(.+)/);
      if (headerMatch) {
        currentSection = headerMatch[2].trim().toLowerCase().replace(/\s+/g, '_');
        sections[currentSection] = [];
      } else if (line.trim()) {
        if (!sections[currentSection]) {
          sections[currentSection] = [];
        }
        sections[currentSection].push(line);
      }
    }

    // 배열을 문자열로 변환
    for (const key of Object.keys(sections)) {
      sections[key] = sections[key].join('\n').trim();
    }

    return sections;
  }

  // ===== 프롬프트 템플릿 커스터마이징 =====

  /**
   * 커스텀 템플릿 등록
   */
  registerTemplate(name, template) {
    this.templates[name] = template;
  }

  /**
   * 시스템 프롬프트 커스터마이징
   */
  setSystemPrompt(mode, prompt) {
    this.systemPrompts[mode] = prompt;
  }

  /**
   * Few-shot 예시 추가
   */
  addFewShotExamples(templateName, examples) {
    const currentTemplate = this.templates[templateName];
    if (!currentTemplate) {
      throw new Error(`Template not found: ${templateName}`);
    }

    const examplesText = examples
      .map(
        (ex, i) => `### 예시 ${i + 1}
입력: ${ex.input}
출력: ${ex.output}`
      )
      .join('\n\n');

    this.templates[templateName] = `${currentTemplate}

## 참고 예시
${examplesText}`;
  }
}

// 싱글톤 인스턴스 export
export const promptEngine = new PromptEngine();
