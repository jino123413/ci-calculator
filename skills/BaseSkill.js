/**
 * BaseSkill - 모든 스킬의 기본 클래스
 *
 * 각 스킬은 이 클래스를 상속받아 구현됩니다.
 * 일관된 인터페이스와 실행 패턴을 제공합니다.
 */

export default class BaseSkill {
  constructor(config = {}) {
    this.name = config.name || 'BaseSkill';
    this.description = config.description || '';
    this.version = config.version || '1.0.0';
    this.category = config.category || 'general';
    this.dependencies = config.dependencies || [];
    this.inputSchema = config.inputSchema || {};
    this.outputSchema = config.outputSchema || {};
    this.isEnabled = true;
    this.executionHistory = [];
  }

  /**
   * 스킬의 메타데이터 반환
   */
  getMetadata() {
    return {
      name: this.name,
      description: this.description,
      version: this.version,
      category: this.category,
      dependencies: this.dependencies,
      inputSchema: this.inputSchema,
      outputSchema: this.outputSchema,
    };
  }

  /**
   * 입력값 검증
   */
  validateInput(input) {
    const errors = [];
    const required = Object.entries(this.inputSchema)
      .filter(([_, schema]) => schema.required)
      .map(([key]) => key);

    for (const field of required) {
      if (input[field] === undefined || input[field] === null) {
        errors.push(`필수 필드 '${field}'가 누락되었습니다.`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * 스킬 실행 (서브클래스에서 오버라이드)
   */
  async execute(input, context = {}) {
    throw new Error('execute 메서드는 서브클래스에서 구현해야 합니다.');
  }

  /**
   * 스킬 실행 래퍼 (로깅, 검증 포함)
   */
  async run(input, context = {}) {
    const startTime = Date.now();

    // 입력 검증
    const validation = this.validateInput(input);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.join(', '),
        executionTime: Date.now() - startTime,
      };
    }

    try {
      const result = await this.execute(input, context);

      const execution = {
        timestamp: new Date().toISOString(),
        input,
        output: result,
        executionTime: Date.now() - startTime,
        success: true,
      };

      this.executionHistory.push(execution);

      return {
        success: true,
        data: result,
        executionTime: execution.executionTime,
      };
    } catch (error) {
      const execution = {
        timestamp: new Date().toISOString(),
        input,
        error: error.message,
        executionTime: Date.now() - startTime,
        success: false,
      };

      this.executionHistory.push(execution);

      return {
        success: false,
        error: error.message,
        executionTime: execution.executionTime,
      };
    }
  }

  /**
   * 실행 이력 조회
   */
  getHistory(limit = 10) {
    return this.executionHistory.slice(-limit);
  }

  /**
   * 스킬 활성화/비활성화
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }
}
