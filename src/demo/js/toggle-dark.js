// 若用户偏好深色主题且未使用过切换开关，则在加载时启用深色模式
getCookie("darkmode") === null && window.matchMedia("(prefers-color-scheme: dark)").matches && darkmode();

function toggleTheme() {
  // 开启深色模式
  if (document.body.getAttribute("data-theme") !== "dark") {
    darkmode();
  }
  // 关闭深色模式
  else {
    lightmode();
  }
}

function darkmode() {
  setCookie("darkmode", "on", 9999);
  document.body.setAttribute("data-theme", "dark");
}

function lightmode() {
  setCookie("darkmode", "off", 9999);
  document.body.removeAttribute("data-theme");
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
    begin = dc.indexOf(prefix);
    if (begin != 0) return null;
  } else {
    begin += 2;
    var end = document.cookie.indexOf(";", begin);
    if (end == -1) {
      end = dc.length;
    }
  }
  return decodeURI(dc.substring(begin + prefix.length, end));
}
