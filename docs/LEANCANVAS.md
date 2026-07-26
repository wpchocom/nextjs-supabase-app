# 린 캔버스 — 모임 이벤트관리

> 기준 문서: [`docs/PRD.md`](./PRD.md). 각 블록 옆 괄호는 근거가 된 PRD 절 번호다. 번호·칸 배치는 첨부된 템플릿(1문제·4해결책·3가치제안·5경쟁우위·2고객세그먼트 / 8주요지표·9채널 / 7비용구조·6수익흐름) 순서를 그대로 따른다.
> 5번(경쟁우위)과 6번(수익흐름)은 PRD에 명시되어 있지 않아 "미정"으로 남기고, 참고용 제안만 별도 표기했다(확정 아님).

<table style="border-collapse: collapse; width: 100%; table-layout: fixed;">
<tr>
<td width="20%" rowspan="2" valign="top" style="border: 1px solid #888; padding: 10px;">

**1. 문제**<br><sub>(PRD 1, 6절)</sub>

- 공지를 카톡 단톡방에 매번 직접 올리고 반복 전달
- 참여자 명단·RSVP·실제 출석을 수기로 관리해 누락·실수 발생
- 더치페이 금액을 손으로 계산해 개인별로 따로 통지
- 카풀 배정을 대화방에서 말로 조율해 헷갈림

**기존 대안**: 카톡 단톡방 + 수기/엑셀 계산, 구글폼·네이버폼(RSVP 수집), Splitwise 등 별도 정산 앱 병행 — 기능이 여러 앱에 흩어져 주최자가 매번 옮겨 다녀야 함

</td>
<td width="20%" valign="top" style="border: 1px solid #888; padding: 10px;">

**4. 해결책**<br><sub>(PRD 5절)</sub>

- 공지 등록 + 그룹 멤버 전원 이메일 자동 발송 (F005·F006)
- 참여자 로스터, 회차별 RSVP, 출석체크 (F002~F004)
- 더치페이 자동 계산(나머지까지 정확 배분) + 분담액 조회·정산완료 체크 (F007~F009)
- 카풀 차량 등록 + 주최자 수동 배정 (F010·F011)

</td>
<td width="20%" rowspan="2" valign="top" style="border: 1px solid #888; padding: 10px;">

**3. 가치 제안**<br><sub>(PRD 1절)</sub>

**"모임 하나 만들면 공지·참석·정산·카풀이 한 곳에서 끝난다"**

그룹과 첫 회차를 한 번에 만드는 단일 플로우라, "정기"라는 정의 때문에 1회성 모임 생성이 번거로워지지 않는다. 관리 단위는 어디까지나 "이번 모임 한 번".

</td>
<td width="20%" valign="top" style="border: 1px solid #888; padding: 10px;">

**5. 경쟁우위**<br><sub>미정</sub>

PRD에 정의되어 있지 않음. 통상 MVP 검증 후 도출되는 항목이라 현재는 비워둔다.

_(참고: "1회성 모임도 부담 없는 생성 플로우"는 가치 제안에 가까움 — 진짜 경쟁우위는 초기 사용자 확보 후 재논의 필요)_

</td>
<td width="20%" rowspan="2" valign="top" style="border: 1px solid #888; padding: 10px;">

**2. 고객 세그먼트**<br><sub>(PRD 2절)</sub>

- **주최자**: 정기 소모임(수영·헬스 등 러닝메이트)을 운영하며 여러 참여자를 반복 관리하는 1인
- **참여자**: 초대링크로 합류해 공지 확인·RSVP·정산 확인을 하는 멤버

**Early adopter**: 카톡 단톡방만으로 소모임을 운영 중이며 정산·출석 관리에 불편을 느끼는 주최자

</td>
</tr>
<tr>
<td valign="top" style="border: 1px solid #888; padding: 10px;">

**8. 주요 지표**<br><sub>(PRD 5절 기능 기준)</sub>

- 그룹 생성 수(F000), 회차 2개 이상으로 이어진 비율(반복 모임 전환)
- 초대링크 → 합류 전환율 (F001)
- 회차당 RSVP 응답률·출석체크 완료율 (F003·F004)
- 정산 완료율(`is_settled=true` 비율, F009)
- 공지 이메일 발송 성공률 (F006)

</td>
<td valign="top" style="border: 1px solid #888; padding: 10px;">

**9. 채널**<br><sub>(PRD 3, 8절)</sub>

- 초대링크를 통한 자연 확산(기존 카톡방 등에 링크만 공유)
- 구글 OAuth 원클릭 로그인으로 가입 마찰 최소화
- 이메일이 유일한 발송 채널(카카오톡·인앱 알림 없음)

</td>
</tr>
<tr>
<td colspan="2" valign="top" style="border: 1px solid #888; padding: 10px;">

**7. 비용 구조**

- Supabase 사용료 (DB·Auth·Edge Functions)
- Resend 등 트랜잭션 이메일 발송 비용 (F006)
- 호스팅(Vercel 등) 비용
- 1인 개발 인건비

</td>
<td style="border: 1px solid #888;"></td>
<td colspan="2" valign="top" style="border: 1px solid #888; padding: 10px;">

**6. 수익 흐름**<br><sub>미정</sub>

PRD 6절(비범위)에 결제/PG 연동 없음이 명시되어 있고, 수익모델은 정의되지 않음. MVP는 무료 운영 전제.

_(참고 제안, 확정 아님: 프리미엄 기능(통계·알림 확장) 유료화 / 그룹 단위 후원)_

</td>
</tr>
</table>
