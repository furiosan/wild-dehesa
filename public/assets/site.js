(function () {
  var chip = document.getElementById('nowchip');
  var now = new Date().getMonth();
  if (chip) {
    try {
      var data = JSON.parse(chip.getAttribute('data-months'));
      var m = data[now];
      chip.textContent = m[0] + ': ' + m[2].charAt(0).toLowerCase() + m[2].slice(1);
      chip.setAttribute('href', '/calendar/' + m[1] + '/');
    } catch (e) { /* keep the static link */ }
  }
  var cards = document.querySelectorAll('.mgrid a[data-i]');
  for (var i = 0; i < cards.length; i++) {
    if (Number(cards[i].getAttribute('data-i')) === now) cards[i].classList.add('now');
  }
  var cells = document.querySelectorAll('table.heat[data-live] td[data-m]');
  for (var j = 0; j < cells.length; j++) {
    if (Number(cells[j].getAttribute('data-m')) === now) cells[j].classList.add('sel');
  }
})();
