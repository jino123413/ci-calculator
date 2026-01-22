/**
 * CodeGeneratorSkill - 코드 생성 스킬
 *
 * 앱 아이디어와 기획서를 바탕으로 초기 코드 템플릿을 생성합니다.
 */

import BaseSkill from './BaseSkill';

export default class CodeGeneratorSkill extends BaseSkill {
  constructor() {
    super({
      name: 'CodeGenerator',
      description: '앱인토스 미니앱의 보일러플레이트 코드 생성',
      version: '1.0.0',
      category: 'development',
      inputSchema: {
        idea: { type: 'object', required: true, description: '앱 아이디어' },
        spec: { type: 'object', required: false, description: '상세 기획서' },
        codeStyle: { type: 'string', required: false, description: 'minimal | standard | comprehensive' },
      },
      outputSchema: {
        projectStructure: { type: 'object', description: '프로젝트 구조' },
        coreFiles: { type: 'array', description: '핵심 코드 파일들' },
        setupCommands: { type: 'array', description: '설정 명령어' },
      },
    });
  }

  async execute(input, context = {}) {
    const { idea, spec, codeStyle = 'standard' } = input;

    // 1. 프로젝트 구조 생성
    const projectStructure = this.generateProjectStructure(idea);

    // 2. 핵심 파일 생성
    const coreFiles = this.generateCoreFiles(idea, spec, codeStyle);

    // 3. 컴포넌트 코드 생성
    const components = this.generateComponents(idea);

    // 4. 훅 코드 생성
    const hooks = this.generateHooks(idea);

    // 5. API 코드 생성
    const apiCode = this.generateApiCode(idea);

    // 6. 스토어 코드 생성
    const storeCode = this.generateStoreCode(idea);

    // 7. 타입 정의 생성
    const types = this.generateTypes(idea);

    // 8. 설정 파일 생성
    const configFiles = this.generateConfigFiles(idea);

    // 9. 설치 명령어
    const setupCommands = this.generateSetupCommands(idea);

    return {
      projectStructure,
      coreFiles: [
        ...coreFiles,
        ...components,
        ...hooks,
        ...apiCode,
        ...storeCode,
        ...types,
        ...configFiles,
      ],
      setupCommands,
      quickStart: this.generateQuickStart(idea),
    };
  }

  generateProjectStructure(idea) {
    const appName = this.toKebabCase(idea.title);

    return {
      root: appName,
      structure: {
        'src/': {
          'components/': {
            'common/': ['Button.tsx', 'Input.tsx', 'Card.tsx', 'Modal.tsx', 'Toast.tsx', 'LoadingSpinner.tsx'],
            'features/': idea.features?.map((f) => `${this.toPascalCase(f)}/`) || ['Feature/'],
            'layout/': ['Header.tsx', 'BottomNav.tsx', 'PageContainer.tsx'],
          },
          'pages/': ['HomePage.tsx', 'ActivityPage.tsx', 'SettingsPage.tsx'],
          'hooks/': ['useAuth.ts', 'useToast.ts', 'useAsync.ts'],
          'api/': ['client.ts', 'endpoints.ts', 'types.ts'],
          'stores/': ['appStore.ts', 'userStore.ts'],
          'types/': ['index.ts', 'api.ts', 'models.ts'],
          'utils/': ['format.ts', 'validation.ts', 'storage.ts'],
          'constants/': ['routes.ts', 'config.ts'],
          'styles/': ['global.css', 'variables.css'],
          'App.tsx': null,
          'main.tsx': null,
        },
        'public/': ['favicon.svg', 'manifest.json'],
        'index.html': null,
        'package.json': null,
        'vite.config.ts': null,
        'tailwind.config.js': null,
        'tsconfig.json': null,
      },
    };
  }

  generateCoreFiles(idea, spec, codeStyle) {
    const appName = idea.title;
    const features = idea.features || ['핵심 기능'];

    return [
      {
        path: 'src/App.tsx',
        content: `
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/common/Toast';
import { PageContainer } from './components/layout/PageContainer';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { ActivityPage } from './pages/ActivityPage';
import { SettingsPage } from './pages/SettingsPage';
import './styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <PageContainer>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/activity" element={<ActivityPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
          <BottomNav />
        </PageContainer>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
        `.trim(),
      },
      {
        path: 'src/main.tsx',
        content: `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
        `.trim(),
      },
      {
        path: 'src/pages/HomePage.tsx',
        content: `
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { useAppStore } from '../stores/appStore';

export function HomePage() {
  const { user } = useAppStore();

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="${appName}" />

      <main className="flex-1 p-4 space-y-4">
        {/* 환영 메시지 */}
        <section className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900">
            안녕하세요{user?.name ? \`, \${user.name}님\` : ''}!
          </h1>
          <p className="mt-2 text-gray-600">
            ${features[0]}을(를) 시작해보세요
          </p>
        </section>

        {/* 메인 카드 */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">${features[0]}</h2>
          <p className="text-gray-600 mb-4">
            오늘의 목표를 설정하고 달성해보세요.
          </p>
          <Button variant="primary" fullWidth>
            시작하기
          </Button>
        </Card>

        {/* 빠른 액션 */}
        <section className="grid grid-cols-2 gap-3">
          ${features
            .slice(1, 5)
            .map(
              (f) => `
          <Card className="p-4 text-center" onClick={() => console.log('${f}')}>
            <div className="text-2xl mb-2">📊</div>
            <span className="text-sm font-medium">${f}</span>
          </Card>`
            )
            .join('')}
        </section>
      </main>
    </div>
  );
}
        `.trim(),
      },
      {
        path: 'src/pages/ActivityPage.tsx',
        content: `
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useActivities } from '../hooks/useActivities';

export function ActivityPage() {
  const { data: activities, isLoading, error } = useActivities();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="활동 내역" showBack />

      <main className="flex-1 p-4">
        {activities?.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-gray-600">아직 활동 내역이 없어요</p>
            <p className="text-gray-400 text-sm mt-1">
              첫 번째 활동을 시작해보세요!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities?.map((activity) => (
              <Card key={activity.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{activity.title}</h3>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <span className="text-blue-500 font-semibold">
                    {activity.value}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
        `.trim(),
      },
      {
        path: 'src/pages/SettingsPage.tsx',
        content: `
import { Header } from '../components/layout/Header';
import { Card } from '../components/common/Card';
import { useAppStore } from '../stores/appStore';

export function SettingsPage() {
  const { user, logout } = useAppStore();

  const settingsGroups = [
    {
      title: '알림',
      items: [
        { label: '푸시 알림', type: 'toggle', value: true },
        { label: '이메일 알림', type: 'toggle', value: false },
      ],
    },
    {
      title: '정보',
      items: [
        { label: '이용약관', type: 'link' },
        { label: '개인정보처리방침', type: 'link' },
        { label: '버전', type: 'text', value: '1.0.0' },
      ],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <Header title="설정" showBack />

      <main className="flex-1 p-4 space-y-4">
        {/* 프로필 섹션 */}
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <div>
              <h2 className="font-semibold text-lg">{user?.name || '게스트'}</h2>
              <p className="text-sm text-gray-500">{user?.email || '로그인이 필요합니다'}</p>
            </div>
          </div>
        </Card>

        {/* 설정 그룹 */}
        {settingsGroups.map((group) => (
          <Card key={group.title} className="overflow-hidden">
            <div className="px-4 py-2 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-600">{group.title}</h3>
            </div>
            <div className="divide-y">
              {group.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between p-4">
                  <span>{item.label}</span>
                  {item.type === 'toggle' && (
                    <input type="checkbox" defaultChecked={item.value} className="toggle" />
                  )}
                  {item.type === 'link' && <span className="text-gray-400">→</span>}
                  {item.type === 'text' && <span className="text-gray-500">{item.value}</span>}
                </div>
              ))}
            </div>
          </Card>
        ))}

        {/* 로그아웃 */}
        <button
          onClick={logout}
          className="w-full p-4 text-red-500 font-medium bg-red-50 rounded-xl"
        >
          로그아웃
        </button>
      </main>
    </div>
  );
}
        `.trim(),
      },
    ];
  }

  generateComponents(idea) {
    return [
      {
        path: 'src/components/common/Button.tsx',
        content: `
import { ReactNode, ButtonHTMLAttributes } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

const variantStyles = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300',
  outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
  ghost: 'text-blue-500 hover:bg-blue-50 active:bg-blue-100',
  danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
};

const sizeStyles = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-13 px-5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={\`
        inline-flex items-center justify-center gap-2
        font-semibold rounded-xl transition-all duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        \${variantStyles[variant]}
        \${sizeStyles[size]}
        \${fullWidth ? 'w-full' : ''}
        \${className}
      \`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}
        `.trim(),
      },
      {
        path: 'src/components/common/Input.tsx',
        content: `
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={\`
            w-full px-4 py-3 rounded-xl border transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            \${error
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-200 focus:border-blue-500'
            }
            \${props.disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
            \${className}
          \`}
          {...props}
        />
        {(error || helperText) && (
          <p className={\`mt-1.5 text-sm \${error ? 'text-red-500' : 'text-gray-500'}\`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
        `.trim(),
      },
      {
        path: 'src/components/common/Card.tsx',
        content: `
import { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'outlined' | 'elevated';
  hoverable?: boolean;
}

const variantStyles = {
  default: 'bg-white border border-gray-100',
  outlined: 'bg-white border border-gray-200',
  elevated: 'bg-white shadow-md',
};

export function Card({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  onClick,
  ...props
}: CardProps) {
  return (
    <div
      className={\`
        rounded-2xl transition-all duration-150
        \${variantStyles[variant]}
        \${hoverable || onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''}
        \${className}
      \`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
        `.trim(),
      },
      {
        path: 'src/components/common/Modal.tsx',
        content: `
import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  variant?: 'center' | 'bottom-sheet';
  showCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  variant = 'center',
  showCloseButton = true,
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        className={\`
          relative bg-white rounded-2xl max-w-md w-[90%] max-h-[85vh] overflow-auto
          \${variant === 'center' ? 'animate-scaleIn' : 'animate-slideUp'}
          \${variant === 'bottom-sheet' ? 'fixed bottom-0 left-0 right-0 w-full max-w-none rounded-b-none' : ''}
        \`}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {title && <h2 className="text-lg font-semibold">{title}</h2>}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
        `.trim(),
      },
      {
        path: 'src/components/common/Toast.tsx',
        content: `
import { create } from 'zustand';
import { useEffect } from 'react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: Date.now().toString() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export function toast(message: string, type: Toast['type'] = 'info', duration = 3000) {
  useToastStore.getState().addToast({ message, type, duration });
}

const typeStyles = {
  info: 'bg-gray-900 text-white',
  success: 'bg-green-500 text-white',
  warning: 'bg-yellow-500 text-white',
  error: 'bg-red-500 text-white',
};

function ToastItem({ toast }: { toast: Toast }) {
  const { removeToast } = useToastStore();

  useEffect(() => {
    if (toast.duration) {
      const timer = setTimeout(() => removeToast(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, removeToast]);

  return (
    <div
      className={\`
        px-4 py-3 rounded-xl shadow-lg animate-slideUp
        \${typeStyles[toast.type]}
      \`}
    >
      {toast.message}
    </div>
  );
}

export function Toaster() {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-24 left-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
        `.trim(),
      },
      {
        path: 'src/components/common/LoadingSpinner.tsx',
        content: `
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizeStyles = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', color = 'blue-500' }: LoadingSpinnerProps) {
  return (
    <div
      className={\`
        \${sizeStyles[size]}
        border-2 border-gray-200 border-t-\${color}
        rounded-full animate-spin
      \`}
    />
  );
}
        `.trim(),
      },
      {
        path: 'src/components/layout/Header.tsx',
        content: `
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center -ml-2"
            >
              ←
            </button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
}
        `.trim(),
      },
      {
        path: 'src/components/layout/BottomNav.tsx',
        content: `
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: '홈', icon: '🏠' },
  { path: '/activity', label: '활동', icon: '📊' },
  { path: '/settings', label: '설정', icon: '⚙️' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 pb-safe">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={\`
                flex flex-col items-center gap-1 p-2 min-w-[64px]
                transition-colors duration-150
                \${isActive ? 'text-blue-500' : 'text-gray-400'}
              \`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
        `.trim(),
      },
      {
        path: 'src/components/layout/PageContainer.tsx',
        content: `
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-safe">
      {children}
    </div>
  );
}
        `.trim(),
      },
    ];
  }

  generateHooks(idea) {
    return [
      {
        path: 'src/hooks/useActivities.ts',
        content: `
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';

export function useActivities() {
  return useQuery({
    queryKey: ['activities'],
    queryFn: () => api.getActivities(),
  });
}
        `.trim(),
      },
      {
        path: 'src/hooks/useAsync.ts',
        content: `
import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
}

export function useAsync<T>(asyncFunction: (...args: any[]) => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      setState({ data: null, error: null, isLoading: true });
      try {
        const data = await asyncFunction(...args);
        setState({ data, error: null, isLoading: false });
        return data;
      } catch (error) {
        setState({ data: null, error: error as Error, isLoading: false });
        throw error;
      }
    },
    [asyncFunction]
  );

  return { ...state, execute };
}
        `.trim(),
      },
    ];
  }

  generateApiCode(idea) {
    return [
      {
        path: 'src/api/client.ts',
        content: `
import axios from 'axios';
import { Activity, User } from '../types/models';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = \`Bearer \${token}\`;
  }
  return config;
});

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const api = {
  // User
  getUser: () => apiClient.get<User>('/user/profile').then((r) => r.data),

  // Activities
  getActivities: (params?: { limit?: number; offset?: number }) =>
    apiClient.get<Activity[]>('/activities', { params }).then((r) => r.data),

  createActivity: (data: Partial<Activity>) =>
    apiClient.post<Activity>('/activities', data).then((r) => r.data),

  updateActivity: (id: string, data: Partial<Activity>) =>
    apiClient.put<Activity>(\`/activities/\${id}\`, data).then((r) => r.data),

  deleteActivity: (id: string) =>
    apiClient.delete(\`/activities/\${id}\`).then((r) => r.data),
};

export default apiClient;
        `.trim(),
      },
    ];
  }

  generateStoreCode(idea) {
    return [
      {
        path: 'src/stores/appStore.ts',
        content: `
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types/models';

interface AppState {
  user: User | null;
  isLoading: boolean;
  theme: 'light' | 'dark';

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  logout: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      theme: 'light',

      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      setTheme: (theme) => set({ theme }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null });
      },
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ user: state.user, theme: state.theme }),
    }
  )
);
        `.trim(),
      },
    ];
  }

  generateTypes(idea) {
    return [
      {
        path: 'src/types/models.ts',
        content: `
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  title: string;
  type: string;
  value: string | number;
  date: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
        `.trim(),
      },
      {
        path: 'src/types/index.ts',
        content: `
export * from './models';
        `.trim(),
      },
    ];
  }

  generateConfigFiles(idea) {
    const appName = this.toKebabCase(idea.title);

    return [
      {
        path: 'package.json',
        content: JSON.stringify(
          {
            name: appName,
            private: true,
            version: '0.1.0',
            type: 'module',
            scripts: {
              dev: 'vite',
              build: 'tsc && vite build',
              preview: 'vite preview',
              test: 'vitest',
              lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
            },
            dependencies: {
              react: '^18.2.0',
              'react-dom': '^18.2.0',
              'react-router-dom': '^6.20.0',
              '@tanstack/react-query': '^5.8.0',
              zustand: '^4.4.7',
              axios: '^1.6.2',
            },
            devDependencies: {
              '@types/react': '^18.2.37',
              '@types/react-dom': '^18.2.15',
              '@vitejs/plugin-react': '^4.2.0',
              typescript: '^5.2.2',
              vite: '^5.0.0',
              tailwindcss: '^3.3.6',
              postcss: '^8.4.32',
              autoprefixer: '^10.4.16',
              vitest: '^1.0.0',
              '@testing-library/react': '^14.1.0',
              eslint: '^8.55.0',
              prettier: '^3.1.0',
            },
          },
          null,
          2
        ),
      },
      {
        path: 'vite.config.ts',
        content: `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
        `.trim(),
      },
      {
        path: 'tailwind.config.js',
        content: `
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        toss: {
          blue: {
            50: '#E8F3FF',
            100: '#C9E2FF',
            500: '#3182F6',
            600: '#2272EB',
            700: '#1B64DA',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 200ms ease-out',
        scaleIn: 'scaleIn 200ms ease-out',
        slideUp: 'slideUp 200ms ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(10px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
    },
  },
  plugins: [],
};
        `.trim(),
      },
      {
        path: 'src/styles/global.css',
        content: `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    -webkit-tap-highlight-color: transparent;
  }

  body {
    @apply bg-gray-50 text-gray-900 antialiased;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
}

@layer utilities {
  .pb-safe {
    padding-bottom: env(safe-area-inset-bottom);
  }

  .pt-safe {
    padding-top: env(safe-area-inset-top);
  }
}
        `.trim(),
      },
      {
        path: 'index.html',
        content: `
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="theme-color" content="#3182F6" />
    <title>${idea.title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
        `.trim(),
      },
      {
        path: 'tsconfig.json',
        content: JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2020',
              useDefineForClassFields: true,
              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
              module: 'ESNext',
              skipLibCheck: true,
              moduleResolution: 'bundler',
              allowImportingTsExtensions: true,
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: 'react-jsx',
              strict: true,
              noUnusedLocals: true,
              noUnusedParameters: true,
              noFallthroughCasesInSwitch: true,
              baseUrl: '.',
              paths: {
                '@/*': ['./src/*'],
              },
            },
            include: ['src'],
            references: [{ path: './tsconfig.node.json' }],
          },
          null,
          2
        ),
      },
    ];
  }

  generateSetupCommands(idea) {
    const appName = this.toKebabCase(idea.title);

    return [
      `# 프로젝트 생성`,
      `npm create vite@latest ${appName} -- --template react-ts`,
      `cd ${appName}`,
      ``,
      `# 의존성 설치`,
      `npm install`,
      `npm install react-router-dom @tanstack/react-query zustand axios`,
      `npm install -D tailwindcss postcss autoprefixer`,
      ``,
      `# Tailwind 초기화`,
      `npx tailwindcss init -p`,
      ``,
      `# 개발 서버 실행`,
      `npm run dev`,
    ];
  }

  generateQuickStart(idea) {
    const appName = this.toKebabCase(idea.title);

    return {
      title: '빠른 시작 가이드',
      steps: [
        {
          step: 1,
          title: '프로젝트 생성',
          command: `npm create vite@latest ${appName} -- --template react-ts && cd ${appName}`,
        },
        {
          step: 2,
          title: '의존성 설치',
          command: 'npm install && npm install react-router-dom @tanstack/react-query zustand axios',
        },
        {
          step: 3,
          title: 'Tailwind 설정',
          command: 'npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p',
        },
        {
          step: 4,
          title: '개발 서버 실행',
          command: 'npm run dev',
        },
      ],
      nextSteps: [
        '생성된 코드를 해당 경로에 복사',
        '토스 SDK 연동 설정',
        '기능 컴포넌트 구현',
        '테스트 작성',
      ],
    };
  }

  // 유틸리티 메서드
  toPascalCase(str) {
    return str
      .split(/[\s_-]+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join('');
  }

  toKebabCase(str) {
    return str
      .toLowerCase()
      .replace(/[\s_]+/g, '-')
      .replace(/[^a-z0-9가-힣-]/g, '');
  }
}
