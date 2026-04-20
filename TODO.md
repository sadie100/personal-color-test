[x] i18n 키 점표기 이관: 기존 flat 키(`navAbout`, `aboutTitle`, `about*`, `styling*`, `homeHero*` 등)를 `nav.about`, `about.title`, `about.pccs.*`, `styling.*`, `home.hero.*` 같은 네임스페이스로 이관. `TranslationSchema`도 nested interface로 전면 재구성.

[ ] CLAUDE.md 업데이트: (1) "no routing library" → react-router-dom 사용으로 정정, (2) 스크린 전환 설명을 라우트 기반으로 갱신, (3) i18n 점표기 네임스페이스 규칙 문서화 (`nav.*`, `types.*`, `types.{slug}.*`, `attribution.*`), (4) 신규 `src/data/colorTypeMeta.ts` 역할 기술.

[ ] 점표기 이관 후 ko/en 키 diff 테스트 추가 고려 (키 누락 방지).

[ ] 테스트 결과 링크 너무 긴데 어떻게 하기

[ ] DESIGN.md 적용해서 리디자인하기. 그리고 폰트 좀 어떻게

[ ] 결과 공유 보완 - SNS 공유 카톡공유 등등...

[ ] 도메인 달고 SEO 높이기

[ ] 중간 결과 보기는 제거해도 될듯?

[ ] 테스트 화면에서 색상이름 및 현재단계가 하얀 톤의 컬러에서 눈에 안띄는 문제 해결

[ ] 컬러 테스트 시작 버튼 위에 How to 같은 버튼 추가해서, 삽화와 함께 어떤 식으로 테스트 진행되는지 설명하는 단계 페이지 넣기
(양옆 키보드 키로 스와이프한다는 설명 추가)

[ ] 스와이프될 때 애니메이션을 좀 더 스와이프가 티나는? 방식으로 변경하기
