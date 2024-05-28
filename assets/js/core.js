var Exchange = function() {

    let bugLeft = '2';                
    let gameOver = false;
    let userWon = false;
    let pauseTimer = false;
    
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

        newGamePopup: function(){
             
             var newGameModal = $('#newGameModal'); // Get the modal
             var span = $('.close'); // Get the <span> element that closes the modal
             var btnStartGame = $('#btnStartGame');
             newGameModal.show();

             // When the user clicks on Start Game
             btnStartGame.on('click',function()
             {
                $('#gamerName').text($('#name').val());
                Exchange.startTimer();
                newGameModal.hide(false);
                sendStart()
             });   

            // When the user clicks on x, close the modal
             span.on('click', function() {
                newGameModal.hide();
             });

             // When the user clicks anywhere outside of the modal, close it
             $(window).on('click', function(event) {
                 if ($(event.target).is(newGameModal)) {
                    newGameModal.hide();
                 }
             });
        },
    
        gameOverPopUp: function(){
            var gameOverModal = $('#gameOverModal'); // Get the modal
            var span = $('.close'); // Get the <span> element that closes the modal
            var btnReset = $('#btnReset');
            gameOverModal.show();

            // When the user clicks on Reset
            btnReset.on('click',function(){
                sendReset()
            });

            // When the user clicks on x, close the modal
            span.on('click', function() {
                gameOverModal.hide();
            });

            // When the user clicks anywhere outside of the modal, close it
            $(window).on('click', function(event) {
                if ($(event.target).is(gameOverModal)) {
                    gameOverModal.hide();
                }
            });
        },

        gameWonModal: function(){
            
            var successModal = $('#successModal'); // Get the modal
            var span = $('.close'); // Get the <span> element that closes the modal
            var btnNewGame = $('#btnNewGame');

            successModal.show();

            // When the user clicks on New Game
            btnNewGame.on('click', function(){
                sendReset()
            });

            // When the user clicks on x, close the modal
            span.on('click', function() {
                successModal.hide();
            });

            // When the user clicks anywhere outside of the modal, close it
            $(window).on('click', function(event) {
                if ($(event.target).is(successModal)) {
                    successModal.hide();
                }
            });
        },

        startTimer:function(){
            
            const targetTime = new Date().getTime() + 10 * 60 * 1000; // Set the target time for the countdown
            localStorage.setItem('targetTime', targetTime); // Store the target time in local storage

            // Update the timer display
            //updateTimerDisplay();
            Exchange.updateTimer();
        },

        pauseCounter:function(){
            pauseTimer = !pauseTimer; //Set bool to pause the timer
        },

        updateTimer:function(){
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
          
                const millisecondsText = milliseconds.toString().padStart(3, '0').slice(0, 2); // Ensure milliseconds are displayed with two digits
                const timerText = `${minutes}:${seconds.toString().padStart(2, '0')}:${millisecondsText}`;
                // document.getElementById('countup').textContent
                if ($('#countup').text() !== timerText) {
                    $('#countup').text(timerText);
                }
          
                // Check if the target time is reached
                if (remainingTime <= 0) {
                  $('#countup').text('Game over'); // Display "Game Over"
                  Exchange.gameOverPopUp(); // Call the function to show the game over pop-up
                  localStorage.removeItem('targetTime'); // Remove the target time from local storage
                }
              } else {
                  $('#countup').text('Game over'); // Display "Game Over" if there is no target time
              }
            }
            // Update using requestAnimationFrame
            setTimeout(Exchange.updateTimer, 10);
            //requestAnimationFrame(Exchange.updateTimer);
        },

        getJsonContent:function(){
            //const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6ImJza0ozVUgxZ3VsNDFRdFZnSDFXbG56ZG5PWHR2LXdlVFYyRkJuNlhoVU0iLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iMDAzNjdlMi0xOTNhLTRmNDgtOTRkZS03MjQ1ZDQ1YzA5NDcvIiwiaWF0IjoxNzE2MzE0NzU3LCJuYmYiOjE3MTYzMTQ3NTcsImV4cCI6MTcxNjQwMTQ1OCwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQWhDcDRYNk82Z2F6R3B5Y2MwQ0dha0p4RWZUOE5wU3BRY0JvT0Q0L05uOUcxOC82bURlNEVsUG9uazMveHVZa3kwbStuYStpTnVINk1BWldZMTlYUUQwelpZVitpT1VRQ0EvTEcvc1BwRnQwPSIsImFtciI6WyJwd2QiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImZhbWlseV9uYW1lIjoiU2FtcGF0aCIsImdpdmVuX25hbWUiOiJTZW50aGlsIiwiaWR0eXAiOiJ1c2VyIiwiaXBhZGRyIjoiMmEwNDo0YTQzOjk2Y2Y6ZjRhMjo2NWJhOjk4Zjg6NTQ0MjozMjg0IiwibmFtZSI6IlNlbnRoaWwgU2FtcGF0aCIsIm9pZCI6ImMzMTlmNmI4LTI1YWItNGNmMi1iYWJjLTcyYjA3MzhhZGQyYiIsIm9ucHJlbV9zaWQiOiJTLTEtNS0yMS00MTczNjUyMjktMzk5NjU5MTgwLTE3MTQ3NzUwODEtMjc5OTY3IiwicGxhdGYiOiIzIiwicHVpZCI6IjEwMDMyMDAxRTEzQkZBRDkiLCJyaCI6IjAuQVFzQTRtY0RzRG9aU0UtVTNuSkYxRndKUndNQUFBQUFBQUFBd0FBQUFBQUFBQUNFQUpFLiIsInNjcCI6IkRldmljZU1hbmFnZW1lbnRBcHBzLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudENvbmZpZ3VyYXRpb24uUmVhZFdyaXRlLkFsbCBEZXZpY2VNYW5hZ2VtZW50TWFuYWdlZERldmljZXMuUmVhZFdyaXRlLkFsbCBJZGVudGl0eVByb3ZpZGVyLlJlYWQuQWxsIElkZW50aXR5UHJvdmlkZXIuUmVhZFdyaXRlLkFsbCBJZGVudGl0eVJpc2tFdmVudC5SZWFkLkFsbCBJZGVudGl0eVJpc2tFdmVudC5SZWFkV3JpdGUuQWxsIElkZW50aXR5Umlza3lVc2VyLlJlYWQuQWxsIElkZW50aXR5Umlza3lVc2VyLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlVc2VyRmxvdy5SZWFkLkFsbCBJZGVudGl0eVVzZXJGbG93LlJlYWRXcml0ZS5BbGwgb3BlbmlkIHByb2ZpbGUgU2l0ZXMuUmVhZC5BbGwgVXNlci5NYW5hZ2VJZGVudGl0aWVzLkFsbCBVc2VyLlJlYWQgZW1haWwgRmlsZXMuUmVhZFdyaXRlIiwic3ViIjoiVFF2NlU0bjhybHVLUmdiYXZranNGYTNqNmFCNkpsdFRBX1k1QWQzYVhrUSIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6ImIwMDM2N2UyLTE5M2EtNGY0OC05NGRlLTcyNDVkNDVjMDk0NyIsInVuaXF1ZV9uYW1lIjoicy5zYW1wYXRoQHJlcGx5LmNvbSIsInVwbiI6InMuc2FtcGF0aEByZXBseS5jb20iLCJ1dGkiOiI0MG80MmJEbHowZUpSaUlKX0tFakFBIiwidmVyIjoiMS4wIiwid2lkcyI6WyJiNzlmYmY0ZC0zZWY5LTQ2ODktODE0My03NmIxOTRlODU1MDkiXSwieG1zX2NjIjpbIkNQMSJdLCJ4bXNfc3NtIjoiMSIsInhtc19zdCI6eyJzdWIiOiJnU0pieF9fUXFsUC1NOUo0LVVxMV9iU2xLel9RZkJLYVVCekxJclNpZEVBIn0sInhtc190Y2R0IjoxNDA2Mjc1ODg1LCJ4bXNfdGRiciI6IkVVIn0.AiplbLl4oV0YcZVrnICiEMhk4YHU62GxN35SSPrV8Wt07vPzKvOVUtWj04kC4HhETQnL-XtgXCUIpwgS5DGrdFUMe0j5IhSlfFEAyU0X9pAFBMI2HoG7uNXy7aqR5ppBShWywrDxP8nf02jruT8OIn4RDtbnYFar3D6nwouT1cRbx5JxqW6wzAm5xGjpVQo2w2ClyL85Df410j9oPHMybnAME_3vYnJoAXwAQA6Fe-yWdkn5RS7PcmWuJE608Dtw_txHZXwoxRMzR_zXpx9jQEU6tONeT4torU__FbkTBYzurtVUMRZgLaB2yED62X8q1stENPckAZ3Fem5u_exDfQ';
            const accessToken = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Ik8yMjRCMlRpeFNtNEtaYlVqNXpldHBTMkVUMUM2MzFicU1TcU1xeDI5TG8iLCJhbGciOiJSUzI1NiIsIng1dCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCIsImtpZCI6IkwxS2ZLRklfam5YYndXYzIyeFp4dzFzVUhIMCJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC9iMDAzNjdlMi0xOTNhLTRmNDgtOTRkZS03MjQ1ZDQ1YzA5NDcvIiwiaWF0IjoxNzE2MzcyMzQzLCJuYmYiOjE3MTYzNzIzNDMsImV4cCI6MTcxNjQ1OTA0MywiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFWUUFxLzhXQUFBQUtXQkdNTGUvQXZBUHl5ZXNOQUZBRGp0bFZtN0JhZFhMUnhqUEVRbkhZU0hDdlN4ZHNTWkl0OG50UEpnZlpvK1JrRXhiYXlZQUJpVkVQZ290M25LSVBEeHZuZTZieklkVDR3SUZwUmw2TlZjPSIsImFtciI6WyJwd2QiLCJyc2EiLCJtZmEiXSwiYXBwX2Rpc3BsYXluYW1lIjoiR3JhcGggRXhwbG9yZXIiLCJhcHBpZCI6ImRlOGJjOGI1LWQ5ZjktNDhiMS1hOGFkLWI3NDhkYTcyNTA2NCIsImFwcGlkYWNyIjoiMCIsImRldmljZWlkIjoiMDI1MDgxZGUtMTYyYy00M2U0LWJmMGUtYWJiNTRjZjYyYWVkIiwiZmFtaWx5X25hbWUiOiJHYW5kaGkiLCJnaXZlbl9uYW1lIjoiS2FuaXNoayIsImlkdHlwIjoidXNlciIsImlwYWRkciI6IjgyLjM2LjIyMS4xNzIiLCJuYW1lIjoiS2FuaXNoayBHYW5kaGkiLCJvaWQiOiI5MjZjNWE2Yy1lODc0LTQ1MjUtOGNmOC1lZDk2ODY3NmQ4MTkiLCJvbnByZW1fc2lkIjoiUy0xLTUtMjEtNDE3MzY1MjI5LTM5OTY1OTE4MC0xNzE0Nzc1MDgxLTMxMTkwNSIsInBsYXRmIjoiMyIsInB1aWQiOiIxMDAzMjAwMkU2MjE3NTVEIiwicmgiOiIwLkFRc0E0bWNEc0RvWlNFLVUzbkpGMUZ3SlJ3TUFBQUFBQUFBQXdBQUFBQUFBQUFDRUFOSS4iLCJzY3AiOiJEZXZpY2VNYW5hZ2VtZW50QXBwcy5SZWFkV3JpdGUuQWxsIERldmljZU1hbmFnZW1lbnRDb25maWd1cmF0aW9uLlJlYWRXcml0ZS5BbGwgRGV2aWNlTWFuYWdlbWVudE1hbmFnZWREZXZpY2VzLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlQcm92aWRlci5SZWFkLkFsbCBJZGVudGl0eVByb3ZpZGVyLlJlYWRXcml0ZS5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZC5BbGwgSWRlbnRpdHlSaXNrRXZlbnQuUmVhZFdyaXRlLkFsbCBJZGVudGl0eVJpc2t5VXNlci5SZWFkLkFsbCBJZGVudGl0eVJpc2t5VXNlci5SZWFkV3JpdGUuQWxsIElkZW50aXR5VXNlckZsb3cuUmVhZC5BbGwgSWRlbnRpdHlVc2VyRmxvdy5SZWFkV3JpdGUuQWxsIG9wZW5pZCBwcm9maWxlIFNpdGVzLlJlYWQuQWxsIFNpdGVzLlJlYWRXcml0ZS5BbGwgVXNlci5NYW5hZ2VJZGVudGl0aWVzLkFsbCBVc2VyLlJlYWQgZW1haWwiLCJzaWduaW5fc3RhdGUiOlsiZHZjX21uZ2QiLCJkdmNfZG1qZCIsImttc2kiXSwic3ViIjoiQnNkUHBjWEp3RnRGMW9vOGYzLVROc0loNlFtWWRrU0poSXA5RWcxc1c1USIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJFVSIsInRpZCI6ImIwMDM2N2UyLTE5M2EtNGY0OC05NGRlLTcyNDVkNDVjMDk0NyIsInVuaXF1ZV9uYW1lIjoiay5nYW5kaGlAcmVwbHkuY29tIiwidXBuIjoiay5nYW5kaGlAcmVwbHkuY29tIiwidXRpIjoicklEQWlVdF9GVXUzZGxidWpXZ1BBQSIsInZlciI6IjEuMCIsIndpZHMiOlsiYjc5ZmJmNGQtM2VmOS00Njg5LTgxNDMtNzZiMTk0ZTg1NTA5Il0sInhtc19jYyI6WyJDUDEiXSwieG1zX3NzbSI6IjEiLCJ4bXNfc3QiOnsic3ViIjoiUkRMM0hmVEh4bU5peXVsbHE0bllKQUtjSkRRNDBBVXZqOV9jVThoVURoQSJ9LCJ4bXNfdGNkdCI6MTQwNjI3NTg4NSwieG1zX3RkYnIiOiJFVSJ9.RbGR4gmnHi5rc7NtI7JyytVuGUrsbqoDZQ-a_IfQKppXfjn3XaORmWkLceOx5h7DdH6t-R1eIuLkVQNCKT3mTcgxr8mIanHbLk72NxjU1f1jlXbNIlTF5S6VECB7EmbJJFOrdbruwE1KOl9F1KpL8-rpC86wUiU3oqx04783JOxA4Q8DoOIn0G0tClB1NNTYCzkHgPD2ZthqzleER_Ymsi4vhU2-tMPRoYNem8D6I_BGpAByxKU08wfxEUWFEzmjntoI-I4Ik-ZkD_eRgW-HKPpCaOOwRr7sUd6sjY4qkTwano21yThX1MMeuXWgCxgjPl5JCl5YH1Raiw18EGGuBQ';
            const sharedLink = 'https://reply-my.sharepoint.com/:u:/p/s_sampath/EVAZBAkl1bdKhrR3CGokt4cBhkUewBJYzeBCGgNpRG0LCQ?email=k.gandhi%40reply.com&e=YbL4BF'
            const link1 = 'https://6gcfbd-my.sharepoint.com/:f:/g/personal/s_hausenblas_6gcfbd_onmicrosoft_com/ElgsGWYmQFlPqutnuGOXhUMBwIg1NWlR-LpLk0qU0fD4rw?e=b6Vue8'
            const encodedLink = btoa(sharedLink); // Base64 encode the shared link

            const fileUrl = `https://graph.microsoft.com/v1.0/shares/u!${encodedLink}/root/content`;
            
            $.ajax({
                    url: fileUrl,
                    method: 'GET',
                    headers: {
                        'content-type' : 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    success: function(fileResponse) {
                        console.log('File data:', fileResponse);
                        const obj = fileResponse;
                        //alert('File content successfully retrieved.');
                        for(let i=0;i<obj.length;i++)
                        {
                            let item = obj[i];
                            //alert(item.Playername);
                        }
                        obj.forEach(element => {
                            alert(element.Playername);
                        });
                    },
                    error: function(error) {
                        console.error('Error fetching file:', error);
                        alert('Error fetching file.');
                    }
                });
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
        location.reload(true); // Forces a hard refresh
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
