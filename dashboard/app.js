(() => {
  'use strict';
  const data = JSON.parse(document.querySelector('#dashboard-data').textContent);
  const palette = { purple: '#270A5E', green: '#13B857', red: '#F21E35', orange: '#FB8500', blue: '#0965F5' };
  const font = 'IBM Plex Sans Arabic';
  const charts = [];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sections = document.querySelector('#sections');
  const empty = document.querySelector('#empty-state');
  const period = document.querySelector('#period-text');
  const links = [...document.querySelectorAll('.section-link')];
  const startInput = document.querySelector('#date-start');
  const endInput = document.querySelector('#date-end');
  const sectionLabels = { orders: 'الطلبات', shipments: 'الشحنات', financial: 'المالية' };
  const sidebar = document.querySelector('#sidebar');
  const appShell = document.querySelector('.app-shell');
  const mobileQuery = window.matchMedia('(max-width: 760px)');
  let toastTimer;

  function notify(message) {
    const toast = document.querySelector('#toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { toast.hidden = true; }, 2800);
  }

  function setActive(hash) {
    links.forEach(link => {
      const active = link.getAttribute('href') === hash;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function closeMobile() {
    const returnFocus = sidebar.contains(document.activeElement) && mobileQuery.matches;
    sidebar.classList.remove('open');
    sidebar.inert = mobileQuery.matches;
    appShell.inert = false;
    document.querySelector('#mobile-backdrop').hidden = true;
    document.querySelector('.mobile-menu').setAttribute('aria-expanded', 'false');
    if (returnFocus) document.querySelector('.mobile-menu').focus({ preventScroll: true });
  }
  closeMobile();
  mobileQuery.addEventListener('change', closeMobile);

  document.querySelector('.mobile-menu').addEventListener('click', () => {
    sidebar.inert = false;
    sidebar.classList.add('open');
    appShell.inert = true;
    document.querySelector('#mobile-backdrop').hidden = false;
    document.querySelector('.mobile-menu').setAttribute('aria-expanded', 'true');
    document.querySelector('.sidebar-close').focus();
  });
  document.querySelector('.sidebar-close').addEventListener('click', closeMobile);
  document.querySelector('#mobile-backdrop').addEventListener('click', closeMobile);
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMobile(); });
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      if (target.closest('#sections') && sections.hidden) {
        empty.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth' });
        closeMobile();
        return;
      }
      target.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'start' });
      history.replaceState(null, '', hash);
      setActive(hash);
      closeMobile();
      if (link.classList.contains('skip-link')) {
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  });

  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      let current = '#overview';
      if (!sections.hidden) {
        document.querySelectorAll('.dashboard-section').forEach(section => {
          if (section.getBoundingClientRect().top <= 170) current = '#' + section.id;
        });
      }
      setActive(current);
      scrollScheduled = false;
    });
  }, { passive: true });

  document.querySelectorAll('[data-open-dialog]').forEach(button => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.openDialog);
      if (dialog.id === 'search-dialog') {
        document.querySelector('#dashboard-search').value = '';
        renderSearch('');
      }
      dialog.showModal();
    });
  });
  document.querySelectorAll('[data-close-dialog]').forEach(button => {
    button.addEventListener('click', () => button.closest('dialog').close());
  });
  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog) {
        const box = dialog.getBoundingClientRect();
        if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
      }
    });
  });

  // Only a single aggregate snapshot exists. Other ranges show unavailable data,
  // rather than fabricating filtered metrics or representing missing data as zero.
  function applyPeriod(start, end) {
    period.textContent = start.replaceAll('-', '/') + ' – ' + end.replaceAll('-', '/');
    const supported = start === data.period.start && end === data.period.end;
    sections.hidden = !supported;
    empty.hidden = supported;
    if (supported) requestAnimationFrame(() => charts.forEach(chart => chart.resize()));
    setActive('#overview');
  }
  document.querySelector('#date-form').addEventListener('submit', event => {
    event.preventDefault();
    const error = document.querySelector('#date-error');
    const invalid = startInput.value > endInput.value;
    error.hidden = !invalid;
    if (invalid) return;
    applyPeriod(startInput.value, endInput.value);
    document.querySelector('#date-dialog').close();
  });
  document.querySelector('#restore-period').addEventListener('click', () => {
    startInput.value = data.period.start;
    endInput.value = data.period.end;
    applyPeriod(data.period.start, data.period.end);
  });

  const normalize = text => text.trim().replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/[ًٌٍَُِّْ]/g, '');
  function renderSearch(value) {
    const results = document.querySelector('#search-results');
    results.replaceChildren();
    const term = normalize(value);
    if (!term || sections.hidden) {
      const hint = document.createElement('p');
      hint.className = 'search-hint';
      hint.textContent = sections.hidden ? 'لا تتوفر بيانات في الفترة المختارة.' : 'ابحث عن الطلبات أو الشحنات أو الأرصدة.';
      results.append(hint);
      return;
    }
    const matches = [...document.querySelectorAll('[data-search]')].filter(metric => normalize(metric.dataset.search + ' ' + sectionLabels[metric.dataset.section]).includes(term));
    if (!matches.length) {
      const hint = document.createElement('p');
      hint.className = 'search-hint';
      hint.textContent = 'لا توجد نتائج مطابقة.';
      results.append(hint);
      return;
    }
    matches.forEach(metric => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'search-result';
      const label = document.createElement('span');
      label.textContent = metric.dataset.search;
      const group = document.createElement('small');
      group.textContent = sectionLabels[metric.dataset.section];
      label.append(group);
      const amount = document.createElement('bdi');
      amount.dir = 'ltr';
      amount.textContent = metric.dataset.value;
      button.append(label, amount);
      button.addEventListener('click', () => {
        document.querySelector('#search-dialog').close();
        metric.scrollIntoView({ behavior: reducedMotion ? 'instant' : 'smooth', block: 'center' });
        metric.classList.add('flash');
        setTimeout(() => metric.classList.remove('flash'), 1800);
      });
      results.append(button);
    });
  }
  document.querySelector('#dashboard-search').addEventListener('input', event => renderSearch(event.target.value));

  document.querySelector('#copy-link').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(location.href); notify('تم نسخ رابط اللوحة'); }
    catch { notify('يمكنك نسخ الرابط من شريط العنوان'); }
  });
  document.querySelector('#fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { notify('ملء الشاشة غير متاح في هذا المتصفح'); }
  });

  function donut(canvas, value, color) {
    const chart = new Chart(canvas, {
      type: 'doughnut',
      data: { datasets: [{ data: [value, 100 - value], backgroundColor: [color, '#EAEAF1'], borderWidth: 0, borderRadius: [9, 0], hoverOffset: 0 }] },
      options: { responsive: true, maintainAspectRatio: false, cutout: '78%', animation: false, rotation: 0, events: [], plugins: { legend: { display: false }, tooltip: { enabled: false } } }
    });
    charts.push(chart);
  }

  async function renderCharts() {
    await document.fonts.ready;
    Chart.defaults.font.family = font;
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#626B82';
    Chart.defaults.animation = false;
    data.ratios.forEach((ratio, i) => donut(document.querySelector('#ratio-' + i), ratio.value, palette[ratio.tone]));
    donut(document.querySelector('#delivery-chart'), data.distribution.deliveryPercentage, palette.purple);

    const valueLabels = {
      id: 'halaValueLabels',
      afterDatasetsDraw(chart) {
        if (chart.canvas.id !== 'distribution-chart') return;
        const ctx = chart.ctx;
        ctx.save();
        ctx.font = '500 13px "IBM Plex Sans Arabic"';
        ctx.fillStyle = '#15132B';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        chart.getDatasetMeta(0).data.forEach((bar, index) => ctx.fillText(String(data.distribution.values[index]), chart.chartArea.right + 12, bar.y));
        ctx.restore();
      }
    };
    charts.push(new Chart(document.querySelector('#distribution-chart'), {
      type: 'bar',
      plugins: [valueLabels],
      data: { labels: data.distribution.labels, datasets: [
        { data: data.distribution.values, backgroundColor: [palette.orange, palette.blue, palette.green, '#DCE0E8'], borderRadius: 5, borderSkipped: false, barThickness: 23, grouped: false, order: 0 },
        { data: [80,80,80,80], backgroundColor: '#F1F3F7', borderRadius: 5, barThickness: 23, grouped: false, order: 1 }
      ] },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false, layout: { padding: { right: 31 } },
        plugins: { legend: { display: false }, tooltip: { rtl: true, filter: item => item.datasetIndex === 0, callbacks: { label: context => String(context.parsed.x) } } },
        scales: { x: { min: 0, max: 80, ticks: { stepSize: 20, padding: 8 }, grid: { color: '#E4E7EE', drawTicks: false }, border: { display: false } }, y: { grid: { display: false }, border: { display: false }, ticks: { color: '#15132B', font: { size: 12 }, padding: 12 } } }
      }
    }));

    // Approximate reference curve only; never use these visual points as financial records.
    charts.push(new Chart(document.querySelector('#revenue-chart'), {
      type: 'line',
      data: { labels: data.revenue.labels, datasets: [{ label: 'USD', data: data.revenue.visualValues, borderColor: palette.purple, backgroundColor: '#F3EFF9', borderWidth: 2.5, tension: .3, pointRadius: 0, pointHoverRadius: 4, fill: true }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { y: { min: 0, max: 160, ticks: { stepSize: 40, padding: 10 }, grid: { color: '#E4E7EE', tickLength: 0 }, border: { display: false, dash: [3,4] } }, x: { grid: { display: false }, border: { color: '#E4E7EE' }, ticks: { maxRotation: 0, autoSkip: false, callback(value, index, ticks) {
        const last = ticks.length - 1;
        const step = Math.ceil(last / (window.innerWidth < 600 ? 3 : 8));
        return index === last || (index % step === 0 && last - index >= step) ? this.getLabelForValue(value) : '';
      }, font: { size: 10 }, padding: 9 } } } }
    }));
  }
  renderCharts().catch(error => {
    console.error('Unable to render dashboard charts', error);
    notify('تعذّر عرض الرسوم البيانية');
  });
})();
