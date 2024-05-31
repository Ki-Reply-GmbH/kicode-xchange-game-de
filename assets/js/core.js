var Exchange = function() {

    let bugLeft = '0';                
    let gameOver = false;
    let userWon = true;
    if (localStorage.getItem('pauseTimer') === null) {
        localStorage.setItem('pauseTimer', 'false');
    }
    if (localStorage.getItem('keepTime') !== null) {
        console.log('keepTime value:', localStorage.getItem('keepTime'));
        $('#countup').html(localStorage.getItem('keepTime') + "<br><small>Waiting for deployment</small>"); // Update the timre value with the value before the refresh
    }

    
    var uiHelperEasyPieChart = function(){
        jQuery('.js-pie-chart').easyPieChart({
            barColor: jQuery(this).data('bar-color') ? jQuery(this).data('bar-color') : '#777777',
            lineWidth: jQuery(this).data('line-width') ? jQuery(this).data('line-width') : 3,
            size: jQuery(this).data('size') ? jQuery(this).data('size') : '80',
            scaleColor: jQuery(this).data('scale-color') ? jQuery(this).data('scale-color') : false
        });
    };

    return {
        bugLeft: bugLeft,

        gameOver: gameOver,

        userWon : userWon,

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

        checkNewGameForm: function () {
            const name = $('#name').val().trim();
            const company = $('#company').val().trim();
            const email = $('#email').val().trim();
            const btnStartGame = $('#btnStartGame');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (name && company && email && emailPattern.test(email)) {
                btnStartGame.prop('disabled', false);
            } else {
                btnStartGame.prop('disabled', true);
            }
        },

        newGamePopup: function(){
             
             var newGameModal = $('#newGameModal'); // Get the modal
             var span = $('.close'); // Get the <span> element that closes the modal
             var btnStartGame = $('#btnStartGame');
             
             
             newGameModal.show();
             $('#name, #company, #email').on('input', this.checkNewGameForm);

             // When the user clicks on Start Game
             btnStartGame.on('click',function()
             {
                localStorage.setItem('gamerName', $('#name').val());
                $('#gamerName').text(localStorage.getItem('gamerName'));
                Exchange.startTimer();
                Exchange.addNewGamerDetails();
                newGameModal.hide(false);
                sendStart()
             });   
        },
    
        gameOverPopUp: function(){
            var gameOverModal = $('#gameOverModal'); // Get the modal
            var span = $('.close'); // Get the <span> element that closes the modal
            var btnReset = $('#btnReset');
            gameOverModal.show();

            // When the user clicks on Reset
            btnReset.on('click',function(){
                $(this).text('Resetting...');
                $(this).prop('disabled', true);
                sendReset()
                localStorage.clear()
            });
        },

        gameWonModal: function(){
            
            var successModal = $('#successModal'); // Get the modal
            var span = $('.close'); // Get the <span> element that closes the modal
            var btnNewGame = $('#btnNewGame');

            // Calculate time taken to complete the game
            var startMinutes = 10;
            var time_left = localStorage.getItem('keepTime');
            
            var time_taken = Exchange.calculateTimeDifference(time_left, startMinutes);

            successModal.show();
            $('#gameWonMessage').text("Game won - time taken: " + time_taken);


            // When the user clicks on New Game
            btnNewGame.on('click', function(){
                $(this).text('Resetting...');
                $(this).prop('disabled', true);
                sendReset()
                localStorage.clear()
            });
        },

        calculateTimeDifference: function(time_left, startMinutes) {
            // Convert the time_left to milliseconds
            var timeParts = time_left.split(':');
            var timeMillis = (+timeParts[0]) * 60 * 1000 + (+timeParts[1]) * 1000 + (+timeParts[2]);
        
            // Convert start time to milliseconds
            var startMillis = startMinutes * 60 * 1000;
        
            // Calculate the difference in milliseconds
            var diffMillis = startMillis - timeMillis;
        
            // Convert the difference in milliseconds back to the format minutes:seconds:milliseconds
            var diffMinutes = Math.floor(diffMillis / (60 * 1000));
            diffMillis -= diffMinutes * 60 * 1000;
            var diffSeconds = Math.floor(diffMillis / 1000);
            diffMillis -= diffSeconds * 1000;
        
            // Create the resulting string and fill the minutes, seconds and milliseconds to two digits
            var t = diffMinutes.toString().padStart(2, '0') + ":" + diffSeconds.toString().padStart(2, '0') + ":" + Math.floor(diffMillis / 10).toString().padStart(2, '0');
        
            return t;
        },

        startTimer:function(){
            console.log('Starting the timer');

            const targetTime = new Date().getTime() + 10 * 60 * 1000; // Set the target time for the countdown
            localStorage.setItem('targetTime', targetTime); // Store the target time in local storage

            // Update the timer display
            //updateTimerDisplay();
            Exchange.updateTimer();
        },

        pauseCounter:function(){
            let pauseTimer = localStorage.getItem('pauseTimer') === 'true'; 
            localStorage.setItem('pauseTimer', !pauseTimer);
        },

        updateTimer:function(){
            let pauseTimer = localStorage.getItem('pauseTimer') === 'true'; 
            if (!pauseTimer) {
              // Get the target time from local storage
              const targetTime = localStorage.getItem('targetTime');
            
              $('#gamerName').text(localStorage.getItem('gamerName'));
              if (targetTime) {
                // Calculate the remaining time
                const now = new Date().getTime();
                const remainingTime = Math.max(0, targetTime - now);
          
                // Convert remaining time to minutes, seconds, and milliseconds
                const minutes = Math.floor(remainingTime / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                const milliseconds = Math.floor((remainingTime % 1000));
          
                const millisecondsText = milliseconds.toString().padStart(3, '0').slice(0, 2); // Ensure milliseconds are displayed with two digits
                const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${millisecondsText}`;
                // document.getElementById('countup').textContent
                if ($('#countup').text() !== timerText) {
                    $('#countup').text(timerText);
                }
          
                // Check if the target time is reached
                if (remainingTime <= 0) {
                  $('#countup').text('Game Over'); // Display "Game Over"
                  Exchange.gameOverPopUp(); // Call the function to show the game over pop-up
                  localStorage.removeItem('targetTime'); // Remove the target time from local storage
                  localStorage.removeItem('gamerName');
                }
              } else {
                  $('#countup').text('Game Over'); // Display "Game Over" if there is no target time
              }
            }
            // Update using requestAnimationFrame
            setTimeout(Exchange.updateTimer, 10);
            //requestAnimationFrame(Exchange.updateTimer);
        },

        generateAccessToken:function(){
            var tenantId = '2fb0515c-15e8-4417-bca2-805a58a8ce8c';
            var clientId = '099d4f0d-8a8e-4133-a846-dd3d019bd01c';
            var clientSecret = '';
            var scope = 'https://graph.microsoft.com/.default';
             
            var tokenUrl = 'https://login.microsoftonline.com/' + tenantId + '/oauth2/v2.0/token';
             
            var tokenData = {
                    grant_type: 'client_credentials',
                    client_id: clientId,
                    client_secret: clientSecret,
                    scope: scope
                };
            var accessToken = ''
             
            $.ajax({
                  url: tokenUrl,
                  headers: {'Access-Control-Allow-Origin':'*'},
                  type: 'POST',
                  data: tokenData,
                  success: function(response) {
                  accessToken = response.access_token;
                  console.log('Access Token:', accessToken);
                  },
                    error: function(error) {
                        console.error('Error getting access token:', error);
                    }
                });
            
            return accessToken
        },

        readJsonFile:function(){

            const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlBJNWdsMk5KSDNRZHFHU0ZBZ201Y25jUW54Zy1WbVN3MnFQS1k4RV8tdmsiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yZmIwNTE1Yy0xNWU4LTQ0MTctYmNhMi04MDVhNThhOGNlOGMvIiwiaWF0IjoxNzE3MTQ5MTg5LCJuYmYiOjE3MTcxNDkxODksImV4cCI6MTcxNzIzNTg4OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhXQUFBQUZPaTlKVEx2b05qdnZ1SXJBYWlKUW0vTWlpeVZjbEdKcEg2L2dBMEM5VGZ4Vk5ISTVURWZMSjZrZjhuQXhIV1EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlZhbmNlIiwiZ2l2ZW5fbmFtZSI6IkFkZWxlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiODIuMzYuMjIxLjE3MiIsIm5hbWUiOiJBZGVsZSBWYW5jZSIsIm9pZCI6ImZkMzc4NTE0LTBkMjgtNDI4Ni05MTZiLTQyZmE3YzJkMjJiZSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMUQzNUYwOUVCIiwicmgiOiIwLkFVWUFYRkd3TC1nVkYwUzhvb0JhV0tqT2pBTUFBQUFBQUFBQXdBQUFBQUFBQUFDOEFCRS4iLCJzY3AiOiJGaWxlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6Ild1TUdab1JoWWZwSF9nS0s2elU3b0Q3TUpreEhVOW9Sb3JvRlNVbjgwbGMiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiIyZmIwNTE1Yy0xNWU4LTQ0MTctYmNhMi04MDVhNThhOGNlOGMiLCJ1bmlxdWVfbmFtZSI6IkFkZWxlVkA2Z2NmYmQub25taWNyb3NvZnQuY29tIiwidXBuIjoiQWRlbGVWQDZnY2ZiZC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiI0Wm01ZzNQRU4wQ01lN3drYmt5QkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJEeTJHYUN2OVRtWTRBc21ubWhWTVI5Uk5EMkpPX0ozdndISlpmZEhJSGdrIn0sInhtc190Y2R0IjoxNjQzMDk4NzIwfQ.kHx7kM37nM5pdaGDmYxhw3HvG_m0-zrF1a2za2S6ATq6bFqtl8FooLr_fBh4nLrO35BO-U8R6e693UHdj8KU5Oapa3wRNl6FPtCmFNI4pB0v4DypUKqp9BwuxWGBzrJU5iayLiJuTXDmwFSnP3sT4aNqTznsRBACWdQ5FBClqIFkmzkXD-MVJF3CPdCFYzLxKN4ZJ5oaminVKF01ult65yTDBRrC8JGKhekMGm7zxBly0IXdVtca3DIDpu4MqaWVCoHeU4WcARMBWxOKP12oYsndfT07JWNGnbwjTRWgavHKtjkurnP_ZaApWoPS2QeA_rRBOjM-zsslt8GaAEsKkQ'
            const sharedLink = 'https://6gcfbd-my.sharepoint.com/personal/s_hausenblas_6gcfbd_onmicrosoft_com/_layouts/15/download.aspx?share=Ede283773ZFAgPVzTa5ijOUB2N4fCUPRxy1M78jPnX_hbA';
            const encodedLink = btoa(sharedLink); 
            const fileUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedLink}/root/content`;
            
            return $.ajax({
                    url: fileUrl,
                    method: 'GET',
                    headers: {
                        'content-type' : 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
        },

        updateJsonFile:function(fileContent){
            const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6IlBJNWdsMk5KSDNRZHFHU0ZBZ201Y25jUW54Zy1WbVN3MnFQS1k4RV8tdmsiLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC8yZmIwNTE1Yy0xNWU4LTQ0MTctYmNhMi04MDVhNThhOGNlOGMvIiwiaWF0IjoxNzE3MTQ5MTg5LCJuYmYiOjE3MTcxNDkxODksImV4cCI6MTcxNzIzNTg4OSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhXQUFBQUZPaTlKVEx2b05qdnZ1SXJBYWlKUW0vTWlpeVZjbEdKcEg2L2dBMEM5VGZ4Vk5ISTVURWZMSjZrZjhuQXhIV1EiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6IkdyYXBoIEV4cGxvcmVyIiwiYXBwaWQiOiJkZThiYzhiNS1kOWY5LTQ4YjEtYThhZC1iNzQ4ZGE3MjUwNjQiLCJhcHBpZGFjciI6IjAiLCJmYW1pbHlfbmFtZSI6IlZhbmNlIiwiZ2l2ZW5fbmFtZSI6IkFkZWxlIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiODIuMzYuMjIxLjE3MiIsIm5hbWUiOiJBZGVsZSBWYW5jZSIsIm9pZCI6ImZkMzc4NTE0LTBkMjgtNDI4Ni05MTZiLTQyZmE3YzJkMjJiZSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMUQzNUYwOUVCIiwicmgiOiIwLkFVWUFYRkd3TC1nVkYwUzhvb0JhV0tqT2pBTUFBQUFBQUFBQXdBQUFBQUFBQUFDOEFCRS4iLCJzY3AiOiJGaWxlcy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBwcm9maWxlIFVzZXIuUmVhZCBlbWFpbCIsInNpZ25pbl9zdGF0ZSI6WyJrbXNpIl0sInN1YiI6Ild1TUdab1JoWWZwSF9nS0s2elU3b0Q3TUpreEhVOW9Sb3JvRlNVbjgwbGMiLCJ0ZW5hbnRfcmVnaW9uX3Njb3BlIjoiTkEiLCJ0aWQiOiIyZmIwNTE1Yy0xNWU4LTQ0MTctYmNhMi04MDVhNThhOGNlOGMiLCJ1bmlxdWVfbmFtZSI6IkFkZWxlVkA2Z2NmYmQub25taWNyb3NvZnQuY29tIiwidXBuIjoiQWRlbGVWQDZnY2ZiZC5vbm1pY3Jvc29mdC5jb20iLCJ1dGkiOiI0Wm01ZzNQRU4wQ01lN3drYmt5QkFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJEeTJHYUN2OVRtWTRBc21ubWhWTVI5Uk5EMkpPX0ozdndISlpmZEhJSGdrIn0sInhtc190Y2R0IjoxNjQzMDk4NzIwfQ.kHx7kM37nM5pdaGDmYxhw3HvG_m0-zrF1a2za2S6ATq6bFqtl8FooLr_fBh4nLrO35BO-U8R6e693UHdj8KU5Oapa3wRNl6FPtCmFNI4pB0v4DypUKqp9BwuxWGBzrJU5iayLiJuTXDmwFSnP3sT4aNqTznsRBACWdQ5FBClqIFkmzkXD-MVJF3CPdCFYzLxKN4ZJ5oaminVKF01ult65yTDBRrC8JGKhekMGm7zxBly0IXdVtca3DIDpu4MqaWVCoHeU4WcARMBWxOKP12oYsndfT07JWNGnbwjTRWgavHKtjkurnP_ZaApWoPS2QeA_rRBOjM-zsslt8GaAEsKkQ'
            const sharedLink = 'https://6gcfbd-my.sharepoint.com/personal/s_hausenblas_6gcfbd_onmicrosoft_com/_layouts/15/download.aspx?share=Ede283773ZFAgPVzTa5ijOUB2N4fCUPRxy1M78jPnX_hbA';
            const encodedLink = btoa(sharedLink);
            const updateUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedLink}/root/content`;

            return $.ajax({
                       url: updateUrl,
                       method: 'PUT',
                       headers: {
                           'Authorization': `Bearer ${accessToken}`,
                           'Content-Type': 'application/json'  
                       },
                       data: JSON.stringify(fileContent)
                   });
       },

       addNewGamerDetails: async function(){
            try {
                const fileContent = await Exchange.readJsonFile();

                let newuser = {};
                newuser["Playername"] = $('#name').val();
                newuser["Companyname"] = $('#company').val();
                newuser["Time"] = "";
                newuser["Email-Address"] = $('#email').val();
                newuser["Finished"] = false;
                localStorage.setItem('gamerEmail', newuser["Email-Address"]); // Store the user details in local storage
                fileContent.push(newuser);

                const fileUpdateResponse = await Exchange.updateJsonFile(fileContent);
                console.log('New Gamer details added successfully');
            }
            catch(error){
                console.error("Exception:-",error);
            }
        },

        updateGamerTime : async function(Time, Finished){
            try{
            const fileContent = await Exchange.readJsonFile();
            var item = fileContent[fileContent.length - 1];

            if (Time === "") {
                item["Time"] = "";
            } else {
                // Calculate time taken to complete the game
                var startMinutes = 10;
                var time_left = localStorage.getItem('keepTime');
                
                var time_taken = Exchange.calculateTimeDifference(time_left, startMinutes);
                item["Time"] = time_taken;
            }

            item["Finished"] = Finished;
                const fileUpdateResponse = await Exchange.updateJsonFile(fileContent);
                console.log('Gamer details updated successfully');
            }
            catch(error){
                console.error('Exception while updating',error);
            }
        }
    };
}();

const socket = new WebSocket('ws://localhost:8765');

socket.onopen = function() {
    console.log('WebSocket connection established');
};

socket.onmessage = function(event) {
    console.log('Message from server: ', event.data);
    if (event.data === "hard_refresh") {
        console.log('Performing hard refresh');
        window.location.href=window.location.href
        console.log('Hard refresh complete');
    } else if (event.data === "stop_timer") {
        console.log('Stopping the timer');
        localStorage.setItem('pauseTimer', 'true');

        localStorage.setItem('keepTime', $('#countup').text());
        console.log('keepTime in socket.onmessage:', localStorage.getItem('keepTime'));

        console.log('Performing hard refresh within stop_timer');
        window.location.href=window.location.href
        console.log('Hard refresh complete');
    }
};

socket.onclose = function() {
    console.log('WebSocket connection closed');
};

function sendStart() {
    const message = 'Game Started';
    socket.send(message);
    console.log('Message sent: ', message);
}

function sendReset() {
    const message = 'New Game';
    socket.send(message);
    console.log('Message sent: ', message);
}

function hardReload() {
    var url = window.location.href;
    if (url.indexOf('?') > -1) {
        url += '&_=' + new Date().getTime();
    } else {
        url += '?_=' + new Date().getTime();
    }
    window.location.href = url;
}
