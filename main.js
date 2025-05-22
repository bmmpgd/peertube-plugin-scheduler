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
      <div style="margin-bottom: 10px;">
        <input
          type="datetime-local"
          id="publish-datetime-picker"
          name="publish-datetime"
          min="${new Date().toISOString().slice(0, 16)}"
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
        />
        <small style="color: #666;">Select a future date and time for publishing</small>
        <script>
          (function() {
            const picker = document.getElementById('publish-datetime-picker');
            const originalInput = document.querySelector('input[name="publish-datetime"]');

            if (originalInput && picker) {
              picker.value = originalInput.value || '';

              picker.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const now = new Date();

                originalInput.value = this.value;
                originalInput.dispatchEvent(new Event('input', { bubbles: true }));
              });

              originalInput.style.display = 'none';
            }
          })();
        </script>
      </div>
    `
    })

    registerSetting({
        name: 'close-time',
        label: 'Closing time for screening submissions.',
        type: 'input',
        default: currentTime,
        private: false,
        descriptionHTML: `
      <div style="margin-bottom: 10px;">
        <input
          type="datetime-local"
          id="close-datetime-picker"
          name="close-datetime"
          min="${new Date().toISOString().slice(0, 16)}"
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
        />
        <small style="color: #666;">Select a future date and time for publishing</small>
        <script>
          (function() {
            const picker = document.getElementById('close-datetime-picker');
            const originalInput = document.querySelector('input[name="close-datetime"]');

            if (originalInput && picker) {
              picker.value = originalInput.value || '';

              picker.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const now = new Date();

                originalInput.value = this.value;
                originalInput.dispatchEvent(new Event('input', { bubbles: true }));
              });

              originalInput.style.display = 'none';
            }
          })();
        </script>
      </div>
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
