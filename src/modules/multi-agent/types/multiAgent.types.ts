export interface RegisteredAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  tools: string[];
  model: string;
  status: 'active' | 'busy' | 'offline';
  badge: string;
}

export interface AgentTaskStep {
  id: string;
  execution_id: string;
  step_order: number;
  assigned_agent: string;
  task_name: string;
  task_description: string;
  input_payload: any;
  output_payload: any;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'waiting_approval' | 'skipped';
  requires_approval: boolean;
  error_message?: string;
  tokens_used: number;
  latency_sec: number;
  started_at?: string;
  completed_at?: string;
}

export interface AgentCommunicationLog {
  id: string;
  execution_id: string;
  step_id?: string;
  sender_agent: string;
  receiver_agent: string;
  message_type: 'INSTRUCTION' | 'RESULT' | 'FEEDBACK' | 'HANDOFF' | 'ARTIFACT' | 'WARNING';
  content: string;
  payload?: any;
  created_at: string;
}

export interface AgentApproval {
  id: string;
  execution_id: string;
  step_id?: string;
  tenant_id: string;
  requester_id?: string;
  approver_id?: string;
  action_type: string;
  title: string;
  description: string;
  proposed_changes?: any;
  status: 'pending' | 'approved' | 'rejected';
  review_comments?: string;
  actioned_at?: string;
  created_at: string;
  requester?: { id: string; name: string; email: string };
  approver?: { id: string; name: string; email: string };
}

export interface AgentWorkflowExecution {
  id: string;
  tenant_id: string;
  user_id?: string;
  title: string;
  user_goal: string;
  workflow_type: string;
  status: 'pending' | 'planning' | 'in_progress' | 'waiting_approval' | 'completed' | 'failed';
  supervisor_model: string;
  plan?: {
    title?: string;
    workflow_type?: string;
    summary?: string;
    subtasks?: any[];
  };
  final_output?: {
    summary_markdown?: string;
    step_outputs?: Record<string, any>;
    status?: string;
    completed_at?: string;
  };
  metadata?: any;
  total_tokens: number;
  total_latency_sec: number;
  total_subtasks: number;
  completed_subtasks: number;
  created_at: string;
  steps?: AgentTaskStep[];
  communication_logs?: AgentCommunicationLog[];
  approvals?: AgentApproval[];
}

export interface CodeAnalysisResult {
  summary: string;
  architecture_pattern: string;
  complexity_score: number;
  maintainability_rating: string;
  classes_and_functions: Array<{ name: string; purpose: string }>;
  key_dependencies: string[];
  strengths: string[];
  potential_risks: string[];
  tokens_used?: number;
  latency_sec?: number;
}

export interface CodeReviewResult {
  quality_score: number;
  verdict: string;
  security_status: string;
  tenant_isolation_checked: boolean;
  critical_issues: Array<{ line_or_area: string; issue: string; recommendation: string }>;
  warnings: Array<{ line_or_area: string; issue: string; recommendation: string }>;
  suggestions: Array<{ type: string; description: string }>;
  review_summary_markdown: string;
  tokens_used?: number;
  latency_sec?: number;
}

export interface ErrorDiagnosticResult {
  error_type: string;
  root_cause: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  reproduction_scenario: string;
  recommended_fix_summary: string;
  patch_snippet: string;
}

export interface TestGenerationResult {
  framework: string;
  test_class_name: string;
  total_test_cases: number;
  test_cases: Array<{ name: string; type: string; description: string }>;
  test_code: string;
  mock_requirements: string[];
  estimated_coverage_percent: number;
  tokens_used?: number;
  latency_sec?: number;
}

export interface SandboxTestResult {
  framework: string;
  status: 'PASSED' | 'FAILED';
  total_tests: number;
  passed: number;
  failed: number;
  duration_sec: number;
  test_results: Array<{
    test_name: string;
    status: 'PASSED' | 'FAILED';
    duration_ms: number;
    assertions: number;
    failure_message?: string;
  }>;
  coverage_summary: {
    lines: string;
    methods: string;
    classes: string;
  };
  raw_output: string;
}
