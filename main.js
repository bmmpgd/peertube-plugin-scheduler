// main.js has the server level manipulation, i.e. plugin settings
async function register ({
                             registerHook,
                             storageManager,
                             registerSetting
                         }) {
    const currentTime = new Date();
    registerSetting({
        name: 'open-time',
        label: 'Opening time for screening submissions',
        type: 'input',
        default: '',
        private: false,
        descriptionHTML: `
            <small style="color: #666;">Select a future date and time for publishing</small>
            <script>
              setTimeout(function() {
                const originalInput = document.querySelector('input[name="open-time"]');
                if (originalInput) {
                  // Create new datetime input
                  const datetimeInput = document.createElement('input');
                  datetimeInput.type = 'datetime-local';
                  datetimeInput.name = 'open-time';
                  datetimeInput.min = new Date().toISOString().slice(0, 16);
                  datetimeInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;';
                  datetimeInput.value = originalInput.value || '';

                  // Replace the original input
                  originalInput.parentNode.replaceChild(datetimeInput, originalInput);
                }
              }, 1000);
            </script>
        `
    })

    registerSetting({
        name: 'close-time',
        label: 'Closing time for screening submissions.',
        type: 'input',
        default: currentTime,
        private: false,
        descriptionHTML: `
            <small style="color: #666;">Select a future date and time for publishing</small>
            <script>
              setTimeout(function() {
                const originalInput = document.querySelector('input[name="close-time"]');
                if (originalInput) {
                  // Create new datetime input
                  const datetimeInput = document.createElement('input');
                  datetimeInput.type = 'datetime-local';
                  datetimeInput.name = 'close-time';
                  datetimeInput.min = new Date().toISOString().slice(0, 16);
                  datetimeInput.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;';
                  datetimeInput.value = originalInput.value || '';

                  // Replace the original input
                  originalInput.parentNode.replaceChild(datetimeInput, originalInput);
                }
              }, 1000);
            </script>
        `
    })
    registerSetting({
        name: 'publish-datetime',
        label: 'Test Scheduled Publish Date/Time',
        type: 'input',
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
    })

}
async function unregister () {
    return
}

module.exports = {
    register,
    unregister
}
