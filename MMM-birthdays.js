// mmm-birthdays.js


const opacities = [ 1, 1, 0.8, 0.53, 0.26 ];


Module.register("MMM-birthdays", {
    defaults: {
        notify_days_before: 14,
        update_interval: 600,
        display_dates: null,
        title: null,
        opacity: true,
        locale: "en_GB",
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "RECV_BIRTHDAYS") {
            this.config.display_dates = payload.birthdays;
            this.config.title = payload.title;
            this.getDom();
        }

        this.updateDom();
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "module-content";

        wrapper.innerHTML = `
            <header class="module-header">${this.config.title}</header>
        `

        var table = document.createElement("table");
        table.className = "small";

        if (this.config.display_dates !== null) {
            wrapper.innerHTML += `
                <table class="small">
                    <tbody>
            `

            let self = this;

            this.config.display_dates.forEach(function (date, i) {
                console.log(date.who);

                var tr = document.createElement("tr");

                if (self.config.opacity === true) {
                    tr.style.opacity = i < opacities.length ? opacities[i] : opacities[opacities.length - 1];
                }
                else {
                    tr.style.opacity = 1;
                }

                tr.innerHTML += `<td class="day" style="text-align: left">${date.who}</td>`;

                table.appendChild(tr);
            });
        }
        else {
            wrapper.innerHTML += 'No birthdays upcoming';
        }

        wrapper.appendChild(table);

        return wrapper;
    },

    start: function () {
        /**
         * Declaring mm as this so that we have access to this inside of unnamed function in 
         * setInterval where this is out of scope
         */
        const mm = this;

        if (mm.config.notify_days_before > 365) {
            mm.config.notify_days_before = 365;
        }

        /**
         * Call this initially, then at the interval specified
         */
        mm.sendSocketNotification("GET_BIRTHDAYS", mm.config);

        setInterval(function () { 
            mm.sendSocketNotification("GET_BIRTHDAYS", mm.config)
        }, mm.config.update_interval * 1000);
    }
});
