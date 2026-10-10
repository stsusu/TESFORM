(function () {
  "use strict";

  var CFG = window.SHOP_CONFIG;
  var PRODUCTS = window.PRODUCTS || [];
  var app = document.getElementById("app");

  // ---------- helpers ----------
  function won(n) { return Number(n).toLocaleString("ko-KR") + "원"; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function toast(msg) {
    var t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }
  function imgBlock(p, idx) {
    var src = p.images && p.images[idx || 0];
    if (!src) return '<span class="ph">IMAGE</span>';
    return '<img src="' + esc(src) + '" alt="' + esc(p.name) + '" loading="lazy" ' +
      "onerror=\"this.replaceWith(Object.assign(document.createElement('span'),{className:'ph',textContent:'IMAGE'}))\">";
  }
  var SEXY_NOTICE = '<div class="notice"><b>구매 전 꼭 확인해주세요.</b> 본 제품은 <b>섹시버튼</b>이 있어야 사용할 수 있습니다.</div>';

  // ---------- cart ----------
  var KEY = "shop_cart_v1";
  function loadCart() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  var cart = loadCart();
  function saveCart() {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
    updateCount();
  }
  function updateCount() {
    var n = cart.reduce(function (a, c) { return a + c.qty; }, 0);
    var el = document.getElementById("cartCount");
    el.textContent = n;
    el.classList.toggle("zero", n === 0);
  }
  function unitPrice(p, sel) {
    var t = p.price;
    (p.options || []).forEach(function (o) {
      o.choices.forEach(function (c) { if (c.label === sel[o.name]) t += c.add || 0; });
    });
    return t;
  }
  function itemKey(pid, sel) {
    return pid + "|" + Object.keys(sel).sort().map(function (k) { return k + "=" + sel[k]; }).join("&");
  }
  function addToCart(pid, sel, qty) {
    var key = itemKey(pid, sel);
    var found = cart.filter(function (c) { return c.key === key; })[0];
    if (found) found.qty += qty;
    else cart.push({ key: key, pid: pid, sel: sel, qty: qty });
    saveCart();
  }
  function lines() {
    var out = [];
    cart.forEach(function (c) {
      var p = findProduct(c.pid);
      if (!p) return;
      var unit = unitPrice(p, c.sel);
      out.push({ c: c, p: p, unit: unit, sub: unit * c.qty });
    });
    return out;
  }
  function totals(ls) {
    var sub = ls.reduce(function (a, l) { return a + l.sub; }, 0);
    var ship = ls.length ? CFG.shippingFee : 0;
    return { sub: sub, ship: ship, total: sub + ship };
  }
  function optText(sel) {
    return Object.keys(sel).map(function (k) { return k + ": " + sel[k]; }).join(" / ");
  }

  // ---------- orders (이 기기에 저장) ----------
  var OKEY = "shop_orders_v1";
  function loadOrders() {
    try { return JSON.parse(localStorage.getItem(OKEY)) || []; } catch (e) { return []; }
  }
  function saveOrder(order) {
    var list = loadOrders();
    list.unshift(order);
    try { localStorage.setItem(OKEY, JSON.stringify(list.slice(0, 50))); } catch (e) {}
  }
  function removeOrder(no) {
    var list = loadOrders().filter(function (o) { return o.no !== no; });
    try { localStorage.setItem(OKEY, JSON.stringify(list)); } catch (e) {}
  }
  function fmtDate(iso) {
    try {
      return new Date(iso).toLocaleString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch (e) { return ""; }
  }

  // ---------- 주문 조회 (구글 시트 연동) ----------
  var STATUS_STEPS = ["입금 대기", "입금 확인", "제작 중", "배송 중", "배송 완료"];

  function lookupOrder(name, phone, box) {
    if (!CFG.lookupUrl) { box.innerHTML = ""; return; }
    box.innerHTML = '<div class="notice">조회 중이에요...</div>';
    var url = CFG.lookupUrl + (CFG.lookupUrl.indexOf("?") === -1 ? "?" : "&") +
      "name=" + encodeURIComponent(name) + "&phone=" + encodeURIComponent(phone);
    fetch(url).then(function (r) { return r.json(); }).then(function (d) {
      if (!d || !d.ok) {
        box.innerHTML = '<div class="notice">일치하는 주문을 찾지 못했어요. 주문 시 입력한 이름과 연락처를 다시 확인해주세요.<br>방금 주문했다면 잠시 후 다시 조회해보세요.</div>';
        return;
      }
      box.innerHTML = (d.orders || []).map(lookupHtml).join("");
      box.scrollIntoView({ behavior: "smooth", block: "start" });
    }).catch(function () {
      box.innerHTML = '<div class="notice">조회에 실패했어요. 잠시 후 다시 시도해주세요.</div>';
    });
  }

  function lookupHtml(o) {
    var idx = STATUS_STEPS.indexOf(o.status);
    var steps = STATUS_STEPS.map(function (s, i) {
      var cls = idx === -1 ? "" : i < idx ? "done" : i === idx ? "now" : "";
      return '<li class="' + cls + '"><i></i><span>' + esc(s) + "</span></li>";
    }).join("");
    var ship;
    if (o.tracking) {
      var q = encodeURIComponent((o.carrier ? o.carrier + " " : "") + o.tracking);
      ship = '<div class="lk-row"><span>택배 정보</span><b>' + esc(o.carrier || "") + " " + esc(o.tracking) + "</b></div>" +
        '<a class="btn ghost block" style="margin-top:10px" target="_blank" rel="noopener" href="https://search.naver.com/search.naver?query=' + q + '">택배 배송 조회</a>';
    } else {
      ship = '<div class="lk-row"><span>택배 정보</span><b>아직 등록되지 않았어요</b></div>';
    }
    return '<div class="lk-card"><div class="lk-head"><b>' + esc(o.no) + '</b><span class="lk-status">' + esc(o.status) + "</span></div>" +
      (idx === -1 ? "" : '<ol class="lk-steps">' + steps + "</ol>") +
      '<div class="lk-row"><span>주문일시</span><b>' + esc(o.at) + "</b></div>" +
      '<div class="lk-row"><span>주문자</span><b>' + esc(o.name) + "</b></div>" +
      '<div class="lk-row"><span>결제금액</span><b>' + esc(o.total) + "</b></div>" +
      '<div class="oc-sec"><div class="opt-name">주문 상품</div><p class="order-list">' + esc(o.items) + "</p></div>" +
      ship + "</div>";
  }

  // ---------- views ----------
  function renderHome() {
    var cards = PRODUCTS.map(function (p) {
      var hasAdd = (p.options || []).some(function (o) { return o.choices.some(function (c) { return c.add > 0; }); });
      return '<a class="card" href="#/product/' + encodeURIComponent(p.id) + '">' +
        '<div class="thumb">' + (p.badge ? '<span class="badge">' + esc(p.badge) + "</span>" : "") + imgBlock(p, 0) + "</div>" +
        '<div class="card-body"><h3 class="card-title">' + esc(p.name) + "</h3>" +
        '<p class="card-sub">' + esc(p.subtitle || "") + "</p>" +
        '<div class="card-price">' + won(p.price) + (hasAdd ? " <small>부터</small>" : "") + "</div></div></a>";
    }).join("");
    app.innerHTML =
      '<section class="hero"><h1>' + esc(CFG.tagline) + "</h1><p>3D 프린터로 제작된 테슬라 악세서리</p></section>" +
      '<div class="wrap">' + SEXY_NOTICE + '<div class="grid">' + cards + "</div></div>";
  }

  function renderProduct(id) {
    var p = findProduct(id);
    if (!p) return renderNotFound();
    var sel = {};
    (p.options || []).forEach(function (o) { sel[o.name] = o.choices[0].label; });
    var qty = 1;
    var imgs = p.images || [];

    var thumbs = imgs.length > 1 ? '<div class="thumbs">' + imgs.map(function (s, i) {
      return '<button type="button" data-i="' + i + '" class="' + (i === 0 ? "on" : "") + '"><img src="' + esc(s) + '" alt=""></button>';
    }).join("") + "</div>" : "";

    var opts = (p.options || []).map(function (o, oi) {
      return '<div class="opt"><div class="opt-name">' + esc(o.name) + '</div><div class="chips">' +
        o.choices.map(function (c, ci) {
          return '<label class="chip"><input type="radio" name="opt' + oi + '" data-o="' + oi + '" value="' + ci + '"' + (ci === 0 ? " checked" : "") + ">" +
            "<span>" + esc(c.label) + (c.add > 0 ? "<em>+" + won(c.add) + "</em>" : "") + "</span></label>";
        }).join("") + "</div></div>";
    }).join("");

    var det = (p.details && p.details.length) ? '<ul class="details">' + p.details.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul>" : "";

    app.innerHTML = '<div class="wrap"><a class="back" href="#/">← 제품 목록</a><div class="detail">' +
      '<div class="gallery"><div class="main-img" id="mainImg">' + imgBlock(p, 0) + "</div>" + thumbs + "</div>" +
      '<div class="info"><h1>' + esc(p.name) + '</h1><p class="sub">' + esc(p.subtitle || "") + "</p>" +
      '<div class="price-now" id="priceNow"></div>' +
      '<p class="desc">' + esc(p.description || "") + "</p>" + det + SEXY_NOTICE + opts +
      '<div class="qty-row"><div class="opt-name" style="margin:0">수량</div><div class="qty">' +
      '<button type="button" id="qMinus" aria-label="수량 감소">−</button><span id="qVal">1</span>' +
      '<button type="button" id="qPlus" aria-label="수량 증가">+</button></div></div>' +
      '<div class="btn-row"><button type="button" class="btn ghost" id="addBtn">장바구니 담기</button>' +
      '<button type="button" class="btn" id="buyBtn">바로 구매</button></div>' +
      "</div></div></div>";

    function refresh() {
      document.getElementById("priceNow").textContent = won(unitPrice(p, sel) * qty);
      document.getElementById("qVal").textContent = qty;
    }
    refresh();

    app.querySelectorAll('input[type=radio]').forEach(function (r) {
      r.addEventListener("change", function () {
        var o = p.options[Number(r.dataset.o)];
        sel[o.name] = o.choices[Number(r.value)].label;
        refresh();
      });
    });
    document.getElementById("qMinus").onclick = function () { if (qty > 1) { qty--; refresh(); } };
    document.getElementById("qPlus").onclick = function () { if (qty < 99) { qty++; refresh(); } };
    app.querySelectorAll(".thumbs button").forEach(function (b) {
      b.onclick = function () {
        app.querySelectorAll(".thumbs button").forEach(function (x) { x.classList.remove("on"); });
        b.classList.add("on");
        document.getElementById("mainImg").innerHTML = imgBlock(p, Number(b.dataset.i));
      };
    });
    document.getElementById("addBtn").onclick = function () {
      addToCart(p.id, Object.assign({}, sel), qty);
      toast("장바구니에 담았어요");
    };
    document.getElementById("buyBtn").onclick = function () {
      addToCart(p.id, Object.assign({}, sel), qty);
      location.hash = "#/checkout";
    };
  }

  function summaryHtml(ls, t, withButton) {
    return '<aside class="summary"><h3>주문 요약</h3>' +
      '<div class="sum-row"><span>상품 금액</span><span>' + won(t.sub) + "</span></div>" +
      '<div class="sum-row"><span>배송비</span><span>' + won(t.ship) + "</span></div>" +
      '<div class="sum-row total"><span>총 결제금액</span><span>' + won(t.total) + "</span></div>" +
      (withButton ? '<a class="btn block" style="margin-top:16px" href="#/checkout">주문하기</a>' : "") +
      "</aside>";
  }

  function renderCart() {
    var ls = lines();
    if (!ls.length) {
      app.innerHTML = '<div class="wrap"><h1 class="page-title">장바구니</h1><div class="empty"><p>장바구니가 비어 있어요.</p><a class="btn" href="#/">제품 보러가기</a></div></div>';
      return;
    }
    var t = totals(ls);
    var items = ls.map(function (l) {
      return '<div class="cart-item"><div class="ci-img">' + imgBlock(l.p, 0) + "</div>" +
        "<div><div class=\"ci-name\">" + esc(l.p.name) + '</div><div class="ci-opts">' + esc(optText(l.c.sel)) + "</div>" +
        '<div class="qty"><button type="button" data-act="minus" data-key="' + esc(l.c.key) + '" aria-label="수량 감소">−</button><span>' + l.c.qty +
        '</span><button type="button" data-act="plus" data-key="' + esc(l.c.key) + '" aria-label="수량 증가">+</button></div></div>' +
        '<div class="ci-right"><div class="ci-price">' + won(l.sub) + '</div><button type="button" class="link-btn" data-act="del" data-key="' + esc(l.c.key) + '">삭제</button></div></div>';
    }).join("");
    app.innerHTML = '<div class="wrap"><h1 class="page-title">장바구니</h1><div class="cart-layout"><div>' + items + "</div>" + summaryHtml(ls, t, true) + "</div></div>";

    app.querySelectorAll("[data-act]").forEach(function (b) {
      b.onclick = function () {
        var c = cart.filter(function (x) { return x.key === b.dataset.key; })[0];
        if (!c) return;
        if (b.dataset.act === "plus" && c.qty < 99) c.qty++;
        else if (b.dataset.act === "minus" && c.qty > 1) c.qty--;
        else if (b.dataset.act === "del") cart = cart.filter(function (x) { return x !== c; });
        saveCart();
        renderCart();
      };
    });
  }

  function renderCheckout() {
    var ls = lines();
    if (!ls.length) { location.hash = "#/cart"; return; }
    var t = totals(ls);
    var itemRows = ls.map(function (l) {
      return '<div class="sum-row" style="font-size:14px"><span>' + esc(l.p.name) + " × " + l.c.qty + "</span><span>" + won(l.sub) + "</span></div>";
    }).join("");

    app.innerHTML = '<div class="wrap"><a class="back" href="#/cart">← 장바구니</a><h1 class="page-title">주문서 작성</h1>' +
      '<form id="orderForm" novalidate class="form-grid"><div>' +
      field("name", "이름", "text", "받으시는 분 이름", true, "이름을 입력해주세요.") +
      field("phone", "연락처", "tel", "010-0000-0000", true, "연락처를 정확히 입력해주세요.") +
      field("address", "주소", "text", "도로명 주소 + 상세주소", true, "주소를 입력해주세요.") +
      field("nickname", "카페닉네임", "text", "카페에서 사용하는 닉네임", true, "카페닉네임을 입력해주세요.") +
      '<div class="field"><label for="f_request">추가요청사항<span class="opt-tag">(선택)</span></label><textarea id="f_request" name="request" placeholder="배송 시 요청사항 등 자유롭게 적어주세요."></textarea></div>' +
      '<div class="field consent" id="consentField"><label><input type="checkbox" id="f_consent"><span>개인정보 수집 및 이용에 동의합니다. <span class="req">(필수)</span></span></label>' +
      "<details><summary>자세히 보기</summary><ul><li>수집 항목: 이름, 연락처, 주소, 카페닉네임, 추가요청사항</li><li>이용 목적: 주문 확인, 제품 제작 및 배송, 문의 응대</li><li>보유 기간: 주문 처리 및 배송 완료 후 필요한 기간 동안 보관 후 파기</li><li>동의를 거부할 수 있으나, 거부 시 주문이 불가합니다.</li></ul></details>" +
      '<div class="err">개인정보 수집 및 이용에 동의해주세요.</div></div>' +
      "</div><div><aside class=\"summary\"><h3>주문 요약</h3>" + itemRows +
      '<div class="sum-row" style="border-top:1px solid var(--line);padding-top:12px;margin-top:12px"><span>상품 금액</span><span>' + won(t.sub) + "</span></div>" +
      '<div class="sum-row"><span>배송비</span><span>' + won(t.ship) + "</span></div>" +
      '<div class="sum-row total"><span>총 결제금액</span><span>' + won(t.total) + "</span></div>" +
      '<div class="bank-box"><b>결제 방법: 계좌 입금</b><br>주문서 제출 후 입금 계좌를 안내해 드려요.</div>' +
      '<button type="submit" class="btn block" id="submitBtn" style="margin-top:16px">주문서 제출하기</button>' +
      '<p class="muted" style="font-size:12px;margin:10px 0 0">※ 섹시버튼이 있는 차량에서만 사용 가능한 제품입니다.</p>' +
      "</aside></div></form></div>";

    var form = document.getElementById("orderForm");
    form.querySelectorAll("input,textarea").forEach(function (el) {
      el.addEventListener("input", function () { var f = el.closest(".field"); if (f) f.classList.remove("invalid"); });
      el.addEventListener("change", function () { var f = el.closest(".field"); if (f) f.classList.remove("invalid"); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = {
        name: document.getElementById("f_name").value.trim(),
        phone: document.getElementById("f_phone").value.trim(),
        address: document.getElementById("f_address").value.trim(),
        nickname: document.getElementById("f_nickname").value.trim(),
        request: document.getElementById("f_request").value.trim()
      };
      var ok = true, first = null;
      function bad(id) { var f = document.getElementById(id).closest(".field"); f.classList.add("invalid"); ok = false; if (!first) first = f; }
      if (!v.name) bad("f_name");
      if (!/^[0-9+\-\s()]{9,16}$/.test(v.phone)) bad("f_phone");
      if (!v.address) bad("f_address");
      if (!v.nickname) bad("f_nickname");
      if (!document.getElementById("f_consent").checked) bad("f_consent");
      if (!ok) { first.scrollIntoView({ behavior: "smooth", block: "center" }); return; }

      submitOrder(v, ls, t);
    });
  }

  function field(name, label, type, ph, required, errMsg) {
    return '<div class="field"><label for="f_' + name + '">' + label + (required ? '<span class="req">*</span>' : "") + "</label>" +
      '<input id="f_' + name + '" name="' + name + '" type="' + type + '" placeholder="' + esc(ph) + '" autocomplete="' + (name === "name" ? "name" : name === "phone" ? "tel" : name === "address" ? "street-address" : "off") + '">' +
      '<div class="err">' + errMsg + "</div></div>";
  }

  function makeOrderNo() {
    var d = new Date();
    function p(n) { return String(n).padStart(2, "0"); }
    return String(d.getFullYear()).slice(2) + p(d.getMonth() + 1) + p(d.getDate()) + "-" + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  function submitOrder(v, ls, t) {
    var btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.textContent = "제출 중...";

    var itemsText = ls.map(function (l, i) {
      return (i + 1) + ". " + l.p.name + "\n   " + optText(l.c.sel) + "\n   수량 " + l.c.qty + "개 / " + won(l.sub);
    }).join("\n") + "\n\n상품금액 " + won(t.sub) + " + 배송비 " + won(t.ship);

    var order = {
      no: makeOrderNo(), name: v.name, phone: v.phone, address: v.address, nickname: v.nickname,
      request: v.request, items: itemsText, total: t.total,
      at: new Date().toISOString()
    };

    var E = CFG.form.entries;
    var body = new URLSearchParams();
    body.append(E.orderNo, order.no);
    body.append(E.name, order.name);
    body.append(E.phone, order.phone);
    body.append(E.address, order.address);
    body.append(E.nickname, order.nickname);
    body.append(E.request, order.request);
    body.append(E.items, order.items);
    body.append(E.total, won(order.total));

    var configured = CFG.form.action.indexOf("YOUR_FORM_ID") === -1;
    order.test = !configured;

    var send = configured
      ? fetch(CFG.form.action, { method: "POST", mode: "no-cors", body: body })
      : Promise.resolve();

    send.then(function () {
      try { sessionStorage.setItem("shop_last_order", JSON.stringify(order)); } catch (e) {}
      window.__lastOrder = order;
      saveOrder(order);
      cart = [];
      saveCart();
      location.hash = "#/done";
    }).catch(function () {
      btn.disabled = false;
      btn.textContent = "주문서 제출하기";
      toast("전송에 실패했어요. 네트워크를 확인하고 다시 시도해주세요.");
    });
  }

  function renderDone() {
    var order = window.__lastOrder;
    if (!order) {
      try { order = JSON.parse(sessionStorage.getItem("shop_last_order")); } catch (e) {}
    }
    if (!order) { location.hash = "#/"; return; }
    var b = CFG.bank;
    app.innerHTML = '<div class="wrap"><div class="done"><div class="check">✓</div><h1>주문서가 접수되었어요</h1>' +
      '<p class="lead">아래 계좌로 입금해 주시면 주문이 처리됩니다.</p>' +
      (order.test ? '<div class="test-banner">테스트 모드: 구글폼이 아직 연결되지 않아 주문 내용이 전송되지 않았습니다. (config.js 설정 필요)</div>' : "") +
      '<div class="pay-box">' +
      '<div class="pay-row"><span>주문번호</span><b>' + esc(order.no) + "</b></div>" +
      '<div class="pay-row"><span>입금 금액</span><span class="pay-amount">' + won(order.total) + "</span></div>" +
      '<div class="pay-row"><span>은행</span><b>' + esc(b.name) + "</b></div>" +
      '<div class="pay-row"><span>계좌번호</span><div class="copy-row"><b id="acct">' + esc(b.number) + '</b><button type="button" class="copy-btn" id="copyAcct">복사</button></div></div>' +
      '<div class="pay-row"><span>예금주</span><b>' + esc(b.holder) + "</b></div>" +
      '<div class="pay-row"><span>입금자명</span><b>' + esc(order.name) + "</b></div></div>" +
      '<p class="muted" style="font-size:13px">입금자명은 주문자 이름과 동일하게 입금해 주세요.</p>' +
      '<div class="pay-box"><div class="opt-name">주문 내역</div><p class="order-list">' + esc(order.items) + "</p></div>" +
      '<a class="btn block" style="margin-bottom:10px" href="#/orders">내 주문내역 보기</a>' +
      '<a class="btn ghost block" href="#/">쇼핑 계속하기</a></div></div>';

    document.getElementById("copyAcct").onclick = function () {
      var txt = b.number;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(function () { toast("계좌번호를 복사했어요"); }, fallback);
      } else fallback();
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = txt; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); toast("계좌번호를 복사했어요"); } catch (e) { toast("길게 눌러 직접 복사해주세요"); }
        document.body.removeChild(ta);
      }
    };
  }

  function renderOrders() {
    var list = loadOrders();
    var b = CFG.bank;
    var body;
    if (!list.length) {
      body = '<div class="empty"><p>이 기기에서 주문한 내역이 없어요.</p><a class="btn" href="#/">제품 보러가기</a></div>';
    } else {
      body = list.map(function (o) {
        return '<details class="order-card"><summary>' +
          '<div class="oc-top"><b>' + esc(o.no) + "</b>" + (o.test ? '<span class="oc-tag">테스트</span>' : "") + "</div>" +
          '<div class="oc-sub"><span>' + esc(fmtDate(o.at)) + '</span><span class="oc-total">' + won(o.total) + "</span></div></summary>" +
          '<div class="oc-body">' +
          '<div class="oc-sec"><div class="opt-name">주문 상품</div><p class="order-list">' + esc(o.items) + "</p></div>" +
          '<div class="oc-sec"><div class="opt-name">배송 정보</div><p class="order-list">' +
          esc(o.name) + " / " + esc(o.phone) + "\n" + esc(o.address) + "\n카페닉네임: " + esc(o.nickname) +
          (o.request ? "\n요청사항: " + esc(o.request) : "") + "</p></div>" +
          '<div class="oc-sec"><div class="opt-name">입금 안내</div><p class="order-list">' +
          esc(b.name) + " " + esc(b.number) + "\n예금주 " + esc(b.holder) + "\n입금액 " + won(o.total) + "\n입금자명 " + esc(o.name) + "</p></div>" +
          (CFG.lookupUrl ? '<button type="button" class="btn ghost block" style="margin-top:14px" data-chk="' + esc(o.no) + '">처리·배송 상태 조회</button>' : "") +
          '<button type="button" class="link-btn" data-del="' + esc(o.no) + '">이 기기에서 내역 삭제</button>' +
          "</div></details>";
      }).join("");
    }
    var hasLookup = !!CFG.lookupUrl;
    var lookupForm = hasLookup
      ? '<form id="lookupForm" class="lk-form"><div class="opt-name">주문 조회 (어느 기기에서나)</div>' +
        '<div class="field"><input id="lk_name" type="text" placeholder="이름 (주문 시 입력한 이름)" autocomplete="off"></div>' +
        '<div class="field"><input id="lk_phone" type="tel" placeholder="주문 시 입력한 연락처"></div>' +
        '<button type="submit" class="btn block">조회하기</button></form><div id="lookupResult"></div>'
      : "";
    var noticeText = hasLookup
      ? "아래 <b>저장된 주문내역</b>은 주문한 이 기기(브라우저)에만 보관돼요. 다른 기기에서는 위 <b>주문 조회</b>에 이름과 연락처를 입력하면 처리 상태와 배송 정보를 볼 수 있어요."
      : "주문내역은 <b>주문한 이 기기(브라우저)</b>에만 저장돼요. 다른 기기에서 접속하거나 브라우저 기록을 지우면 보이지 않아요. 입금 확인·배송 상태는 이 화면에 표시되지 않아요.";
    app.innerHTML = '<div class="wrap" style="max-width:680px"><h1 class="page-title">주문내역</h1>' + lookupForm +
      '<div class="notice">' + noticeText + "</div>" +
      body + "</div>";

    var lf = document.getElementById("lookupForm");
    if (lf) {
      lf.addEventListener("submit", function (e) {
        e.preventDefault();
        var nm = document.getElementById("lk_name").value.trim();
        var ph = document.getElementById("lk_phone").value.trim();
        if (!nm || !ph) { toast("이름과 연락처를 입력해주세요"); return; }
        lookupOrder(nm, ph, document.getElementById("lookupResult"));
      });
    }
    app.querySelectorAll("[data-chk]").forEach(function (btn) {
      btn.onclick = function () {
        var o = loadOrders().filter(function (x) { return x.no === btn.dataset.chk; })[0];
        if (o) lookupOrder(o.name, o.phone, document.getElementById("lookupResult"));
      };
    });

    app.querySelectorAll("[data-del]").forEach(function (btn) {
      btn.onclick = function () {
        if (confirm("이 기기에서 이 주문내역을 삭제할까요?\n(이미 접수된 주문은 취소되지 않아요.)")) {
          removeOrder(btn.dataset.del);
          renderOrders();
        }
      };
    });
  }

  function renderNotFound() {
    app.innerHTML = '<div class="wrap"><div class="empty"><p>페이지를 찾을 수 없어요.</p><a class="btn" href="#/">홈으로</a></div></div>';
  }

  // ---------- router ----------
  function route() {
    var h = location.hash || "#/";
    var parts = h.replace(/^#\/?/, "").split("/");
    var page = parts[0] || "";
    if (page === "") renderHome();
    else if (page === "product") renderProduct(decodeURIComponent(parts[1] || ""));
    else if (page === "cart") renderCart();
    else if (page === "checkout") renderCheckout();
    else if (page === "done") renderDone();
    else if (page === "orders") renderOrders();
    else renderNotFound();
    window.scrollTo(0, 0);
  }

  // ---------- init ----------
  document.title = CFG.shopName + " | " + CFG.tagline;
  document.getElementById("logo").textContent = CFG.shopName;
  document.getElementById("footerText").textContent = "© " + new Date().getFullYear() + " " + CFG.shopName;
  updateCount();
  window.addEventListener("hashchange", route);
  route();
})();
