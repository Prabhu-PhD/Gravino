    document.addEventListener('DOMContentLoaded', () => {
      const numSelectors = document.querySelectorAll('.num-selector');
      const contentPanels = document.querySelectorAll('.cap-content-panel');
      let currentActiveId = 'cap-1';
      let exitTimeout = null;

      function switchCapability(targetId) {
        if (!targetId || targetId === currentActiveId) return;

        const outgoingPanel = document.getElementById(currentActiveId);
        const incomingPanel = document.getElementById(targetId);
        if (!incomingPanel) return;

        // Clear any previous exit timeout
        if (exitTimeout) clearTimeout(exitTimeout);

        currentActiveId = targetId;

        // 1. Highlight active number with radiant gradient; set others to muted greyscale
        numSelectors.forEach(btn => {
          if (btn.getAttribute('data-target') === targetId) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });

        // 2. Perform Move-Out animation on outgoing panel
        if (outgoingPanel) {
          outgoingPanel.classList.remove('is-active');
          outgoingPanel.classList.add('is-exiting');
          exitTimeout = setTimeout(() => {
            outgoingPanel.classList.remove('is-exiting');
          }, 420);
        }

        // 3. Clear any other inactive panels
        contentPanels.forEach(panel => {
          if (panel !== incomingPanel && panel !== outgoingPanel) {
            panel.classList.remove('is-active', 'is-exiting');
          }
        });

        // 4. Perform Move-In animation on incoming panel
        requestAnimationFrame(() => {
          incomingPanel.classList.remove('is-exiting');
          incomingPanel.classList.add('is-active');
          updateStageHeight(targetId);
        });
      }

      /* OURS (2026-10-08): the stage no longer needs a height from here.
         The panels share one grid cell (arun.css), so the stage is always
         as tall as the tallest panel, at every width, with no jump between
         them. This used to set an inline min-height with a 630px floor on
         desktop, which left a well of empty space under every panel and
         sat the panel's top above the numerals beside it. */
      function updateStageHeight() {
        const stage = document.querySelector('.cap-panel-stage');
        if (stage) stage.style.removeProperty('min-height');
      }

      numSelectors.forEach(btn => {
        // Instant hover highlight and move in / move out switch
        btn.addEventListener('mouseenter', () => {
          const target = btn.getAttribute('data-target');
          switchCapability(target);
        });

        // Click / touch support for mobile & tablet
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-target');
          switchCapability(target);
        });
      });

      setTimeout(() => updateStageHeight('cap-1'), 150);
      window.addEventListener('resize', () => updateStageHeight(currentActiveId));
    });
