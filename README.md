# MMM-birthdays
A birthday reminder module for MichMich's [MagicMirror](https://magicmirror.builders/).

![Screenshot](/screenshots/MMM-birthdays_screenshot.png?raw=true "Screenshot")

## Installation
- Navigate to your MagicMirror `modules` folder and clone this repository using: `https://github.com/amitchone/MMM-birthdays.git`
- Change directory to `MMM-birthdays` via `cd MMM-birthdays/`
- Run `npm install` to install the necessary third-party packages

## Configuration & Usage
This module is intended to be extremely simple to use and therefore only provides a small set of configurable parameters:

| Option  | Description  | Default  |
|---|---|---|
| notify_days_before  | Number of days before birthday that notifications should start to be shown  | 14  |
| notify_days_after  | Number of days after birthday that notification should still be shown  | 2  |
| update_internal  | Number of seconds between updating displayed birthdays  | 600  |
| birthdays  | An array of `birthdays` objects as described below | See below  |

So, the default `config.js` entry for this module could look like this:

```
{
    module: "MMM-birthdays",
    position: "top_right",
    config: {
        notify_days_before: 14,
        notify_days_after: 2,
        update_interval: 600
    }
}
```

### Birthdays Array
The birthdays array is a list of JSON objects containing the following fields:

| Option  | Description  | Example  |
|---|---|---|
| name  | Name of person (or animal) who's birthday to track  | `"Adam"`  |
| dob  | Date of birth in RFC 2822 date format `"YYYY-MM-DD"` | `"2000-12-25"` would be the 25th December 2000  |

As this is an array, it can contain multiple `birthdays` objects. The example below states that Adam's birthday is on 25th December 2000 and Bob's is on 13th January 2023:

```
{
    module: "MMM-birthdays",
    position: "top_right",
    config: {
        notify_days_before: 14,
        notify_days_after: 2,
        update_interval: 600,
        birthdays: [
            {
                name: "Adam",
                dob: "2000-12-25"
            },
            {
                name: "Bob",
                dob: "2023-01-13"
            }
        ]
    }
}
```

## birthdays.json
You probably know a lot of people and so listing them all in `config.js` would make the file look rather messy. So, this module checks for the presence of a file named `birthdays.json` in the `MMM-birthdays/` directory. If it exists, this file takes precedence over any `birthdays` configuration parameter specified in `config.js` and means that you don't have to specify any birthdays entries in `config.js`.

The equivalent specification for Adam and Bob's birthdays in the previous example in `birthdays.json` is as follows - note specifically the additional `"` marks around the property names as this is JSON, not Javascript:

```
{
    "birthdays": [
        {
            "name": "Adam",
            "dob": "2000-12-25"
        },
        {
            "name": "Bob",
            "dob": "2023-01-13"
        }
    ]
}
```
