// node_helper.js

const NodeHelper = require("node_helper");
const fs = require("fs");
var moment = require("moment");


module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        this.config = payload;

		if (notification === "GET_BIRTHDAYS") {
            this.config.loc_data = this.get_locale(this.config.locale);
			this.get_birthdays(this.config);
		}
	},

    get_locale: function (locale) {
        var loc_data;

        try {
            console.log(`mmm-birthdays: using locale ${locale}`);
            loc_data = JSON.parse(fs.readFileSync(`${__dirname}/locales/${String(locale).toLowerCase()}.json`), "utf-8");
        }
        catch (e) {
            console.log(`mmm-birthdays: locale ${locale} is not supported, falling back to en_GB`);
            loc_data = JSON.parse(fs.readFileSync(`${__dirname}/locales/en_gb.json`), "utf-8");
        }
        
        return loc_data;
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
        var dtb = moment(moment().format("YYYY") + m_dob.format("-MM-DD")).diff(moment().format("YYYY-MM-DD"), "days");

        if (dtb < 0) {  
            dtb = moment(moment().add(1, "y").format("YYYY") + m_dob.format("-MM-DD")).diff(moment().format("YYYY-MM-DD"), "days");
        }

        return dtb;
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
                    var who = (dtb > 1) ? this.config.loc_data.phrase.u_m : this.config.loc_data.phrase.u_s;

                    who = String(who).replace("{NAME}", name);
                    who = String(who).replace("{AGE}", new_age);
                    who = String(who).replace("{DAYS}", dtb);

                    display_birthdays.push({
                        "ord": dtb,
                        "who": who
                    });

                    console.log(`mmm-birthdays: ${who}`)
                }
            }
            else if (dtb == 0) {
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
