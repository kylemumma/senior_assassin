let participants = [];
let kills = {};
let states = {};
let leaderboard = [];

//display the leaderboard
function getLeaderboard(){
    participantsArr = participants.slice();
    let values = [];
    let i;
    for (i = 0; i < participantsArr.length; i++)
    {
        values[i] = kills[participantsArr[i]];
    }
    values.sort();
    values.reverse();

    let sorted = [];
    while(participantsArr.length > 0){
        i = 0;
        for (i = 0; i < participantsArr.length; i++){      
            if (kills[participantsArr[i]] == values[0]){
                sorted[sorted.length] = participantsArr[i];
                participantsArr.splice(i, 1);
                i--;
            }
        }
        values.shift();
    }
    leaderboard = [];
    let place = 1;
    for (i = 0; i < participants.length; i++){
        if (i > 0 && kills[sorted[i]] != kills[sorted[i - 1]]){
            place = i + 1;
        }
        let temp = {};
        temp["place"] = place;
        temp["name"] = sorted[i];
        temp["kills"] = kills[sorted[i]];
        temp["state"] = states[sorted[i]];
        leaderboard[leaderboard.length] = temp;
        // console.log(place + " | " + sorted[i] + " : " + kills[sorted[i]])
    }
    console.log(leaderboard);
    load();
}

function load(){
    // array describing the color for each team
    // using camel case where the team names include a space
    const colors = {
        mercedes: '#00D2BE',
        ferrari: '#DC0000',
        redBull: '#1E41FF',
        renault: '#FFF500',
        racingPoint: '#F596C8',
        alfaRomeo: '#9B0000',
        toroRosso: '#469BFF',
        haas: '#BD9E57',
        mclaren: '#FF8700',
        williams: '#FFFFFF'
    }

    // target the table element in which to add one div for each driver
    const main = d3
        .select('table');

    // for each driver add one table row
    // ! add a class to the row to differentiate the rows from the existing one
    // otherwise the select method would target the existing one and include one row less than the required amount
    const drivers = main
        .selectAll('tr.driver')
        .data(leaderboard)
        .enter()
        .append('tr')
        .attr('class', 'driver');

    // in each row add the information specified by the dataset in td elements
    // specify a class to style the elements differently with CSS

    // position using the index of the data points
    drivers
        .append('td')
        .html (({place, state}) => `${state != "dead" ? `<span style="color:#11FE00">${place}</span>` : `<span style="color:red">${place}</span>`} `) //style="color:#11FE00"  <---- green color option
        //.text(({place}) => place)
        .attr('class', 'position');
    drivers
        .append('td')  
        .html (({name, state}) => `${state != "dead" ? `<span style="color:#11FE00">${name.charAt(0).toUpperCase() + name.split(" ")[0].slice(1) + " " + name.split(" ")[1].charAt(0).toUpperCase() + name.split(" ")[1].slice(1)}</span>` : `<span style="color:red">${name.charAt(0).toUpperCase() + name.split(" ")[0].slice(1) + " " + name.split(" ")[1].charAt(0).toUpperCase() + name.split(" ")[1].slice(1)}</span>`} `)  //string.charAt(0).toUpperCase() + 
    

  //  .html (({name, team}) => `${name.split(' ').map((part, index) => index > 0 ? `<strong>${part}</strong>` : `${part}`).join(' ')} <span>${team}</span>`)

    drivers
        .append('td')
        .html (({kills, state}) => `${state != "dead" ? `<span style="color:#11FE00">${kills}</span>` : `<span style="color:red">${kills}</span>`} `)
}



$(document).ready(() => {
    //get participants
    $.get("https://nchsassassin.com/participants", (res) => {
        let participantsArr = [];
        console.log(res);
        for(let participant of res){
            participantsArr.push(participant["name"]);
        //    kills[participant["name"]] = parseInt(participant["kills"], 10);
            kills[participant["name"]] = participant["kills"];
            states[participant["name"]] = participant["state"];
         //   console.log(participant["kills"]);
        }
        participants = participantsArr;
        getLeaderboard();
    });
});