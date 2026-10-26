# 함정길잡이 개발 인수인계

정리일: 2026-10-26

## 전달할 주소

- 소스 코드: https://github.com/kdww1106-star/naval-acquisition-learning
- 서비스: https://kdww1106-star.github.io/naval-acquisition-learning/
- 코드 ZIP: https://github.com/kdww1106-star/naval-acquisition-learning/archive/refs/heads/main.zip
- 참고 원본: https://github.com/Silbet/naval-acquisition-learning
- 운영·문제은행 설명: [README](../README.md)
- 기존 문제 분석과 보강 내역: [콘텐츠 분석](content-analysis.md)

최신 코드는 본인 소유 운영 저장소의 `main`입니다. 원본의 최신 문항 개편까지 코드·이력을 Fork하였으며, 원본 저장소와는 별도의 사이트로 운영합니다. 예전 기능 브랜치는 새 작업의 기준으로 사용하지 않습니다.

## 친구에게 넘기는 방법

### 함께 관리하기 — 현재 주소 유지

이 저장소의 소유자는 `kdww1106-star`이며 관리자 권한으로 공동운영자를 초대할 수 있습니다. 저장소 Settings → Collaborators → Add people에서 GitHub 아이디로 초대하고 상대방이 수락하면 됩니다. `osunh`에 대한 초대를 전송했습니다. 초대의 현재 수락 여부는 저장소 설정에서 확인하세요. 개인 계정의 비밀번호나 토큰을 전달할 필요는 없습니다.

개인 저장소의 협업자는 코드·브랜치 수정 및 PR 작업을 할 수 있지만, 소유권·협업자 초대 관리는 소유자가 담당합니다. 공동운영자는 작업 브랜치 → PR → 검증 → main 병합 순서로 변경합니다. main 변경은 본인 사이트에 자동 배포됩니다.

친구는 아래 clone 명령으로 이력까지 내려받아 이어서 작업하면 됩니다. ZIP은 Git 이력이 없으므로 코드 열람·일회성 전달용입니다. 직접 쓰기 권한이 없어도 Fork 후 원본 저장소로 PR을 보낼 수 있습니다.

### 친구가 소유권까지 가져가기

소유자가 저장소 Settings → General → Danger Zone → Transfer ownership에서 친구의 정확한 계정명으로 이전하고 상대가 수락하는 방식입니다. 이번에는 원본을 이전한 것이 아니라 본인 계정에 Fork하였고 원본은 그대로 유지됩니다. 이후 소유권이나 저장소 이름을 바꾸려면 Pages 설정·실제 주소를 다시 확인해야 합니다. 저장소 이름까지 바꾸면 `vite.config.ts`의 Pages `base`와 `playwright.pages.config.ts`의 테스트 경로도 함께 수정해야 합니다.

## 처음 실행하기

Git과 Node.js 24를 준비합니다. 학습 기능에는 서버·데이터베이스·유료 API 계정·환경변수 파일이 필요하지 않습니다. 피드백은 무료 Tally 폼에 저장하며 운영자는 폼 소유 계정으로 제출 내용을 관리합니다. [피드백 운영 안내](feedback.md)를 확인하세요.

```sh
git clone https://github.com/kdww1106-star/naval-acquisition-learning.git
cd naval-acquisition-learning
npm ci
npm run dev
```

브라우저에서 `http://127.0.0.1:5173`을 엽니다. 로컬 개발은 일반 경로, GitHub Pages는 `#/setup/destroyer`와 같은 해시 경로를 사용합니다.

## 코드 위치

| 변경하려는 내용 | 파일 |
| --- | --- |
| 화면·문구·학습 흐름 | `src/App.tsx` |
| 디자인·반응형 화면 | `src/styles.css` |
| 기존 문제·단원·문제 스키마 | `src/data.ts` |
| 추가 문제·외부 출처 | `src/content-expansion.ts` |
| 공통 실무 상황형·규정 근거 | `src/business-content.ts` |
| 방위사업 용어 120문항 | `src/terminology-content.ts` |
| 검수 기록·문항 사용 중단 | `src/reviews.ts` |
| 출제 비율·채점·저장 | `src/domain.ts` |
| Pages 경로·라우터 | `vite.config.ts`, `src/main.tsx` |
| 피드백 화면·외부 폼 연결 | `src/FeedbackPage.tsx`, `src/feedback-settings.json` |
| 자동 검증·배포 | `.github/workflows/` |

현재 출제 305문항, 10개 단원, 32개 출처입니다. 함종 전용 125문항, 공통 업무 상황형 60문항, 용어형 120문항이며, 선택한 단원 안에서 5·10·20문항을 출제합니다. 같은 개념은 한 회차에 하나만 출제하며 다른 단원으로 부족분을 채우지 않습니다. 자세한 규칙은 README를 확인합니다.

문항의 `published`는 공개 상태, `verified`는 실제 담당자 검수 이력이 기록된 상태입니다. 신규 문항도 공개되어 있으나 담당자 개별 검수 완료를 뜻하지 않습니다. 새 문항을 추가할 때는 안정적인 ID와 `concept`, 출처를 지정하고 유사 문제는 같은 개념으로 묶습니다. 기존 배열 중간에 문항을 끼워 넣거나 순서를 바꿔 기존 ID를 변경하지 않습니다. 새로운 출처 호스트는 `scripts/validate-data.ts`에도 등록합니다.

## 수정·검증·반영 순서

```sh
git switch main
git pull --ff-only origin main
git switch -c feat/작업명
# 코드 수정
npm run validate:data
npm test
npx playwright install chromium
npm run test:e2e
npm run build:pages
npm run test:pages
git add 수정한파일
git commit -m "feat: 한글 변경 내용"
git push -u origin feat/작업명
```

GitHub에서 **kdww1106-star/naval-acquisition-learning의 main** 대상으로 PR을 만듭니다. Fork 화면에서 원본 저장소가 기본 대상으로 표시될 수 있으므로 저장소 소유자를 확인하세요. 제목은 `[Feature] 한글 설명`, `[Fix] 한글 설명`, `[Docs] 한글 설명`처럼 작성하고 어떤 문제를 해결해 어떻게 동작하게 됐는지 적습니다. CI 통과 후 검토·병합합니다. 작은 문서 변경은 관련 확인만 수행하면 됩니다.

## 배포 확인과 복구

main에 병합하면 Actions의 `GitHub Pages 배포`가 테스트 → 빌드 → Pages 브라우저 테스트 → 배포를 실행합니다. Settings → Pages의 Source는 GitHub Actions이며, github-pages 환경의 허용 브랜치는 main입니다. 수동 배포도 main에서 실행합니다. 별도의 배포용 비밀키를 친구에게 넘길 필요는 없습니다.

Actions에서 배포 성공을 확인한 다음 서비스 주소에서 수정 결과와 새로고침을 확인합니다. 로컬에서 배포 산출물을 확인하려면 다음을 실행합니다.

```sh
npm run build:pages
npm run preview -- --mode pages
```

안내된 로컬 주소의 `/naval-acquisition-learning/`에서 확인합니다. 문제 발생 시 원인이 된 커밋을 되돌리는 수정 브랜치와 PR을 만들고, main 병합 후 자동 재배포합니다. 기능 브랜치에 직접 배포 권한을 추가하지 않습니다.

## 데이터와 남은 관리 사항

진행 회차는 브라우저 sessionStorage의 `hamjeong.session.v2`, 완료 기록은 localStorage의 `hamjeong.history.v1`에 저장됩니다. 서버 데이터 이전 작업은 없습니다. 다른 사람·기기의 학습 기록은 함께 전달되지 않습니다.

도메인이 달라져 원본 사이트의 브라우저 학습 기록은 새 사이트로 자동 이동하지 않습니다. 피드백 폼은 기존 `X5lb1e`를 그대로 사용하므로 두 사이트의 응답은 같은 Tally 폼에 모입니다. GitHub 협업 초대만으로 Tally 응답 관리 권한이 생기지는 않으며 폼 소유 계정에서 관리합니다.

현재 작업 폴더의 Git `origin`은 본인 저장소, `upstream`은 Silbet 원본입니다. `main`은 `origin/main`을 추적하며 기본 push 대상도 origin입니다. 원본의 변경을 가져올 때는 별도 검토·병합이 필요하며 자동 반영되지 않습니다.

담당자 피드백에 따른 문항 수정과 추가 검수, 공개 출처의 변경·삭제 확인이 지속 관리 업무입니다. 실험적 WebMCP는 지원 브라우저에서 단원 목록만 제공하며 일반 학습 기능의 실행 조건이 아닙니다.
