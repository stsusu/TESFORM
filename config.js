// ============================================================
//  사이트 기본 설정 (여기만 고치면 됩니다)
// ============================================================
window.SHOP_CONFIG = {
  shopName: "CONSOLE SHIFT",          // 사이트 이름 (원하는 이름으로 변경)
  tagline: "테슬라 센터콘솔 시프터",
  shippingFee: 3000,                   // 배송비 (원)

  // 입금 계좌
  bank: {
    name: "카카오뱅크",
    number: "3333-05-01459148",
    holder: "김정곤"
  },

  // 구글폼 연동 (README.md 참고해서 채우세요)
  // action: 구글폼 "formResponse" 주소
  // entries: 각 질문의 entry.숫자
  form: {
    action: "https://docs.google.com/forms/d/e/YOUR_FORM_ID/formResponse",
    entries: {
      orderNo:  "entry.0000000001", // 주문번호
      name:     "entry.0000000002", // 이름
      phone:    "entry.0000000003", // 연락처
      address:  "entry.0000000004", // 주소
      nickname: "entry.0000000005", // 카페닉네임
      request:  "entry.0000000006", // 추가요청사항
      items:    "entry.0000000007", // 주문내역
      total:    "entry.0000000008"  // 총 결제금액
    }
  }
};
