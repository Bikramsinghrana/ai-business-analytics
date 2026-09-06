import { apiClient } from '../../../services/apiClient';
import {
  RegisteredAgent,
  AgentWorkflowExecution,
  AgentApproval,
  CodeAnalysisResult,
  CodeReviewResult,
  ErrorDiagnosticResult,
  TestGenerationResult,
  SandboxTestResult,
} from '../types/multiAgent.types';

export const multiAgentApi = {
  // ── Supervisor & Orchestration APIs ──
  getAgents: async (): Promise<RegisteredAgent[]> => {
    const res = await apiClient.get<RegisteredAgent[]>('/multi-agent/agents');
    return Array.isArray(res.data) ? res.data : [];
  },

  planWorkflow: async (goal: string, provider?: string, model?: string): Promise<any> => {
    const res = await apiClient.post<any>('/multi-agent/plan', {
      goal,
      provider,
      model,
    });
    return res.data;
  },

  executeWorkflow: async (goal: string, customPlan?: any, provider?: string, model?: string): Promise<AgentWorkflowExecution> => {
    const res = await apiClient.post<AgentWorkflowExecution>('/multi-agent/execute', {
      goal,
      custom_plan: customPlan,
      provider,
      model,
    });
    return res.data;
  },

  getExecutions: async (): Promise<{ data: AgentWorkflowExecution[] }> => {
    const res = await apiClient.get<any>('/multi-agent/executions');
    const items = res.data?.data || (Array.isArray(res.data) ? res.data : []);
    return { data: items };
  },

  getExecutionById: async (id: string): Promise<AgentWorkflowExecution> => {
    const res = await apiClient.get<AgentWorkflowExecution>(`/multi-agent/executions/${id}`);
    return res.data;
  },

  getApprovals: async (status?: string): Promise<AgentApproval[]> => {
    const res = await apiClient.get<AgentApproval[]>('/multi-agent/approvals', {
      params: { status },
    });
    return Array.isArray(res.data) ? res.data : [];
  },

  actionApproval: async (id: string, action: 'approve' | 'reject', comments?: string): Promise<AgentApproval> => {
    const res = await apiClient.post<AgentApproval>(`/multi-agent/approvals/${id}/action`, {
      action,
      comments,
    });
    return res.data;
  },

  // ── Developer & Tester Agent APIs ──
  analyzeCode: async (code: string, language?: string, context?: string): Promise<CodeAnalysisResult> => {
    const res = await apiClient.post<CodeAnalysisResult>('/multi-agent/dev/analyze', {
      code,
      language,
      context,
    });
    return res.data;
  },

  explainCode: async (code: string, language?: string, audience?: string): Promise<{ content: string; tokens_used: number; latency_sec: number }> => {
    const res = await apiClient.post<{ content: string; tokens_used: number; latency_sec: number }>('/multi-agent/dev/explain', {
      code,
      language,
      audience,
    });
    return res.data;
  },

  reviewCode: async (code: string, language?: string): Promise<CodeReviewResult> => {
    const res = await apiClient.post<CodeReviewResult>('/multi-agent/dev/review', {
      code,
      language,
    });
    return res.data;
  },

  diagnoseError: async (errorMessage: string, stackTrace?: string, code?: string): Promise<ErrorDiagnosticResult> => {
    const res = await apiClient.post<ErrorDiagnosticResult>('/multi-agent/dev/diagnose', {
      error_message: errorMessage,
      stack_trace: stackTrace,
      code,
    });
    return res.data;
  },

  suggestFix: async (code: string, instruction: string, language?: string): Promise<any> => {
    const res = await apiClient.post<any>('/multi-agent/dev/suggest-fix', {
      code,
      instruction,
      language,
    });
    return res.data;
  },

  generateTests: async (code: string, framework?: string, className?: string): Promise<TestGenerationResult> => {
    const res = await apiClient.post<TestGenerationResult>('/multi-agent/dev/generate-tests', {
      code,
      framework,
      class_name: className,
    });
    return res.data;
  },

  runSandboxTest: async (testCode: string, framework?: string): Promise<SandboxTestResult> => {
    const res = await apiClient.post<SandboxTestResult>('/multi-agent/dev/run-sandbox-test', {
      test_code: testCode,
      framework,
    });
    return res.data;
  },
};
