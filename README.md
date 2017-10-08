# Password Strength Meter JS

This script was developed to check the strength of password strings. It provides more than 15 verification items on password safety, with a hard focus on identifying the typical bad habits of faulty password formulation.

Developed to be used as a ready-to-use realtime verification script.

This script is neither perfect nor foolproof, and should only be utilized as a loose guide in determining methods for improving the password creation process.

The script is based on the http://www.passwordmeter.com/ website and should give the same score ratings as the website.

### Items verified by the script:

 * Minimal Numbers of Characters
 * Uppercase Letters
 * Lowercase Letters
 * Numbers
 * Symbols
 * Middle Numbers or Symbols
 * Minimal Requirements filled
 * Letters Only
 * Numbers Only
 * Repeated Characters (Case Insensitive)
 * Consecutive Uppercase Letters
 * Consecutive Lowercase Letters
 * Consecutive Numbers
 * Sequential Letters
 * Sequential Numbers
 * Sequential Symbols

Each of the verified items are returned to the callback function and shows the counting occurrences and the respective scores;


### How to use the script

Add Jquery and the passwdmeter script at your ```<head>``` area:

```html
<script src="jquery.min.js"></script>
<script src="passwdstrength.js" charset="utf-8"></script>
```
Make a callback functions:
```javascript
function myCallbackFunc(pStatus, pDetails) {
	//your processing code here
    console.log(pStatus, pDetails);
}
```

Apply it to the desired inputs:
```javascript
$('#my-input-id').pwdStrengh('myCallbackFunc');
```

## To-do
The script still is not perfect and I want to make some improves as soon as I have some free time:

* Resource to enable/disable items to check
* Parameter for minimal number of characters
* Resource to add list of ignore/common words/passwords
* Reduce the code (I think it is still not optimized)

## License
The Password Strength Meter Script is a free project: you can redistribute it and/or modify it under the terms of the Apache License as published by the Apache.org.
The script is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the Apache License for more details.
