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

      function updateStageHeight(targetId) {
        const stage = document.querySelector('.cap-panel-stage');
        const targetPanel = document.getElementById(targetId);
        if (stage && targetPanel) {
          const h = targetPanel.scrollHeight || targetPanel.offsetHeight;
          if (h > 0) {
            /* OURS: the 630px floor is a desktop measurement. Below the lg
               breakpoint the totem is a row of tabs rather than a column of
               numerals beside the panel, so nothing needs reserving and the
               floor only leaves a large empty well under the shorter
               panels. Above lg it is unchanged. */
            var floor = window.matchMedia('(min-width: 1024px)').matches ? 630 : 0;
            /* setProperty with 'important', not stage.style.minHeight.
               His stylesheet sets .cap-panel-stage a min-height of 520px
               !important below the lg breakpoint, and a plain inline style
               loses to it - the panels are absolutely positioned, so the
               stage would keep a fixed height and the taller panels would
               overflow into the section beneath. */
            stage.style.setProperty('min-height', Math.max(h + 24, floor) + 'px', 'important');
          }
        }
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
