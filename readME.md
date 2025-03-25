# Node Version
현재 이 프로젝트는 Node.js 버전 20.11.x에서 실행됩니다.

# 프로젝트 설명
이 프로젝트는 mcp-ai-core에서 mcp-client를 통해 자식 프로세스를 생성하도록 설계되었습니다.

# MCP Server Example

Model Context Protocol (MCP) 서버 예제 프로젝트입니다.

## 프로젝트 구조

```
mcp-server-ex/
├── src/
│   ├── index.ts        # 메인 서버 설정 및 초기화
│   └── tool/
│       └── nws.ts      # National Weather Service 도구 구현
├── package.json
└── tsconfig.json
```

## 주요 컴포넌트

### 서버 설정 (src/index.ts)
- MCP 서버 인스턴스 생성 및 설정
- 기본 프롬프트 등록
- 도구 등록 및 초기화
- StdioServerTransport를 통한 통신 설정

### NWS 도구 (src/tool/nws.ts)
- `get-alerts`: 특정 주(state)의 기상 경보 조회
- `list_tools`: 사용 가능한 도구 목록 반환
- 모의 API 응답 구현 (실제 API 호출 대신 테스트용)

## MCP 프로토콜 구현

### 지원하는 기능
- Resources: list, read
- Tools: list, call
- Prompts: list, get

### 도구 목록
1. get-alerts
   - 설명: 특정 주의 기상 경보 조회
   - 매개변수: state (2글자 주 코드, 예: CA, NY)

## 실행 방법

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 실행
npm start
```

## 개발 참고사항

1. 새로운 도구 추가
   - `src/tool/` 디렉토리에 새 도구 구현
   - `registerXxxTool` 함수 작성
   - `list_tools` 응답에 새 도구 정보 추가

2. 프롬프트 추가
   - `server.prompt()` 메서드 사용
   - messages 배열에 응답 포함

3. 도구 응답 형식
   ```typescript
   {
     content: [{
       type: "text",
       text: string
     }]
   }
   ```
