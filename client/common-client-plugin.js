// client/commonclient-plugin.js has the client side manipulation
async function register ({ registerHook, peertubeHelpers, registerVideoField }) {
    const settings = await peertubeHelpers.getSettings()
    const now = new Date();
    const showNotice = async () => {
        if (now < new Date(settings['open-time']) || now > new Date(settings['close-time'])) {
            // TODO: figure out a way to do the redirect/form disabling, couldn't fine home in the serverConfig
            peertubeHelpers.showModal({
                title: 'SCREENINGS CLOSED.',
                content: "Screening submissions are currently closed. They're scheduled to be open at " + new Date(settings['open-time']).toLocaleString() + " and close at " + new Date(settings['close-time']).toLocaleString()  + ".",
                confirm: { value: 'confirm', action: () => {window.location.href = "http://localhost:9000";} },
            })
        }
    }
    registerHook({
        target: 'action:video-edit.init',
        handler: (video) => showNotice()
    })
    for (const type of ['upload', 'import-url', 'import-torrent', 'update']) {
        // the tab that the form field will show up in during video submission
        const videoFormTab = {type, tab: 'main'};
        registerVideoField({
            name: 'publish-datetime',
            label: 'Test Scheduled Publish Date/Time',
            type: 'html',
            default: '',
            private: false,
            descriptionHTML: `
    <div style="margin-bottom: 10px;">
      <input
        type="datetime-local"
        id="publish-datetime-picker"
        style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: yellow;"
      />
      <small style="color: #666;">Select a future date and time for publishing</small>
      <div id="debug-info" style="font-size: 12px; color: red;"></div>
    </div>
    <script>
      console.log('Script executing...');

      function debugAndInit() {
        const picker = document.getElementById('publish-datetime-picker');
        const originalInput = document.querySelector('input[name="publish-datetime"]');
        const debugDiv = document.getElementById('debug-info');

        debugDiv.innerHTML = 'Picker found: ' + !!picker + ', Original found: ' + !!originalInput;

        if (picker && originalInput) {
          debugDiv.innerHTML += ' - Both found, initializing...';
          picker.value = originalInput.value || '';

          picker.addEventListener('change', function() {
            originalInput.value = this.value;
            originalInput.dispatchEvent(new Event('input', { bubbles: true }));
            debugDiv.innerHTML += ' - Value synced: ' + this.value;
          });

          originalInput.style.display = 'none';
        }
      }

      // Try multiple times
      setTimeout(debugAndInit, 100);
      setTimeout(debugAndInit, 500);
      setTimeout(debugAndInit, 1000);
      setTimeout(debugAndInit, 2000);
    </script>
  `
        }, videoFormTab);
    }
    registerHook({
        target: 'action:video-edit.form.updated',
        handler: (params) => {
            const uploadForm = document.querySelector('form[ng-submit="upload()"]')

            uploadForm.addEventListener('change', (e) => {
                if (e.target.type === 'file') {
                    const originalName = e.target.files[0].name
                    const titleField = document.querySelector('input[name="name"]')

                    // Auto-populate title field
                    const newName = `LASTNAME_${originalName}`
                    titleField.value = newName
                    console.log(`Auto-populated title field with ${newName}`)
                }
            })
        }
    })
    registerHook({
        target: 'action:video-watch.player.loaded',
        handler: (video) => {
            if (now < new Date(settings['screening-close-time'])) {
                peertubeHelpers.showModal({
                    title: 'SCREENINGS CURRENTLY SHOWING.',
                    content: "This video is currently in the screening scheduled and cannot be viewed until screenings are over. " +
                        "Current screening schedule ends: " + new Date(settings['screening-close-time']).toLocaleString()  + ".",
                    confirm: { value: 'confirm', action: () => {window.location.href = "http://localhost:9000";} },
                })
            }
        }
        })
}

export {
    register
}
