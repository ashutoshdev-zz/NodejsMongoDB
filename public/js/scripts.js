/**
 * @author ashutosh
 * @param {type} param
 * @name script.js 
 */
$(document).ready(function() {
    $('#map').on('show.bs.modal', function() {
        $(this).find('.modal-body').css({
            // 'width':'auto', //probably not needed
            // 'height':'auto', //probably not needed 
            'max-width': '110%',
            'max-height': '110%',
            'padding': '24px',
        });
        console.log('map-resized');
    });
    $('#img').change(function() {
        $('.loader').show();
         inputFiles = [];
         inputFiles = this.files;
         inputFile = inputFiles[0];
        
        $('#attachedfile').val(inputFile.name);
        $('#ptext').val($('#img').val());
         alert("Uploaded");
        $('.loader').hide();
    });
    $('#imgp').change(function() {
        $('.loadera').show();
        inputFiles = [];
        inputFiles = this.files;
        inputFile = inputFiles[0];
        $('attachedpfile').val(inputFile.name);
        $('#ptextp').val($('#imgp').val());
        $('.loadera').hide();
        
    });
    $('#login').formValidation({//this uses the formvalidation.io jquery plugin to ensure things like , email and password is provided.
        framework: 'bootstrap',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh',
        },
        // live:"enabled",
        fields: {
            email: {
                message: "Email is required",
                validators: {
                    notEmpty: {
                        message: "Please provide an email"
                    },
                    emailAddress: {
                        message: "Invalid Email"
                    },
                }
            },
            password: {
                message: "Password required",
                validators: {
                    notEmpty: {
                        message: "Please provide password"
                    }
                }
            }
        }
    });
    $('#forget').formValidation({//this uses the formvalidation.io jquery plugin to ensure things like , email and password is provided.
        framework: 'bootstrap',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh',
        },
        // live:"enabled",
        fields: {
            email: {
                message: "Email is required",
                validators: {
                    notEmpty: {
                        message: "Please provide your Email"
                    },
                    emailAddress: {
                        message: "Invalid Email"
                    }
                }
            }
        }
    });
});
$(document).ready(function() {
    FormValidation.Validator.securepassword = {
        validate: function(validator, $field, options) {
            var value = $field.val();
            if (value === '') {
                return true;
            }
            // Check the password strength
            if (value.length < 8) {
                return {
                    valid: false,
                    message: 'The password must be more than 8 characters long'
                };
            }
            // The password doesn't contain any uppercase character
            if (value === value.toLowerCase()) {
                return {
                    valid: false,
                    message: 'The password must contain at least one upper case character'
                }
            }
            // The password doesn't contain any uppercase character
            if (value === value.toUpperCase()) {
                return {
                    valid: false,
                    message: 'The password must contain at least one lower case character'
                }
            }
            // The password doesn't contain any digit
            if (value.search(/[0-9]/) < 0) {
                return {
                    valid: false,
                    message: 'The password must contain at least one digit'
                }
            }
            return true;
        }
    };
    $('#signupa').formValidation({//this uses the formvalidation.io jquery plugin to ensure things like , email and password is provided.
        framework: 'bootstrap',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh',
            excluded: [':disabled', ':hidden', ':not(:visible)'],
        },
        live: "enabled",
        fields: {
            email: {
                message: "Email is required",
                validators: {
                    notEmpty: {
                        message: "Please provide your Email"
                    },
                    emailAddress: {
                        message: "Invalid Email"
                    },
                    remote: {
                        message: 'The E-mail is already registered',
                        url: 'http://localhost:3300/response'
                    }
                }
            },
            password: {
                message: "Password required",
                validators: {
                    notEmpty: {
                        message: "Please provide password"
                    },
                    identical: {
                        field: 'confirmPassword',
                        message: 'The password and its confirm are not the same'
                    },
                    securepassword: true
                }
            },
            confirmPassword: {
                message: "Password required",
                validators: {
                    notEmpty: {
                        message: "Please provide confirm password"
                    },
                    identical: {
                        field: 'password',
                        message: 'The password and its confirm are not the same'
                    },
                    securepassword: true
                }
            },
            name: {
                message: "Full Name required",
                validators: {
                    notEmpty: {
                        message: "Please provide Full name"
                    }
                }
            }
        }
    });
});