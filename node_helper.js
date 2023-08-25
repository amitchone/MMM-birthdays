// node_helper.js

const NodeHelper = require("node_helper");
const fs = require("fs");
var moment = require("moment");


module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        this.config = payload;

		if (notification === "GET_BIRTHDAYS") {
			this.get_birthdays(this.config);
		}
	},

    get_birthdays: function () {
        var birthdays = null;

        try {    
            birthdays = JSON.parse(fs.readFileSync(`${__dirname}/birthdays.json`, "utf8"));
            birthdays = birthdays.birthdays;
        } catch (error) {
            if ("birthdays" in this.config) {
                birthdays = this.config.birthdays;
            }
        } finally {
            if (birthdays === null) {
                throw EvalError("No config.birthdays or birthdays.json detected");
            }

            this.parse_birthdays(birthdays);
        }
    },

    get_current_age: function (m_dob) {
        return moment().diff(m_dob, "years");
    },
  
    get_new_age: function (m_dob) {
        return this.get_current_age(m_dob) + 1;
    },
  
    days_to_birthday: function (m_dob) {
        return moment(moment().format("YYYY") + m_dob.format("-MM-DD")).diff(moment().format("YYYY-MM-DD"), "days");
    },

    parse_birthdays: function (birthdays) {
        var display_birthdays = [];

        var keys = Object.keys(birthdays)

        for (let i = 0, length = keys.length; i < length; i++) {
            var name = birthdays[i].name
            var dob = moment(birthdays[i].dob)
            
            var new_age = this.get_new_age(dob)
            var cur_age = this.get_current_age(dob)
            var dtb = this.days_to_birthday(dob)

            if (dtb > 0) {
                if (dtb <= this.config.notify_days_before) {
                    var days = "day"
                    if (dtb > 1) days += "s"

                    display_birthdays.push({
                        "ord": dtb,
                        "who": `${name} will be ${new_age} in ${dtb} ${days}`,
                    });

                    console.log(`mmm-birthdays: ${name} will be ${new_age} in ${dtb} ${days}`)
                }
            }

            if (dtb < 0) {
                if (Math.abs(dtb) <= this.config.notify_days_after) {
                    var days = "day"
                    if (Math.abs(dtb) > 1) days += "s"

                    display_birthdays.push({
                        "ord": dtb,
                        "who": `${name} was ${cur_age} ${Math.abs(dtb)} ${days} ago`,
                    });

                    console.log(`mmm-birthdays: ${name} was ${cur_age} ${Math.abs(dtb)} ${days} ago`)
                }
            }
            
            if (dtb == 0) {
                display_birthdays.push({
                    "ord": dtb,
                    "who": `${name} is ${cur_age} today!`,
                });
                
                console.log(`mmm-birthdays: ${name} is ${cur_age} today!`)
            }
        }

        if (display_birthdays.length > 0) {
            display_birthdays.sort((a, b) => a.ord - b.ord);

            this.sendSocketNotification("RECV_BIRTHDAYS", display_birthdays);
        }
    },
});
