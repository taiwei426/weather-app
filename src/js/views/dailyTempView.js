import {getReadableTime} from './base'


function timeArr(data, weather, activeLocationTime){
    
    var count = 0;

    return data.map( el => {
       
        var momentDate = getReadableTime(el.time, weather.timezone, true);
        
        var newDay;

        function dayOfWeek(){
            var days = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];

            var date =  activeLocationTime.day + count + 1;
                
            // if date > 7, then start over in counting
            date > 6  ? date = date - 7 :  date = date

            count += 1;
            
            newDay = days[date];
        }

        
        if(momentDate === '12am'){
            if(activeLocationTime.localDay === activeLocationTime.day){
                if (count === 0){
                    newDay = 'Tmrw'
                    count += 1;   
                } else {
                    dayOfWeek()
                }
            } else{
                dayOfWeek()
            }
            momentDate = [momentDate, newDay]
        }
        return momentDate
    })
}


export const createChart = (weather, chart, activeLocationTime) => {

    // if chart already exists, destroy prev  instance
    if(chart !== undefined){
        // console.log('destroy chart')
        chart.destroy();
    }    

    // create chart
    var Chart = require('chart.js');
    var chart = document.getElementById('temp-chart');

    var data = weather.hourly.data

    // create temp array
    var temp = data.map(el => Math.round(el.temperature));

    // create time array
    var time = timeArr(data, weather, activeLocationTime);


    // create new Chart
    return new Chart(chart, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                data: temp,
                // backgroundColor: 'rgba(153, 102, 255, 0.25)', 
                borderColor:  'rgba(59, 61, 74, 1)',
                borderWidth: 2, 
                pointRadius:  2,
                pointBorderWidth: 2,
                
            }]
        },
       
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend : {
                display: false,
            },
            tooltips: {
                intersect: false, 
                displayColors: false, 
                position: 'nearest', 
                bodyFontSize: 24,               
                // titleMarginBottom: 14,
                callbacks: {
                    label: function(tooltipItem) {
                        // console.log(tooltipItem)
                        tooltipItem.height = 20;
                        return tooltipItem.value +'°'
                    },
                    footer: function(tooltipItem){
                        // console.log(tooltipItem[0].index)
                        return weather.hourly.data[tooltipItem[0].index].summary
                    }
                }
            }, 
            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false,
                        drawTicks: true, 
                        tickMarkLength: 0,
                    },
                    ticks: {
                        beginAtZero: true, 
                        padding: -50,
                        callback: function(value, index) {
                            return index % 2 === 0 ? value + '°' : '';
                        }
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawTicks: true,  
                    },
                    ticks: {
                        display: true,
                        callback: function (value, index) {

                            // if it's the first or last index, don't show
                            if(index === 0 ||  index === temp.length -1){
                                return ''
                            
                            // if it's a new day, aka 12am array
                            } else if(Array.isArray(value) === true) {
                                var timeArr = value[0].split(' ');
                            
                                timeArr  = timeArr[0].split('')
                                
                                var num = parseInt(timeArr[0]+timeArr[1]); 
                                
                                return [num + timeArr[2] + timeArr[3], value[1]]

                            } else {
                                var timeArr = value.split(' ');
                            
                                timeArr  = timeArr[0].split('')
                                
                                // only show time if it's 4, 8, 12
                                if(timeArr.length === 3){
                                    var num = parseInt(timeArr[0]);
                                    
                                    if(num === 4 || num === 8){
                                        return num + timeArr[1] + timeArr[2]
                                    }
                                } else if (timeArr.length === 4){
                                    var num = parseInt(timeArr[0] + timeArr[1]);
                                    if(num === 12){
                                        return num + timeArr[2] + timeArr[3]
                                    }
                                }
                            }
                        }
                    }
                }]
            }
        }
    });

}
