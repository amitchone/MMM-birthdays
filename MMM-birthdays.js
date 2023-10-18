// mmm-birthdays.js


Module.register("MMM-birthdays", {
    defaults: {
        notify_days_before: 14,
        notify_days_after: 2,
        update_interval: 600,
        display_dates: null,
        opacity: true,
    },

    socketNotificationReceived: function (notification, payload) {
        if (notification === "RECV_BIRTHDAYS") {
            this.config.display_dates = payload;
            this.getDom();
        }

        this.updateDom();
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        wrapper.className = "module-content";

        wrapper.innerHTML = `
            <header class="module-header">BIRTHDAYS</header>
        `

        var table = document.createElement("table");
        table.className = "small";

        if (this.config.display_dates !== null) {
            wrapper.innerHTML += `
                <table class="small>
                    <tbody>
            `

            for (i in this.config.display_dates) {
                console.log(this.config.display_dates[i].who);

                var tr = document.createElement("tr");

                if (this.config.opacity !== true) {
                    tr.style.opacity = 1;
                }

                tr.innerHTML += `<td class="day" style="text-align: left">${this.config.display_dates[i].who}</td>`;

                table.appendChild(tr);
            }
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

        /**
         * Call this initially, then at the interval specified
         */
        mm.sendSocketNotification("GET_BIRTHDAYS", mm.config);

        setInterval(function () { 
            mm.sendSocketNotification("GET_BIRTHDAYS", mm.config)
        }, mm.config.update_interval * 1000);
    }
});
