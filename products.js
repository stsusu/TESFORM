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
    id: "shifter-2holes",                 // 상품 고유 ID (영문/숫자/하이픈, 중복 금지)
    name: "센터콘솔 시프터 2구",
    subtitle: " 하이랜드, 주니퍼 Y/YL 용",
    badge: "NEW",                        // 뱃지 (필요 없으면 "")
    price: 31000,                        // 기본 가격 (원)
    images: ["Image/2hole_free.png","Image/LED_sample.png","Image/sample_W.png","Image/free.png"],   // 예: ["images/basic-1.jpg", "images/basic-2.jpg"]
    description: "센터콘솔에 장착하는 편리한 시프터! \n LED 별도 장착시 화려 엠비언트 효과!! \n 시프터와 버튼 2구로 구성되어있습니다. \n 에어밸브캡 리무버 무료증정 이벤트중",
    details: [
      "소재: PETG",
      "제작 방식: 주문 후 3D 프린팅 제작",
      "제작 기간: 주문 확인 후 순차 제작"
    ],
    options: [
      {
        name: "옵션1 · 색상",
        choices: [
          { label: "블랙", add: 0, image: "Image/hole2_body_B.png"},
          { label: "화이트", add: 0, image: "Image/hole2_body_W.png" }
        ]
      },
      {
        name: "옵션2 · 시프터 색상",
        choices: [
          { label: "반투명", add: 0, image: "Image/Shifter_T.png"},
          { label: "블랙", add: 0, image: "Image/Shifter_B.png" },
          { label: "레드", add: 0, image: "Image/Shifter_R.png" }
          
        ]
      },
      {
        name: "옵션3 · 버튼엣지 색상",
        choices: [
          { label: "반투명", add: 0, image: "Image/Edge_T.png" },
          { label: "블랙", add: 0, image: "Image/Edge_B.png" },
          { label: "화이트", add: 0, image: "Image/Edge_W.png" },
          { label: "레드", add: 0, image: "Image/Edge_R.png" }
        ]
      }
    ]
  },

   {
    id: "shifter-3holes",                 // 상품 고유 ID (영문/숫자/하이픈, 중복 금지)
    name: "센터콘솔 시프터 3구",
    subtitle: " 하이랜드, 주니퍼 Y/YL 용",
    badge: "NEW",                        // 뱃지 (필요 없으면 "")
    price: 32000,                        // 기본 가격 (원)
    images: ["Image/3hole_free.png","Image/LED_sample.png","Image/sample_W.png","Image/free.png"],                          // 예: ["images/basic-1.jpg", "images/basic-2.jpg"]
    description: "센터콘솔에 장착하는 편리한 시프터! \n LED 별도 장착시 화려 엠비언트 효과!! \n 시프터와 버튼 3구로 구성되어있습니다.\n 에어밸브캡 리무버 무료증정 이벤트중",
    details: [
      "소재: PETG",
      "제작 방식: 주문 후 3D 프린팅 제작",
      "제작 기간: 주문 확인 후 순차 제작"
    ],
    options: [
      {
        name: "옵션1 · 색상",
        choices: [
          { label: "블랙", add: 0, image: "Image/hole3_body_B.png"},
          { label: "화이트", add: 0, image: "Image/hole3_body_W.png" }
        ]
      },
      {
        name: "옵션2 · 시프터 색상",
        choices: [
          { label: "반투명", add: 0, image: "Image/Shifter_T.png"},
          { label: "블랙", add: 0, image: "Image/Shifter_B.png" },
          { label: "레드", add: 0, image: "Image/Shifter_R.png" }
          
        ]
      },
      {
        name: "옵션3 · 버튼엣지 색상",
        choices: [
          { label: "반투명", add: 0, image: "Image/Edge_T.png" },
          { label: "블랙", add: 0, image: "Image/Edge_B.png" },
          { label: "화이트", add: 0, image: "Image/Edge_W.png" },
          { label: "레드", add: 0, image: "Image/Edge_R.png" }
        ]
      }
    ]
  },
  {
    id: "remover",                 // 상품 고유 ID (영문/숫자/하이픈, 중복 금지)
    name: "타이어 에어캡 리무버",
    subtitle: "전차종",
    badge: "NEW",                        // 뱃지 (필요 없으면 "")
    price: 5000,                        // 기본 가격 (원)
    images: ["Image/Cap_remover.png"],                          // 예: ["images/basic-1.jpg", "images/basic-2.jpg"]
    description: "에어캡 뺄때마다 손가락 아프셨죠? \n 특히 YL은 손가락도 안들어가요ㅜㅜ \n 이제 리무버로 편하게 사용하세요. \n 리무버가 캡을 꽉물고 있어 분실위험 제로!! \n 리무버에 끼인 캡은 뒤를 누르면 쏙 빠져요~",
    details: [
      "소재: PETG",
      "제작 방식: 주문 후 3D 프린팅 제작",
      "제작 기간: 주문 확인 후 순차 제작"
    ]
  },
 {
    id: "shifter",                 // 상품 고유 ID (영문/숫자/하이픈, 중복 금지)
    name: "시프터 별매",
    subtitle: "콘솔시프터 구매자용",
    badge: "NEW",                        // 뱃지 (필요 없으면 "")
    price: 2000,                        // 기본 가격 (원)
    images: ["Image/Shifter_T.png","Image/Shifter_B.png","Image/Shifter_R.png"],                          // 예: ["images/basic-1.jpg", "images/basic-2.jpg"]
    description: "시프터의 색상을 변경하고 싶으실때 구매하세요",
    details: [
      "소재: PETG",
      "제작 방식: 주문 후 3D 프린팅 제작",
      "제작 기간: 주문 확인 후 순차 제작"
    ],
    options: [
      {
        name: "시프터 색상",
        choices: [
          { label: "반투명", add: 0, image: "Image/Shifter_T.png"},
          { label: "블랙", add: 0, image: "Image/Shifter_B.png" },
          { label: "레드", add: 0, image: "Image/Shifter_R.png" }
          
        ]
      }
    ]
  },
   {
    id: "Edge",                 // 상품 고유 ID (영문/숫자/하이픈, 중복 금지)
    name: "버튼엣지 별매",
    subtitle: "콘솔시프터 구매자용",
    badge: "NEW",                        // 뱃지 (필요 없으면 "")
    price: 1000,                        // 기본 가격 (원)
    images: ["Image/Edge_T.png","Image/Edge_B.png","Image/Edge_W.png","Image/Edge_R.png"],                          // 예: ["images/basic-1.jpg", "images/basic-2.jpg"]
    description: "버튼엣지의 색상을 변경하고 싶으실때 구매하세요",
    details: [
      "소재: PETG",
      "제작 방식: 주문 후 3D 프린팅 제작",
      "제작 기간: 주문 확인 후 순차 제작"
    ],
    options: [
      {
        name: "버튼엣지 색상",
        choices: [
          { label: "반투명", add: 0, image: "Image/Edge_T.png" },
          { label: "블랙", add: 0, image: "Image/Edge_B.png" },
          { label: "화이트", add: 0, image: "Image/Edge_W.png" },
          { label: "레드", add: 0, image: "Image/Edge_R.png" }
        ]
      }
    ]
  }
];
