var Exchange = function() {

    let bugLeft = '0';                
    let gameOver = false;
    let userWon = false;
    let pauseTimer = false;
    
    var uiHelperEasyPieChart = function(){
        // Init Easy Pie Charts (with .js-pie-chart class)
        jQuery('.js-pie-chart').easyPieChart({
            barColor: jQuery(this).data('bar-color') ? jQuery(this).data('bar-color') : '#777777',
            lineWidth: jQuery(this).data('line-width') ? jQuery(this).data('line-width') : 3,
            size: jQuery(this).data('size') ? jQuery(this).data('size') : '80',
            scaleColor: jQuery(this).data('scale-color') ? jQuery(this).data('scale-color') : false
        });
    };

    return {
        bugLeft: bugLeft,
        initHelper: function(helper) {
            switch (helper) {
                case 'easy-pie-chart':
                    uiHelperEasyPieChart();
                    break;
                default:
                    return false;
            }
        },
        initHelpers: function(helpers) {
            if (helpers instanceof Array) {
                for(var index in helpers) {
                    Exchange.initHelper(helpers[index]);
                }
            } else {
                Exchange.initHelper(helpers);
            }

            
        },

        newGamePopup: function(){
             // Get the modal
             var modal = $('#newGameModal');
                       
             // Get the <span> element that closes the modal
             var span = $('.close');

             var btnSubmit = $('#submit');
             modal.show();

             btnSubmit.on('click',function()
             {
                startTimer();
                modal.hide(false);
             });   

             // When the user clicks the button, open the modal
             //btn.on('click', function() {
                
             //});

             // When the user clicks on <span> (x), close the modal
             span.on('click', function() {
                modal.hide();
             });

             // When the user clicks anywhere outside of the modal, close it
             $(window).on('click', function(event) {
                 if ($(event.target).is(modal)) {
                    modal.hide();
                 }
             });
        }, 

        startTimer:function(){
            // Set the target time for the countdown
            const targetTime = new Date().getTime() + 2 * 60 * 1000;

            // Store the target time in local storage
            localStorage.setItem('targetTime', targetTime);

            // Update the timer display
            //updateTimerDisplay();
            Exchange.uTimerDisplay();
        },

        pauseCounter:function(){
            pauseTimer = !pauseTimer;
        },

        updateTimerDisplay:function(){
            const targetTime = localStorage.getItem('targetTime');

            if (targetTime) {
                // Calculate the remaining time
                const now = new Date().getTime();
                const remainingTime = Math.max(0, targetTime - now);

                // Convert remaining time to minutes, seconds, and milliseconds
                const minutes = Math.floor(remainingTime / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                const milliseconds = Math.floor((remainingTime % 1000));

                // Display the remaining time
                document.getElementById('countup').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}:${milliseconds.toString().padStart(3, '0').slice(0,2)}`;

                // Check if the target time is reached
                if (remainingTime <= 0) {
                    document.getElementById('countup').textContent = 'Game over';
                    showPopup(); // Call the function to show the pop-up
                    localStorage.removeItem('targetTime'); // Remove the target time from local storage
                } else {
                    // Update the timer display every millisecond
                    //setTimeout(updateTimerDisplay, 1);
                    requestAnimationFrame(updateTimerDisplay);
                }
            } else {
                // Display "Timer stopped" if there is no target time
                document.getElementById('countup').textContent = 'Timer stopped';
            }
        },

        uTimerDisplay:function(){
            if (!pauseTimer) {
              // Get the target time from local storage
              const targetTime = localStorage.getItem('targetTime');
          
              if (targetTime) {
                // Calculate the remaining time
                const now = new Date().getTime();
                const remainingTime = Math.max(0, targetTime - now);
          
                // Convert remaining time to minutes, seconds, and milliseconds
                const minutes = Math.floor(remainingTime / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                const milliseconds = Math.floor((remainingTime % 1000));
          
                // Update the timer display only when seconds or milliseconds change
                const millisecondsText = milliseconds.toString().padStart(3, '0').slice(0, 2); // Ensure milliseconds are displayed with two digits
                const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${millisecondsText}`;
                if (document.getElementById('countup').textContent !== timerText) {
                    document.getElementById('countup').textContent = timerText;
                }
          
                // Check if the target time is reached
                if (remainingTime <= 0) {
                  showPopup(); // Call the function to show the pop-up
                  localStorage.removeItem('targetTime'); // Remove the target time from local storage
                }
              } else {
                // Display "Timer stopped" if there is no target time
                document.getElementById('countup').textContent = 'Timer stopped';
              }
            }
            // Schedule the next update using requestAnimationFrame
            requestAnimationFrame(Exchange.uTimerDisplay);
          }
    };
}();