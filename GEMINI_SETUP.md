# Gemini API 설정 가이드

## 1. API 키 발급

1. [Google AI Studio](https://aistudio.google.com/app/apikey) 방문
2. Google 계정으로 로그인
3. "Create API Key" 클릭
4. 생성된 API 키를 복사

## 2. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

**중요**:

- `your_actual_gemini_api_key_here` 부분을 실제 API 키로 교체하세요
- `.env.local` 파일은 Git에 커밋하지 마세요 (보안상 이유)
- API 키는 절대 코드에 직접 작성하지 마세요

## 3. 최신 SDK 사용

이 프로젝트는 최신 Google GenAI SDK (`@google/genai`)를 사용합니다:

```typescript
import { GoogleGenAI } from "@google/genai";

// 환경변수에서 자동으로 API 키를 가져옴
const ai = new GoogleGenAI({});

// Gemini 2.5 Flash 모델 사용
const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: "사용자 프롬프트",
  config: {
    thinkingConfig: {
      thinkingBudget: 0, // 속도 우선 (사고 기능 비활성화)
    },
  },
});
```

## 4. 사용 가능한 모델

- `gemini-2.5-flash`: 빠른 응답, 일반적인 용도 (권장)
- `gemini-2.5-pro`: 더 정확한 응답, 복잡한 작업용

## 5. 문제 해결

### API 키 오류

- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- API 키가 올바르게 설정되었는지 확인
- 서버 재시작 후 다시 시도

### 응답 속도 개선

- `thinkingBudget: 0`으로 설정하여 사고 기능 비활성화
- `gemini-2.5-flash` 모델 사용 (기본값)

## 6. 보안 주의사항

- API 키를 절대 공개 저장소에 커밋하지 마세요
- 프로덕션 환경에서는 환경변수를 안전하게 관리하세요
- API 키가 노출된 경우 즉시 재발급하세요
