// ============================================================
//  사이트 기본 설정 (여기만 고치면 됩니다)
// ============================================================
window.SHOP_CONFIG = {
  shopName: "CONSOLE SHIFT",          // 사이트 이름 (원하는 이름으로 변경)
  tagline: "테슬라 센터콘솔 시프터",
  shippingFee: 3000,                   // 배송비 (원)

  // 주문 조회용 구글 Apps Script 웹 앱 주소 (README.md 5번 참고)
  // 비워두면 "이 기기에 저장된 주문내역"만 보입니다.
  lookupUrl: "https://script.google.com/macros/s/AKfycbwAxo0zZtdjexFmVOyiVHMDVpK3CEWwFTsi-pT8tFtqEV4JnVqA8dlw3syHPzPegS2n4Q/exec",

  // 입금 계좌
  bank: {
    name: "카카오뱅크",
    number: "3333-05-01459148",
    holder: "김정곤"
  },

  // 구글폼 연동
  // action: 구글폼 "formResponse" 주소
  // entries: 각 질문의 entry.숫자
  form: {
    action: "https://docs.google.com/forms/d/e/1FAIpQLSdWONnCwhxtZoqA5bARHCPgw67mTEtTcQeuJhOHYSoSFAhOwA/formResponse",
    entries: {
      orderNo:  "entry.1819731869", // 주문번호
      name:     "entry.1756480751", // 이름
      phone:    "entry.1551847862", // 연락처
      address:  "entry.687887047",  // 주소
      nickname: "entry.1080828159", // 카페닉네임
      request:  "entry.322278705",  // 추가요청사항
      items:    "entry.1141666436", // 주문내역
      total:    "entry.845155149"   // 총 결제금액
    }
  }
};
