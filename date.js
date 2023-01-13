//jshint esversion:6

exports.getDate = function () {
    let tod = new Date();
    let options = {
        weekday : 'long',
        month: 'long',
        day: 'numeric'
       };
       
        return tod.toLocaleDateString('en-US', options)
        
};

exports.getDay = function () {
    let tod = new Date();

    let options = {
        weekday : 'long',
    };

    return tod.toLocaleDateString('en-US', options);
   
};


