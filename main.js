// main.js has the server level manipulation, i.e. plugin settings
async function register ({
                             registerHook,
                             storageManager,
                             registerSetting
                         }) {
const currentTime = new Date();
    registerSetting({
        name: 'open-time',
        label: 'Opening time for screening submissions.',
        type: 'input',
        default: currentTime,
        private: false,
        descriptionHTML: 'Starting at this date-time, screening submissions will be open.'
    })

    registerSetting({
        name: 'close-time',
        label: 'Closing time for screening submissions.',
        type: 'input',
        default: currentTime,
        private: false,
        descriptionHTML: 'Screening submissions will be closed at this date-time.'
    })

}
async function unregister () {
    return
}

module.exports = {
    register,
    unregister
}
