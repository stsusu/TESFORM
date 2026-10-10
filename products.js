// ============================================================
//  상품 데이터 (템플릿)
//  - 상품 추가: 아래 블록 하나를 통째로 복사해서 붙여넣고 내용만 바꾸세요.
//  - 상품 수정: 해당 블록의 글자/가격만 바꾸면 됩니다.
//  - 상품 삭제: 블록을 지우면 됩니다.
//  - 사진: images 폴더에 올리고 images: ["images/파일명.jpg"] 로 적으세요. (여러 장 가능)
//  - 옵션: options 안에 옵션1, 옵션2, 옵션3... 마음대로 추가/삭제 가능.
//          choices의 add 는 "추가금액"이고, 0이면 추가금 없음.
// ============================================================
window.PRODUCTS = [
  {
    id: "shifter-basic",                 // 상품 고유 ID (영문/숫자/하이픈, 중복 금지)
    name: "센터콘솔 시프터 (하이랜드, 주니퍼 Y/YL 용)",
    subtitle: "3D 프린팅 · 기본형",
    badge: "NEW",                        // 뱃지 (필요 없으면 "")
    price: 39000,                        // 기본 가격 (원)
    images: [],                          // 예: ["images/basic-1.jpg", "images/basic-2.jpg"]
    description: "센터콘솔에 장착하는 3D 프린터 제작 시프터입니다. 심플한 디자인으로 주행 기어 조작이 한결 편해집니다.",
    details: [
      "소재: PETG",
      "제작 방식: 주문 후 3D 프린팅 제작",
      "제작 기간: 주문 확인 후 순차 제작",
      "색상 커스텀 가능: 블랙, 화이트, 레드포인트, LED 투과 등"
    ],
    options: [
      {
        name: "옵션1 · 바디색상",
        choices: [
          { label: "블랙", add: 0 },
          { label: "화이트", add: 0 }
        ]
      },
      {
        name: "옵션2 · 시프터 색상",
        choices: [
          { label: "반투명(LED투과)", add: 0 },
          { label: "블랙", add: 0 },
          { label: "레드", add: 0 }
        ]
      },
      {
        name: "옵션3 · 버튼에지 색상",
        choices: [
          { label: "반투명(LED투과)", add: 0 },
          { label: "블랙", add: 0 },
          { label: "화이트", add: 0 },
          { label: "레드", add: 0 }
        ]
      }
    ]
  },

  {
    id: "shifter-pro",
    name: "센터콘솔 시프터 - 프로",
    subtitle: "3D 프린팅 · 고급형",
    badge: "BEST",
    price: 49000,
    images: [],
    description: "표면 마감과 그립감을 개선한 고급형 시프터입니다.",
    details: [
      "소재: ASA",
      "표면 마감 처리",
      "제작 기간: 주문 확인 후 순차 제작"
    ],
    options: [
      {
        name: "옵션1 · 색상",
        choices: [
          { label: "블랙", add: 0 },
          { label: "화이트", add: 0 }
        ]
      },
      {
        name: "옵션2 · 마감",
        choices: [
          { label: "무광", add: 0 },
          { label: "샌딩 마감", add: 8000 }
        ]
      }
    ]
  },

  {
    id: "shifter-set",
    name: "센터콘솔 시프터 - 세트",
    subtitle: "시프터 + 거치 패드",
    badge: "",
    price: 59000,
    images: [],
    description: "시프터와 거치 패드를 함께 구성한 세트 상품입니다.",
    details: [
      "구성: 시프터 1개 + 거치 패드 1개"
    ],
    options: [
      {
        name: "옵션1 · 색상",
        choices: [
          { label: "블랙", add: 0 },
          { label: "화이트", add: 0 },
          { label: "그레이", add: 0 }
        ]
      }
    ]
  }
];
