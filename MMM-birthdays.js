// mmm-birthdays.js


Module.register("MMM-birthdays", {
    defaults: {
        notify_days_before: 14,
        notify_days_after: 2,
        update_internal: 600,
        display_dates: null,
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
        wrapper.innerHTML = `
          <header class="module-header">BIRTHDAYS</header>
        `

        if (this.config.display_dates !== null) {
            for (i in this.config.display_dates) {
                console.log(this.config.display_dates[i].who);

                const p = document.createElement("p");
                p.innerHTML += `<p style="text-align:left;">${this.config.display_dates[i].who}</p>`

                wrapper.appendChild(p);
            }
        }
        else {
            wrapper.innerHTML += 'No birthdays upcoming';
        }

        return wrapper;
    },

    start: function () {
        setInterval(this.sendSocketNotification("GET_BIRTHDAYS", this.config), this.config.update_internal);
    }
});
