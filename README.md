# Taerin Kim Portfolio

전북대학교 컴퓨터인공지능학부에서 AI를 공부하고 있는 김태린입니다. 이 사이트에는 제 관심 분야와 학습 목표, 연구실과 팀 프로젝트에서 경험한 내용을 담았습니다.

저는 인생의 각 시기를 책의 챕터처럼 생각합니다. 그 생각을 담아 사이트도 한 권의 책처럼 구성했습니다. 무채색 화면과 간결한 글을 중심으로 정리하고, 표지를 넘기면 목차에서 원하는 페이지를 선택할 수 있도록 만들었습니다.

[포트폴리오 보기](https://xofls01.github.io/MyProfile/)

[GitHub 저장소](https://github.com/xofls01/MyProfile)

## 사이트 구성

상단 메뉴로 각 페이지에 바로 이동하거나, 페이지 아래의 이전 및 다음 링크를 따라 순서대로 읽을 수 있습니다. 책 넘김 효과를 지원하지 않는 브라우저에서도 일반 링크로 이동할 수 있습니다.

| 페이지 | 담은 내용 | 주소 |
| --- | --- | --- |
| Home | 이름, 짧은 소개, 프로필 사진, 연락처 | [표지](https://xofls01.github.io/MyProfile/) |
| Contents | 페이지 목록과 바로 가기 | [목차](https://xofls01.github.io/MyProfile/contents/) |
| About | 자기소개, 관심 분야와 선택 이유, 기술 활용 경험, 학습 계획 | [자기소개](https://xofls01.github.io/MyProfile/about/) |
| Projects | 캡스톤, 제스처 인증, rPPG, 감정 인식 연구, 싱가포르 PBL 소개 | [활동 목록](https://xofls01.github.io/MyProfile/projects/) |
| 운전자 안전 시스템 | 목적, 담당 역할, 사용 기술, 수행 과정, 현재 결과와 개선 방향 | [상세 페이지](https://xofls01.github.io/MyProfile/projects/driver-safety-system/) |
| 제스처 인증 시스템 | 목적, 공동 작업과 담당 역할, 개발 과정, 결과와 한계 | [상세 페이지](https://xofls01.github.io/MyProfile/projects/gesture-authentication/) |

## 실행 환경과 설치

사이트는 Hugo로 빌드하고 GitHub Actions를 통해 GitHub Pages에 배포합니다. 배포 설정은 [hugo-pages.yml](.github/workflows/hugo-pages.yml)에 있습니다.

| 도구 | 배포에 지정한 버전 | 용도 |
| --- | --- | --- |
| Hugo Extended | 0.167.0 | 정적 사이트 빌드 |
| Python | 3.12 | 배포 준비와 경로 보정 스크립트 실행 |
| Node.js | 24 | 워크플로의 보조 도구 설치 |
| Go | 1.27.1 | 워크플로에서 준비하는 Hugo 관련 도구 환경 |
| Dart Sass | 1.105.0 | 워크플로에서 준비하는 스타일 빌드 도구 |
| Git | 설치된 버전 사용 | 소스 내려받기와 변경 이력 관리 |

로컬에서 현재 사이트를 실행할 때는 Git과 Hugo가 필요합니다. 배포용 빌드 스크립트까지 실행하려면 Python도 설치합니다. 테마는 `site/themes/template/`에 포함되어 있습니다.

### 도구 설치

Git은 운영체제에 맞는 설치 프로그램으로 설치합니다. macOS에서는 터미널에서 `git --version`을 실행했을 때 설치 안내가 나타나면 안내에 따라 명령줄 도구를 설치할 수 있습니다.

Python은 [공식 다운로드 페이지](https://www.python.org/downloads/)에서 3.12 버전의 운영체제에 맞는 설치 파일을 받아 설치합니다.

Hugo는 [0.167.0 릴리스 페이지](https://github.com/gohugoio/hugo/releases/tag/v0.167.0)의 Assets에서 운영체제와 CPU에 맞는 Extended 압축 파일을 내려받습니다. 압축을 푼 뒤 실행 파일이 있는 폴더를 `PATH`에 등록합니다. 자세한 과정은 [Hugo의 macOS 설치 안내](https://gohugo.io/installation/macos/)에서 확인할 수 있습니다.

예를 들어 macOS에서 저장소 안의 `.pages-tools/hugo/` 폴더에 `hugo` 실행 파일을 두었다면, 저장소 최상위 폴더에서 다음 명령으로 현재 터미널에 경로를 등록합니다.

```bash
export PATH="$PWD/.pages-tools/hugo:$PATH"
```

이 설정은 현재 터미널에서만 유지됩니다. 새 터미널에서는 다시 실행하거나 셸 설정에 실행 파일의 경로를 등록합니다.

설치를 마치면 버전을 확인합니다.

```bash
git --version
python3 --version
hugo version
```

배포와 같은 조건으로 확인하려면 Hugo Extended 0.167.0과 Python 3.12를 사용합니다. 현재 테마에 명시된 Hugo 최소 버전은 0.158.0입니다.

### 저장소 내려받기

```bash
git clone https://github.com/xofls01/MyProfile.git
cd MyProfile
```

이미 내려받은 저장소가 있다면 VS Code에서 그 폴더를 열고 터미널을 사용합니다. 아래 명령은 모두 `README.md`와 `site/`가 있는 저장소 최상위 폴더에서 실행합니다.

## 로컬에서 확인하기

```bash
hugo server --source site --config hugo.toml,pages.json --baseURL http://localhost:1313/MyProfile/ --enableGitInfo=false --disableFastRender
```

터미널에 서버가 실행되었다는 안내가 나오면 브라우저에서 [로컬 미리보기](http://localhost:1313/MyProfile/)를 엽니다. 파일을 저장하면 변경 내용을 확인할 수 있습니다. 서버를 종료할 때는 실행 중인 터미널에서 `Ctrl+C`를 누릅니다.

`hugo.toml`과 `pages.json`을 함께 읽어야 실제 배포에 사용하는 테마와 설정이 적용됩니다. 로컬 미리보기 주소는 자신의 컴퓨터에서 확인하는 주소이며, 다른 사람에게 보여줄 때는 맨 위의 공개 포트폴리오 주소를 사용합니다.

## 배포용으로 빌드하기

워크플로에서 사용하는 빌드 스크립트를 로컬에서도 실행할 수 있습니다.

```bash
python3 .github/pages_build.py --build
```

스크립트는 `site/`를 빌드하고 저장소 최상위의 `public/`에 결과를 만듭니다. `/MyProfile/` 배포 경로에 맞춰 자산 경로를 보정하고 홈 페이지가 생성되었는지 확인합니다. 운영 주소는 `.github-pages.json`의 `baseURL`을 사용합니다.

배포에서는 워크플로가 도구 설치와 의존성 준비를 자동으로 수행합니다. 로컬에서는 현재 사이트에 포함된 테마와 자산을 사용하므로 별도의 Python 패키지를 설치하지 않아도 위 빌드 스크립트를 실행할 수 있습니다.

## 내용을 수정하는 위치

실제로 배포하는 사이트의 소스는 `site/` 안에 있습니다. 최상위에 남아 있는 원본 테마 파일과 구분해 아래 경로를 수정합니다.

| 바꾸려는 내용 | 파일 또는 폴더 |
| --- | --- |
| 이름, 홈 소개, 이메일, GitHub 주소, 상단 메뉴 | `site/hugo.toml` |
| 운영 주소와 테마 설정 | `site/pages.json`, `.github-pages.json` |
| 프로필 사진 | `site/static/images/profile.jpg` |
| About 본문 | `site/content/about.md` |
| 목차 안내 문구 | `site/content/contents.md` |
| 다섯 활동의 소개와 상세 페이지 연결 | `site/content/projects/_index.md` |
| 운전자 안전 시스템 상세 내용 | `site/content/projects/driver-safety-system.md` |
| 제스처 인증 시스템 상세 내용 | `site/content/projects/gesture-authentication.md` |
| 홈과 각 페이지의 HTML 구성 | `site/layouts/index.html`, `site/layouts/page/` |
| 공통 메뉴와 푸터 | `site/layouts/partials/header.html`, `site/layouts/partials/footer.html` |
| 목차 항목, 읽는 순서와 쪽수 | `site/layouts/partials/book-pages.html`, `site/layouts/partials/book-page-number.html` |
| 이전 및 다음 페이지 링크 | `site/layouts/partials/book-navigation.html` |
| 화면별 글꼴, 색상, 여백, 반응형 배치 | `site/static/css/` |
| 책 넘김 효과 | `site/static/js/home-cover.js`, `site/static/css/page-turn.css` |
| 메뉴 조작과 테마 전환 | `site/assets/js/main.js` |
| 한국어 안내 문구 | `site/i18n/ko.toml` |
| 자동 빌드와 배포 | `.github/workflows/hugo-pages.yml`, `.github/pages_build.py` |

쪽수와 목차는 공통 페이지 목록을 기준으로 생성합니다. 페이지를 추가하거나 읽는 순서를 바꿀 때는 `book-pages.html`도 함께 수정합니다.

## 수정 후 재배포하기

1. 파일을 수정하고 로컬 화면에서 내용과 동작을 확인합니다.
2. `git status --short`로 변경된 파일을 확인합니다.
3. 수정한 파일만 `git add`로 선택하고 `git diff --cached`로 커밋할 내용을 확인합니다.
4. 실제 변경 내용을 설명하는 메시지로 커밋한 뒤 `main`에 push합니다.

예를 들어 About 본문을 수정했다면 다음과 같이 실행합니다.

```bash
git diff -- site/content/about.md
git add site/content/about.md
git diff --cached
git commit -m "About 자기소개 내용 수정"
git push origin main
```

GitHub 저장소의 Settings에서 Pages를 열고, Build and deployment의 Source를 `GitHub Actions`로 설정합니다. 이 설정은 처음 배포 환경을 준비할 때 확인합니다.

push한 뒤 [Actions 실행 목록](https://github.com/xofls01/MyProfile/actions)에서 해당 커밋의 `Deploy Hugo to GitHub Pages` 실행을 엽니다. `build`와 `deploy`가 모두 성공했는지 확인하고, 공개 사이트에서 수정한 페이지를 새로고침해 변경 내용이 보이는지 확인합니다. 실패한 경우 실패한 단계의 로그를 확인합니다.

`public/`은 빌드 결과이며 배포 과정에서 다시 만들어집니다. 수정할 때는 원본 소스가 있는 `site/`의 파일을 사용합니다.

## 출처와 이용 조건

이 사이트는 Gokarna 테마를 바탕으로 수정했습니다. 원본 제작자는 Yash Mehrotra와 Avijit Gupta이며, 원본 테마의 라이선스는 GNU GPLv3입니다.

[Gokarna 원본 저장소](https://github.com/gokarna-theme/gokarna-hugo)

[원본 테마 설명](site/themes/template/README.md)

[라이선스 전문](LICENSE)

2026년 11월 4일 기준으로 원본 테마에 제 소개와 활동 내용을 반영하고, 책 형태의 화면 구성, 목차, 페이지 넘김, 반응형 배치와 키보드 조작을 수정했습니다. 원본 라이선스 파일과 테마 출처 표시는 유지하고 있습니다.

| 자료 | 사용 위치와 제작 구분 | 출처와 고지 |
| --- | --- | --- |
| Gokarna 테마 | `site/themes/template/`에 포함된 외부 코드 | GNU GPLv3. 원본 제작자와 라이선스 고지 유지 |
| 프로필 사진 | `site/static/images/profile.jpg`, 제가 제공한 사진 | 제 프로필 사진으로 사용 |
| 자기소개와 활동 설명 | `site/content/`, 제 경험과 프로젝트 자료를 바탕으로 작성 | 문장 정리에 AI 도움을 받았으며 직접 내용을 확인하고 수정 |
| 페이지 구성과 추가 코드 | `site/layouts/`, `site/static/css/`, `site/static/js/`, `site/assets/js/main.js` | 제가 정한 디자인과 동작에 맞춰 AI 도움을 받아 작성하고 수정 |
| Feather와 SVGInjector | 테마에 포함된 메뉴 아이콘과 SVG 처리 코드 | [Feather](https://github.com/feathericons/feather), [SVGInjector](https://github.com/iconic/SVGInjector). 포함된 코드의 저작권과 MIT 라이선스 고지 유지 |
| Lato 글꼴 | 테마에 포함된 글꼴 파일 | [Lato](https://www.latofonts.com/), SIL Open Font License 1.1. 추가한 주요 화면은 시스템 글꼴과 Georgia 등을 함께 사용 |
| KaTeX | `site/hugo.toml`에 남아 있는 테마의 수식 렌더링 설정 | [KaTeX](https://github.com/KaTeX/KaTeX), MIT 라이선스 |
| 배포 준비 스크립트 | `prepare_github_pages.py`, `.github/pages_build.py`, 생성 버전 3.1 | 수업에서 제공한 스크립트 사용 |

사이트를 만들면서 ChatGPT와 Codex의 도움을 받아 문장을 정리하고, HTML과 CSS 작성, 페이지 넘김 구현, 오류 분석과 점검을 진행했습니다. 디자인 방향과 표현할 내용은 직접 정하고, 제안받은 결과를 화면에서 확인하며 수정했습니다. 실제 요청과 판단, 반영 위치, 검증 결과에 관한 대표 사례는 과제 보고서에 기록합니다.
