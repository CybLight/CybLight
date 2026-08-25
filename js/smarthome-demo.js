/**
 * CybLight Smart Home Hub — Interactive IoT Simulator
 * Allows users to test real-time virtual device controls and live E2EE telemetry.
 */
(function () {
  let state = {
    room: 'living_room',
    light: {
      on: true,
      brightness: 80,
      color: '#ff7f27',
      rgb: [255, 127, 39]
    },
    climate: {
      targetTemp: 22.0,
      currentTemp: 21.8,
      humidity: 46,
      mode: 'cool'
    },
    relay: {
      on: true,
      power: 142.5
    },
    security: {
      armed: true,
      motionDetected: false
    }
  };

  let powerInterval = null;

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  function emitTelemetry(eventTopic, payload) {
    const consoleEl = document.getElementById('hubTelemetryConsole');
    if (!consoleEl) return;

    const packet = {
      topic: `cyblight/hub/${state.room}/${eventTopic}`,
      timestamp: new Date().toISOString(),
      e2ee: true,
      cipher: 'ChaCha20-Poly1305',
      device_id: 'hub_node_esp32_c3',
      payload: payload,
      mac_sig: Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    };

    consoleEl.textContent = JSON.stringify(packet, null, 2);
    consoleEl.classList.add('is-updated');
    setTimeout(() => consoleEl.classList.remove('is-updated'), 300);
  }

  function updateLightUI() {
    const bulb = document.getElementById('demoBulbVisual');
    const toggle = document.getElementById('demoLightToggle');
    const slider = document.getElementById('demoLightBrightness');
    const label = document.getElementById('demoLightBrightnessVal');

    if (!bulb) return;

    if (state.light.on) {
      bulb.style.opacity = String(Math.max(0.2, state.light.brightness / 100));
      bulb.style.background = state.light.color;
      bulb.style.boxShadow = `0 0 ${20 + state.light.brightness * 0.4}px ${state.light.color}`;
      if (toggle) toggle.checked = true;
    } else {
      bulb.style.opacity = '0.15';
      bulb.style.background = '#64748b';
      bulb.style.boxShadow = 'none';
      if (toggle) toggle.checked = false;
    }

    if (label) label.textContent = `${state.light.brightness}%`;
    if (slider) slider.value = state.light.brightness;
  }

  function updateClimateUI() {
    const tempEl = document.getElementById('demoClimateTemp');
    const targetEl = document.getElementById('demoClimateTarget');
    const modeEl = document.getElementById('demoClimateMode');

    if (tempEl) tempEl.textContent = `${state.climate.currentTemp.toFixed(1)}°C`;
    if (targetEl) targetEl.textContent = `${state.climate.targetTemp.toFixed(1)}°C`;
    if (modeEl) {
      const modeNames = { cool: '❄️ Охлаждение', heat: '🔥 Нагрев', eco: '🍃 Эко' };
      modeEl.textContent = modeNames[state.climate.mode] || state.climate.mode;
    }
  }

  function updateRelayUI() {
    const toggle = document.getElementById('demoRelayToggle');
    const powerEl = document.getElementById('demoRelayPower');
    if (toggle) toggle.checked = state.relay.on;
    if (powerEl) {
      powerEl.textContent = state.relay.on ? `${state.relay.power.toFixed(1)} Вт` : '0.0 Вт';
    }
  }

  function initSimulator() {
    const lightToggle = document.getElementById('demoLightToggle');
    const lightSlider = document.getElementById('demoLightBrightness');
    const colorBtns = document.querySelectorAll('[data-color]');
    const tempUp = document.getElementById('demoTempUp');
    const tempDown = document.getElementById('demoTempDown');
    const modeBtns = document.querySelectorAll('[data-mode]');
    const relayToggle = document.getElementById('demoRelayToggle');
    const motionBtn = document.getElementById('demoTriggerMotion');
    const copyTelemetryBtn = document.getElementById('demoCopyTelemetry');
    const roomBtns = document.querySelectorAll('[data-room]');

    if (!lightToggle) return;

    // Room Switcher
    roomBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        roomBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.room = btn.dataset.room;
        emitTelemetry('room/select', { room: state.room });
      });
    });

    // Light
    lightToggle.addEventListener('change', () => {
      state.light.on = lightToggle.checked;
      updateLightUI();
      emitTelemetry('light/state', { state: state.light.on ? 'ON' : 'OFF', brightness: state.light.brightness });
    });

    if (lightSlider) {
      lightSlider.addEventListener('input', () => {
        state.light.brightness = Number(lightSlider.value);
        if (state.light.brightness > 0) state.light.on = true;
        updateLightUI();
        emitTelemetry('light/brightness', { brightness: state.light.brightness });
      });
    }

    colorBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const hex = btn.dataset.color;
        state.light.color = hex;
        state.light.rgb = hexToRgb(hex);
        state.light.on = true;
        updateLightUI();
        emitTelemetry('light/color', { color_hex: hex, color_rgb: state.light.rgb });
      });
    });

    // Climate
    if (tempUp) {
      tempUp.addEventListener('click', () => {
        if (state.climate.targetTemp < 30) {
          state.climate.targetTemp += 0.5;
          updateClimateUI();
          emitTelemetry('climate/set_target', { target_temp: state.climate.targetTemp });
        }
      });
    }

    if (tempDown) {
      tempDown.addEventListener('click', () => {
        if (state.climate.targetTemp > 16) {
          state.climate.targetTemp -= 0.5;
          updateClimateUI();
          emitTelemetry('climate/set_target', { target_temp: state.climate.targetTemp });
        }
      });
    }

    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.climate.mode = btn.dataset.mode;
        updateClimateUI();
        emitTelemetry('climate/mode', { mode: state.climate.mode });
      });
    });

    // Relay
    if (relayToggle) {
      relayToggle.addEventListener('change', () => {
        state.relay.on = relayToggle.checked;
        updateRelayUI();
        emitTelemetry('relay/socket', { state: state.relay.on ? 'ON' : 'OFF', power_watts: state.relay.on ? state.relay.power : 0 });
      });
    }

    // Motion Alert Simulation
    if (motionBtn) {
      motionBtn.addEventListener('click', () => {
        const alertBadge = document.getElementById('demoSecurityBadge');
        if (alertBadge) {
          alertBadge.textContent = '🚨 ДВИЖЕНИЕ ОБНАРУЖЕНО';
          alertBadge.classList.add('is-alarm');
        }
        emitTelemetry('security/motion', { event: 'MOTION_DETECTED', zone: 'living_room_pir', confidence: 0.98 });

        setTimeout(() => {
          if (alertBadge) {
            alertBadge.textContent = '🛡️ Охрана активна (Спокойно)';
            alertBadge.classList.remove('is-alarm');
          }
        }, 3500);
      });
    }

    // Copy Telemetry JSON
    if (copyTelemetryBtn) {
      copyTelemetryBtn.addEventListener('click', () => {
        const consoleEl = document.getElementById('hubTelemetryConsole');
        if (!consoleEl) return;
        navigator.clipboard.writeText(consoleEl.textContent).then(() => {
          const orig = copyTelemetryBtn.textContent;
          copyTelemetryBtn.textContent = 'Скопировано ✅';
          setTimeout(() => (copyTelemetryBtn.textContent = orig), 2000);
        });
      });
    }

    // Dynamic small jitter on wattage
    powerInterval = setInterval(() => {
      if (state.relay.on) {
        state.relay.power = 135 + Math.random() * 15;
        updateRelayUI();
      }
    }, 4000);

    // Initial render
    updateLightUI();
    updateClimateUI();
    updateRelayUI();
    emitTelemetry('hub/init', { status: 'ONLINE', nodes_connected: 4 });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimulator);
  } else {
    initSimulator();
  }
})();
