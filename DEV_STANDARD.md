# 📱 React Native + TDS 표준 개발 가이드

> **프로젝트 표준**: 앱인토스 미니앱은 React Native + TDS로 개발합니다.
> **최종 업데이트**: 2026-01-21

---

## 🎯 개발 표준

### 기술 스택

- **프레임워크**: React Native (Granite Framework)
- **디자인 시스템**: TDS (Toss Design System) React Native
- **라우팅**: 파일 기반 라우팅 (Next.js 방식)
- **상태 관리**: React Hooks + Context API (필요시 Zustand)
- **스타일링**: TDS Components + Inline Styles
- **타입스크립트**: 필수 사용

---

## 🚀 프로젝트 초기 설정

### 1. 프로젝트 생성

```bash
# Granite 앱 생성
npm create granite-app
# 또는
pnpm create granite-app
# 또는
yarn create granite-app

# 프롬프트 응답
# - 앱 이름: kebab-case 형식 (예: receipt-tracker)
# - 개발 도구: prettier + eslint 또는 biome
# - 패키지 매니저 선택
```

### 2. 필수 패키지 설치

```bash
# 앱인토스 프레임워크
npm install @apps-in-toss/framework

# TDS React Native (필수!)
npm install @toss/tds-react-native

# 기타 유틸리티
npm install date-fns
npm install zustand  # 복잡한 상태 관리 시
```

### 3. 프로젝트 초기화

```bash
# granite.config.ts 생성
npx ait init
```

---

## 📁 프로젝트 구조

```
receipt-static/
├── pages/                    # 파일 기반 라우팅
│   ├── index.tsx            # intoss://receipt-tracker
│   ├── detail/
│   │   └── [id].tsx         # intoss://receipt-tracker/detail/:id
│   └── _app.tsx             # 앱 등록 및 글로벌 설정
├── components/              # 재사용 가능한 컴포넌트
│   ├── common/              # 공통 컴포넌트
│   ├── features/            # 기능별 컴포넌트
│   └── layout/              # 레이아웃 컴포넌트
├── hooks/                   # 커스텀 Hooks
├── stores/                  # 상태 관리 (Zustand)
├── utils/                   # 유틸리티 함수
├── constants/               # 상수 정의
├── types/                   # TypeScript 타입 정의
├── assets/                  # 이미지, 아이콘 등
├── granite.config.ts        # 앱인토스 설정
├── package.json
└── tsconfig.json
```

---

## ⚙️ 설정 파일

### `granite.config.ts`

```typescript
export default {
  appName: 'receipt-tracker',        // 콘솔 등록명과 일치
  displayName: '영수증 트래커',       // 네비게이션 바 레이블
  primaryColor: '#3182F6',           // RGB HEX 형식
  icon: 'https://example.com/icon.png', // 앱 아이콘 URL

  // 브랜딩 설정 (선택사항)
  brand: {
    icon: '/icon.png',
    displayName: '영수증 트래커',
    primaryColor: '#3182F6'
  }
}
```

### `package.json` 스크립트

```json
{
  "scripts": {
    "dev": "ait dev",
    "build": "ait build",
    "start": "ait dev",
    "lint": "eslint .",
    "type-check": "tsc --noEmit"
  }
}
```

### `tsconfig.json` (표준 설정)

```json
{
  "extends": "@apps-in-toss/tsconfig",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@components/*": ["./components/*"],
      "@hooks/*": ["./hooks/*"],
      "@utils/*": ["./utils/*"],
      "@types/*": ["./types/*"],
      "@stores/*": ["./stores/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules", "dist", ".ait"]
}
```

---

## 🎨 TDS 컴포넌트 사용 가이드

### 필수 Import

```typescript
import {
  Button,
  TextField,
  Toast,
  Dialog,
  Navbar,
  List,
  ListRow,
  Tab,
  Badge,
  Checkbox,
  Switch,
  colors
} from '@toss/tds-react-native';
```

### 컬러 사용

```typescript
// ✅ 올바른 방법: TDS 컬러 토큰 사용
import { colors } from '@toss/tds-react-native';

<View style={{ backgroundColor: colors.blue500 }} />
<Text style={{ color: colors.grey700 }}>텍스트</Text>

// ❌ 잘못된 방법: 하드코딩
<View style={{ backgroundColor: '#3182F6' }} />  // 금지!
```

### 타이포그래피 사용

```typescript
// ✅ 올바른 방법: TDS 타이포그래피 컴포넌트 사용
import { Typography } from '@toss/tds-react-native';

<Typography variant="typography3">큰 제목</Typography>
<Typography variant="typography5">본문 텍스트</Typography>
<Typography variant="typography7">작은 텍스트</Typography>

// ❌ 잘못된 방법: fontSize 하드코딩
<Text style={{ fontSize: 22 }}>제목</Text>  // 금지!
```

### 버튼 사용

```typescript
// Primary 버튼 (주요 액션)
<Button
  type="primary"
  style="fill"
  size="big"
  onPress={handleSubmit}
>
  저장하기
</Button>

// Secondary 버튼 (보조 액션)
<Button
  type="primary"
  style="weak"
  size="medium"
  onPress={handleCancel}
>
  취소
</Button>

// 로딩 상태
<Button loading disabled>
  처리 중...
</Button>
```

### TextField 사용

```typescript
// 기본 입력
<TextField
  variant="line"
  label="이름"
  value={name}
  onChangeText={setName}
  placeholder="이름을 입력하세요"
/>

// 에러 상태
<TextField
  variant="line"
  label="이메일"
  value={email}
  onChangeText={setEmail}
  hasError={emailError}
  help="올바른 이메일 형식이 아닙니다"
/>

// 금액 입력
<TextField
  variant="line"
  prefix="₩"
  format={TextField.format.amount}
  value={amount}
  onChangeText={setAmount}
/>

// 검색 (Clearable)
<TextField.Clearable
  variant="line"
  placeholder="검색"
  value={search}
  onChangeText={setSearch}
  onClear={() => setSearch('')}
/>
```

### Toast 사용

```typescript
// 성공 메시지
<Toast
  open={showSuccess}
  text="저장되었어요"
  icon={<Toast.Icon name="icn-check-color" />}
  onClose={() => setShowSuccess(false)}
/>

// 액션 버튼이 있는 Toast
<Toast
  open={showAction}
  text="변경사항이 있어요"
  position="bottom"
  button={
    <Toast.Button
      text="저장"
      onPress={handleSave}
    />
  }
  onClose={() => setShowAction(false)}
/>
```

### Dialog 사용

```typescript
// Alert Dialog
const handleAlert = async () => {
  await AlertDialog({
    title: '저장 완료',
    description: '변경사항이 저장되었어요',
    buttonText: '확인'
  });
};

// Confirm Dialog
const handleDelete = async () => {
  const confirmed = await ConfirmDialog({
    title: '정말 삭제하시겠어요?',
    description: '삭제된 데이터는 복구할 수 없습니다',
    leftButton: '취소',
    rightButton: '삭제'
  });

  if (confirmed) {
    // 삭제 로직
  }
};
```

### List 사용

```typescript
<List rowSeparator="indented">
  <ListRow
    onPress={() => navigation.navigate('Settings')}
    withArrow
  >
    <ListRow.Icon name="settings" />
    <ListRow.Texts title="설정" />
  </ListRow>

  <ListRow
    onPress={() => navigation.navigate('Profile')}
    withArrow
  >
    <ListRow.Icon name="profile" />
    <ListRow.Texts title="프로필" />
  </ListRow>

  <ListRow>
    <ListRow.Texts title="알림" />
    <Switch
      checked={notifications}
      onCheckedChange={setNotifications}
    />
  </ListRow>
</List>
```

### Tab 사용

```typescript
const [activeTab, setActiveTab] = useState('receipts');

<Tab value={activeTab} onChange={setActiveTab}>
  <Tab.Item value="receipts">영수증</Tab.Item>
  <Tab.Item value="stats">통계</Tab.Item>
  <Tab.Item value="settings" redBean>설정</Tab.Item>
</Tab>

{activeTab === 'receipts' && <ReceiptList />}
{activeTab === 'stats' && <Statistics />}
{activeTab === 'settings' && <Settings />}
```

---

## 🏗️ 컴포넌트 작성 규칙

### 1. 함수형 컴포넌트 사용 (필수)

```typescript
// ✅ 올바른 방법
export default function ReceiptCard({ receipt }: ReceiptCardProps) {
  return (
    <View>
      {/* ... */}
    </View>
  );
}

// ❌ 잘못된 방법
export default class ReceiptCard extends Component {  // 금지!
  // ...
}
```

### 2. TypeScript 타입 정의 (필수)

```typescript
// types/receipt.ts
export interface Receipt {
  id: string;
  date: Date;
  amount: number;
  category: string;
  description: string;
}

// components/ReceiptCard.tsx
interface ReceiptCardProps {
  receipt: Receipt;
  onPress?: () => void;
}

export default function ReceiptCard({ receipt, onPress }: ReceiptCardProps) {
  // ...
}
```

### 3. Hooks 사용 규칙

```typescript
// ✅ 올바른 방법: 컴포넌트 최상위에서 호출
export default function ReceiptList() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReceipts();
  }, []);

  // ...
}

// ❌ 잘못된 방법: 조건문 안에서 호출
export default function ReceiptList() {
  if (condition) {
    const [state, setState] = useState();  // 금지!
  }
}
```

### 4. 스타일링 규칙

```typescript
// ✅ 올바른 방법: TDS 컴포넌트 + 인라인 스타일
import { colors } from '@toss/tds-react-native';

<View style={{
  padding: 16,
  backgroundColor: colors.white,
  borderRadius: 12
}}>
  <Button>버튼</Button>
</View>

// ⚠️ 복잡한 스타일은 StyleSheet 사용
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12
  }
});
```

---

## 🔄 상태 관리

### React Hooks (간단한 상태)

```typescript
// 로컬 상태
const [count, setCount] = useState(0);
const [text, setText] = useState('');

// 복잡한 상태
const [form, setForm] = useState({
  name: '',
  email: '',
  phone: ''
});

// 파생 상태
const totalAmount = useMemo(() => {
  return receipts.reduce((sum, r) => sum + r.amount, 0);
}, [receipts]);

// 사이드 이펙트
useEffect(() => {
  loadData();
}, []);
```

### Zustand (복잡한 전역 상태)

```typescript
// stores/receiptStore.ts
import { create } from 'zustand';

interface ReceiptStore {
  receipts: Receipt[];
  selectedReceipt: Receipt | null;
  addReceipt: (receipt: Receipt) => void;
  selectReceipt: (id: string) => void;
  loadReceipts: () => Promise<void>;
}

export const useReceiptStore = create<ReceiptStore>((set, get) => ({
  receipts: [],
  selectedReceipt: null,

  addReceipt: (receipt) => {
    set((state) => ({
      receipts: [...state.receipts, receipt]
    }));
  },

  selectReceipt: (id) => {
    const receipt = get().receipts.find(r => r.id === id);
    set({ selectedReceipt: receipt || null });
  },

  loadReceipts: async () => {
    const receipts = await fetchReceipts();
    set({ receipts });
  }
}));

// 컴포넌트에서 사용
function ReceiptList() {
  const { receipts, loadReceipts } = useReceiptStore();

  useEffect(() => {
    loadReceipts();
  }, []);

  return (
    <List>
      {receipts.map(r => <ReceiptCard key={r.id} receipt={r} />)}
    </List>
  );
}
```

---

## 🎣 커스텀 Hooks 패턴

```typescript
// hooks/useReceipts.ts
export function useReceipts() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadReceipts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchReceipts();
      setReceipts(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);

  return {
    receipts,
    loading,
    error,
    reload: loadReceipts
  };
}

// 사용
function ReceiptList() {
  const { receipts, loading, error, reload } = useReceipts();

  if (loading) return <Loader />;
  if (error) return <ErrorPage message={error.message} />;

  return (
    <List>
      {receipts.map(r => <ReceiptCard key={r.id} receipt={r} />)}
    </List>
  );
}
```

---

## 📱 라우팅

### 파일 기반 라우팅

```typescript
// pages/index.tsx → intoss://receipt-tracker
export default function HomePage() {
  return <HomeScreen />;
}

// pages/detail/[id].tsx → intoss://receipt-tracker/detail/:id
export default function DetailPage({ route }) {
  const { id } = route.params;
  return <DetailScreen receiptId={id} />;
}

// pages/settings/index.tsx → intoss://receipt-tracker/settings
export default function SettingsPage() {
  return <SettingsScreen />;
}
```

### 네비게이션

```typescript
import { useNavigation } from '@react-navigation/native';

function ReceiptCard({ receipt }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('detail', { id: receipt.id });
  };

  return (
    <ListRow onPress={handlePress}>
      {/* ... */}
    </ListRow>
  );
}
```

---

## 🧪 테스트

### 단위 테스트 (Jest + React Native Testing Library)

```typescript
// __tests__/ReceiptCard.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import ReceiptCard from '../components/ReceiptCard';

describe('ReceiptCard', () => {
  const mockReceipt = {
    id: '1',
    date: new Date('2026-01-21'),
    amount: 10000,
    category: '식비',
    description: '점심'
  };

  it('renders correctly', () => {
    const { getByText } = render(<ReceiptCard receipt={mockReceipt} />);
    expect(getByText('점심')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <ReceiptCard receipt={mockReceipt} onPress={onPress} />
    );

    fireEvent.press(getByText('점심'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
```

---

## 📦 빌드 & 배포

### 개발 서버 실행

```bash
npm run dev

# Android 포트 포워딩
adb reverse tcp:8081 tcp:8081

# iOS는 동일 WiFi + 로컬 네트워크 권한
```

### 프로덕션 빌드

```bash
npm run build

# .ait 번들 파일 생성
# → 앱인토스 콘솔에 업로드
```

---

## ✅ 체크리스트

### 개발 시작 전
- [ ] Granite 앱 생성
- [ ] @apps-in-toss/framework 설치
- [ ] @toss/tds-react-native 설치 (필수!)
- [ ] granite.config.ts 설정
- [ ] tsconfig.json 경로 별칭 설정

### 컴포넌트 작성 시
- [ ] 함수형 컴포넌트 사용
- [ ] TypeScript 타입 정의
- [ ] TDS 컴포넌트 우선 사용
- [ ] TDS 컬러 토큰 사용 (하드코딩 금지)
- [ ] 타이포그래피 스케일 사용 (하드코딩 금지)

### 빌드 전
- [ ] 타입 체크 (npm run type-check)
- [ ] 린트 (npm run lint)
- [ ] 테스트 (npm test)
- [ ] 불필요한 console.log 제거
- [ ] TODO 주석 확인

### 배포 전
- [ ] 출시 체크리스트 확인 (DEV_STANDARD.md 참조)
- [ ] 라이트 모드만 사용 확인
- [ ] 핀치 줌 비활성화 확인
- [ ] 응답 시간 2초 이내 확인
- [ ] 접근성 기준 충족 확인

---

## 🔗 참고 자료

- **앱인토스 개발 가이드**: `docs/apps-in-toss-developer-guide.md`
- **TDS React Native 컴포넌트**: `docs/tds-react-native-components.json`
- **공식 문서**: https://developers-apps-in-toss.toss.im
- **TDS 문서**: https://tossmini-docs.toss.im/tds-react-native/
- **커뮤니티**: https://techchat-apps-in-toss.toss.im/

---

**문서 버전**: v1.0.0
**최종 업데이트**: 2026-01-21
**프로젝트 표준**: React Native + TDS
