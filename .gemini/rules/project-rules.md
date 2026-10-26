# 룰 (Project Rules for CulturePop Event App)

당신은 이 프로젝트를 작업할 때 반드시 다음 4대 규칙을 엄격하게 준수해야 합니다.

---

## 1. 모든 작업 후 Git 백업 및 Push 의무화
- 사용자가 요청한 모든 코드 수정, 파일 추가, 빌드 작업이 완료될 때마다 반드시 Git으로 백업합니다.
- 명령어:
  ```bash
  git add .
  git commit -m "작업 내용 한글 요약"
  git push origin main
  ```
- 원격 저장소: `https://github.com/odh50fire-sys/Event`

---

## 2. 한글 커밋 메시지 작성 원칙
- 커밋 메시지(comment)는 반드시 **한글로 작업 내용을 간단하고 명확하게 요약**하여 작성합니다.
- 예시:
  - `git commit -m "키즈 관련 행사 전면 제외 및 와인 페어로 교체, EXE 재빌드"`
  - `git commit -m "코스트코 및 백화점 휴무일 캘린더 연산 로직 추가"`

---

## 3. 중요 변경 사항 발생 시 Plan MD 갱신
- 프로젝트의 구조 변경, 중요 기능 추가, 대상 시설 변경, 수집/필터링 정책 변경 등이 있을 때마다:
  - 프로젝트 내 [docs/culture_event_app_plan.md](file:///c:/Users/odhch/OneDrive/바탕%20화면/은퇴계획/antigravity/Event/docs/culture_event_app_plan.md) 및 대화 Artifact를 즉시 갱신합니다.

---

## 4. 키즈(어린이/베이비/유아/육아) 관련 항목 완전 배제 원칙
- 모든 카테고리(전시, 행사, 축제, 박람회, 공연 등)에서 키즈 관련 항목은 원천 배제합니다.
- `isKidRelated(event)` 검증 로직을 항시 거쳐야 하며, 키즈/어린이/베이비/유아/육아/영유아/초등/아이와 등의 키워드가 포함된 콘텐츠는 캘린더 및 D-day 배너에 일절 노출시키지 않습니다.
- 성인·문화예술·라이프스타일·미식·휴무일 중심으로 콘텐츠를 구성합니다.
