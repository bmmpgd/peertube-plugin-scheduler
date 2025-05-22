// client/commonclient-plugin.js has the client side manipulation
async function register ({ registerHook, peertubeHelpers }) {
    const settings = peertubeHelpers.getSettings()
    const now = new Date();

    const closed = async () => {
        console.log(settings);
        if (settings) {
            const { showModal } = peertubeHelpers

            showModal({
                title: "SCREENING SUBMISSIONS CLOSED",
                content: "Screening submissions are currently closed. You will be redirected to the homepage.",
                confirm: {
                    value: 'OK'
                }
            })
        }
    }

    // Run when route is /videos/upload
    registerHook({
        target: 'action:router.navigation-end',
        handler: ({ path }) => {
            // TODO: after seeing if this works, check user's current time against the inputed dates
            // then implement redirect
            if (path === '/videos/upload') {
                console.log(dateTime);
                console.log(settings);
                closed();
            }
        }
    })

    // Run when refresh or manually enter /videos/upload route in browser
    if (window.location.pathname === '/videos/upload') {
        console.log(dateTime);
        console.log(settings);
        closed();
    }
}

export {
    register
}
