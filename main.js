// main.js has the server level manipulation, i.e. plugin settings
async function register ({
                             registerHook,
                             storageManager,
                             registerSetting,
                             peertubeHelpers
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
    // rename video to match LASTNAME_VIDEO-TITLE.extension
    registerHook({
        target: 'action:api.video.uploaded',
        handler: async (params) => {
            const { video } = params
            let user = null
            let lastName = 'UNKNOWN'
            console.log('Video object keys:', Object.keys(video))
            console.log('Video userId:', video.userId)
            const userId = video.userId || video.accountId || video.channelId

            try {
                const userResult = await peertubeHelpers.database.query(
                    'SELECT display_name, username FROM "user" WHERE id = $1',
                    [userId]
                )
                user = userResult.rows?.[0]

                if (user) {
                    lastName = user.display_name?.split(' ').pop() || user.username || 'UNKNOWN'
                }
            } catch (error) {
                console.error('Database query error:', error)
                // Try alternative approach - get user through account
                try {
                    const accountResult = await peertubeHelpers.database.query(
                        'SELECT a.name FROM account a JOIN video v ON v."channelId" = a.id WHERE v.id = $1',
                        [video.id]
                    )
                    lastName = accountResult.rows?.[0]?.name || 'UNKNOWN'
                } catch (accountError) {
                    console.error('Account query error:', accountError)
                }
            }

            // Extract user's last name
            const userResult = await peertubeHelpers.database.query(
                'SELECT * FROM "user" WHERE id = $1',
                [video.userId]
            )

            const videoTitle = video.name.replace(/[^a-zA-Z0-9]/g, '-')
            let originalExtension = '.mp4'

            if (video.VideoFiles && video.VideoFiles.length > 0) {
                // Extract extension from the first video file
                const filename = video.VideoFiles[0].filename || video.VideoFiles[0].fileUrl
                const match = filename.match(/\.([^.]+)$/)
                if (match) {
                    originalExtension = match[0] // includes the dot
                }
            } else if (video.filename) {
                // Alternative: check video.filename directly
                const match = video.filename.match(/\.([^.]+)$/)
                if (match) {
                    originalExtension = match[0]
                }
            }

            // Update the video's internal filename with original extension
            await video.update({
                filename: `${lastName}_${videoTitle}${originalExtension}`
            })
        }
    })

    // TODO: add start/end times for the days of screening.
    // TODO: add override input for admins to put in usernames that can submit after close.

}
async function unregister () {
    return
}

module.exports = {
    register,
    unregister
}
