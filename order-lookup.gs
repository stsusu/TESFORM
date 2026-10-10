/**
 * 주문 조회용 구글 Apps Script  (이름 + 연락처로 조회)
 *
 * 사용법 (README.md 4번 참고)
 * 1) 구글폼 응답이 쌓이는 구글 시트를 열기
 * 2) 확장 프로그램 → Apps Script → 이 파일 내용 전체를 붙여넣기 → 저장
 * 3) 배포 → 새 배포 → 유형: 웹 앱 → 실행 계정: 나 / 액세스 권한: 모든 사용자 → 배포
 *    (코드를 고친 뒤에는 배포 → 배포 관리 → 수정 → 새 버전 으로 다시 배포)
 * 4) 나오는 "웹 앱 URL"(…/exec)을 config.js 의 lookupUrl 에 붙여넣기
 *
 * 시트 1행(제목 줄)에 아래 이름의 열이 있어야 합니다.
 *   주문번호, 이름, 연락처, 주문내역, 총 결제금액   (구글폼 질문 제목과 동일)
 *   처리상태, 택배사, 송장번호                       (직접 만드는 열 — 오른쪽 끝에 추가)
 * 타임스탬프 열은 구글폼이 자동으로 만들어줍니다.
 *
 * 조회는 "이름 + 연락처"가 모두 맞아야 결과가 나오고(최근 주문 최대 10건),
 * 주소·연락처 같은 개인정보는 돌려주지 않습니다. (이름은 가려서 표시)
 */

var MAX_RESULTS = 10;

function doGet(e) {
  var p = (e && e.parameter) || {};
  var name = norm_(p.name);
  var phone = String(p.phone || "").replace(/\D/g, "");
  if (!name || phone.length < 8) return out_({ ok: false, error: "bad_request" });

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var values = sheet.getDataRange().getDisplayValues();
  if (values.length < 2) return out_({ ok: false, error: "not_found" });

  var head = values[0].map(function (h) { return String(h).trim(); });
  function idx(n) { return head.indexOf(n); }
  var cName = idx("이름"), cPhone = idx("연락처");
  if (cName < 0 || cPhone < 0) return out_({ ok: false, error: "no_columns" });

  var orders = [];
  for (var i = values.length - 1; i >= 1 && orders.length < MAX_RESULTS; i--) {
    var r = values[i];
    if (norm_(r[cName]) !== name) continue;

    // 시트가 앞자리 0을 지우는 경우가 있어서 뒤 8자리로 비교
    var rp = String(r[cPhone]).replace(/\D/g, "");
    if (rp.slice(-8) !== phone.slice(-8)) continue;

    orders.push(rowToOrder_(r, idx));
  }

  if (!orders.length) return out_({ ok: false, error: "not_found" });
  return out_({ ok: true, orders: orders });
}

function rowToOrder_(r, idx) {
  function val(n) { var k = idx(n); return k < 0 ? "" : String(r[k]).trim(); }
  return {
    no: val("주문번호"),
    at: val("타임스탬프"),
    name: mask_(val("이름")),
    items: val("주문내역"),
    total: val("총 결제금액"),
    status: val("처리상태") || "입금 대기",
    carrier: val("택배사"),
    tracking: val("송장번호")
  };
}

// 공백 제거 + 소문자(영문 이름 대비)
function norm_(s) {
  return String(s || "").replace(/\s+/g, "").toLowerCase();
}

function mask_(n) {
  if (n.length <= 1) return n;
  if (n.length === 2) return n.charAt(0) + "*";
  return n.charAt(0) + new Array(n.length - 1).join("*") + n.charAt(n.length - 1);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
