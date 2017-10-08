(function ( $ ) {
    const stsFail=0, stsPass=1, stsExceed=2, stsWarn=3;

    $.fn.pwdStrengh = function(pCallback) {
        return this.each(function() {
            $(this).keyup( function() {checkPasswdStrengh(this, pCallback);} );
        });
    };

    String.prototype.strReverse = function() {
    	var newstring = "";
    	for (var s=0; s < this.length; s++) {
    		newstring = this.charAt(s) + newstring;
    	}
    	return newstring;
    };

    function getComplexityByScore (pScore) {
        var complexity = ["Too Short", "Very Weak", "Weak", "Good", "Strong", "Very Strong"];
        return complexity[Math.ceil(pScore/20)];
    }

    function getScoreOnBounds (pScore) {
        return (pScore > 100 ? 100 : (pScore < 0 ? 0 : pScore));
    }

    function runCallBackFunction(pCallback, pResult, pDetails) {
        if (pCallback != undefined && pCallback.length > 0){
            if ($.isFunction(window[pCallback])) {
                window[pCallback](pResult, pDetails);
            } else {
                warn("callback function '"+pCallback+"' is not a function");
            }
        }
    }

    function checkPasswdStrengh(pElement, pCallback) {
        var pwd = $(pElement).val();
        var score=0;

        var bonus = {length:0, alphaUC:0, alphaLC:0, number:0, symbol:0, midChar:0};
        var pwdString = {
                         unqChar:0, repInc:0, consecSymbol:0, consecCharType:0, seqChar:0, reqChar:0, multConsecCharType:0,
                         mandatory: {
                                     length: {val:0, status:stsFail},
                                     alphaUC: {val:0, status:stsFail},
                                     alphaLC: {val:0, status:stsFail},
                                     number: {val:0, status:stsFail},
                                     symbol: {val:0, status:stsFail}
                                    },
                         additional: {
                                      midChar: {val:0, status:stsFail},
                                      requirements: {val:0, status:stsFail}
                                    },
                         suggested: {
                                     alphasOnly: {val:0, status:stsFail},
                                     numbersOnly: {val:0, status:stsFail},
                                     repChar: {val:0, status:stsFail},
                                     consecAlphaUC: {val:0, status:stsFail},
                                     consecAlphaLC: {val:0, status:stsFail},
                                     consecNumber: {val:0, status:stsFail},
                                     seqAlpha: {val:0, status:stsFail},
                                     seqNumber: {val:0, status:stsFail},
                                     seqSymbol: {val:0, status:stsFail}
                                    }
                        };

        var multiplier = {midChar:2, consecAlphaUC:2, consecAlphaLC:2, consecNumber:2, seqAlpha:3, seqNumber:3, seqSymbol:3, length:4, number:4, symbol:6};
        var minPwdLength = 8;

        var nTmpAlphaUC="", nTmpAlphaLC="", nTmpNumber="", nTmpSymbol="";
        var sAlphas = "abcdefghijklmnopqrstuvwxyz";
        var sNumerics = "01234567890";
        var sSymbols = ")!@#$%^&*()";

    	if (pwd) {
    		score = parseInt(pwd.length * multiplier.length);
    		pwdString.mandatory.length.val = pwd.length;
    		var arrPwd = pwd.replace(/\s+/g,"").split(/\s*/);
    		var arrPwdLen = arrPwd.length;

    		// Loop through password to check for Symbol, Numeric, Lowercase and Uppercase pattern matches
    		for (var a=0; a < arrPwdLen; a++) {
    			if (arrPwd[a].match(/[A-Z]/g)) {
    				if (nTmpAlphaUC !== "") {
                        if ((nTmpAlphaUC + 1) == a) {
                            pwdString.suggested.consecAlphaUC.val++;
                            pwdString.consecCharType++;
                        }
                    }
    				nTmpAlphaUC = a;
    				pwdString.mandatory.alphaUC.val++;
    			}
    			else if (arrPwd[a].match(/[a-z]/g)) {
    				if (nTmpAlphaLC !== "") { if ((nTmpAlphaLC + 1) == a) { pwdString.suggested.consecAlphaLC.val++; pwdString.consecCharType++; } }
    				nTmpAlphaLC = a;
    				pwdString.mandatory.alphaLC.val++;
    			}
    			else if (arrPwd[a].match(/[0-9]/g)) {
    				if (a > 0 && a < (arrPwdLen - 1)) { pwdString.additional.midChar.val++; }
    				if (nTmpNumber !== "") { if ((nTmpNumber + 1) == a) { pwdString.suggested.consecNumber.val++; pwdString.consecCharType++; } }
    				nTmpNumber = a;
    				pwdString.mandatory.number.val++;
    			}
    			else if (arrPwd[a].match(/[^a-zA-Z0-9_]/g)) {
    				if (a > 0 && a < (arrPwdLen - 1)) { pwdString.additional.midChar.val++; }
    				if (nTmpSymbol !== "") { if ((nTmpSymbol + 1) == a) { pwdString.consecSymbol++; pwdString.consecCharType++; } }
    				nTmpSymbol = a;
    				pwdString.mandatory.symbol.val++;
    			}
    			// Internal loop through password to check for repeat characters
    			var bCharExists = false;

    			for (var b=0; b < arrPwdLen; b++) {
    				if (arrPwd[a] == arrPwd[b] && a != b) { // repeat character exists
    					bCharExists = true;
    					pwdString.repInc += Math.abs(arrPwdLen/(b-a));
    				}
    			}

    			if (bCharExists) {
    				pwdString.suggested.repChar.val++;
    				pwdString.unqChar = arrPwdLen-pwdString.suggested.repChar.val;
    				pwdString.repInc = (pwdString.unqChar) ? Math.ceil(pwdString.repInc/pwdString.unqChar) : Math.ceil(pwdString.repInc);
    			}
    		}

    		// Check for sequential alpha string patterns (forward and reverse)
    		for (var s=0; s < 23; s++) {
    			var sFwd = sAlphas.substring(s,parseInt(s+3));
    			var sRev = sFwd.strReverse();
    			if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) { pwdString.suggested.seqAlpha.val++; pwdString.seqChar++;}
    		}

    		// Check for sequential numeric string patterns (forward and reverse)
    		for (var s=0; s < 8; s++) {
    			var sFwd = sNumerics.substring(s,parseInt(s+3));
    			var sRev = sFwd.strReverse();
    			if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) { pwdString.suggested.seqNumber.val++; pwdString.seqChar++;}
    		}

    		// Check for sequential symbol string patterns (forward and reverse)
    		for (var s=0; s < 8; s++) {
    			var sFwd = sSymbols.substring(s,parseInt(s+3));
    			var sRev = sFwd.strReverse();
    			if (pwd.toLowerCase().indexOf(sFwd) != -1 || pwd.toLowerCase().indexOf(sRev) != -1) { pwdString.suggested.seqSymbol.val++; pwdString.seqChar++;}
    		}

    	// Modify overall score value based on usage vs requirements

    		// General point assignment
    		score += (pwdString.mandatory.alphaUC.val > 0 && pwdString.mandatory.alphaUC.val < pwdString.mandatory.length.val ? ((pwdString.mandatory.length.val - pwdString.mandatory.alphaUC.val) * 2) : 0);
            score += (pwdString.mandatory.alphaLC.val > 0 && pwdString.mandatory.alphaLC.val < pwdString.mandatory.length.val ? ((pwdString.mandatory.length.val - pwdString.mandatory.alphaLC.val) * 2) : 0);
            score += (pwdString.mandatory.number.val > 0 && pwdString.mandatory.number.val < pwdString.mandatory.length.val ? (pwdString.mandatory.number.val * multiplier.number) : 0);
            score += (pwdString.mandatory.symbol.val > 0 ? (pwdString.mandatory.symbol.val * multiplier.symbol) : 0);
            score += (pwdString.additional.midChar.val > 0 ? (pwdString.additional.midChar.val * multiplier.midChar) : 0);

    		// Point deductions for poor practices
    		if ((pwdString.mandatory.alphaLC.val > 0 || pwdString.mandatory.alphaUC.val > 0) && pwdString.mandatory.symbol.val === 0 && pwdString.mandatory.number.val === 0) {  // Only Letters
    			score = parseInt(score - pwdString.mandatory.length.val);
    			pwdString.suggested.alphasOnly.val = pwdString.mandatory.length.val;
    		}
    		if (pwdString.mandatory.alphaLC.val === 0 && pwdString.mandatory.alphaUC.val === 0 && pwdString.mandatory.symbol.val === 0 && pwdString.mandatory.number.val > 0) {  // Only Numbers
    			score = parseInt(score - pwdString.mandatory.length.val);
    			pwdString.suggested.numbersOnly.val = pwdString.mandatory.length.val;
    		}

            score -= (pwdString.suggested.repChar.val > 0 ? pwdString.repInc : 0); // Same character exists more than once
            score -= (pwdString.suggested.consecAlphaUC.val > 0 ? (pwdString.suggested.consecAlphaUC.val * multiplier.consecAlphaUC) : 0); // Consecutive Uppercase Letters exist
            score -= (pwdString.suggested.consecAlphaLC.val > 0 ? (pwdString.suggested.consecAlphaLC.val * multiplier.consecAlphaLC) : 0); // Consecutive Lowercase Letters exist
            score -= (pwdString.suggested.consecNumber.val > 0 ? (pwdString.suggested.consecNumber.val * multiplier.consecNumber) : 0); // Consecutive Numbers exist
            score -= (pwdString.suggested.seqAlpha.val > 0 ? (pwdString.suggested.seqAlpha.val * multiplier.seqAlpha) : 0); // Sequential alpha strings exist (3 characters or more)
            score -= (pwdString.suggested.seqNumber.val > 0 ? (pwdString.suggested.seqNumber.val * multiplier.seqNumber) : 0); // Sequential numeric strings exist (3 characters or more)
            score -= (pwdString.suggested.seqSymbol.val > 0 ? (pwdString.suggested.seqSymbol.val * multiplier.seqSymbol) : 0); // Sequential symbol strings exist (3 characters or more)

    		// Determine if mandatory requirements have been met and set image indicators accordingly
            var minVal = 0;

            $.each( pwdString.mandatory, function( key, item ) {
                minVal = (key == "length" ? parseInt(minPwdLength - 1) : 0);
                item.status = (item.val >= minVal + 1 ? stsPass : stsFail);
                pwdString.reqChar += (item.status == stsFail ? 0 : 1);
            });

            pwdString.additional.requirements.val = pwdString.reqChar;

    		if (pwd.length >= minPwdLength) { var nMinReqChars = 3; } else { var nMinReqChars = 4; }
    		if (pwdString.additional.requirements.val > nMinReqChars) {  // One or more required characters exist
    			score = parseInt(score + (pwdString.additional.requirements.val * 2));
    		}

    		// Determine if additional bonuses need to be applied and set image indicators accordingly
            $.each( pwdString.additional, function( key, item ) {
                minVal = (key == "requirements" ? nMinReqChars : 0);
                item.status = (item.val >= minVal + 1 ? stsPass : stsFail);
            });

    		// Determine if suggested requirements have been met and set image indicators accordingly
            $.each( pwdString.suggested, function( key, item ) {
                item.status = (item.val > 0 ? stsPass : stsWarn);
            });

            score = getScoreOnBounds(score);

            result = {
                score: score,
                complexity: getComplexityByScore(score)
            };

            runCallBackFunction(pCallback, result, pwdString);
        }
    }

}( jQuery ));
