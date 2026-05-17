var tenureUnit = 'years';

window.onload = function() {
  calculate();
  updateAllSliders();
};

function setTab(btn, type) {
  var tabs = document.querySelectorAll('.tab');
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].classList.remove('active');
  }

  btn.classList.add('active');

  if (type === 'home') {
    document.getElementById('amountInput').value = 5000000;
    document.getElementById('amountSlider').value = 5000000;
    document.getElementById('rateInput').value = 8.5;
    document.getElementById('rateSlider').value = 8.5;
    document.getElementById('tenureInput').value = 20;
    document.getElementById('tenureSlider').value = 20;
  } else if (type === 'car') {
    document.getElementById('amountInput').value = 700000;
    document.getElementById('amountSlider').value = 700000;
    document.getElementById('rateInput').value = 9.0;
    document.getElementById('rateSlider').value = 9.0;
    document.getElementById('tenureInput').value = 5;
    document.getElementById('tenureSlider').value = 5;
  } else if (type === 'personal') {
    document.getElementById('amountInput').value = 300000;
    document.getElementById('amountSlider').value = 300000;
    document.getElementById('rateInput').value = 14.0;
    document.getElementById('rateSlider').value = 14.0;
    document.getElementById('tenureInput').value = 3;
    document.getElementById('tenureSlider').value = 3;
  }

  calculate();
  updateAllSliders();
}

function setUnit(unit) {
  tenureUnit = unit;

  if (unit === 'years') {
    document.getElementById('yearBtn').classList.add('active');
    document.getElementById('monthBtn').classList.remove('active');
    document.getElementById('tenureSlider').min = 1;
    document.getElementById('tenureSlider').max = 30;
    document.getElementById('tenureSlider').step = 1;

    var currentVal = parseInt(document.getElementById('tenureInput').value);

    if (currentVal > 30) {
      var years = Math.round(currentVal / 12);
      document.getElementById('tenureInput').value = years;
      document.getElementById('tenureSlider').value = years;
    }
  } else {
    document.getElementById('yearBtn').classList.remove('active');
    document.getElementById('monthBtn').classList.add('active');
    document.getElementById('tenureSlider').min = 1;
    document.getElementById('tenureSlider').max = 360;
    document.getElementById('tenureSlider').step = 1;

    var currentVal2 = parseInt(document.getElementById('tenureInput').value);

    if (currentVal2 <= 30) {
      var months = currentVal2 * 12;
      document.getElementById('tenureInput').value = months;
      document.getElementById('tenureSlider').value = months;
    }
  }

  calculate();
  updateAllSliders();
}

function syncFromSlider(which) {
  if (which === 'amount') {
    var val = document.getElementById('amountSlider').value;
    document.getElementById('amountInput').value = val;
  } else if (which === 'rate') {
    var val = document.getElementById('rateSlider').value;
    document.getElementById('rateInput').value = val;
  } else if (which === 'tenure') {
    var val = document.getElementById('tenureSlider').value;
    document.getElementById('tenureInput').value = val;
  }

  calculate();
  updateAllSliders();
}

function syncFromInput(which) {
  if (which === 'amount') {
    var val = document.getElementById('amountInput').value;
    document.getElementById('amountSlider').value = val;
  } else if (which === 'rate') {
    var val = document.getElementById('rateInput').value;
    document.getElementById('rateSlider').value = val;
  } else if (which === 'tenure') {
    var val = document.getElementById('tenureInput').value;
    document.getElementById('tenureSlider').value = val;
  }

  calculate();
  updateAllSliders();
}

function updateAllSliders() {
  updateSliderFill('amountSlider', 100000, 85000000);
  updateSliderFill('rateSlider', 1, 20);

  if (tenureUnit === 'years') {
    updateSliderFill('tenureSlider', 1, 30);
  } else {
    updateSliderFill('tenureSlider', 1, 360);
  }
}

function updateSliderFill(id, min, max) {
  var slider = document.getElementById(id);
  var val = parseFloat(slider.value);
  var pct = ((val - min) / (max - min)) * 100;
  slider.style.setProperty('--pct', pct + '%');
}

function calculate() {
  var principal = parseFloat(document.getElementById('amountInput').value) || 0;
  var annualRate = parseFloat(document.getElementById('rateInput').value) || 0;
  var tenureVal = parseFloat(document.getElementById('tenureInput').value) || 0;

  var totalMonths;

  if (tenureUnit === 'years') {
    totalMonths = tenureVal * 12;
  } else {
    totalMonths = tenureVal;
  }

  var r = annualRate / 12 / 100;

  var emi = 0;
  var totalAmount = 0;
  var totalInterest = 0;

  if (r === 0) {
    emi = principal / totalMonths;
  } else {
    emi = principal * r * Math.pow(1 + r, totalMonths) / (Math.pow(1 + r, totalMonths) - 1);
  }

  totalAmount = emi * totalMonths;
  totalInterest = totalAmount - principal;

  document.getElementById('emiDisplay').textContent = '₹' + formatIndian(Math.round(emi));
  document.getElementById('principalDisplay').textContent = '₹' + formatIndian(Math.round(principal));
  document.getElementById('interestDisplay').textContent = '₹' + formatIndian(Math.round(totalInterest));
  document.getElementById('totalDisplay').textContent = '₹' + formatIndian(Math.round(totalAmount));

  drawChart(principal, totalInterest);
}

function formatIndian(num) {
  if (isNaN(num)) return '0';

  var str = num.toString();
  var lastThree = str.slice(-3);
  var rest = str.slice(0, -3);
  var result = '';

  if (rest.length > 0) {
    while (rest.length > 2) {
      result = ',' + rest.slice(-2) + result;
      rest = rest.slice(0, -2);
    }

    result = rest + result;
    result = result + ',' + lastThree;
  } else {
    result = lastThree;
  }

  return result;
}

function drawChart(principal, interest) {
  var canvas = document.getElementById('donutChart');
  var ctx = canvas.getContext('2d');

  var total = principal + interest;

  if (total === 0) return;

  var principalAngle = (principal / total) * 2 * Math.PI;
  var interestAngle = (interest / total) * 2 * Math.PI;

  var cx = canvas.width / 2;
  var cy = canvas.height / 2;
  var outerR = 75;
  var innerR = 52;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, outerR, -Math.PI / 2, -Math.PI / 2 + principalAngle);
  ctx.closePath();
  ctx.fillStyle = '#3b82f6';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, outerR, -Math.PI / 2 + principalAngle, -Math.PI / 2 + principalAngle + interestAngle);
  ctx.closePath();
  ctx.fillStyle = '#9ca3af';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cx, cy, innerR, 0, 2 * Math.PI);
  ctx.fillStyle = '#f0f4ff';
  ctx.fill();
}